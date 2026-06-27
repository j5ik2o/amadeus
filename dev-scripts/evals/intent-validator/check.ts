#!/usr/bin/env bun

import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

function replaceDesignTraceDesignLink(workspace: string): void {
  const path = join(workspace, ".amadeus/intents", intent, "traceability.md");
  const text = readFileSync(path, "utf8");
  const from = "| [design.md](units/U001-password-reset-request/design.md) | U001 | R001 | UC001 | B001 | B001/T001, B001/T002, B001/T003 |";
  const to = "| [design.md](units/U002-credential-update-with-reset-token/design.md) | U001 | R001 | UC001 | B001 | B001/T001, B001/T002, B001/T003 |";
  if (!text.includes(from)) fail("traceability fixture does not contain expected design trace row");
  writeFileSync(path, text.replace(from, to));
}

function replaceDesignTraceReferencesWithMissingIds(workspace: string): void {
  const path = join(workspace, ".amadeus/intents", intent, "traceability.md");
  const text = readFileSync(path, "utf8");
  const from = "| [design.md](units/U001-password-reset-request/design.md) | U001 | R001 | UC001 | B001 | B001/T001, B001/T002, B001/T003 |";
  const to = "| [design.md](units/U001-password-reset-request/design.md) | U001 | R999 | UC999 | B999 | B999/T999 |";
  if (!text.includes(from)) fail("traceability fixture does not contain expected design trace row");
  writeFileSync(path, text.replace(from, to));
}

function replaceTaskReferencesWithMissingIds(workspace: string): void {
  const path = join(workspace, ".amadeus/intents", intent, "bolts/B001-password-reset-request-flow/tasks.md");
  const text = readFileSync(path, "utf8");
  const from = "  - 要求: R001\n  - ユースケース: UC001\n  - 依存: なし";
  const to = "  - 要求: R999\n  - ユースケース: UC999\n  - 依存: T999";
  if (!text.includes(from)) fail("tasks fixture does not contain expected task references");
  writeFileSync(path, text.replace(from, to));
}

function replaceTaskReferencesWithEmptyIds(workspace: string): void {
  const path = join(workspace, ".amadeus/intents", intent, "bolts/B001-password-reset-request-flow/tasks.md");
  const text = readFileSync(path, "utf8");
  const from = "  - 要求: R001\n  - ユースケース: UC001\n  - 依存: なし";
  const to = "  - 要求:\n  - ユースケース:\n  - 依存:";
  if (!text.includes(from)) fail("tasks fixture does not contain expected task references");
  writeFileSync(path, text.replace(from, to));
}

function writeConstructionTestResults(workspace: string): void {
  writeFileSync(
    join(workspace, ".amadeus/intents", intent, "bolts/B001-password-reset-request-flow/test-results.md"),
    [
      "# テスト結果",
      "",
      "## 検証結果",
      "",
      "| テスト | コマンド | 結果 | 根拠 |",
      "|---|---|---|---|",
      "| 単体 | npm test | pass | ローカル実行 |",
      "",
      "## 安全性確認",
      "",
      "- 未確認",
      "",
      "## CI確認",
      "",
      "- 未確認",
      "",
      "## 受け入れ証拠",
      "",
      "| 要求 | タスク | 証拠 | 要約 |",
      "|---|---|---|---|",
      "| R001 | B001/T001 | npm test | パスワード再設定要求の入口を確認した。 |",
      "",
    ].join("\n"),
  );
}

function writeConstructionNotes(workspace: string): void {
  writeFileSync(
    join(workspace, ".amadeus/intents", intent, "bolts/B001-password-reset-request-flow/notes.md"),
    [
      "# Construction ノート",
      "",
      "## 実行方針",
      "",
      "- B001 の最小実装と検証を対象にする。",
      "",
      "## 対象タスク",
      "",
      "| タスク | 状態 | 方針 | 証拠 |",
      "|---|---|---|---|",
      "| T001 | 実装済み | 入力定義を確認する。 | test-results.md |",
      "",
      "## 未確認事項",
      "",
      "- なし",
      "",
    ].join("\n"),
  );
}

function writeConstructionState(workspace: string, overrides: Record<string, any> = {}): void {
  const path = join(workspace, ".amadeus/intents", intent, "state.json");
  const state = JSON.parse(readFileSync(path, "utf8"));
  state.phase = "construction";
  state.status = overrides.status ?? "in_progress";
  state.ideation = { status: "completed", gate: "passed" };
  state.inception = overrides.inception ?? { status: "completed", gate: "passed" };
  state.construction = {
    status: overrides.constructionStatus ?? "in_progress",
    targetBolts: ["B001"],
    requiredArtifacts: [
      "requirements.md",
      "acceptance.md",
      "units.md",
      "bolts.md",
      "traceability.md",
      "decisions.md",
      "state.json",
    ],
    requiredBoltArtifacts: overrides.requiredBoltArtifacts ?? [
      "bolts/B001-password-reset-request-flow/bolt.md",
      "bolts/B001-password-reset-request-flow/tasks.md",
      "bolts/B001-password-reset-request-flow/notes.md",
      "bolts/B001-password-reset-request-flow/test-results.md",
    ],
    gate: overrides.constructionGate ?? "not_ready",
  };
  writeFileSync(path, JSON.stringify(state, null, 2));
}

function replaceUnitDetailWithOldPath(workspace: string): void {
  const path = join(workspace, ".amadeus/intents", intent, "units.md");
  const text = readFileSync(path, "utf8");
  const from = "[unit.md](units/U001-password-reset-request/unit.md)";
  const to = "[unit.md](units/U001-password-reset-request.md)";
  if (!text.includes(from)) fail("units fixture does not contain expected U001 unit link");
  writeFileSync(path, text.replace(from, to));
}

function writePrWithoutUrl(workspace: string): void {
  writeFileSync(
    join(workspace, ".amadeus/intents", intent, "bolts/B001-password-reset-request-flow/pr.md"),
    [
      "# PR 記録",
      "",
      "## Pull Request",
      "",
      "- URL: 未確認",
      "- 状態: 未確認",
      "",
      "## 対象",
      "",
      "| ボルト | タスク | 要求 |",
      "|---|---|---|",
      "| B001 | T001 | R001 |",
      "",
      "## 確認状況",
      "",
      "| 観点 | 状態 | 根拠 |",
      "|---|---|---|",
      "| CI | 未確認 | 未登録 |",
      "",
    ].join("\n"),
  );
}

function appendEmptyConstructionTrace(workspace: string): void {
  const path = join(workspace, ".amadeus/intents", intent, "traceability.md");
  const text = readFileSync(path, "utf8");
  writeFileSync(
    path,
    [
      text.trimEnd(),
      "",
      "## Construction からの追跡",
      "",
      "| ボルト | タスク | 証拠 | 状態 |",
      "|---|---|---|---|",
      "",
    ].join("\n"),
  );
}

run(["bun", "run", validator, ".", intent]);

const wrongDesignWorkspace = workspaceCopy();
replaceTraceabilityDesignLink(wrongDesignWorkspace);
runExpectFailure(
  ["bun", "run", validator, wrongDesignWorkspace, intent],
  "`設計` が対象 Unit の Unit Design Brief を指す",
);

const wrongDesignTraceWorkspace = workspaceCopy();
replaceDesignTraceDesignLink(wrongDesignTraceWorkspace);
runExpectFailure(
  ["bun", "run", validator, wrongDesignTraceWorkspace, intent],
  "`設計` が対象 Unit の Unit Design Brief を指す",
);

const wrongDesignTraceReferencesWorkspace = workspaceCopy();
replaceDesignTraceReferencesWithMissingIds(wrongDesignTraceReferencesWorkspace);
runExpectFailure(
  ["bun", "run", validator, wrongDesignTraceReferencesWorkspace, intent],
  "設計追跡の `タスク` が既存 Task を指す",
);

const wrongTaskReferencesWorkspace = workspaceCopy();
replaceTaskReferencesWithMissingIds(wrongTaskReferencesWorkspace);
runExpectFailure(
  ["bun", "run", validator, wrongTaskReferencesWorkspace, intent],
  "Task の `要求` が既存 ID またはなしである",
);

const emptyTaskReferencesWorkspace = workspaceCopy();
replaceTaskReferencesWithEmptyIds(emptyTaskReferencesWorkspace);
runExpectFailure(
  ["bun", "run", validator, emptyTaskReferencesWorkspace, intent],
  "Task の `要求` が既存 ID またはなしである",
);

const missingBoltsIndexWorkspace = workspaceCopy();
rmSync(join(missingBoltsIndexWorkspace, ".amadeus/intents", intent, "bolts.md"));
runExpectFailure(
  ["bun", "run", validator, missingBoltsIndexWorkspace, intent],
  "bolts.md が存在する",
);

const constructionWithoutInceptionRequiredWorkspace = workspaceCopy();
writeConstructionNotes(constructionWithoutInceptionRequiredWorkspace);
writeConstructionTestResults(constructionWithoutInceptionRequiredWorkspace);
writeConstructionState(constructionWithoutInceptionRequiredWorkspace);
run(["bun", "run", validator, constructionWithoutInceptionRequiredWorkspace, intent]);

const constructionWithStaleInceptionRequiredWorkspace = workspaceCopy();
writeConstructionNotes(constructionWithStaleInceptionRequiredWorkspace);
writeConstructionTestResults(constructionWithStaleInceptionRequiredWorkspace);
writeConstructionState(constructionWithStaleInceptionRequiredWorkspace, {
  inception: {
    status: "completed",
    gate: "passed",
    requiredArtifacts: [
      "requirements.md",
      "acceptance.md",
    ],
  },
});
run(["bun", "run", validator, constructionWithStaleInceptionRequiredWorkspace, intent]);

const missingTargetBoltArtifactsWorkspace = workspaceCopy();
writeConstructionNotes(missingTargetBoltArtifactsWorkspace);
writeConstructionTestResults(missingTargetBoltArtifactsWorkspace);
writeConstructionState(missingTargetBoltArtifactsWorkspace, {
  requiredBoltArtifacts: [
    "bolts/B001-password-reset-request-flow/bolt.md",
    "bolts/B001-password-reset-request-flow/tasks.md",
  ],
});
runExpectFailure(
  ["bun", "run", validator, missingTargetBoltArtifactsWorkspace, intent],
  "Construction 必須 Bolt 成果物が targetBolt の証拠成果物を含む",
);

const oldUnitDetailWorkspace = workspaceCopy();
replaceUnitDetailWithOldPath(oldUnitDetailWorkspace);
runExpectFailure(
  ["bun", "run", validator, oldUnitDetailWorkspace, intent],
  "`詳細` が units/<unit-id>-<slug>/unit.md を指す",
);

const missingConstructionTraceWorkspace = workspaceCopy();
writeConstructionNotes(missingConstructionTraceWorkspace);
writeConstructionTestResults(missingConstructionTraceWorkspace);
writeConstructionState(missingConstructionTraceWorkspace, {
  status: "completed",
  constructionStatus: "completed",
  constructionGate: "passed",
});
runExpectFailure(
  ["bun", "run", validator, missingConstructionTraceWorkspace, intent],
  "`Construction からの追跡` の表がある",
);

const emptyConstructionTraceWorkspace = workspaceCopy();
writeConstructionNotes(emptyConstructionTraceWorkspace);
writeConstructionTestResults(emptyConstructionTraceWorkspace);
appendEmptyConstructionTrace(emptyConstructionTraceWorkspace);
writeConstructionState(emptyConstructionTraceWorkspace, {
  status: "completed",
  constructionStatus: "completed",
  constructionGate: "passed",
});
runExpectFailure(
  ["bun", "run", validator, emptyConstructionTraceWorkspace, intent],
  "`Construction からの追跡` が証拠追跡行を持つ",
);

const prWithoutUrlWorkspace = workspaceCopy();
writeConstructionNotes(prWithoutUrlWorkspace);
writeConstructionTestResults(prWithoutUrlWorkspace);
writePrWithoutUrl(prWithoutUrlWorkspace);
writeConstructionState(prWithoutUrlWorkspace, {
  requiredBoltArtifacts: [
    "bolts/B001-password-reset-request-flow/bolt.md",
    "bolts/B001-password-reset-request-flow/tasks.md",
    "bolts/B001-password-reset-request-flow/notes.md",
    "bolts/B001-password-reset-request-flow/test-results.md",
    "bolts/B001-password-reset-request-flow/pr.md",
  ],
});
runExpectFailure(
  ["bun", "run", validator, prWithoutUrlWorkspace, intent],
  "PR 記録が URL を持つ",
);

const existingPrWithoutUrlWorkspace = workspaceCopy();
writeConstructionNotes(existingPrWithoutUrlWorkspace);
writeConstructionTestResults(existingPrWithoutUrlWorkspace);
writePrWithoutUrl(existingPrWithoutUrlWorkspace);
writeConstructionState(existingPrWithoutUrlWorkspace);
runExpectFailure(
  ["bun", "run", validator, existingPrWithoutUrlWorkspace, intent],
  "PR 記録が URL を持つ",
);

console.log("intent validator eval: ok");
