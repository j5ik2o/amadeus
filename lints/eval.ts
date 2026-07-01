#!/usr/bin/env bun

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function run(args: string[]): string {
  const result = Bun.spawnSync({
    cmd: ["bun", "run", "lints/check.ts", ...args],
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  const stdout = result.stdout.toString();
  const stderr = result.stderr.toString();
  assert(result.success, `lint runner failed: ${stderr || stdout}`);
  return `${stdout}${stderr}`;
}

const reportOutput = run(["--report"]);
assert(reportOutput.includes("ts complexity:"), "lint report must include ts-complexity output");
assert(reportOutput.includes("lints: ok"), "lint report must print aggregate success");

const checkOutput = run(["--check"]);
assert(checkOutput.includes("ts complexity: ok"), "lint check must include ts-complexity check");
assert(checkOutput.includes("lints: ok"), "lint check must print aggregate success");

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
  scripts?: Record<string, string>;
};
assert(packageJson.scripts?.["lint:report"] === "bun run lints/check.ts --report", "package script mismatch: lint:report");
assert(packageJson.scripts?.["lint:check"] === "bun run lints/check.ts --check", "package script mismatch: lint:check");
assert(packageJson.scripts?.["test:it:lints"] === "bun run lints/eval.ts", "package script mismatch: test:it:lints");
assert(packageJson.scripts?.["test:it:all"]?.includes("npm run test:it:lints"), "test:it:all must run lints eval");

console.log("lints eval: ok");
