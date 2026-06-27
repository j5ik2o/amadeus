#!/usr/bin/env bun

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "../../..");
const checkScript = join(root, "dev-scripts/evals/llm-templates/check.ts");
const corporateRunner = join(root, "dev-scripts/run-codex-corporate.sh");

type Case = {
  args?: string[];
  env?: Record<string, string>;
  expectedStdout: string;
  name: string;
};

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function runCase(testCase: Case): void {
  const workspace = mkdtempSync(join(tmpdir(), "amadeus-llm-provider-options-"));
  try {
    const result = Bun.spawnSync([
      "bun",
      "run",
      checkScript,
      "--mode",
      "ping",
      "--workspace",
      workspace,
      ...(testCase.args ?? []),
    ], {
      cwd: root,
      env: {
        ...process.env,
        ...(testCase.env ?? {}),
      },
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = new TextDecoder().decode(result.stdout);
    const stderr = new TextDecoder().decode(result.stderr);

    if (result.exitCode !== 0) {
      fail([
        `${testCase.name}: command failed`,
        "stdout:",
        stdout,
        "stderr:",
        stderr,
      ].join("\n"));
    }

    if (!stdout.includes(testCase.expectedStdout)) {
      fail([
        `${testCase.name}: unexpected stdout`,
        `expected to include: ${testCase.expectedStdout}`,
        "stdout:",
        stdout,
      ].join("\n"));
    }
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
}

const cases: Case[] = [
  {
    name: "mock provider returns deterministic ping",
    args: ["--provider", "mock"],
    expectedStdout: "provider: mock",
  },
  {
    name: "real provider prints codex runner command",
    args: ["--provider", "real", "--print-command"],
    expectedStdout: `'${corporateRunner}' 'exec'`,
  },
  {
    name: "cli provider overrides environment provider",
    args: ["--provider", "real", "--print-command"],
    env: { AMADEUS_LLM_PROVIDER: "mock" },
    expectedStdout: `'${corporateRunner}' 'exec'`,
  },
];

for (const testCase of cases) {
  runCase(testCase);
}

console.log("llm provider options eval: ok");
