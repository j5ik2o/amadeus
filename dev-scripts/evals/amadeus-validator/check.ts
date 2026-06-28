#!/usr/bin/env bun

import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
    fail(["command unexpectedly succeeded: " + command.join(" "), "expected:", expected, "stdout:", stdout, "stderr:", stderr].join("\n"));
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
    `| [U001 design](units/${unit1}/design.md) | U001 | R001 | UC001 | B001 |`,
    `| [U002 design](units/${unit2}/design.md) | U001 | R001 | UC001 | B001 |`,
    "traceability fixture does not contain expected design trace row",
  );
}

function replaceDesignTraceReferencesWithMissingIds(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "traceability.md"),
    `| [U001 design](units/${unit1}/design.md) | U001 | R001 | UC001 | B001 |`,
    `| [U001 design](units/${unit1}/design.md) | U001 | R999 | UC999 | B999 |`,
    "traceability fixture does not contain expected design trace row",
  );
}

function addTaskColumnToRequirementTrace(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "traceability.md"),
    "| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト |",
    "| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト | タスク |",
    "traceability fixture does not contain expected requirement trace header",
  );
  replaceInFile(
    intentPath(workspace, "traceability.md"),
    "|---|---|---|---|---|---|",
    "|---|---|---|---|---|---|---|",
    "traceability fixture does not contain expected requirement trace separator",
  );
  replaceInFile(
    intentPath(workspace, "traceability.md"),
    "| R001 | ACT001 | S001 | UC001 | U001 | B001 |",
    "| R001 | ACT001 | S001 | UC001 | U001 | B001 | B001/T001 |",
    "traceability fixture does not contain expected requirement trace row",
  );
}

function removeTaskDesignReason(workspace: string): void {
  replaceInFile(
    intentPath(workspace, `bolts/${bolt1}/tasks.md`),
    "  - 設計根拠: design.md#実装設計\n",
    "",
    "tasks fixture does not contain expected design reason",
  );
}

function writeConstructionTasks(workspace: string): void {
  writeFileSync(
    intentPath(workspace, `bolts/${bolt1}/tasks.md`),
    [
      "# Tasks",
      "",
      "- [ ] T001: Discovery Brief の基本見出しを作る",
      "  - 作業:",
      "    - 入力テーマ、確認した前提、判定、判定理由、推奨次アクションの見出しを作る。",
      "  - 要求: R001",
      "  - ユースケース: UC001",
      "  - 依存: なし",
      "  - 設計根拠: design.md#実装設計",
      "  - 証拠: 未登録",
      "- [ ] T002: Discovery 状態と一覧を整合させる",
      "  - 作業:",
      "    - state.json と discoveries.md の状態、判定、詳細リンクを一致させる。",
      "  - 要求: R001",
      "  - ユースケース: UC001",
      "  - 依存: T001",
      "  - 設計根拠: design.md#実装設計",
      "  - 証拠: 未登録",
      "",
    ].join("\n"),
  );
}

function writeConstructionTasksForSecondBolt(workspace: string): void {
  writeFileSync(
    intentPath(workspace, `bolts/${bolt2}/tasks.md`),
    [
      "# Tasks",
      "",
      "- [ ] T001: Intent 候補表を作る",
      "  - 作業:",
      "    - 候補、状態、Intent、課題、成功状態、除外範囲、依存を持つ候補表を作る。",
      "  - 要求: R002",
      "  - ユースケース: UC002",
      "  - 依存: B001/T002",
      "  - 設計根拠: design.md#実装設計",
      "  - 証拠: 未登録",
      "- [ ] T002: 推奨次アクションを候補状態に合わせる",
      "  - 作業:",
      "    - recommended または initialized の候補から、次に使う skill を示す。",
      "  - 要求: R002",
      "  - ユースケース: UC002",
      "  - 依存: T001",
      "  - 設計根拠: design.md#実装設計",
      "  - 証拠: 未登録",
      "",
    ].join("\n"),
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

function writeConstructionDesign(workspace: string, overrides: Record<string, string> = {}): void {
  writeFileSync(
    intentPath(workspace, `bolts/${bolt1}/design.md`),
    [
      "# Construction Design",
      "",
      "## 概要",
      "",
      overrides.overview ?? "- B001/T001 と B001/T002 を実装へ進められる粒度で設計した。",
      "",
      "## Domain Design",
      "",
      overrides.domain ?? "- 対象 Task: B001/T001, B001/T002。Discovery Brief の入力、判定、候補を一貫した成果物として扱う。",
      "",
      "## Logical Design",
      "",
      overrides.logical ?? "- 対象 Task: B001/T001, B001/T002。brief.md と state.json の整合を維持する。",
      "",
      "## 実装設計",
      "",
      overrides.implementation ?? "- 対象 Task: B001/T001, B001/T002。既存 Markdown 構造を壊さず、必要な見出しと表を更新する。",
      "",
      "## 検証設計",
      "",
      overrides.verification ?? "- 対象 Task: B001/T001, B001/T002。validator で Discovery Brief と Intent 成果物を確認する。",
      "",
      "## 設計変更記録",
      "",
      overrides.changes ?? "- なし。",
      "",
    ].join("\n"),
  );
}

function writeEventStormingSession(workspace: string): void {
  const base = join(workspace, ".amadeus/event-storming/ES001-loan-flow");
  mkdirSync(base, { recursive: true });
  writeFileSync(
    join(base, "summary.md"),
    [
      "# Event Storming Summary",
      "",
      "## Purpose",
      "",
      "- 図書貸出セルフサービスの Domain Event と設計候補を整理する。",
      "",
      "## Scope",
      "",
      "- pre-intent",
      "",
      "## Related Discovery",
      "",
      "- なし",
      "",
      "## Related Intent",
      "",
      "- なし",
      "",
      "## Level Status",
      "",
      "| Level | Status | Evidence |",
      "|---|---|---|",
      "| big-picture | ready | events.md, board.md |",
      "| process-modeling | ready | flow.md |",
      "| system-design | ready | aggregate-candidates.md, bounded-context-candidates.md |",
      "",
      "## Next Skill",
      "",
      "- amadeus-domain-modeling",
      "",
      "## Handoff To Domain Modeling",
      "",
      "| Candidate | Kind | Evidence | Open Questions |",
      "|---|---|---|---|",
      "| AGC001 | Aggregate Candidate | DEV001, DEV002 | 返却期限を同じ集約で守るか |",
      "| BCC001 | Bounded Context Candidate | AGC001, DEV001, DEV002 | 利用者管理と分けるか |",
      "",
      "## Supersession",
      "",
      "| Field | Value |",
      "|---|---|",
      "| Supersedes | なし |",
      "| Superseded By | なし |",
      "| Reason | なし |",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(base, "events.md"),
    [
      "# Domain Events",
      "",
      "## 一覧",
      "",
      "| ID | Domain Event | Description | Source | Excluded Similar Events |",
      "|---|---|---|---|---|",
      "| DEV001 | 貸出が開始された | 利用者が図書の貸出を開始した | ヒアリング | 貸出ボタンがクリックされた |",
      "| DEV002 | 返却期限が決まった | 貸出に対する返却期限が決まった | ヒアリング | 返却期限計算 API が呼ばれた |",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(base, "flow.md"),
    [
      "# Event Storming Flow",
      "",
      "## Flow",
      "",
      "| ID | Type | Label | Trigger | Produces | Related | Note |",
      "|---|---|---|---|---|---|---|",
      "| ACT001 | Actor | 利用者 |  | CMD001 |  | 図書を借りる |",
      "| CMD001 | Command | 貸出を開始する | ACT001 | DEV001 |  | UI event は Command の契機として扱う |",
      "| DEV001 | Domain Event | 貸出が開始された | CMD001 | POL001 |  |  |",
      "| POL001 | Policy | 貸出開始時に返却期限を決める | DEV001 | DEV002 |  |  |",
      "| DEV002 | Domain Event | 返却期限が決まった | POL001 | RM001 |  |  |",
      "| RM001 | Read Model | 貸出状況 | DEV001, DEV002 |  | ACT001 | 利用者が参照する |",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(base, "board.md"),
    [
      "# Event Storming Board",
      "",
      "## Board",
      "",
      "| Order | Type | ID | Label | Related | Note |",
      "|---:|---|---|---|---|---|",
      "| 1 | Actor | ACT001 | 利用者 | CMD001 | 図書を借りる |",
      "| 2 | Command | CMD001 | 貸出を開始する | DEV001 | 利用者が実行する |",
      "| 3 | Domain Event | DEV001 | 貸出が開始された | POL001 | 貸出事実 |",
      "| 4 | Policy | POL001 | 貸出開始時に返却期限を決める | DEV002 | 期限決定へ進む |",
      "| 5 | Domain Event | DEV002 | 返却期限が決まった | AGC001 | 期限事実 |",
      "| 6 | Aggregate Candidate | AGC001 | 貸出 | DEV001, DEV002 | 貸出と返却期限の一貫性境界候補 |",
      "| 7 | Bounded Context Candidate | BCC001 | 貸出管理 | AGC001 | 貸出関連ルールの境界候補 |",
      "| 8 | Read Model | RM001 | 貸出状況 | DEV001, DEV002 | 貸出状況の参照モデル |",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(base, "aggregate-candidates.md"),
    [
      "# Aggregate Candidates",
      "",
      "## 一覧",
      "",
      "| ID | Candidate | Rationale | Related Domain Events | Consistency Clues | Open Questions |",
      "|---|---|---|---|---|---|",
      "| AGC001 | 貸出 | 貸出開始と返却期限の一貫性が密に見える | DEV001, DEV002 | 貸出開始後に返却期限が必要 | 返却期限変更を含めるか |",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(base, "bounded-context-candidates.md"),
    [
      "# Bounded Context Candidates",
      "",
      "## 一覧",
      "",
      "| ID | Candidate | Rationale | Related Domain Events | Related Aggregate Candidates | Open Questions |",
      "|---|---|---|---|---|---|",
      "| BCC001 | 貸出管理 | 貸出開始と返却期限のルールが密に関係する | DEV001, DEV002 | AGC001 | 利用者管理と同じ境界かは未確認 |",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(base, "hotspots.md"),
    [
      "# Hotspots",
      "",
      "## 一覧",
      "",
      "| ID | Type | Summary | Source | Status | Related | Next Action |",
      "|---|---|---|---|---|---|---|",
      "| HOT001 | Open Question | 返却期限変更の扱いが未確定 | ヒアリング | open | DEV002 | Domain Modeling で確認する |",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(base, "state.json"),
    JSON.stringify({
      schemaVersion: 1,
      id: "ES001-loan-flow",
      phase: "event-storming",
      status: "ready",
      currentLevel: "system-design",
      completedLevels: ["big-picture", "process-modeling", "system-design"],
      scope: "pre-intent",
      relatedDiscovery: null,
      relatedIntent: null,
      nextRecommendedSkill: "amadeus-domain-modeling",
    }, null, 2),
  );
}

function removeEventStormingBoardCandidate(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/board.md");
  replaceInFile(
    path,
    "| 6 | Aggregate Candidate | AGC001 | 貸出 | DEV001, DEV002 | 貸出と返却期限の一貫性境界候補 |\n",
    "",
    "event storming fixture does not contain expected aggregate candidate row",
  );
}

function removeEventStormingBoardBoundedContextCandidate(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/board.md");
  replaceInFile(
    path,
    "| 7 | Bounded Context Candidate | BCC001 | 貸出管理 | AGC001 | 貸出関連ルールの境界候補 |\n",
    "",
    "event storming fixture does not contain expected bounded context candidate row",
  );
}

function removeEventStormingBoardProcessElement(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/board.md");
  replaceInFile(
    path,
    "| 4 | Policy | POL001 | 貸出開始時に返却期限を決める | DEV002 | 期限決定へ進む |\n",
    "",
    "event storming fixture does not contain expected policy row",
  );
  replaceInFile(
    path,
    "| 3 | Domain Event | DEV001 | 貸出が開始された | POL001 | 貸出事実 |",
    "| 3 | Domain Event | DEV001 | 貸出が開始された | DEV002 | 貸出事実 |",
    "event storming fixture does not contain expected DEV001 board row",
  );
}

function removeEventStormingBoardReadModel(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/board.md");
  replaceInFile(
    path,
    "| 8 | Read Model | RM001 | 貸出状況 | DEV001, DEV002 | 貸出状況の参照モデル |\n",
    "",
    "event storming fixture does not contain expected read model row",
  );
}

function markEventStormingCurrentLevelBigPictureWithProcessComplete(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/state.json");
  replaceInFile(
    path,
    '"currentLevel": "system-design",\n  "completedLevels": [\n    "big-picture",\n    "process-modeling",\n    "system-design"\n  ]',
    '"currentLevel": "big-picture",\n  "completedLevels": [\n    "big-picture",\n    "process-modeling"\n  ]',
    "event storming fixture does not contain expected level state",
  );
}

function markEventStormingProcessModelingReady(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/state.json");
  replaceInFile(
    path,
    '"currentLevel": "system-design",\n  "completedLevels": [\n    "big-picture",\n    "process-modeling",\n    "system-design"\n  ]',
    '"currentLevel": "process-modeling",\n  "completedLevels": [\n    "big-picture",\n    "process-modeling"\n  ]',
    "event storming fixture does not contain expected level state",
  );
  replaceInFile(
    path,
    '"nextRecommendedSkill": "amadeus-domain-modeling"',
    '"nextRecommendedSkill": "amadeus-discovery"',
    "event storming fixture does not contain expected nextRecommendedSkill",
  );
}

function markEventStormingSystemDesignDraft(workspace: string): void {
  const statePath = join(workspace, ".amadeus/event-storming/ES001-loan-flow/state.json");
  replaceInFile(
    statePath,
    '"status": "ready",\n  "currentLevel": "system-design",\n  "completedLevels": [\n    "big-picture",\n    "process-modeling",\n    "system-design"\n  ]',
    '"status": "draft",\n  "currentLevel": "system-design",\n  "completedLevels": [\n    "big-picture",\n    "process-modeling"\n  ]',
    "event storming fixture does not contain expected ready state",
  );
  const summaryPath = join(workspace, ".amadeus/event-storming/ES001-loan-flow/summary.md");
  replaceInFile(
    summaryPath,
    "| system-design | ready | aggregate-candidates.md, bounded-context-candidates.md |",
    "| system-design | draft | aggregate-candidates.md, bounded-context-candidates.md |",
    "event storming fixture does not contain expected system-design status",
  );
}

function removeEventStormingSummaryHandoff(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/summary.md");
  replaceInFile(
    path,
    [
      "## Handoff To Domain Modeling",
      "",
      "| Candidate | Kind | Evidence | Open Questions |",
      "|---|---|---|---|",
      "| AGC001 | Aggregate Candidate | DEV001, DEV002 | 返却期限を同じ集約で守るか |",
      "| BCC001 | Bounded Context Candidate | AGC001, DEV001, DEV002 | 利用者管理と分けるか |",
      "",
    ].join("\n"),
    "",
    "event storming fixture does not contain expected handoff section",
  );
}

function removeEventStormingSummaryHandoffRows(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/summary.md");
  replaceInFile(
    path,
    [
      "| AGC001 | Aggregate Candidate | DEV001, DEV002 | 返却期限を同じ集約で守るか |",
      "| BCC001 | Bounded Context Candidate | AGC001, DEV001, DEV002 | 利用者管理と分けるか |",
      "",
    ].join("\n"),
    "",
    "event storming fixture does not contain expected handoff rows",
  );
}

function replaceEventStormingSummaryHandoffCandidateWithMissingId(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/summary.md");
  replaceInFile(
    path,
    "| AGC001 | Aggregate Candidate | DEV001, DEV002 | 返却期限を同じ集約で守るか |",
    "| AGC999 | Aggregate Candidate | DEV001, DEV002 | 返却期限を同じ集約で守るか |",
    "event storming fixture does not contain expected handoff row",
  );
}

function markEventStormingSystemDesignReadyWithoutCompletedLevel(workspace: string): void {
  const statePath = join(workspace, ".amadeus/event-storming/ES001-loan-flow/state.json");
  replaceInFile(
    statePath,
    '"completedLevels": [\n    "big-picture",\n    "process-modeling",\n    "system-design"\n  ]',
    '"completedLevels": [\n    "big-picture",\n    "process-modeling"\n  ]',
    "event storming fixture does not contain expected completedLevels",
  );
}

function replaceEventStormingBoardRelatedWithMissingId(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/board.md");
  replaceInFile(
    path,
    "| 2 | Command | CMD001 | 貸出を開始する | DEV001 | 利用者が実行する |",
    "| 2 | Command | CMD001 | 貸出を開始する | DEV999 | 利用者が実行する |",
    "event storming fixture does not contain expected board row",
  );
}

function replaceEventStormingDraftReferencesWithUnknown(workspace: string): void {
  const flowPath = join(workspace, ".amadeus/event-storming/ES001-loan-flow/flow.md");
  replaceInFile(
    flowPath,
    "| CMD001 | Command | 貸出を開始する | ACT001 | DEV001 |  | UI event は Command の契機として扱う |",
    "| CMD001 | Command | 貸出を開始する | 未確認 | DEV001 |  | UI event は Command の契機として扱う |",
    "event storming fixture does not contain expected flow row",
  );
  const boardPath = join(workspace, ".amadeus/event-storming/ES001-loan-flow/board.md");
  replaceInFile(
    boardPath,
    "| 2 | Command | CMD001 | 貸出を開始する | DEV001 | 利用者が実行する |",
    "| 2 | Command | CMD001 | 貸出を開始する | 未確認 | 利用者が実行する |",
    "event storming fixture does not contain expected board row",
  );
  const hotspotsPath = join(workspace, ".amadeus/event-storming/ES001-loan-flow/hotspots.md");
  replaceInFile(
    hotspotsPath,
    "| HOT001 | Open Question | 返却期限変更の扱いが未確定 | ヒアリング | open | DEV002 | Domain Modeling で確認する |",
    "| HOT001 | Open Question | 返却期限変更の扱いが未確定 | ヒアリング | open | 未確認 | Domain Modeling で確認する |",
    "event storming fixture does not contain expected hotspot row",
  );
}

function markEventStormingBigPictureReady(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/state.json");
  replaceInFile(
    path,
    '"currentLevel": "system-design",\n  "completedLevels": [\n    "big-picture",\n    "process-modeling",\n    "system-design"\n  ]',
    '"currentLevel": "big-picture",\n  "completedLevels": [\n    "big-picture"\n  ]',
    "event storming fixture does not contain expected level state",
  );
  replaceInFile(
    path,
    '"nextRecommendedSkill": "amadeus-domain-modeling"',
    '"nextRecommendedSkill": "amadeus-discovery"',
    "event storming fixture does not contain expected nextRecommendedSkill",
  );
}

function replaceEventStormingRelatedIntentWithValue(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/state.json");
  replaceInFile(
    path,
    '"relatedIntent": null',
    '"relatedIntent": "20260628-discovery-brief-creation"',
    "event storming fixture does not contain expected relatedIntent",
  );
}

function removeEventStormingState(workspace: string): void {
  rmSync(join(workspace, ".amadeus/event-storming/ES001-loan-flow/state.json"));
}

function replaceEventStormingCompletedLevelsWithMissingPrerequisite(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/state.json");
  replaceInFile(
    path,
    '"completedLevels": [\n    "big-picture",\n    "process-modeling",\n    "system-design"\n  ]',
    '"completedLevels": [\n    "system-design"\n  ]',
    "event storming fixture does not contain expected completedLevels",
  );
}

function replaceEventStormingNextRecommendedSkillWithWrongValue(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/state.json");
  replaceInFile(
    path,
    '"nextRecommendedSkill": "amadeus-domain-modeling"',
    '"nextRecommendedSkill": "amadeus-inception"',
    "event storming fixture does not contain expected nextRecommendedSkill",
  );
}

function replaceEventStormingNextRecommendedSkillIgnoringCompletedLevels(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/state.json");
  replaceInFile(
    path,
    '"currentLevel": "system-design"',
    '"currentLevel": "big-picture"',
    "event storming fixture does not contain expected currentLevel",
  );
  replaceInFile(
    path,
    '"nextRecommendedSkill": "amadeus-domain-modeling"',
    '"nextRecommendedSkill": "amadeus-discovery"',
    "event storming fixture does not contain expected nextRecommendedSkill",
  );
}

function replaceEventStormingFlowTypeWithMismatchedIdPrefix(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/flow.md");
  replaceInFile(
    path,
    "| ACT001 | Actor | 利用者 |  | CMD001 |  | 図書を借りる |",
    "| ACT001 | External System | 利用者 |  | CMD001 |  | 図書を借りる |",
    "event storming fixture does not contain expected flow row",
  );
}

function removeEventStormingFlowDomainEvent(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/flow.md");
  replaceInFile(
    path,
    "| DEV002 | Domain Event | 返却期限が決まった | POL001 | RM001 |  |  |\n",
    "",
    "event storming fixture does not contain expected DEV002 flow row",
  );
}

function replaceEventStormingBoardOrderWithInvalidValue(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/board.md");
  replaceInFile(
    path,
    "| 2 | Command | CMD001 | 貸出を開始する | DEV001 | 利用者が実行する |",
    "| x | Command | CMD001 | 貸出を開始する | DEV001 | 利用者が実行する |",
    "event storming fixture does not contain expected board order",
  );
}

function replaceEventStormingHotspotRelatedWithMissingId(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/hotspots.md");
  replaceInFile(
    path,
    "| HOT001 | Open Question | 返却期限変更の扱いが未確定 | ヒアリング | open | DEV002 | Domain Modeling で確認する |",
    "| HOT001 | Open Question | 返却期限変更の扱いが未確定 | ヒアリング | open | DEV999 | Domain Modeling で確認する |",
    "event storming fixture does not contain expected hotspot row",
  );
}

function replaceEventStormingHotspotRelatedWithFlowOnlyId(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/hotspots.md");
  replaceInFile(
    path,
    "| HOT001 | Open Question | 返却期限変更の扱いが未確定 | ヒアリング | open | DEV002 | Domain Modeling で確認する |",
    "| HOT001 | Open Question | 返却期限変更の扱いが未確定 | ヒアリング | open | RM001 | Domain Modeling で確認する |",
    "event storming fixture does not contain expected hotspot row",
  );
}

function removeEventStormingEventRows(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/events.md");
  replaceInFile(
    path,
    [
      "| DEV001 | 貸出が開始された | 利用者が図書の貸出を開始した | ヒアリング | 貸出ボタンがクリックされた |",
      "| DEV002 | 返却期限が決まった | 貸出に対する返却期限が決まった | ヒアリング | 返却期限計算 API が呼ばれた |",
      "",
    ].join("\n"),
    "",
    "event storming fixture does not contain expected event rows",
  );
}

function removeEventStormingAggregateCandidateRows(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/aggregate-candidates.md");
  replaceInFile(
    path,
    "| AGC001 | 貸出 | 貸出開始と返却期限の一貫性が密に見える | DEV001, DEV002 | 貸出開始後に返却期限が必要 | 返却期限変更を含めるか |\n",
    "",
    "event storming fixture does not contain expected aggregate candidate row",
  );
}

function removeEventStormingBoundedContextCandidateRows(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow/bounded-context-candidates.md");
  replaceInFile(
    path,
    "| BCC001 | 貸出管理 | 貸出開始と返却期限のルールが密に関係する | DEV001, DEV002 | AGC001 | 利用者管理と同じ境界かは未確認 |\n",
    "",
    "event storming fixture does not contain expected bounded context candidate row",
  );
}

function writeConstructionDesignForSecondBolt(workspace: string): void {
  writeFileSync(
    intentPath(workspace, `bolts/${bolt2}/design.md`),
    [
      "# Construction Design",
      "",
      "## 概要",
      "",
      "- B002/T001 と B002/T002 を実装へ進められる粒度で設計した。",
      "",
      "## Domain Design",
      "",
      "- 対象 Task: B002/T001, B002/T002。Intent 候補と推奨次アクションを一貫した判断記録として扱う。",
      "",
      "## Logical Design",
      "",
      "- 対象 Task: B002/T001, B002/T002。候補状態と推奨次アクションを対応させる。",
      "",
      "## 実装設計",
      "",
      "- 対象 Task: B002/T001, B002/T002。候補表と次アクション表示を更新する。",
      "",
      "## 検証設計",
      "",
      "- 対象 Task: B002/T001, B002/T002。validator で候補表と推奨次アクションを確認する。",
      "",
      "## 設計変更記録",
      "",
      "- なし。",
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
      `bolts/${bolt1}/design.md`,
      `bolts/${bolt1}/notes.md`,
      `bolts/${bolt1}/test-results.md`,
    ],
    gate: overrides.constructionGate ?? "not_ready",
    bolts: overrides.bolts ?? [
      {
        id: "B001",
        designGate: {
          status: "ready",
          reviewedBy: "ai",
          updatedAt: "2026-06-28",
          evidence: `bolts/${bolt1}/design.md`,
        },
        tasks: {
          status: "generated",
          reviewedBy: "ai",
          updatedAt: "2026-06-28",
          evidence: `bolts/${bolt1}/tasks.md`,
        },
      },
    ],
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

function appendConstructionTrace(workspace: string): void {
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
      `| B001 | B001/T001, B001/T002 | [test-results.md](bolts/${bolt1}/test-results.md) | completed |`,
      "",
    ].join("\n"),
  );
}

function appendConstructionDesignTrace(
  workspace: string,
  overrides: { task?: string; implementation?: string; verification?: string; pr?: string; status?: string } = {},
): void {
  const path = intentPath(workspace, "traceability.md");
  const text = readFileSync(path, "utf8");
  writeFileSync(
    path,
    [
      text.trimEnd(),
      "",
      "## Construction Design からの追跡",
      "",
      "| Construction Design | Task | 実装 | 検証 | PR | 状態 |",
      "|---|---|---|---|---|---|",
      `| [B001 Construction Design](bolts/${bolt1}/design.md) | ${overrides.task ?? "B001/T001, B001/T002"} | ${overrides.implementation ?? "未実施"} | ${overrides.verification ?? "未実施"} | ${overrides.pr ?? "未実施"} | ${overrides.status ?? "ready"} |`,
      "",
    ].join("\n"),
  );
}

run(["bun", "run", validator, "examples/04-inception-completed", intent]);

const eventStormingWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingWorkspace);
run(["bun", "run", validator, eventStormingWorkspace]);

const draftSystemDesignEventStormingWorkspace = workspaceCopy();
writeEventStormingSession(draftSystemDesignEventStormingWorkspace);
markEventStormingSystemDesignDraft(draftSystemDesignEventStormingWorkspace);
removeEventStormingSummaryHandoff(draftSystemDesignEventStormingWorkspace);
run(["bun", "run", validator, draftSystemDesignEventStormingWorkspace]);

const draftEventStormingWithFlowOnlyHotspotWorkspace = workspaceCopy();
writeEventStormingSession(draftEventStormingWithFlowOnlyHotspotWorkspace);
markEventStormingSystemDesignDraft(draftEventStormingWithFlowOnlyHotspotWorkspace);
removeEventStormingBoardReadModel(draftEventStormingWithFlowOnlyHotspotWorkspace);
replaceEventStormingHotspotRelatedWithFlowOnlyId(draftEventStormingWithFlowOnlyHotspotWorkspace);
run(["bun", "run", validator, draftEventStormingWithFlowOnlyHotspotWorkspace]);

const draftEventStormingWithUnknownReferenceWorkspace = workspaceCopy();
writeEventStormingSession(draftEventStormingWithUnknownReferenceWorkspace);
markEventStormingSystemDesignDraft(draftEventStormingWithUnknownReferenceWorkspace);
replaceEventStormingDraftReferencesWithUnknown(draftEventStormingWithUnknownReferenceWorkspace);
run(["bun", "run", validator, draftEventStormingWithUnknownReferenceWorkspace]);

const missingEventStormingBoardCandidateWorkspace = workspaceCopy();
writeEventStormingSession(missingEventStormingBoardCandidateWorkspace);
removeEventStormingBoardCandidate(missingEventStormingBoardCandidateWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingEventStormingBoardCandidateWorkspace],
  "`board.md` が system-design の Aggregate Candidate を含む",
);

const missingEventStormingBoardBoundedContextCandidateWorkspace = workspaceCopy();
writeEventStormingSession(missingEventStormingBoardBoundedContextCandidateWorkspace);
removeEventStormingBoardBoundedContextCandidate(missingEventStormingBoardBoundedContextCandidateWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingEventStormingBoardBoundedContextCandidateWorkspace],
  "`board.md` が system-design の Bounded Context Candidate を含む",
);

const missingEventStormingBoardProcessElementWorkspace = workspaceCopy();
writeEventStormingSession(missingEventStormingBoardProcessElementWorkspace);
removeEventStormingBoardProcessElement(missingEventStormingBoardProcessElementWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingEventStormingBoardProcessElementWorkspace],
  "`board.md` が process-modeling の要素を含む",
);

const missingEventStormingProcessReadyBoardElementWorkspace = workspaceCopy();
writeEventStormingSession(missingEventStormingProcessReadyBoardElementWorkspace);
markEventStormingProcessModelingReady(missingEventStormingProcessReadyBoardElementWorkspace);
removeEventStormingBoardProcessElement(missingEventStormingProcessReadyBoardElementWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingEventStormingProcessReadyBoardElementWorkspace],
  "`board.md` が process-modeling の要素を含む",
);

const completedProcessEventStormingWithBadBoardRefWorkspace = workspaceCopy();
writeEventStormingSession(completedProcessEventStormingWithBadBoardRefWorkspace);
markEventStormingCurrentLevelBigPictureWithProcessComplete(completedProcessEventStormingWithBadBoardRefWorkspace);
replaceEventStormingBoardRelatedWithMissingId(completedProcessEventStormingWithBadBoardRefWorkspace);
runExpectFailure(
  ["bun", "run", validator, completedProcessEventStormingWithBadBoardRefWorkspace],
  "`Related` が Event Storming 要素 ID またはなしである",
);

const bigPictureEventStormingWithBadBoardRefWorkspace = workspaceCopy();
writeEventStormingSession(bigPictureEventStormingWithBadBoardRefWorkspace);
markEventStormingBigPictureReady(bigPictureEventStormingWithBadBoardRefWorkspace);
replaceEventStormingBoardRelatedWithMissingId(bigPictureEventStormingWithBadBoardRefWorkspace);
runExpectFailure(
  ["bun", "run", validator, bigPictureEventStormingWithBadBoardRefWorkspace],
  "`Related` が Event Storming 要素 ID またはなしである",
);

const eventStormingWithoutStateWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingWithoutStateWorkspace);
removeEventStormingState(eventStormingWithoutStateWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithoutStateWorkspace],
  "Event Storming 状態ファイルが存在する",
);

const eventStormingPreIntentWithRelatedIntentWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingPreIntentWithRelatedIntentWorkspace);
replaceEventStormingRelatedIntentWithValue(eventStormingPreIntentWithRelatedIntentWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingPreIntentWithRelatedIntentWorkspace],
  "`relatedIntent` が",
);

const eventStormingReadyWithoutCompletedSystemDesignWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingReadyWithoutCompletedSystemDesignWorkspace);
markEventStormingSystemDesignReadyWithoutCompletedLevel(eventStormingReadyWithoutCompletedSystemDesignWorkspace);
removeEventStormingSummaryHandoff(eventStormingReadyWithoutCompletedSystemDesignWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingReadyWithoutCompletedSystemDesignWorkspace],
  "Handoff To Domain Modeling",
);

const eventStormingWithoutHandoffRowsWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingWithoutHandoffRowsWorkspace);
removeEventStormingSummaryHandoffRows(eventStormingWithoutHandoffRowsWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithoutHandoffRowsWorkspace],
  "system-design ready の Handoff が1件以上ある",
);

const eventStormingWithBadHandoffCandidateWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingWithBadHandoffCandidateWorkspace);
replaceEventStormingSummaryHandoffCandidateWithMissingId(eventStormingWithBadHandoffCandidateWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithBadHandoffCandidateWorkspace],
  "`Candidate` が system-design 候補 ID である",
);

const eventStormingMissingCompletedLevelPrerequisiteWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingMissingCompletedLevelPrerequisiteWorkspace);
replaceEventStormingCompletedLevelsWithMissingPrerequisite(eventStormingMissingCompletedLevelPrerequisiteWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingMissingCompletedLevelPrerequisiteWorkspace],
  "`system-design` 完了は `process-modeling` 完了を前提にする",
);

const eventStormingWrongNextRecommendedSkillWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingWrongNextRecommendedSkillWorkspace);
replaceEventStormingNextRecommendedSkillWithWrongValue(eventStormingWrongNextRecommendedSkillWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWrongNextRecommendedSkillWorkspace],
  "`nextRecommendedSkill` が scope と level に対応する",
);

const eventStormingNextRecommendedSkillIgnoringCompletedLevelsWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingNextRecommendedSkillIgnoringCompletedLevelsWorkspace);
replaceEventStormingNextRecommendedSkillIgnoringCompletedLevels(eventStormingNextRecommendedSkillIgnoringCompletedLevelsWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingNextRecommendedSkillIgnoringCompletedLevelsWorkspace],
  "`nextRecommendedSkill` が scope と level に対応する",
);

const eventStormingMismatchedTypeIdPrefixWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingMismatchedTypeIdPrefixWorkspace);
replaceEventStormingFlowTypeWithMismatchedIdPrefix(eventStormingMismatchedTypeIdPrefixWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingMismatchedTypeIdPrefixWorkspace],
  "`Type` と `ID` 接頭辞が対応する",
);

const eventStormingMissingFlowDomainEventWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingMissingFlowDomainEventWorkspace);
removeEventStormingFlowDomainEvent(eventStormingMissingFlowDomainEventWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingMissingFlowDomainEventWorkspace],
  "`flow.md` が Domain Event を含む",
);

const eventStormingInvalidBoardOrderWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingInvalidBoardOrderWorkspace);
replaceEventStormingBoardOrderWithInvalidValue(eventStormingInvalidBoardOrderWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingInvalidBoardOrderWorkspace],
  "`Order` が正の整数である",
);

const eventStormingMissingHotspotReferenceWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingMissingHotspotReferenceWorkspace);
replaceEventStormingHotspotRelatedWithMissingId(eventStormingMissingHotspotReferenceWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingMissingHotspotReferenceWorkspace],
  "`Related` が Event Storming 要素 ID またはなしである",
);

const eventStormingWithoutEventsWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingWithoutEventsWorkspace);
removeEventStormingEventRows(eventStormingWithoutEventsWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithoutEventsWorkspace],
  "big-picture ready の Domain Event が1件以上ある",
);

const eventStormingWithoutAggregateCandidatesWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingWithoutAggregateCandidatesWorkspace);
removeEventStormingAggregateCandidateRows(eventStormingWithoutAggregateCandidatesWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithoutAggregateCandidatesWorkspace],
  "system-design ready の Aggregate Candidate が1件以上ある",
);

const eventStormingWithoutBoundedContextCandidatesWorkspace = workspaceCopy();
writeEventStormingSession(eventStormingWithoutBoundedContextCandidatesWorkspace);
removeEventStormingBoundedContextCandidateRows(eventStormingWithoutBoundedContextCandidatesWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithoutBoundedContextCandidatesWorkspace],
  "system-design ready の Bounded Context Candidate が1件以上ある",
);

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
  "`要求` が一覧内の既存 ID である",
);

const requirementTraceWithTaskColumnWorkspace = workspaceCopy();
addTaskColumnToRequirementTrace(requirementTraceWithTaskColumnWorkspace);
runExpectFailure(
  ["bun", "run", validator, requirementTraceWithTaskColumnWorkspace, intent],
  "Inception の `要求からの追跡` は `タスク` 列を持たない",
);

const inceptionWithTaskFileWorkspace = workspaceCopy();
writeConstructionTasks(inceptionWithTaskFileWorkspace);
runExpectFailure(
  ["bun", "run", validator, inceptionWithTaskFileWorkspace, intent],
  "Inception は Bolt 配下の tasks.md を持たない",
);

const missingTaskDesignReasonWorkspace = workspaceCopy();
writeConstructionDesign(missingTaskDesignReasonWorkspace);
writeConstructionTasks(missingTaskDesignReasonWorkspace);
writeConstructionNotes(missingTaskDesignReasonWorkspace);
appendConstructionDesignTrace(missingTaskDesignReasonWorkspace);
writeConstructionState(missingTaskDesignReasonWorkspace);
removeTaskDesignReason(missingTaskDesignReasonWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingTaskDesignReasonWorkspace, intent],
  "Task が `設計根拠` を持つ",
);

const wrongTaskReferencesWorkspace = workspaceCopy();
writeConstructionDesign(wrongTaskReferencesWorkspace);
writeConstructionTasks(wrongTaskReferencesWorkspace);
writeConstructionNotes(wrongTaskReferencesWorkspace);
appendConstructionDesignTrace(wrongTaskReferencesWorkspace);
writeConstructionState(wrongTaskReferencesWorkspace);
replaceTaskReferencesWithMissingIds(wrongTaskReferencesWorkspace);
runExpectFailure(
  ["bun", "run", validator, wrongTaskReferencesWorkspace, intent],
  "Task の `要求` が既存 ID またはなしである",
);

const emptyTaskReferencesWorkspace = workspaceCopy();
writeConstructionDesign(emptyTaskReferencesWorkspace);
writeConstructionTasks(emptyTaskReferencesWorkspace);
writeConstructionNotes(emptyTaskReferencesWorkspace);
appendConstructionDesignTrace(emptyTaskReferencesWorkspace);
writeConstructionState(emptyTaskReferencesWorkspace);
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
writeConstructionDesign(constructionWithoutInceptionRequiredWorkspace);
writeConstructionTasks(constructionWithoutInceptionRequiredWorkspace);
writeConstructionNotes(constructionWithoutInceptionRequiredWorkspace);
writeConstructionTestResults(constructionWithoutInceptionRequiredWorkspace);
appendConstructionDesignTrace(constructionWithoutInceptionRequiredWorkspace);
writeConstructionState(constructionWithoutInceptionRequiredWorkspace);
run(["bun", "run", validator, constructionWithoutInceptionRequiredWorkspace, intent]);

const constructionWithStaleInceptionRequiredWorkspace = workspaceCopy();
writeConstructionDesign(constructionWithStaleInceptionRequiredWorkspace);
writeConstructionTasks(constructionWithStaleInceptionRequiredWorkspace);
writeConstructionNotes(constructionWithStaleInceptionRequiredWorkspace);
writeConstructionTestResults(constructionWithStaleInceptionRequiredWorkspace);
appendConstructionDesignTrace(constructionWithStaleInceptionRequiredWorkspace);
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

const readyNonTargetBoltWorkspace = workspaceCopy();
writeConstructionDesign(readyNonTargetBoltWorkspace);
writeConstructionTasks(readyNonTargetBoltWorkspace);
writeConstructionDesignForSecondBolt(readyNonTargetBoltWorkspace);
writeConstructionTasksForSecondBolt(readyNonTargetBoltWorkspace);
writeConstructionNotes(readyNonTargetBoltWorkspace);
writeConstructionTestResults(readyNonTargetBoltWorkspace);
writeConstructionState(readyNonTargetBoltWorkspace, {
  requiredBoltArtifacts: [
    `bolts/${bolt1}/bolt.md`,
    `bolts/${bolt1}/tasks.md`,
    `bolts/${bolt1}/design.md`,
    `bolts/${bolt1}/notes.md`,
    `bolts/${bolt1}/test-results.md`,
    `bolts/${bolt2}/design.md`,
  ],
  bolts: [
    {
      id: "B001",
      designGate: {
        status: "draft",
        reviewedBy: "ai",
        updatedAt: "2026-06-28",
        evidence: `bolts/${bolt1}/design.md`,
      },
      tasks: {
        status: "generated",
        reviewedBy: "ai",
        updatedAt: "2026-06-28",
        evidence: `bolts/${bolt1}/tasks.md`,
      },
    },
    {
      id: "B002",
      designGate: {
        status: "ready",
        reviewedBy: "ai",
        updatedAt: "2026-06-28",
        evidence: `bolts/${bolt2}/design.md`,
      },
      tasks: {
        status: "generated",
        reviewedBy: "ai",
        updatedAt: "2026-06-28",
        evidence: `bolts/${bolt2}/tasks.md`,
      },
    },
  ],
});
run(["bun", "run", validator, readyNonTargetBoltWorkspace, intent]);

const completedConstructionWithoutTestResultsWorkspace = workspaceCopy();
writeConstructionDesign(completedConstructionWithoutTestResultsWorkspace);
writeConstructionTasks(completedConstructionWithoutTestResultsWorkspace);
writeConstructionNotes(completedConstructionWithoutTestResultsWorkspace);
appendConstructionDesignTrace(completedConstructionWithoutTestResultsWorkspace, {
  implementation: "実装済み",
  verification: "検証済み",
  status: "passed",
});
appendConstructionTrace(completedConstructionWithoutTestResultsWorkspace);
writeConstructionState(completedConstructionWithoutTestResultsWorkspace, {
  status: "completed",
  constructionStatus: "completed",
  constructionGate: "passed",
  requiredBoltArtifacts: [
    `bolts/${bolt1}/bolt.md`,
    `bolts/${bolt1}/tasks.md`,
    `bolts/${bolt1}/design.md`,
    `bolts/${bolt1}/notes.md`,
  ],
});
runExpectFailure(
  ["bun", "run", validator, completedConstructionWithoutTestResultsWorkspace, intent],
  "Construction 完了時の必須 Bolt 成果物が test-results.md を含む",
);

const missingTargetBoltArtifactsWorkspace = workspaceCopy();
writeConstructionDesign(missingTargetBoltArtifactsWorkspace);
writeConstructionTasks(missingTargetBoltArtifactsWorkspace);
writeConstructionNotes(missingTargetBoltArtifactsWorkspace);
writeConstructionTestResults(missingTargetBoltArtifactsWorkspace);
appendConstructionDesignTrace(missingTargetBoltArtifactsWorkspace);
writeConstructionState(missingTargetBoltArtifactsWorkspace, {
  requiredBoltArtifacts: [
    `bolts/${bolt1}/bolt.md`,
    `bolts/${bolt1}/tasks.md`,
    `bolts/${bolt1}/design.md`,
  ],
});
runExpectFailure(
  ["bun", "run", validator, missingTargetBoltArtifactsWorkspace, intent],
  "Construction 必須 Bolt 成果物が targetBolt の証拠成果物を含む",
);

const generatedTasksWithoutRequiredTasksWorkspace = workspaceCopy();
writeConstructionDesign(generatedTasksWithoutRequiredTasksWorkspace);
writeConstructionTasks(generatedTasksWithoutRequiredTasksWorkspace);
writeConstructionNotes(generatedTasksWithoutRequiredTasksWorkspace);
writeConstructionTestResults(generatedTasksWithoutRequiredTasksWorkspace);
appendConstructionDesignTrace(generatedTasksWithoutRequiredTasksWorkspace);
writeConstructionState(generatedTasksWithoutRequiredTasksWorkspace, {
  requiredBoltArtifacts: [
    `bolts/${bolt1}/bolt.md`,
    `bolts/${bolt1}/design.md`,
    `bolts/${bolt1}/notes.md`,
  ],
});
runExpectFailure(
  ["bun", "run", validator, generatedTasksWithoutRequiredTasksWorkspace, intent],
  "Construction 必須 Bolt 成果物が targetBolt の証拠成果物を含む",
);

const notGeneratedTasksWorkspace = workspaceCopy();
writeConstructionDesign(notGeneratedTasksWorkspace, {
  overview: "- Construction Design は作成中で、Task への分解は未完了。",
  domain: "- Task 化前のため、対象成果物の関心だけを整理する。",
  logical: "- Task 化前のため、処理順序は未確定。",
  implementation: "- Task 化前のため、実装対象は未確定。",
  verification: "- Task 化前のため、検証対象は未確定。",
});
writeConstructionNotes(notGeneratedTasksWorkspace);
writeConstructionState(notGeneratedTasksWorkspace, {
  requiredBoltArtifacts: [
    `bolts/${bolt1}/bolt.md`,
    `bolts/${bolt1}/design.md`,
    `bolts/${bolt1}/notes.md`,
  ],
  bolts: [
    {
      id: "B001",
      designGate: {
        status: "draft",
        reviewedBy: "ai",
        updatedAt: "2026-06-28",
        evidence: `bolts/${bolt1}/design.md`,
      },
      tasks: {
        status: "not_generated",
        reviewedBy: "ai",
        updatedAt: "2026-06-28",
        evidence: "",
      },
    },
  ],
});
run(["bun", "run", validator, notGeneratedTasksWorkspace, intent]);

const constructionDesignTraceWrongBoltWorkspace = workspaceCopy();
writeConstructionDesign(constructionDesignTraceWrongBoltWorkspace);
writeConstructionTasks(constructionDesignTraceWrongBoltWorkspace);
writeConstructionNotes(constructionDesignTraceWrongBoltWorkspace);
writeConstructionTestResults(constructionDesignTraceWrongBoltWorkspace);
appendConstructionDesignTrace(constructionDesignTraceWrongBoltWorkspace, { task: "B002/T001" });
writeConstructionState(constructionDesignTraceWrongBoltWorkspace);
runExpectFailure(
  ["bun", "run", validator, constructionDesignTraceWrongBoltWorkspace, intent],
  "`Construction Design からの追跡` が対象 Bolt の Task を指す",
);

const untrackedConstructionDesignWorkspace = workspaceCopy();
writeConstructionDesign(untrackedConstructionDesignWorkspace);
writeConstructionTasks(untrackedConstructionDesignWorkspace);
writeConstructionNotes(untrackedConstructionDesignWorkspace);
writeConstructionTestResults(untrackedConstructionDesignWorkspace);
appendConstructionDesignTrace(untrackedConstructionDesignWorkspace);
writeConstructionState(untrackedConstructionDesignWorkspace);
writeFileSync(intentPath(untrackedConstructionDesignWorkspace, `bolts/${bolt2}/design.md`), "# Construction Design\n");
runExpectFailure(
  ["bun", "run", validator, untrackedConstructionDesignWorkspace, intent],
  "Construction Design は requiredBoltArtifacts に含まれる",
);

const oldUnitDetailWorkspace = workspaceCopy();
replaceUnitDetailWithOldPath(oldUnitDetailWorkspace);
runExpectFailure(
  ["bun", "run", validator, oldUnitDetailWorkspace, intent],
  "`詳細` が units/<unit-id>-<slug>/unit.md を指す",
);

const missingConstructionTraceWorkspace = workspaceCopy();
writeConstructionDesign(missingConstructionTraceWorkspace);
writeConstructionTasks(missingConstructionTraceWorkspace);
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
writeConstructionDesign(emptyConstructionTraceWorkspace);
writeConstructionTasks(emptyConstructionTraceWorkspace);
writeConstructionNotes(emptyConstructionTraceWorkspace);
writeConstructionTestResults(emptyConstructionTraceWorkspace);
appendConstructionDesignTrace(emptyConstructionTraceWorkspace);
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

const completedConstructionWithUnimplementedDesignTraceWorkspace = workspaceCopy();
writeConstructionDesign(completedConstructionWithUnimplementedDesignTraceWorkspace);
writeConstructionTasks(completedConstructionWithUnimplementedDesignTraceWorkspace);
writeConstructionNotes(completedConstructionWithUnimplementedDesignTraceWorkspace);
writeConstructionTestResults(completedConstructionWithUnimplementedDesignTraceWorkspace);
appendConstructionDesignTrace(completedConstructionWithUnimplementedDesignTraceWorkspace);
appendConstructionTrace(completedConstructionWithUnimplementedDesignTraceWorkspace);
writeConstructionState(completedConstructionWithUnimplementedDesignTraceWorkspace, {
  status: "completed",
  constructionStatus: "completed",
  constructionGate: "passed",
});
runExpectFailure(
  ["bun", "run", validator, completedConstructionWithUnimplementedDesignTraceWorkspace, intent],
  "Construction 完了時の設計追跡が未実施を残さない",
);

const prWithoutUrlWorkspace = workspaceCopy();
writeConstructionDesign(prWithoutUrlWorkspace);
writeConstructionTasks(prWithoutUrlWorkspace);
writeConstructionNotes(prWithoutUrlWorkspace);
writeConstructionTestResults(prWithoutUrlWorkspace);
appendConstructionDesignTrace(prWithoutUrlWorkspace);
writePrWithoutUrl(prWithoutUrlWorkspace);
writeConstructionState(prWithoutUrlWorkspace, {
  requiredBoltArtifacts: [
    `bolts/${bolt1}/bolt.md`,
    `bolts/${bolt1}/tasks.md`,
    `bolts/${bolt1}/design.md`,
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
writeConstructionDesign(existingPrWithoutUrlWorkspace);
writeConstructionTasks(existingPrWithoutUrlWorkspace);
writeConstructionNotes(existingPrWithoutUrlWorkspace);
writeConstructionTestResults(existingPrWithoutUrlWorkspace);
appendConstructionDesignTrace(existingPrWithoutUrlWorkspace);
writePrWithoutUrl(existingPrWithoutUrlWorkspace);
writeConstructionState(existingPrWithoutUrlWorkspace);
runExpectFailure(
  ["bun", "run", validator, existingPrWithoutUrlWorkspace, intent],
  "PR 記録が URL を持つ",
);

const missingConstructionDesignHeadingWorkspace = workspaceCopy();
writeConstructionDesign(missingConstructionDesignHeadingWorkspace, { logical: "" });
writeConstructionTasks(missingConstructionDesignHeadingWorkspace);
writeConstructionNotes(missingConstructionDesignHeadingWorkspace);
writeConstructionTestResults(missingConstructionDesignHeadingWorkspace);
appendConstructionDesignTrace(missingConstructionDesignHeadingWorkspace);
writeConstructionState(missingConstructionDesignHeadingWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingConstructionDesignHeadingWorkspace, intent],
  "`Logical Design` 見出しに本文がある",
);

const constructionWithoutBoltGateWorkspace = workspaceCopy();
writeConstructionDesign(constructionWithoutBoltGateWorkspace);
writeConstructionTasks(constructionWithoutBoltGateWorkspace);
writeConstructionNotes(constructionWithoutBoltGateWorkspace);
writeConstructionTestResults(constructionWithoutBoltGateWorkspace);
appendConstructionDesignTrace(constructionWithoutBoltGateWorkspace);
writeConstructionState(constructionWithoutBoltGateWorkspace, { bolts: [] });
  runExpectFailure(
    ["bun", "run", validator, constructionWithoutBoltGateWorkspace, intent],
    "`construction.bolts` が targetBolt の designGate を持つ",
  );

  const constructionWithoutTasksWorkspace = workspaceCopy();
  writeConstructionDesign(constructionWithoutTasksWorkspace);
  writeConstructionTasks(constructionWithoutTasksWorkspace);
  writeConstructionNotes(constructionWithoutTasksWorkspace);
  writeConstructionTestResults(constructionWithoutTasksWorkspace);
  appendConstructionDesignTrace(constructionWithoutTasksWorkspace);
  writeConstructionState(constructionWithoutTasksWorkspace, {
    bolts: [
      {
        id: "B001",
        designGate: {
          status: "ready",
          reviewedBy: "ai",
          updatedAt: "2026-06-28",
          evidence: `bolts/${bolt1}/design.md`,
        },
      },
    ],
  });
  runExpectFailure(
    ["bun", "run", validator, constructionWithoutTasksWorkspace, intent],
    "`construction.bolts[].tasks` がオブジェクトである",
  );

  const constructionReadyWithoutDesignTraceWorkspace = workspaceCopy();
writeConstructionDesign(constructionReadyWithoutDesignTraceWorkspace);
writeConstructionTasks(constructionReadyWithoutDesignTraceWorkspace);
writeConstructionNotes(constructionReadyWithoutDesignTraceWorkspace);
writeConstructionTestResults(constructionReadyWithoutDesignTraceWorkspace);
writeConstructionState(constructionReadyWithoutDesignTraceWorkspace);
runExpectFailure(
  ["bun", "run", validator, constructionReadyWithoutDesignTraceWorkspace, intent],
  "`Construction Design からの追跡` の表がある",
);

console.log("amadeus validator eval: ok");
