#!/usr/bin/env bun

import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "../../..");
const fixture = join(root, "examples/04-inception-completed/.amadeus");
const intent = "20260628-discovery-brief-creation";
const validator = ".agents/skills/amadeus-validator/validator/AmadeusValidator.ts";

const unit1 = "U001-discovery-brief-recording";
const unit2 = "U002-intent-candidate-guidance";
const bolt1 = "B001-discovery-brief-recording";
const bolt2 = "B002-intent-candidate-guidance";

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
  const workspace = mkdtempSync(join(tmpdir(), "amadeus-validator"));
  cpSync(fixture, join(workspace, ".amadeus"), { recursive: true });
  return workspace;
}

function intentPath(workspace: string, path: string): string {
  return join(workspace, ".amadeus/intents", intent, path);
}

function replaceInFile(path: string, from: string, to: string, message: string): void {
  const text = readFileSync(path, "utf8");
  if (!text.includes(from)) fail(message);
  writeFileSync(path, text.replace(from, to));
}

function replaceDiscoveryDecision(workspace: string): void {
  replaceInFile(
    join(workspace, ".amadeus/discoveries/20260628-amadeus-theme-decomposition/brief.md"),
    "## 判定\n\nmulti_intent",
    "## 判定\n\nsingle_intent",
    "discovery fixture does not contain expected decision",
  );
}

function removeDiscoveryCandidate(workspace: string): void {
  const path = join(workspace, ".amadeus/discoveries/20260628-amadeus-theme-decomposition/brief.md");
  const text = readFileSync(path, "utf8");
  const rows = [
    "| Discovery から Intent 初期化へ引き継げる | waiting | 未作成 | Discovery の候補を Intent の入れ物へ渡す手順が曖昧になる | recommended または initialized の候補から Intent を初期化できる | Ideation 以降の成果物 | 入力テーマを Discovery Brief に整理できる |\n",
    "| Discovery を含む成果物構造を検証できる | waiting | 未作成 | Discovery が成果物構造として壊れても検出しにくい | Validator が Discovery、Intent、phase 別成果物を検証できる | 内容妥当性の承認 | 入力テーマを Discovery Brief に整理できる |\n",
    "| Discovery の例示スナップショットを参照できる | waiting | 未作成 | root .amadeus と例示が混ざり、読者が実運用状態と誤解する | examples 配下で段階別 snapshot を参照できる | Construction の実装証拠 | 入力テーマを Discovery Brief に整理できる |\n",
  ];
  let updated = text;
  for (const row of rows) {
    if (!updated.includes(row)) fail("discovery fixture does not contain expected candidate row");
    updated = updated.replace(row, "");
  }
  writeFileSync(path, updated);
}

function replaceDesignTraceDesignLink(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "traceability.md"),
    `| [U001 design](units/${unit1}/design.md) | U001 | R001 | UC001 | B001 | B001/T001, B001/T002 |`,
    `| [U002 design](units/${unit2}/design.md) | U001 | R001 | UC001 | B001 | B001/T001, B001/T002 |`,
    "traceability fixture does not contain expected design trace row",
  );
}

function replaceDesignTraceReferencesWithMissingIds(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "traceability.md"),
    `| [U001 design](units/${unit1}/design.md) | U001 | R001 | UC001 | B001 | B001/T001, B001/T002 |`,
    `| [U001 design](units/${unit1}/design.md) | U001 | R999 | UC999 | B999 | B999/T999 |`,
    "traceability fixture does not contain expected design trace row",
  );
}

function replaceTaskReferencesWithMissingIds(workspace: string): void {
  replaceInFile(
    intentPath(workspace, `bolts/${bolt1}/tasks.md`),
    "  - 要求: R001\n  - ユースケース: UC001\n  - 依存: なし",
    "  - 要求: R999\n  - ユースケース: UC999\n  - 依存: T999",
    "tasks fixture does not contain expected task references",
  );
}

function replaceTaskReferencesWithEmptyIds(workspace: string): void {
  replaceInFile(
    intentPath(workspace, `bolts/${bolt1}/tasks.md`),
    "  - 要求: R001\n  - ユースケース: UC001\n  - 依存: なし",
    "  - 要求:\n  - ユースケース:\n  - 依存:",
    "tasks fixture does not contain expected task references",
  );
}

function makeBoltReferenceMultipleUnits(workspace: string, withReason: boolean): void {
  const boltsPath = intentPath(workspace, "bolts.md");
  replaceInFile(
    boltsPath,
    `| B001 | Discovery Brief の基本記録を整える | U001 | [U001 design](units/${unit1}/design.md) | なし | [${bolt1}/bolt.md](bolts/${bolt1}/bolt.md) |`,
    `| B001 | Discovery Brief の基本記録を整える | U001, U002 | [U001 design](units/${unit1}/design.md), [U002 design](units/${unit2}/design.md) | なし | [${bolt1}/bolt.md](bolts/${bolt1}/bolt.md) |`,
    "bolts fixture does not contain expected B001 row",
  );

  const boltPath = intentPath(workspace, `bolts/${bolt1}/bolt.md`);
  replaceInFile(
    boltPath,
    "## 対象ユニット\n\n- U001: Discovery Brief の基本記録",
    "## 対象ユニット\n\n- U001: Discovery Brief の基本記録\n- U002: Intent 候補と推奨次アクションの整理",
    "bolt fixture does not contain expected target unit section",
  );
  replaceInFile(
    boltPath,
    `## 設計\n\n- [U001 Unit Design Brief](../../units/${unit1}/design.md)`,
    `## 設計\n\n- [U001 Unit Design Brief](../../units/${unit1}/design.md)\n- [U002 Unit Design Brief](../../units/${unit2}/design.md)`,
    "bolt fixture does not contain expected design section",
  );
  if (withReason) {
    replaceInFile(
      boltPath,
      "## 完了条件",
      "## 複数 Unit を扱う理由\n\n- U001 と U002 を同じ実施で扱うと、Brief 記録と候補状態の整合をまとめて確認できるため。\n\n## 完了条件",
      "bolt fixture does not contain expected completion heading",
    );
  }
}

function replaceBoltUnitWithMissingId(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "bolts.md"),
    `| B001 | Discovery Brief の基本記録を整える | U001 | [U001 design](units/${unit1}/design.md) | なし | [${bolt1}/bolt.md](bolts/${bolt1}/bolt.md) |`,
    `| B001 | Discovery Brief の基本記録を整える | U999 | [U001 design](units/${unit1}/design.md) | なし | [${bolt1}/bolt.md](bolts/${bolt1}/bolt.md) |`,
    "bolts fixture does not contain expected B001 row",
  );
}

function replaceBoltUnitWithDuplicateId(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "bolts.md"),
    `| B001 | Discovery Brief の基本記録を整える | U001 | [U001 design](units/${unit1}/design.md) | なし | [${bolt1}/bolt.md](bolts/${bolt1}/bolt.md) |`,
    `| B001 | Discovery Brief の基本記録を整える | U001, U001 | [U001 design](units/${unit1}/design.md) | なし | [${bolt1}/bolt.md](bolts/${bolt1}/bolt.md) |`,
    "bolts fixture does not contain expected B001 row",
  );
}

function replaceUnitDetailWithOldPath(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "units.md"),
    `[${unit1}/unit.md](units/${unit1}/unit.md)`,
    `[${unit1}.md](units/${unit1}.md)`,
    "units fixture does not contain expected U001 unit link",
  );
}

function writeConstructionTestResults(workspace: string): void {
  writeFileSync(
    intentPath(workspace, `bolts/${bolt1}/test-results.md`),
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
      "| R001 | B001/T001 | npm test | Discovery Brief の基本見出しを確認した。 |",
      "",
    ].join("\n"),
  );
}

function writeConstructionNotes(workspace: string): void {
  writeFileSync(
    intentPath(workspace, `bolts/${bolt1}/notes.md`),
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
  const path = intentPath(workspace, "state.json");
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
      `bolts/${bolt1}/bolt.md`,
      `bolts/${bolt1}/tasks.md`,
      `bolts/${bolt1}/notes.md`,
      `bolts/${bolt1}/test-results.md`,
    ],
    gate: overrides.constructionGate ?? "not_ready",
  };
  writeFileSync(path, JSON.stringify(state, null, 2));
}

function writePrWithoutUrl(workspace: string): void {
  writeFileSync(
    intentPath(workspace, `bolts/${bolt1}/pr.md`),
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
  const path = intentPath(workspace, "traceability.md");
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

run(["bun", "run", validator, "examples/04-inception-completed", intent]);

const discoveryDecisionMismatchWorkspace = workspaceCopy();
replaceDiscoveryDecision(discoveryDecisionMismatchWorkspace);
runExpectFailure(
  ["bun", "run", validator, discoveryDecisionMismatchWorkspace],
  "state.json.decision と brief.md の判定が一致する",
);

const discoveryMultiIntentTooSmallWorkspace = workspaceCopy();
removeDiscoveryCandidate(discoveryMultiIntentTooSmallWorkspace);
runExpectFailure(
  ["bun", "run", validator, discoveryMultiIntentTooSmallWorkspace],
  "multi_intent の Intent 候補が2件以上ある",
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
rmSync(intentPath(missingBoltsIndexWorkspace, "bolts.md"));
runExpectFailure(
  ["bun", "run", validator, missingBoltsIndexWorkspace, intent],
  "bolts.md が存在する",
);

const multiUnitBoltWithReasonWorkspace = workspaceCopy();
makeBoltReferenceMultipleUnits(multiUnitBoltWithReasonWorkspace, true);
run(["bun", "run", validator, multiUnitBoltWithReasonWorkspace, intent]);

const multiUnitBoltWithoutReasonWorkspace = workspaceCopy();
makeBoltReferenceMultipleUnits(multiUnitBoltWithoutReasonWorkspace, false);
runExpectFailure(
  ["bun", "run", validator, multiUnitBoltWithoutReasonWorkspace, intent],
  "複数 Unit を同じ Bolt で扱う理由を記録する",
);

const missingBoltUnitReferenceWorkspace = workspaceCopy();
replaceBoltUnitWithMissingId(missingBoltUnitReferenceWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingBoltUnitReferenceWorkspace, intent],
  "Bolt の `ユニット` が既存 Unit を参照する",
);

const duplicateBoltUnitReferenceWorkspace = workspaceCopy();
replaceBoltUnitWithDuplicateId(duplicateBoltUnitReferenceWorkspace);
runExpectFailure(
  ["bun", "run", validator, duplicateBoltUnitReferenceWorkspace, intent],
  "Bolt の `ユニット` が重複しない",
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
    `bolts/${bolt1}/bolt.md`,
    `bolts/${bolt1}/tasks.md`,
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
    `bolts/${bolt1}/bolt.md`,
    `bolts/${bolt1}/tasks.md`,
    `bolts/${bolt1}/notes.md`,
    `bolts/${bolt1}/test-results.md`,
    `bolts/${bolt1}/pr.md`,
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

console.log("amadeus validator eval: ok");
