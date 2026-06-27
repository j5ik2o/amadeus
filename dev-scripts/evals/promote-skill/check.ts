#!/usr/bin/env bun

import { existsSync, mkdirSync, mkdtempSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dir, "../../..");

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function run(command: string[], cwd = root): string {
  const result = Bun.spawnSync(command, {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
  });
  const stdout = new TextDecoder().decode(result.stdout);
  const stderr = new TextDecoder().decode(result.stderr);
  if (result.exitCode !== 0) {
    fail(["command failed: " + command.join(" "), "stdout:", stdout, "stderr:", stderr].join("\n"));
  }
  return stdout;
}

function runExpectFailure(command: string[], cwd = root): [string, string] {
  const result = Bun.spawnSync(command, {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
  });
  const stdout = new TextDecoder().decode(result.stdout);
  const stderr = new TextDecoder().decode(result.stderr);
  if (result.exitCode === 0) {
    fail(["command unexpectedly succeeded: " + command.join(" "), "stdout:", stdout, "stderr:", stderr].join("\n"));
  }
  return [stdout, stderr];
}

function amadeusSkills(): string[] {
  return readdirSync(join(root, "skills"))
    .filter((entry) => entry.startsWith("amadeus-") && statSync(join(root, "skills", entry)).isDirectory())
    .sort();
}

function requiredInternalSkillGroups(): Record<string, string[]> {
  return {
    "amadeus-ideation": [
      "amadeus-ideation-scope-framing",
      "amadeus-ideation-feasibility-shaping",
      "amadeus-ideation-mock-framing",
      "amadeus-ideation-traceability-finalization",
    ],
    "amadeus-inception": [
      "amadeus-inception-requirements-definition",
      "amadeus-inception-interaction-modeling",
      "amadeus-inception-execution-design",
      "amadeus-inception-traceability-finalization",
    ],
  };
}

function listPaths(rootPath: string): string[] {
  if (!existsSync(rootPath)) return [];
  const results: string[] = [];
  const visit = (current: string): void => {
    for (const entry of readdirSync(current)) {
      const next = join(current, entry);
      results.push(relative(rootPath, next));
      if (statSync(next).isDirectory()) visit(next);
    }
  };
  visit(rootPath);
  return results.sort();
}

run(["bun", "run", "dev-scripts/promote-skill.ts", "amadeus-grilling", "--dry-run"]);
run(["bun", "run", "dev-scripts/promote-skill.ts", "amadeus-steering", "--dry-run"]);
run(["bun", "run", "dev-scripts/promote-skill.ts", "amadeus-intent-validator", "--dry-run"]);
runExpectFailure(["bun", "run", "dev-scripts/promote-skill.ts", "amadeus-grilling"]);

for (const [parentSkill, internalSkills] of Object.entries(requiredInternalSkillGroups())) {
  const missingInternalSkills = internalSkills.filter((skill) => {
    return !existsSync(join(root, "skills", skill, "SKILL.md")) || !existsSync(join(root, ".agents/skills", skill, "SKILL.md"));
  });
  if (missingInternalSkills.length > 0) {
    fail(`missing internal skills for ${parentSkill}: ${missingInternalSkills.join(", ")}`);
  }

  const parentSkillBody = await Bun.file(join(root, "skills", parentSkill, "SKILL.md")).text();
  const missingInternalOrchestration = internalSkills.filter((skill) => !parentSkillBody.includes(`必ず \`${skill}\` を使う`));
  if (missingInternalOrchestration.length > 0) {
    fail(`missing internal skill orchestration for ${parentSkill}: ${missingInternalOrchestration.join(", ")}`);
  }
}

const promoteAllRoot = mkdtempSync(join(tmpdir(), "amadeus-promote-all"));
const agentsRoot = join(promoteAllRoot, ".agents/skills");

for (const skill of amadeusSkills()) {
  run(["bun", "run", "dev-scripts/promote-skill.ts", skill, "--agents-root", agentsRoot]);
}

const disallowed = listPaths(agentsRoot).filter((path) => {
  const parts = path.split("/");
  return parts.some((part) => [
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
  ].includes(part)) || path === "scripts/ci" || path.startsWith("scripts/ci/");
});
if (disallowed.length > 0) fail(`disallowed promoted files remain:\n${disallowed.join("\n")}`);

for (const skill of amadeusSkills()) {
  run(["diff", "-qr", join(agentsRoot, skill), `.agents/skills/${skill}`]);
}

const violationRoot = mkdtempSync(join(tmpdir(), "amadeus-promote-violation"));
const violationAgentsRoot = join(violationRoot, ".agents/skills");
mkdirSync(join(violationAgentsRoot, "amadeus-grilling/evals"), { recursive: true });
writeFileSync(join(violationAgentsRoot, "amadeus-grilling/evals/keep.txt"), "x");
runExpectFailure([
  "bun",
  "run",
  "dev-scripts/promote-skill.ts",
  "amadeus-grilling",
  "--dry-run",
  "--agents-root",
  violationAgentsRoot,
]);

run(["git", "diff", "--check"]);

console.log("promote skill eval: ok");
