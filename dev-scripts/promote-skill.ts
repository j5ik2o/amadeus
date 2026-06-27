#!/usr/bin/env bun

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, cpSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

const alwaysAllowedFiles = ["SKILL.md", "pyproject.toml", "uv.lock"];
const alwaysAllowedDirs = ["references", "scripts", "assets", "templates"];
const conditionalDirs = ["agents", "validator", "eval-viewer"];
const disallowedNames = new Set([
  "dev-scripts",
  "evals",
  "eval-runs",
  "tmp",
  "benchmarks",
  "review-output",
  "tests",
  ".venv",
  ".pytest_cache",
  "__pycache__",
  "justfile",
  ".gitignore",
]);
const disallowedPaths = ["scripts/ci"];

type Options = {
  replace: boolean;
  dryRun: boolean;
  agentsRoot: string;
};

function usage(): string {
  return "Usage: bun run dev-scripts/promote-skill.ts <skill-name> [--replace] [--dry-run] [--agents-root PATH]";
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function parseOptions(argv: string[]): { skillName: string; options: Options } {
  const options: Options = {
    replace: false,
    dryRun: false,
    agentsRoot: ".agents/skills",
  };
  const positional: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--replace") {
      options.replace = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--agents-root") {
      const value = argv[index + 1];
      if (!value) fail(usage());
      options.agentsRoot = value;
      index += 1;
    } else if (arg.startsWith("--")) {
      fail(usage());
    } else {
      positional.push(arg);
    }
  }

  if (positional.length !== 1) fail(usage());
  return { skillName: positional[0], options };
}

function ensureSafeSkillName(skillName: string): void {
  if (/^[a-z0-9][a-z0-9-]*$/.test(skillName)) return;
  fail(`invalid skill name: ${skillName}`);
}

function isDirectory(path: string): boolean {
  return existsSync(path) && statSync(path).isDirectory();
}

function isFile(path: string): boolean {
  return existsSync(path) && statSync(path).isFile();
}

function skillBody(source: string): string {
  return readFileSync(join(source, "SKILL.md"), "utf8");
}

function referenced(body: string, name: string): boolean {
  return body.includes(`${name}/`) || body.includes(`\`${name}\``) || body.includes(`<skill-dir>/${name}`);
}

function allowedEntries(source: string): string[] {
  const body = skillBody(source);
  const entries: string[] = [];

  for (const file of alwaysAllowedFiles) {
    if (isFile(join(source, file))) entries.push(file);
  }
  for (const dir of alwaysAllowedDirs) {
    if (isDirectory(join(source, dir))) entries.push(dir);
  }
  for (const dir of conditionalDirs) {
    if (isDirectory(join(source, dir)) && referenced(body, dir)) entries.push(dir);
  }

  return entries;
}

function unpromotedEntries(source: string, entries: string[]): string[] {
  const allowed = new Set(entries);
  return readdirSync(source).filter((entry) => !allowed.has(entry)).sort();
}

function copyEntry(source: string, destination: string, entry: string, dryRun: boolean): void {
  const from = join(source, entry);
  const to = join(destination, entry);
  console.log(`copy ${from} -> ${to}`);
  if (dryRun) return;

  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}

function listFilesAndDirs(root: string): string[] {
  if (!existsSync(root)) return [];
  const results: string[] = [];
  const visit = (current: string): void => {
    for (const entry of readdirSync(current)) {
      const next = join(current, entry);
      results.push(next);
      if (statSync(next).isDirectory()) visit(next);
    }
  };
  visit(root);
  return results;
}

function disallowedPromotedPaths(destination: string): string[] {
  const paths: string[] = [];
  for (const path of listFilesAndDirs(destination)) {
    const rel = relative(destination, path);
    const name = basename(path);
    if (disallowedNames.has(name)) paths.push(rel);
    if (disallowedPaths.some((prefix) => rel === prefix || rel.startsWith(`${prefix}/`))) paths.push(rel);
  }
  return [...new Set(paths)].sort();
}

const { skillName, options } = parseOptions(process.argv.slice(2));
ensureSafeSkillName(skillName);

const root = process.cwd();
const source = resolve(root, "skills", skillName);
const destination = resolve(root, options.agentsRoot, skillName);

if (!isDirectory(source)) fail(`missing source skill: ${source}`);
if (!isFile(join(source, "SKILL.md"))) fail(`missing SKILL.md: ${join(source, "SKILL.md")}`);
if (existsSync(destination) && !options.replace && !options.dryRun) {
  fail(`promoted skill already exists: ${destination} (use --replace)`);
}

const entries = allowedEntries(source);
if (!entries.includes("SKILL.md")) fail("SKILL.md must be promoted");

const skipped = unpromotedEntries(source, entries);
console.log(`promote ${skillName}`);
console.log(`source: ${source}`);
console.log(`destination: ${destination}`);
console.log(`entries: ${entries.join(", ")}`);
if (skipped.length > 0) console.log(`skipped: ${skipped.join(", ")}`);

if (!options.dryRun) {
  if (existsSync(destination) && options.replace) rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
}

for (const entry of entries) copyEntry(source, destination, entry, options.dryRun);

const violations = disallowedPromotedPaths(destination);
if (violations.length > 0) {
  fail(`disallowed promoted files remain:\n${violations.map((path) => `  - ${path}`).join("\n")}`);
}

console.log(options.dryRun ? "dry-run: ok" : "promote: ok");
