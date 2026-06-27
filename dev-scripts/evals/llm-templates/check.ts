#!/usr/bin/env bun

import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, cpSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { createLlmProvider, isLlmProviderMode, shellQuote, type LlmProvider, type LlmProviderMode, type LlmRequest, type MockLlmCases } from "../llm-support/provider";

type SkillMode = "steering" | "intent-init" | "intent-ideation" | "intent-inception";
type InceptionInternalProcess =
  "requirements-definition" |
  "interaction-modeling" |
  "execution-design" |
  "traceability-finalization";
type InceptionInternalMode = `intent-inception-internal-${InceptionInternalProcess}`;
type InitialE2eMode = SkillMode | InceptionInternalMode;
type E2eMode = InitialE2eMode | `${InitialE2eMode}-rerun`;
type Mode = "ping" | E2eMode | "all";

type ExpectedArtifacts = {
  mustExist: string[];
  mustNotExist: string[];
  mustRemainValid: string[];
};

type ExpectedMarkdownChanges = {
  created: string[];
  mayUpdate: string[];
  updated: string[];
};

type MarkdownSnapshot = Map<string, string>;

type E2eCase = {
  id: E2eMode;
  prompt: string;
  prepareGiven: (workspace: string) => void;
  givenMustRemainValid: string[];
  applyMock: (workspace: string) => void;
  expectedArtifacts: ExpectedArtifacts;
  expectedMarkdownChanges: ExpectedMarkdownChanges;
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
  "amadeus-inception-requirements-definition",
  "amadeus-inception-interaction-modeling",
  "amadeus-inception-execution-design",
  "amadeus-inception-traceability-finalization",
  "amadeus-intent-validator",
  "japanese-tech-writing",
];
const fixtureIntent = "20260627-loan-self-service";
const returnReminderIntent = "20260627-return-reminder";
const inceptionInternalProcesses = [
  "requirements-definition",
  "interaction-modeling",
  "execution-design",
  "traceability-finalization",
] as const;
const inceptionInternalModes = inceptionInternalProcesses.map((process) => `intent-inception-internal-${process}` as const);
const initialE2eModes = ["steering", "intent-init", "intent-ideation", "intent-inception", ...inceptionInternalModes] as const;
const rerunE2eModes = initialE2eModes.map((mode) => `${mode}-rerun` as const);
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

function listAmadeusMarkdownFiles(workspace: string): string[] {
  return listAmadeusFiles(workspace).filter((file) => file.endsWith(".md"));
}

function snapshotMarkdown(workspace: string): MarkdownSnapshot {
  return new Map(listAmadeusMarkdownFiles(workspace).map((file) => {
    const path = join(workspace, file);
    const stat = statSync(path);
    return [file, `${stat.size}:${stat.mtimeMs}:${readFileSync(path, "utf8")}`];
  }));
}

function unique(files: string[]): string[] {
  return [...new Set(files)].sort();
}

function replaceInTree(path: string, replacements: Record<string, string>): void {
  for (const file of listFiles(path)) {
    replaceInFile(file, replacements);
  }
}

function replaceInFiles(paths: string[], replacements: Record<string, string>): void {
  for (const path of paths) {
    if (existsSync(path)) replaceInFile(path, replacements);
  }
}

function replaceInFile(file: string, replacements: Record<string, string>): void {
    let content = readFileSync(file, "utf8");
    for (const [from, to] of Object.entries(replacements)) {
      content = content.replaceAll(from, to);
    }
    writeFileSync(file, content);
}

function copiedTargetFiles(source: string, target: string, pathReplacements: Record<string, string> = {}): string[] {
  return listFiles(source).map((file) => {
    let targetFile = join(target, relative(source, file));
    for (const [from, to] of Object.entries(pathReplacements)) {
      targetFile = targetFile.replaceAll(from, to);
    }
    return targetFile;
  });
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
  applyInitializedIntentArtifacts(workspace, fixtureIntent, "貸出セルフサービス開始", "利用者が図書貸出をセルフサービスで開始できるようにする。");
}

function applyInitializedIntentArtifacts(workspace: string, intent: string, name: string, purpose: string): void {
  const source = join(root, ".agents/skills/amadeus-intent-init/templates/intents/initialized");
  const target = join(workspace, ".amadeus/intents", intent);
  ensureFile(join(source, "intent.md"));
  cpSync(source, target, { recursive: true });
  replaceInTree(target, {
    "<intent-id>-<slug>": intent,
    "<intent-name>": name,
    "<intent-purpose>": purpose,
  });
  writeIntentIndex(workspace, intent);
}

function prepareReturnReminderIntentFixture(workspace: string): void {
  applyInitializedIntentArtifacts(workspace, returnReminderIntent, "返却期限通知", "利用者に返却期限の接近を通知し、延滞を減らす。");
}

function prepareIdeationIntentFixture(workspace: string): void {
  prepareInitializedIntentFixture(workspace);
  applyIdeationIntentArtifacts(workspace);
}

function applyIdeationIntentArtifacts(workspace: string): void {
  const source = join(root, ".agents/skills/amadeus-intent-ideation/templates/intents/ideation");
  const target = join(workspace, ".amadeus/intents", fixtureIntent);
  ensureFile(join(source, "scope.md"));
  cpSync(source, target, { recursive: true });
  replaceInFiles(copiedTargetFiles(source, target), {
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
  applyInceptionIntentArtifacts(workspace);
}

function prepareInceptionInteractionModelingFixture(workspace: string): void {
  prepareIdeationIntentFixture(workspace);
  applyInceptionRequirementsDefinitionArtifacts(workspace);
}

function prepareInceptionExecutionDesignFixture(workspace: string): void {
  prepareInceptionInteractionModelingFixture(workspace);
  applyInceptionInteractionModelingArtifacts(workspace);
}

function prepareInceptionTraceabilityFinalizationFixture(workspace: string): void {
  prepareInceptionExecutionDesignFixture(workspace);
  applyInceptionExecutionDesignArtifacts(workspace);
}

function applyInceptionIntentArtifacts(workspace: string): void {
  applyInceptionRequirementsDefinitionArtifacts(workspace);
  applyInceptionInteractionModelingArtifacts(workspace);
  applyInceptionExecutionDesignArtifacts(workspace);
  applyInceptionTraceabilityFinalizationArtifacts(workspace);
}

function applyInceptionRequirementsDefinitionArtifacts(workspace: string): void {
  const source = inceptionTemplateSource();
  const target = inceptionTarget(workspace);
  const entries = ["requirements.md", "requirements", "acceptance.md"];
  copyInceptionTemplateEntries(source, target, entries);

  const copiedFiles = copiedInceptionTargetFiles(source, target, entries, inceptionPathReplacements());
  movePath(join(target, "requirements/R001-requirement.md"), join(target, "requirements/R001-loan-eligibility-check.md"));
  replaceInFiles(copiedFiles, inceptionReplacements());
}

function applyInceptionInteractionModelingArtifacts(workspace: string): void {
  const source = inceptionTemplateSource();
  const target = inceptionTarget(workspace);
  const entries = ["user-stories.md", "user-stories", "use-cases.md", "use-cases"];
  copyInceptionTemplateEntries(source, target, entries);

  const copiedFiles = copiedInceptionTargetFiles(source, target, entries, inceptionPathReplacements());
  movePath(join(target, "user-stories/S001-story.md"), join(target, "user-stories/S001-know-loan-eligibility.md"));
  movePath(join(target, "use-cases/UC001-use-case.md"), join(target, "use-cases/UC001-check-loan-eligibility.md"));
  replaceInFiles(copiedFiles, inceptionReplacements());
}

function applyInceptionExecutionDesignArtifacts(workspace: string): void {
  const source = inceptionTemplateSource();
  const target = inceptionTarget(workspace);
  const entries = ["units.md", "units", "bolts.md", "bolts", "domain"];
  copyInceptionTemplateEntries(source, target, entries);

  const copiedFiles = copiedInceptionTargetFiles(source, target, entries, inceptionPathReplacements());
  movePath(join(target, "units/U001-unit.md"), join(target, "units/U001-loan-eligibility-check.md"));
  movePath(join(target, "bolts/B001-bolt"), join(target, "bolts/B001-loan-eligibility-flow"));
  replaceInFiles(copiedFiles, inceptionReplacements());

  writeInceptionDomainIndexes(target);
}

function applyInceptionTraceabilityFinalizationArtifacts(workspace: string): void {
  const source = join(root, ".agents/skills/amadeus-intent-inception/templates/intents/inception");
  const target = join(workspace, ".amadeus/intents", fixtureIntent);
  const entries = ["traceability.md", "decisions.md", "decisions", "state.json"];
  copyInceptionTemplateEntries(source, target, entries);

  const copiedFiles = copiedInceptionTargetFiles(source, target, entries, inceptionPathReplacements());
  movePath(join(target, "decisions/D001-inception-boundary.md"), join(target, "decisions/D002-inception-boundary.md"));
  replaceInFiles(copiedFiles, inceptionReplacements());

  const traceabilityPath = join(target, "traceability.md");
  const traceability = readFileSync(traceabilityPath, "utf8")
    .replace("| R001 | 未確認 | S001 | UC001 | U001 | B001 | T001 |", "| R001 | ACT001 | S001 | UC001 | U001 | B001 | T001 |")
    .replace("| 未確認 | 未確認 | なし | R001 |", "| OBJ001 | ACT001 | なし | R001 |")
    .replace("| U001 | 未確認 | R001 | UC001 | B001 |", "");
  writeFileSync(traceabilityPath, traceability);

  writeInceptionState(target);
}

function inceptionTemplateSource(): string {
  return join(root, ".agents/skills/amadeus-intent-inception/templates/intents/inception");
}

function inceptionTarget(workspace: string): string {
  return join(workspace, ".amadeus/intents", fixtureIntent);
}

function inceptionPathReplacements(): Record<string, string> {
  return {
    "R001-requirement.md": "R001-loan-eligibility-check.md",
    "S001-story.md": "S001-know-loan-eligibility.md",
    "UC001-use-case.md": "UC001-check-loan-eligibility.md",
    "U001-unit.md": "U001-loan-eligibility-check.md",
    "B001-bolt": "B001-loan-eligibility-flow",
    "D001-inception-boundary.md": "D002-inception-boundary.md",
  };
}

function inceptionReplacements(): Record<string, string> {
  return {
    "<intent-id>-<slug>": fixtureIntent,
    "<dependency-or-none>": "なし",
    "R001-requirement.md": "R001-loan-eligibility-check.md",
    "S001-story.md": "S001-know-loan-eligibility.md",
    "UC001-use-case.md": "UC001-check-loan-eligibility.md",
    "U001-unit.md": "U001-loan-eligibility-check.md",
    "B001-bolt": "B001-loan-eligibility-flow",
    "D001-inception-boundary.md": "D002-inception-boundary.md",
    "D001": "D002",
  };
}

function copyInceptionTemplateEntries(source: string, target: string, entries: string[]): void {
  for (const entry of entries) {
    const sourcePath = join(source, entry);
    const targetPath = join(target, entry);
    ensureFileOrDir(sourcePath);
    ensureDir(dirname(targetPath));
    cpSync(sourcePath, targetPath, { recursive: true });
  }
}

function ensureFileOrDir(path: string): void {
  if (!existsSync(path)) fail(`missing file or directory: ${path}`);
}

function copiedInceptionTargetFiles(source: string, target: string, entries: string[], pathReplacements: Record<string, string>): string[] {
  return entries.flatMap((entry) => {
    const sourcePath = join(source, entry);
    const files = statSync(sourcePath).isDirectory() ? listFiles(sourcePath) : [sourcePath];
    return files.map((file) => {
      let targetFile = join(target, relative(source, file));
      for (const [from, to] of Object.entries(pathReplacements)) {
        targetFile = targetFile.replaceAll(from, to);
      }
      return targetFile;
    });
  });
}

function writeInceptionDomainIndexes(target: string): void {
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
}

function writeInceptionState(target: string): void {
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

function intentInceptionInternalPrompt(process: InceptionInternalProcess): string {
  const processDetails: Record<InceptionInternalProcess, { skill: string; lines: string[] }> = {
    "requirements-definition": {
      skill: "amadeus-inception-requirements-definition",
      lines: [
        "内部skill: amadeus-inception-requirements-definition。",
        "要件定義だけを進めてください。",
        "作成対象:",
        "- `requirements.md` と `requirements/R001-loan-eligibility-check.md`",
        "- `acceptance.md`",
      ],
    },
    "interaction-modeling": {
      skill: "amadeus-inception-interaction-modeling",
      lines: [
        "内部skill: amadeus-inception-interaction-modeling。",
        "相互作用整理だけを進めてください。",
        "作成対象:",
        "- `user-stories.md` と `user-stories/S001-know-loan-eligibility.md`",
        "- `use-cases.md` と `use-cases/UC001-check-loan-eligibility.md`",
      ],
    },
    "execution-design": {
      skill: "amadeus-inception-execution-design",
      lines: [
        "内部skill: amadeus-inception-execution-design。",
        "実施設計だけを進めてください。",
        "作成対象:",
        "- `units.md` と `units/U001-loan-eligibility-check.md`",
        "- `bolts.md` と `bolts/B001-loan-eligibility-flow/bolt.md`、`design.md`、`tasks.md`",
        "- `domain/subdomains.md` と `domain/bounded-contexts.md`",
      ],
    },
    "traceability-finalization": {
      skill: "amadeus-inception-traceability-finalization",
      lines: [
        "内部skill: amadeus-inception-traceability-finalization。",
        "追跡と状態確定だけを進めてください。",
        "作成または更新対象:",
        "- `traceability.md`",
        "- `decisions.md` と `decisions/D002-inception-boundary.md`",
        "- `state.json`",
      ],
    },
  };
  const detail = processDetails[process];

  return [
    `${detail.skill} を使ってください。`,
    "",
    "Ideation gate passed の Intent `20260627-loan-self-service` に対して、Inception の内部skillを1つだけ実行してください。",
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
    ...detail.lines,
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- できるだけ同梱テンプレートを使い、上の ID とファイル名で最小成果物を作成してください。",
    "- 対象 Intent 配下の、指定された内部プロセスの成果物だけを作成または更新してください。",
    "- domain model、実装、CI は作らないでください。",
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

function steeringMarkdownArtifacts(): string[] {
  return markdownOnly(steeringArtifacts());
}

function initializedIntentArtifacts(intent: string): string[] {
  return [
    ...steeringArtifacts(),
    `.amadeus/intents/${intent}/intent.md`,
    `.amadeus/intents/${intent}/state.json`,
  ];
}

function initializedIntentMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/intent.md`,
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

function ideationIntentMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/scope.md`,
    `.amadeus/intents/${intent}/ideation.md`,
    `.amadeus/intents/${intent}/traceability.md`,
    `.amadeus/intents/${intent}/decisions.md`,
    `.amadeus/intents/${intent}/decisions/D001-complete-ideation.md`,
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

function inceptionIntentMarkdownArtifacts(intent: string): string[] {
  return [
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

function inceptionRequirementsDefinitionArtifacts(intent: string): string[] {
  return [
    ...ideationIntentArtifacts(intent),
    `.amadeus/intents/${intent}/requirements.md`,
    `.amadeus/intents/${intent}/requirements/R001-loan-eligibility-check.md`,
    `.amadeus/intents/${intent}/acceptance.md`,
  ];
}

function inceptionRequirementsDefinitionMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/requirements.md`,
    `.amadeus/intents/${intent}/requirements/R001-loan-eligibility-check.md`,
    `.amadeus/intents/${intent}/acceptance.md`,
  ];
}

function inceptionInteractionModelingArtifacts(intent: string): string[] {
  return [
    ...inceptionRequirementsDefinitionArtifacts(intent),
    `.amadeus/intents/${intent}/user-stories.md`,
    `.amadeus/intents/${intent}/user-stories/S001-know-loan-eligibility.md`,
    `.amadeus/intents/${intent}/use-cases.md`,
    `.amadeus/intents/${intent}/use-cases/UC001-check-loan-eligibility.md`,
  ];
}

function inceptionInteractionModelingMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/user-stories.md`,
    `.amadeus/intents/${intent}/user-stories/S001-know-loan-eligibility.md`,
    `.amadeus/intents/${intent}/use-cases.md`,
    `.amadeus/intents/${intent}/use-cases/UC001-check-loan-eligibility.md`,
  ];
}

function inceptionExecutionDesignArtifacts(intent: string): string[] {
  return [
    ...inceptionInteractionModelingArtifacts(intent),
    `.amadeus/intents/${intent}/units.md`,
    `.amadeus/intents/${intent}/units/U001-loan-eligibility-check.md`,
    `.amadeus/intents/${intent}/bolts.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/bolt.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/design.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/tasks.md`,
    `.amadeus/intents/${intent}/domain/subdomains.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts.md`,
  ];
}

function inceptionExecutionDesignMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/units.md`,
    `.amadeus/intents/${intent}/units/U001-loan-eligibility-check.md`,
    `.amadeus/intents/${intent}/bolts.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/bolt.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/design.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/tasks.md`,
    `.amadeus/intents/${intent}/domain/subdomains.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts.md`,
  ];
}

function inceptionTraceabilityFinalizationArtifacts(intent: string): string[] {
  return [
    ...inceptionExecutionDesignArtifacts(intent),
    `.amadeus/intents/${intent}/decisions/D002-inception-boundary.md`,
  ];
}

function inceptionTraceabilityFinalizationMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/decisions/D002-inception-boundary.md`,
  ];
}

function markdownOnly(files: string[]): string[] {
  return files.filter((file) => file.endsWith(".md"));
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

function expectedMarkdownChanges(created: string[], updated: string[], mayUpdate: string[] = []): ExpectedMarkdownChanges {
  return {
    created: unique(markdownOnly(created)),
    mayUpdate: unique(markdownOnly(mayUpdate)),
    updated: unique(markdownOnly(updated)),
  };
}

function e2eCase(mode: E2eMode): E2eCase {
  const baseCases: Record<InitialE2eMode, E2eCase> = {
    steering: {
      id: "steering",
      prompt: steeringPrompt(),
      prepareGiven: () => {},
      givenMustRemainValid: [],
      applyMock: prepareSteeringFixture,
      expectedArtifacts: expectedArtifacts(steeringArtifacts(), ["."]),
      expectedMarkdownChanges: expectedMarkdownChanges(steeringMarkdownArtifacts(), []),
    },
    "intent-init": {
      id: "intent-init",
      prompt: intentInitPrompt(),
      prepareGiven: prepareSteeringFixture,
      givenMustRemainValid: ["."],
      applyMock: prepareReturnReminderIntentFixture,
      expectedArtifacts: expectedArtifacts(initializedIntentArtifacts(returnReminderIntent), [returnReminderIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        initializedIntentMarkdownArtifacts(returnReminderIntent),
        [".amadeus/intents.md"],
      ),
    },
    "intent-ideation": {
      id: "intent-ideation",
      prompt: intentIdeationPrompt(),
      prepareGiven: prepareInitializedIntentFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyIdeationIntentArtifacts,
      expectedArtifacts: expectedArtifacts(ideationIntentArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(ideationIntentMarkdownArtifacts(fixtureIntent), []),
    },
    "intent-inception": {
      id: "intent-inception",
      prompt: intentInceptionPrompt(),
      prepareGiven: prepareIdeationIntentFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyInceptionIntentArtifacts,
      expectedArtifacts: expectedArtifacts(inceptionIntentArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        inceptionIntentMarkdownArtifacts(fixtureIntent),
        [
          `.amadeus/intents/${fixtureIntent}/traceability.md`,
          `.amadeus/intents/${fixtureIntent}/decisions.md`,
        ],
      ),
    },
    "intent-inception-internal-requirements-definition": {
      id: "intent-inception-internal-requirements-definition",
      prompt: intentInceptionInternalPrompt("requirements-definition"),
      prepareGiven: prepareIdeationIntentFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyInceptionRequirementsDefinitionArtifacts,
      expectedArtifacts: expectedArtifacts(inceptionRequirementsDefinitionArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        inceptionRequirementsDefinitionMarkdownArtifacts(fixtureIntent),
        [],
      ),
    },
    "intent-inception-internal-interaction-modeling": {
      id: "intent-inception-internal-interaction-modeling",
      prompt: intentInceptionInternalPrompt("interaction-modeling"),
      prepareGiven: prepareInceptionInteractionModelingFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyInceptionInteractionModelingArtifacts,
      expectedArtifacts: expectedArtifacts(inceptionInteractionModelingArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        inceptionInteractionModelingMarkdownArtifacts(fixtureIntent),
        [],
      ),
    },
    "intent-inception-internal-execution-design": {
      id: "intent-inception-internal-execution-design",
      prompt: intentInceptionInternalPrompt("execution-design"),
      prepareGiven: prepareInceptionExecutionDesignFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyInceptionExecutionDesignArtifacts,
      expectedArtifacts: expectedArtifacts(inceptionExecutionDesignArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        inceptionExecutionDesignMarkdownArtifacts(fixtureIntent),
        [],
      ),
    },
    "intent-inception-internal-traceability-finalization": {
      id: "intent-inception-internal-traceability-finalization",
      prompt: intentInceptionInternalPrompt("traceability-finalization"),
      prepareGiven: prepareInceptionTraceabilityFinalizationFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyInceptionTraceabilityFinalizationArtifacts,
      expectedArtifacts: expectedArtifacts(inceptionTraceabilityFinalizationArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        inceptionTraceabilityFinalizationMarkdownArtifacts(fixtureIntent),
        [
          `.amadeus/intents/${fixtureIntent}/traceability.md`,
          `.amadeus/intents/${fixtureIntent}/decisions.md`,
        ],
      ),
    },
  };

  if (!mode.endsWith("-rerun")) return baseCases[mode as InitialE2eMode];

  const baseMode = mode.replace("-rerun", "") as InitialE2eMode;
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
    expectedMarkdownChanges: expectedMarkdownChanges([], [], [
      ...baseCase.expectedMarkdownChanges.created,
      ...baseCase.expectedMarkdownChanges.updated,
    ]),
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

function assertMarkdownChanges(before: MarkdownSnapshot, after: MarkdownSnapshot, expected: ExpectedMarkdownChanges): void {
  const actualCreated = [...after.keys()].filter((file) => !before.has(file)).sort();
  const actualUpdated = [...after.keys()].filter((file) => {
    const previous = before.get(file);
    return previous !== undefined && previous !== after.get(file);
  }).sort();
  const expectedCreated = unique(expected.created);
  const allowedUpdated = unique([...expected.updated, ...expected.mayUpdate]);
  const expectedUpdated = unique(expected.updated);

  const missingCreated = expectedCreated.filter((file) => !actualCreated.includes(file));
  const unexpectedCreated = actualCreated.filter((file) => !expectedCreated.includes(file));
  const missingUpdated = expectedUpdated.filter((file) => !actualUpdated.includes(file));
  const unexpectedUpdated = actualUpdated.filter((file) => !allowedUpdated.includes(file));

  if (missingCreated.length > 0 || unexpectedCreated.length > 0 || missingUpdated.length > 0 || unexpectedUpdated.length > 0) {
    fail([
      "markdown change coverage mismatch",
      `missing created: ${missingCreated.length === 0 ? "<none>" : missingCreated.join(", ")}`,
      `unexpected created: ${unexpectedCreated.length === 0 ? "<none>" : unexpectedCreated.join(", ")}`,
      `missing updated: ${missingUpdated.length === 0 ? "<none>" : missingUpdated.join(", ")}`,
      `unexpected updated: ${unexpectedUpdated.length === 0 ? "<none>" : unexpectedUpdated.join(", ")}`,
    ].join("\n"));
  }
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
  const beforeMarkdown = snapshotMarkdown(workspace);
  const result = await runProvider(provider, {
    caseId: testCase.id,
    outputPath: join(workspace, "last-message.md"),
    prompt: testCase.prompt,
    workspace,
  });
  const afterMarkdown = snapshotMarkdown(workspace);
  assertE2eCase(workspace, testCase);
  assertMarkdownChanges(beforeMarkdown, afterMarkdown, testCase.expectedMarkdownChanges);
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
