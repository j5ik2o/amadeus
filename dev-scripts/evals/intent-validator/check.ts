#!/usr/bin/env bun

import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "../../..");
const intent = "20260626-password-reset";
const validator = ".agents/skills/amadeus-intent-validator/validator/IntentValidator.ts";

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

function runExpectFailure(command: string[], expected: string, cwd = root): void {
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
  if (!stdout.includes(expected) && !stderr.includes(expected)) {
    fail(["command failed without expected evidence: " + expected, "stdout:", stdout, "stderr:", stderr].join("\n"));
  }
}

function workspaceCopy(): string {
  const workspace = mkdtempSync(join(tmpdir(), "amadeus-intent-validator"));
  cpSync(join(root, ".amadeus"), join(workspace, ".amadeus"), { recursive: true });
  return workspace;
}

function replaceTraceabilityDesignLink(workspace: string): void {
  const path = join(workspace, ".amadeus/intents", intent, "traceability.md");
  const text = readFileSync(path, "utf8");
  const from = "[design.md](units/U001-password-reset-request/design.md) | 既存実装なし。成果物上の再設定要求受付";
  const to = "[design.md](units/U002-credential-update-with-reset-token/design.md) | 既存実装なし。成果物上の再設定要求受付";
  if (!text.includes(from)) fail("traceability fixture does not contain expected U001 design link");
  writeFileSync(path, text.replace(from, to));
}

run(["bun", "run", validator, ".", intent]);

const wrongDesignWorkspace = workspaceCopy();
replaceTraceabilityDesignLink(wrongDesignWorkspace);
runExpectFailure(
  ["bun", "run", validator, wrongDesignWorkspace, intent],
  "`設計` が対象 Unit の Unit Design Brief を指す",
);

console.log("intent validator eval: ok");
