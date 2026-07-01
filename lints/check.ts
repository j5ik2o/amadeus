#!/usr/bin/env bun

import { existsSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";

type LintMode = "check" | "report";

type LintCheck = {
  name: string;
  path: string;
};

const root = resolve(import.meta.dir, "..");

function discoverLintChecks(): LintCheck[] {
  return readdirSync(import.meta.dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      path: join(import.meta.dir, entry.name, "check.ts"),
    }))
    .filter((lint) => existsSync(lint.path))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function runLint(lint: LintCheck, mode: LintMode): boolean {
  const result = Bun.spawnSync({
    cmd: ["bun", "run", relative(root, lint.path), `--${mode}`],
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  if (result.success) return true;
  console.error(`lint failed: ${lint.name}`);
  return false;
}

function parseArgs(args: string[]): LintMode {
  let mode: LintMode = "check";
  for (const arg of args) {
    if (arg === "--check") mode = "check";
    else if (arg === "--report") mode = "report";
    else throw new Error(`unknown argument: ${arg}`);
  }
  return mode;
}

if (import.meta.main) {
  try {
    const mode = parseArgs(process.argv.slice(2));
    const lintChecks = discoverLintChecks();
    if (lintChecks.length === 0) throw new Error("no lint checks found under lints/*/check.ts");

    const failed = lintChecks.filter((lint) => !runLint(lint, mode));
    if (failed.length > 0) {
      console.error(`lints failed: ${failed.map((lint) => lint.name).join(", ")}`);
      process.exit(1);
    }

    console.log(`lints: ok (${lintChecks.length} checks)`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
