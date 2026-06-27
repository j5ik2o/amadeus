#!/usr/bin/env bun

import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, cpSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { createLlmProvider, isLlmProviderMode, shellQuote, type LlmProvider, type LlmProviderMode, type LlmRequest, type MockLlmCases } from "../llm-support/provider";

type SkillMode = "steering" | "intent-init" | "intent-ideation" | "intent-inception";
type E2eMode = SkillMode | `${SkillMode}-rerun`;
type Mode = "ping" | E2eMode | "all";

type ExpectedArtifacts = {
  mustExist: string[];
  mustNotExist: string[];
  mustRemainValid: string[];
};

type E2eCase = {
  id: E2eMode;
  prompt: string;
  prepareGiven: (workspace: string) => void;
  givenMustRemainValid: string[];
  applyMock: (workspace: string) => void;
  expectedArtifacts: ExpectedArtifacts;
};

type Options = {
  dryRun: boolean;
  keep: boolean;
  mode: Mode;
  printCommand: boolean;
  provider: LlmProviderMode;
  runner: string;
  workspace?: string;
};

const root = resolve(import.meta.dir, "../../..");
const defaultCodexRunner = "dev-scripts/run-codex-corporate.sh";
const validator = ".agents/skills/amadeus-intent-validator/validator/IntentValidator.rb";
const requiredSkills = [
  "amadeus-steering",
  "amadeus-intent-init",
  "amadeus-intent-ideation",
  "amadeus-intent-inception",
  "amadeus-intent-validator",
  "japanese-tech-writing",
];
const fixtureIntent = "20260627-loan-self-service";
const returnReminderIntent = "20260627-return-reminder";
const initialE2eModes = ["steering", "intent-init", "intent-ideation", "intent-inception"] as const;
const rerunE2eModes = ["steering-rerun", "intent-init-rerun", "intent-ideation-rerun", "intent-inception-rerun"] as const;
const e2eModes = [...initialE2eModes, ...rerunE2eModes] as const;
const forbiddenSpecArtifacts = [
  ".amadeus/spec.md",
  ".amadeus/specs",
  ".kiro/specs",
  "openspec",
];

function parseArgs(args: string[]): Options {
  const options: Options = {
    dryRun: false,
    keep: false,
    mode: "steering",
    printCommand: false,
    provider: providerModeFromEnvironment(),
    runner: process.env.AMADEUS_CODEX_RUNNER ?? defaultCodexRunner,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--keep") {
      options.keep = true;
    } else if (arg === "--print-command") {
      options.printCommand = true;
    } else if (arg === "--provider") {
      const value = args[index + 1];
      if (!isLlmProviderMode(value)) fail("--provider requires mock or real");
      options.provider = value;
      index += 1;
    } else if (arg === "--mode") {
      const value = args[index + 1];
      if (!isMode(value)) fail(`--mode requires ping, all, or one of: ${e2eModes.join(", ")}`);
      options.mode = value;
      index += 1;
    } else if (arg === "--workspace") {
      const value = args[index + 1];
      if (!value) fail("--workspace requires a path");
      options.workspace = resolve(value);
      index += 1;
    } else if (arg === "--runner") {
      const value = args[index + 1];
      if (!value) fail("--runner requires a path");
      options.runner = value;
      index += 1;
    } else {
      fail(`unknown argument: ${arg}`);
    }
  }

  return options;
}

function providerModeFromEnvironment(): LlmProviderMode {
  const value = process.env.AMADEUS_LLM_PROVIDER;
  if (value === undefined) return "mock";
  if (isLlmProviderMode(value)) return value;
  fail("AMADEUS_LLM_PROVIDER requires mock or real");
}

function resolveRunner(path: string): string {
  return resolve(root, path);
}

function isMode(value: string | undefined): value is Mode {
  return value === "ping" ||
    isE2eMode(value) ||
    value === "all";
}

function isE2eMode(value: string | undefined): value is E2eMode {
  return e2eModes.includes(value as E2eMode);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function run(command: string[], cwd: string): string {
  const result = Bun.spawnSync(command, {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = new TextDecoder().decode(result.stdout);
  const stderr = new TextDecoder().decode(result.stderr);

  if (result.exitCode !== 0) {
    fail([
      `command failed: ${command.join(" ")}`,
      "stdout:",
      stdout,
      "stderr:",
      stderr,
    ].join("\n"));
  }

  return stdout;
}

function ensureFile(path: string): void {
  if (!existsSync(path)) fail(`missing file: ${path}`);
}

function ensureMissing(path: string): void {
  if (existsSync(path)) fail(`unexpected file: ${path}`);
}

function ensureDir(path: string): void {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

function listFiles(path: string): string[] {
  return readdirSync(path).flatMap((entry) => {
    const next = join(path, entry);
    return statSync(next).isDirectory() ? listFiles(next) : [next];
  });
}

function listAmadeusFiles(workspace: string): string[] {
  const amadeus = join(workspace, ".amadeus");
  if (!existsSync(amadeus)) return [];
  return listFiles(amadeus).map((file) => relative(workspace, file)).sort();
}

function unique(files: string[]): string[] {
  return [...new Set(files)].sort();
}

function replaceInTree(path: string, replacements: Record<string, string>): void {
  for (const file of listFiles(path)) {
    let content = readFileSync(file, "utf8");
    for (const [from, to] of Object.entries(replacements)) {
      content = content.replaceAll(from, to);
    }
    writeFileSync(file, content);
  }
}

function createWorkspace(options: Options): string {
  const workspace = options.workspace ?? mkdtempSync(join(tmpdir(), "amadeus-llm-template-eval-"));
  ensureDir(workspace);
  return workspace;
}

function prepareWorkspace(workspace: string): void {
  ensureDir(join(workspace, ".agents/skills"));
  ensureDir(join(workspace, ".agents/rules"));

  for (const skill of requiredSkills) {
    const source = join(root, ".agents/skills", skill);
    const target = join(workspace, ".agents/skills", skill);
    ensureFile(join(source, "SKILL.md"));
    cpSync(source, target, { recursive: true });
  }

  cpSync(join(root, ".agents/rules"), join(workspace, ".agents/rules"), { recursive: true });

  writeFileSync(
    join(workspace, "AGENTS.md"),
    [
      "# AGENTS.md",
      "",
      "- 必ず日本語で返答すること。",
      "- `.agents/rules/**/*.md` を守ること。",
      "- 日本語を書くときは `japanese-tech-writing` skill を使うこと。",
      "- Amadeus 成果物を作る場合は、対象 skill の同梱テンプレートを使うこと。",
      "",
    ].join("\n"),
  );
}

function prepareSteeringFixture(workspace: string): void {
  const source = join(root, ".agents/skills/amadeus-steering/templates/steering");
  const target = join(workspace, ".amadeus");
  ensureFile(join(source, "README.md"));
  cpSync(source, target, { recursive: true });
  replaceInTree(target, {
    "<product-name>": "図書貸出セルフサービス",
  });
}

function writeIntentIndex(workspace: string, intent: string): void {
  writeFileSync(
    join(workspace, ".amadeus/intents.md"),
    [
      "# インテント",
      "",
      "## 一覧",
      "",
      "| 識別子 | 概要 | 依存 | 詳細 |",
      "|---|---|---|---|",
      `| ${intent} | 利用者が図書貸出をセルフサービスで開始できるようにする。 | なし | [${intent}/intent.md](intents/${intent}/intent.md) |`,
      "",
      "## 依存関係",
      "",
      "| インテント | 依存 | 理由 |",
      "|---|---|---|",
      `| ${intent} | なし | 単独で成立する初期 Intent である。 |`,
      "",
    ].join("\n"),
  );
}

function prepareInitializedIntentFixture(workspace: string): void {
  prepareSteeringFixture(workspace);
  const source = join(root, ".agents/skills/amadeus-intent-init/templates/intents/initialized");
  const target = join(workspace, ".amadeus/intents", fixtureIntent);
  ensureFile(join(source, "intent.md"));
  cpSync(source, target, { recursive: true });
  replaceInTree(target, {
    "<intent-id>-<slug>": fixtureIntent,
    "<intent-name>": "貸出セルフサービス開始",
    "<intent-purpose>": "利用者が図書貸出をセルフサービスで開始できるようにする。",
  });
  writeIntentIndex(workspace, fixtureIntent);
}

function prepareReturnReminderIntentFixture(workspace: string): void {
  const intent = "20260627-return-reminder";
  const source = join(root, ".agents/skills/amadeus-intent-init/templates/intents/initialized");
  const target = join(workspace, ".amadeus/intents", intent);
  ensureFile(join(source, "intent.md"));
  cpSync(source, target, { recursive: true });
  replaceInTree(target, {
    "<intent-id>-<slug>": intent,
    "<intent-name>": "返却期限通知",
    "<intent-purpose>": "利用者に返却期限の接近を通知し、延滞を減らす。",
  });
  writeIntentIndex(workspace, intent);
}

function prepareIdeationIntentFixture(workspace: string): void {
  prepareInitializedIntentFixture(workspace);
  const source = join(root, ".agents/skills/amadeus-intent-ideation/templates/intents/ideation");
  const target = join(workspace, ".amadeus/intents", fixtureIntent);
  ensureFile(join(source, "scope.md"));
  cpSync(source, target, { recursive: true });
  replaceInTree(target, {
    "<intent-id>-<slug>": fixtureIntent,
    "<dependency-or-none>": "なし",
  });
  writeFileSync(
    join(target, "state.json"),
    JSON.stringify({
      intent: fixtureIntent,
      phase: "ideation",
      status: "completed",
      initialized: {
        status: "completed",
        createdArtifacts: ["intent.md", "state.json"],
        next: "ideation",
      },
      ideation: {
        status: "completed",
        requiredArtifacts: ["intent.md", "scope.md", "ideation.md", "decisions.md", "traceability.md"],
        requiredMocks: ["mocks/initial-confirmation.puml"],
        gate: "passed",
      },
    }, null, 2),
  );
}

function prepareInceptionIntentFixture(workspace: string): void {
  prepareIdeationIntentFixture(workspace);
  const source = join(root, ".agents/skills/amadeus-intent-inception/templates/intents/inception");
  const target = join(workspace, ".amadeus/intents", fixtureIntent);
  ensureFile(join(source, "requirements.md"));
  cpSync(source, target, { recursive: true });

  movePath(join(target, "requirements/R001-requirement.md"), join(target, "requirements/R001-loan-eligibility-check.md"));
  movePath(join(target, "user-stories/S001-story.md"), join(target, "user-stories/S001-know-loan-eligibility.md"));
  movePath(join(target, "use-cases/UC001-use-case.md"), join(target, "use-cases/UC001-check-loan-eligibility.md"));
  movePath(join(target, "units/U001-unit.md"), join(target, "units/U001-loan-eligibility-check.md"));
  movePath(join(target, "bolts/B001-bolt"), join(target, "bolts/B001-loan-eligibility-flow"));
  movePath(join(target, "decisions/D001-inception-boundary.md"), join(target, "decisions/D002-inception-boundary.md"));
  rmSync(join(target, "codebase-analysis.md"), { force: true });

  replaceInTree(target, {
    "<intent-id>-<slug>": fixtureIntent,
    "<dependency-or-none>": "なし",
    "R001-requirement.md": "R001-loan-eligibility-check.md",
    "S001-story.md": "S001-know-loan-eligibility.md",
    "UC001-use-case.md": "UC001-check-loan-eligibility.md",
    "U001-unit.md": "U001-loan-eligibility-check.md",
    "B001-bolt": "B001-loan-eligibility-flow",
    "D001-inception-boundary.md": "D002-inception-boundary.md",
    "D001": "D002",
  });

  const traceabilityPath = join(target, "traceability.md");
  const traceability = readFileSync(traceabilityPath, "utf8")
    .replace("| R001 | 未確認 | S001 | UC001 | U001 | B001 | T001 |", "| R001 | ACT001 | S001 | UC001 | U001 | B001 | T001 |")
    .replace("| 未確認 | 未確認 | なし | R001 |", "| OBJ001 | ACT001 | なし | R001 |")
    .replace("| U001 | 未確認 | R001 | UC001 | B001 |", "");
  writeFileSync(traceabilityPath, traceability);

  writeFileSync(
    join(target, "domain/subdomains.md"),
    [
      "# サブドメイン",
      "",
      "## 一覧",
      "",
      "| 識別子 | 名前 | 種別 | 役割 | コンテキスト |",
      "|---|---|---|---|---|",
      "| SD001 | 貸出確認 | コア | 貸出可否確認を扱う。 | なし |",
      "",
      "## 未確認事項",
      "",
      "- 境界の詳細は Inception 後に確認する。",
    ].join("\n"),
  );
  writeFileSync(
    join(target, "domain/bounded-contexts.md"),
    [
      "# 境界づけられたコンテキスト",
      "",
      "## 範囲",
      "",
      `この文書は、\`${fixtureIntent}\` インテントで Unit を切る時に参照する境界づけられたコンテキストを扱う。`,
      "",
      "全体の境界づけられたコンテキストは、[../../../domain/bounded-contexts.md](../../../domain/bounded-contexts.md) を参照する。",
      "",
      "## コンテキスト",
      "",
      "| 識別子 | 名前 | サブドメイン | 役割 | モデル | 契約 |",
      "|---|---|---|---|---|---|",
      "",
      "境界づけられたコンテキストは未確認である。",
      "",
      "## コンテキスト間の依存",
      "",
      "| Downstream | Upstream | 依存内容 | 組織パターン | 統合パターン | 状態 |",
      "|---|---|---|---|---|---|",
      "",
      "コンテキスト間の依存は未確認である。",
      "",
      "## 外部境界",
      "",
      "| コンテキスト | 名前 | 役割 | 根拠 |",
      "|---|---|---|---|",
      "",
      "外部境界は未確認である。",
      "",
      "## Unit 分割への入力",
      "",
      "| Unit | コンテキスト | 境界 | 分割理由 |",
      "|---|---|---|---|",
      "",
      "Unit 分割への入力は未確認である。",
      "",
      "## 境界外",
      "",
      "- 未確認",
      "",
      "## 未確認事項",
      "",
      "- モデルと契約は Inception 後に確認する。",
    ].join("\n"),
  );

  writeFileSync(
    join(target, "state.json"),
    JSON.stringify({
      intent: fixtureIntent,
      phase: "inception",
      status: "in_progress",
      initialized: {
        status: "completed",
        createdArtifacts: ["intent.md", "state.json"],
        next: "ideation",
      },
      ideation: {
        status: "completed",
        requiredArtifacts: ["intent.md", "scope.md", "ideation.md", "decisions.md", "traceability.md"],
        requiredMocks: ["mocks/initial-confirmation.puml"],
        gate: "passed",
      },
      inception: {
        status: "in_progress",
        requiredArtifacts: [
          "requirements.md",
          "requirements/R001-loan-eligibility-check.md",
          "acceptance.md",
          "user-stories.md",
          "user-stories/S001-know-loan-eligibility.md",
          "use-cases.md",
          "use-cases/UC001-check-loan-eligibility.md",
          "units.md",
          "units/U001-loan-eligibility-check.md",
          "bolts.md",
          "domain/subdomains.md",
          "domain/bounded-contexts.md",
          "traceability.md",
          "decisions.md",
          "decisions/D002-inception-boundary.md",
          "state.json",
        ],
        requiredBoltArtifacts: [
          "bolts/B001-loan-eligibility-flow/bolt.md",
          "bolts/B001-loan-eligibility-flow/design.md",
          "bolts/B001-loan-eligibility-flow/tasks.md",
        ],
        gate: "not_ready",
      },
    }, null, 2),
  );
}

function movePath(source: string, target: string): void {
  if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  renameSync(source, target);
}

function steeringPrompt(): string {
  return [
    "amadeus-steering を使ってください。",
    "",
    "空の workspace に Amadeus steering layer を作成してください。",
    "",
    "題材:",
    "- プロダクト名: 図書貸出セルフサービス",
    "- 主目的: 利用者が図書館カウンターに並ばずに貸出と返却を進められる",
    "- 主なアクター: 利用者, 図書館職員",
    "- 外部システム: 図書管理システム",
    "- 主要領域: 貸出, 返却, 利用者通知",
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- `.amadeus/` 配下だけを作成してください。",
    "- git commit はしないでください。",
    "- 作成後に `ruby .agents/skills/amadeus-intent-validator/validator/IntentValidator.rb .` を実行し、結果を要約してください。",
  ].join("\n");
}

function pingPrompt(): string {
  return [
    "動作確認です。",
    "ファイルを作成せず、コマンドも実行しないでください。",
    "最後の返答は `pong` だけにしてください。",
  ].join("\n");
}

function intentInitPrompt(): string {
  return [
    "amadeus-intent-init を使ってください。",
    "",
    "既存の Amadeus steering layer に、新しい Intent の入れ物だけを作成または更新してください。",
    "",
    "Intent:",
    "- ディレクトリ名: 20260627-return-reminder",
    "- 目的: 利用者に返却期限の接近を通知し、延滞を減らす",
    "- 依存する既存 Intent: なし",
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- `.amadeus/intents.md`、対象 Intent の `intent.md`、`state.json` だけを作成または更新してください。",
    "- Ideation 成果物、Inception 成果物、domain 成果物は作らないでください。",
    "- git commit はしないでください。",
    "- 作成後に `ruby .agents/skills/amadeus-intent-validator/validator/IntentValidator.rb . 20260627-return-reminder` を実行し、結果を要約してください。",
  ].join("\n");
}

function intentIdeationPrompt(): string {
  return [
    "amadeus-intent-ideation を使ってください。",
    "",
    "既存の initialized Intent `20260627-loan-self-service` を Ideation へ進めてください。",
    "",
    "Ideation で分かっていること:",
    "- 対象: 利用者が貸出開始前に図書と利用者状態を確認する体験",
    "- 対象外: 決済、配送、職員向け蔵書管理",
    "- 初期モック: 貸出開始確認カード",
    "- Inception への引き継ぎ: 貸出可否、返却期限、通知要否を要求候補にする",
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- 対象 Intent 配下の Ideation 成果物だけを作成または更新してください。",
    "- requirements、use-cases、units、bolts、domain 成果物は作らないでください。",
    "- git commit はしないでください。",
    "- 作成後に `ruby .agents/skills/amadeus-intent-validator/validator/IntentValidator.rb . 20260627-loan-self-service` を実行し、結果を要約してください。",
  ].join("\n");
}

function intentInceptionPrompt(): string {
  return [
    "amadeus-intent-inception を使ってください。",
    "",
    "Ideation gate passed の Intent `20260627-loan-self-service` を Inception へ進めてください。",
    "",
    "Inception で分かっていること:",
    "- 要求: R001 loan-eligibility-check。利用者は貸出開始前に図書の貸出可否を確認できる。",
    "- ユーザーストーリー: S001 know-loan-eligibility。利用者として、貸出できるかを事前に知りたい。",
    "- ユースケース: UC001 check-loan-eligibility。利用者が図書情報を提示し、システムが貸出可否と返却期限を返す。",
    "- Unit: U001 loan-eligibility-check。貸出可否確認。",
    "- Bolt: B001 loan-eligibility-flow。貸出可否確認フロー。",
    "- Decision: D002 inception-boundary。Inception scaffold の境界判断。",
    "- 既存コード: greenfield として扱う",
    "",
    "作成対象:",
    "- `requirements.md` と `requirements/R001-loan-eligibility-check.md`",
    "- `acceptance.md`",
    "- `user-stories.md` と `user-stories/S001-know-loan-eligibility.md`",
    "- `use-cases.md` と `use-cases/UC001-check-loan-eligibility.md`",
    "- `units.md` と `units/U001-loan-eligibility-check.md`",
    "- `bolts.md` と `bolts/B001-loan-eligibility-flow/bolt.md`、`design.md`、`tasks.md`",
    "- `domain/subdomains.md` と `domain/bounded-contexts.md`",
    "- `traceability.md`、`decisions.md`、`decisions/D002-inception-boundary.md`、`state.json`",
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- できるだけ同梱テンプレートを使い、上の ID とファイル名で最小成果物を作成してください。",
    "- 対象 Intent 配下の Inception 成果物だけを作成または更新してください。",
    "- domain model、実装、CI は作らないでください。",
    "- greenfield なので `codebase-analysis.md` は必須成果物に含めず、対象外理由を traceability に残してください。",
    "- `domain/subdomains.md` と `domain/bounded-contexts.md` は構造 index として作成し、境界が未確認なら空表にしてください。",
    "- 初回作成時の各 Review Gate は自己点検として扱い、矛盾がない限り質問で止まらず `gate: not_ready` の成果物を作ってください。",
    "- git commit はしないでください。",
    "- 作成後に `ruby .agents/skills/amadeus-intent-validator/validator/IntentValidator.rb . 20260627-loan-self-service` を実行し、結果を要約してください。",
  ].join("\n");
}

function rerunPrompt(basePrompt: string): string {
  return [
    basePrompt,
    "",
    "再実行条件:",
    "- 既存成果物がすでにある状態で再実行してください。",
    "- 不足があれば補完し、既存内容と矛盾する重複成果物は作らないでください。",
    "- 実装、CI は作らないでください。",
  ].join("\n");
}

function promptFor(mode: Mode): string {
  if (mode === "ping") return pingPrompt();
  if (isE2eMode(mode)) return e2eCase(mode).prompt;
  fail("all mode does not have a single prompt");
}

function steeringArtifacts(): string[] {
  return [
    ".amadeus/README.md",
    ".amadeus/steering.md",
    ".amadeus/objective.md",
    ".amadeus/actors.md",
    ".amadeus/external-systems.md",
    ".amadeus/glossary.md",
    ".amadeus/knowledge.md",
    ".amadeus/policies.md",
    ".amadeus/domain/subdomains.md",
    ".amadeus/domain/bounded-contexts.md",
    ".amadeus/intents.md",
  ];
}

function initializedIntentArtifacts(intent: string): string[] {
  return [
    ...steeringArtifacts(),
    `.amadeus/intents/${intent}/intent.md`,
    `.amadeus/intents/${intent}/state.json`,
  ];
}

function ideationIntentArtifacts(intent: string): string[] {
  return [
    ...initializedIntentArtifacts(intent),
    `.amadeus/intents/${intent}/scope.md`,
    `.amadeus/intents/${intent}/ideation.md`,
    `.amadeus/intents/${intent}/traceability.md`,
    `.amadeus/intents/${intent}/decisions.md`,
    `.amadeus/intents/${intent}/decisions/D001-complete-ideation.md`,
    `.amadeus/intents/${intent}/mocks/initial-confirmation.puml`,
  ];
}

function inceptionIntentArtifacts(intent: string): string[] {
  return [
    ...ideationIntentArtifacts(intent),
    `.amadeus/intents/${intent}/requirements.md`,
    `.amadeus/intents/${intent}/requirements/R001-loan-eligibility-check.md`,
    `.amadeus/intents/${intent}/acceptance.md`,
    `.amadeus/intents/${intent}/user-stories.md`,
    `.amadeus/intents/${intent}/user-stories/S001-know-loan-eligibility.md`,
    `.amadeus/intents/${intent}/use-cases.md`,
    `.amadeus/intents/${intent}/use-cases/UC001-check-loan-eligibility.md`,
    `.amadeus/intents/${intent}/units.md`,
    `.amadeus/intents/${intent}/units/U001-loan-eligibility-check.md`,
    `.amadeus/intents/${intent}/bolts.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/bolt.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/design.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/tasks.md`,
    `.amadeus/intents/${intent}/domain/subdomains.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts.md`,
    `.amadeus/intents/${intent}/decisions/D002-inception-boundary.md`,
  ];
}

function expectedArtifacts(mustExist: string[], mustRemainValid: string[]): ExpectedArtifacts {
  return {
    mustExist: unique(mustExist),
    mustNotExist: [
      ...forbiddenSpecArtifacts,
      ".amadeus/intents/20260627-loan-self-service/codebase-analysis.md",
      ".amadeus/intents/20260627-loan-self-service/spec.md",
      ".amadeus/intents/20260627-loan-self-service/specs",
      ".amadeus/intents/20260627-loan-self-service/domain/bounded-contexts/BC001-loan-check/models.md",
      ".amadeus/intents/20260627-loan-self-service/domain/bounded-contexts/BC001-loan-check/contracts.md",
      ".amadeus/intents/20260627-return-reminder/scope.md",
      ".amadeus/intents/20260627-return-reminder/requirements.md",
      ".amadeus/intents/20260627-return-reminder/domain",
    ],
    mustRemainValid,
  };
}

function e2eCase(mode: E2eMode): E2eCase {
  const baseCases: Record<SkillMode, E2eCase> = {
    steering: {
      id: "steering",
      prompt: steeringPrompt(),
      prepareGiven: () => {},
      givenMustRemainValid: [],
      applyMock: prepareSteeringFixture,
      expectedArtifacts: expectedArtifacts(steeringArtifacts(), ["."]),
    },
    "intent-init": {
      id: "intent-init",
      prompt: intentInitPrompt(),
      prepareGiven: prepareSteeringFixture,
      givenMustRemainValid: ["."],
      applyMock: prepareReturnReminderIntentFixture,
      expectedArtifacts: expectedArtifacts(initializedIntentArtifacts(returnReminderIntent), [returnReminderIntent]),
    },
    "intent-ideation": {
      id: "intent-ideation",
      prompt: intentIdeationPrompt(),
      prepareGiven: prepareInitializedIntentFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: prepareIdeationIntentFixture,
      expectedArtifacts: expectedArtifacts(ideationIntentArtifacts(fixtureIntent), [fixtureIntent]),
    },
    "intent-inception": {
      id: "intent-inception",
      prompt: intentInceptionPrompt(),
      prepareGiven: prepareIdeationIntentFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: prepareInceptionIntentFixture,
      expectedArtifacts: expectedArtifacts(inceptionIntentArtifacts(fixtureIntent), [fixtureIntent]),
    },
  };

  if (!mode.endsWith("-rerun")) return baseCases[mode as SkillMode];

  const baseMode = mode.replace("-rerun", "") as SkillMode;
  const baseCase = baseCases[baseMode];
  return {
    ...baseCase,
    id: mode,
    prompt: rerunPrompt(baseCase.prompt),
    prepareGiven: (workspace) => {
      baseCase.prepareGiven(workspace);
      baseCase.applyMock(workspace);
    },
    givenMustRemainValid: baseCase.expectedArtifacts.mustRemainValid,
  };
}

function prepareDryRun(workspace: string, mode: Mode): void {
  if (mode === "all") {
    for (const targetMode of initialE2eModes) {
      const modeWorkspace = join(workspace, targetMode);
      ensureDir(modeWorkspace);
      prepareWorkspace(modeWorkspace);
      prepareE2eGiven(modeWorkspace, e2eCase(targetMode));
    }
  } else if (isE2eMode(mode)) {
    prepareE2eGiven(workspace, e2eCase(mode));
  }
}

function prepareE2eGiven(workspace: string, testCase: E2eCase): void {
  testCase.prepareGiven(workspace);
  assertValidTargets(workspace, testCase.givenMustRemainValid);
}

function assertE2eCase(workspace: string, testCase: E2eCase): void {
  assertArtifacts(workspace, testCase.expectedArtifacts);
}

function assertArtifacts(workspace: string, expectedArtifacts: ExpectedArtifacts): void {
  for (const file of expectedArtifacts.mustExist) {
    ensureFile(join(workspace, file));
  }
  for (const file of expectedArtifacts.mustNotExist) {
    ensureMissing(join(workspace, file));
  }

  const expected = unique(expectedArtifacts.mustExist);
  const actual = listAmadeusFiles(workspace);
  const missing = expected.filter((file) => !actual.includes(file));
  const unexpected = actual.filter((file) => !expected.includes(file));
  const specArtifacts = actual.filter(isSpecArtifact);

  if (missing.length > 0 || unexpected.length > 0 || specArtifacts.length > 0) {
    fail([
      "artifact manifest mismatch",
      `missing: ${missing.length === 0 ? "<none>" : missing.join(", ")}`,
      `unexpected: ${unexpected.length === 0 ? "<none>" : unexpected.join(", ")}`,
      `spec artifacts: ${specArtifacts.length === 0 ? "<none>" : specArtifacts.join(", ")}`,
    ].join("\n"));
  }

  assertValidTargets(workspace, expectedArtifacts.mustRemainValid);
}

function isSpecArtifact(file: string): boolean {
  return file.split(/[\\/]/).some((segment) => segment === "spec" || segment === "specs");
}

function assertValidTargets(workspace: string, targets: string[]): void {
  for (const target of targets) {
    if (target === ".") {
      run(["ruby", validator, "."], workspace);
    } else {
      run(["ruby", validator, ".", target], workspace);
    }
  }
}

function assertPing(output: string): void {
  const message = readFileSync(output, "utf8").trim();
  if (message !== "pong") {
    fail(`ping response must be exactly "pong", but was: ${JSON.stringify(message)}`);
  }
}

async function runProvider(provider: LlmProvider, request: LlmRequest) {
  try {
    return await provider.run(request);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}

function mockCases(): MockLlmCases {
  const cases: MockLlmCases = {
    ping: {
      message: "pong\n",
    },
  };

  for (const mode of e2eModes) {
    const testCase = e2eCase(mode);
    cases[mode] = {
      apply: (request) => testCase.applyMock(request.workspace),
      message: `${mode} 成果物を作成または更新しました。\n`,
    };
  }

  return cases;
}

async function runE2e(provider: LlmProvider, workspace: string, testCase: E2eCase): Promise<void> {
  prepareE2eGiven(workspace, testCase);
  const result = await runProvider(provider, {
    caseId: testCase.id,
    outputPath: join(workspace, "last-message.md"),
    prompt: testCase.prompt,
    workspace,
  });
  assertE2eCase(workspace, testCase);
  ensureFile(result.outputPath);
}

async function main(): Promise<void> {
  const options = parseArgs(Bun.argv.slice(2));
  const runner = resolveRunner(options.runner);
  if (options.provider === "real") ensureFile(runner);
  ensureFile(join(root, validator));

  const workspace = createWorkspace(options);
  prepareWorkspace(workspace);
  const output = join(workspace, "last-message.md");
  const selectedPrompt = options.mode === "all" ? "" : promptFor(options.mode);
  const provider = createLlmProvider({
    mockCases: mockCases(),
    mode: options.provider,
    root,
    runner: options.runner,
  });

  if (options.printCommand) {
    const command = provider.previewCommand({
      caseId: options.mode,
      outputPath: output,
      prompt: selectedPrompt,
      workspace,
    }).map(shellQuote).join(" ");
    console.log(command);
    console.log(`workspace: ${workspace}`);
    console.log(`provider: ${provider.describe()}`);
    return;
  }

  if (options.dryRun) {
    prepareDryRun(workspace, options.mode);
    console.log(`llm template eval dry-run: ok`);
    console.log(`mode: ${options.mode}`);
    console.log(`workspace: ${workspace}`);
    console.log(`provider: ${provider.describe()}`);
    console.log(`runner: ${runner}`);
    console.log(`codex home: ${process.env.CODEX_HOME ?? "<set by selected runner>"}`);
    if (!options.keep && !options.workspace) rmSync(workspace, { recursive: true, force: true });
    return;
  }

  try {
    console.log(`workspace: ${workspace}`);
    console.log(`mode: ${options.mode}`);
    console.log(`provider: ${provider.describe()}`);
    if (options.mode === "all") {
      for (const mode of initialE2eModes) {
        const modeWorkspace = join(workspace, mode);
        ensureDir(modeWorkspace);
        prepareWorkspace(modeWorkspace);
        console.log(`mode workspace: ${modeWorkspace}`);
        await runE2e(provider, modeWorkspace, e2eCase(mode));
        console.log(`llm ${mode} eval: ok`);
      }
      console.log("llm template eval: ok");
    } else if (options.mode === "ping") {
      const result = await runProvider(provider, {
        caseId: options.mode,
        outputPath: output,
        prompt: selectedPrompt,
        workspace,
      });
      assertPing(result.outputPath);
      console.log("llm ping eval: ok");
    } else {
      await runE2e(provider, workspace, e2eCase(options.mode));
      console.log(`llm ${options.mode} eval: ok`);
      console.log("llm template eval: ok");
    }
  } finally {
    if (!options.keep && !options.workspace) rmSync(workspace, { recursive: true, force: true });
  }
}

await main();
