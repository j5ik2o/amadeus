#!/usr/bin/env bun

import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, cpSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { createLlmProvider, isLlmProviderMode, shellQuote, type LlmProvider, type LlmProviderMode, type LlmRequest, type MockLlmCases } from "../llm-support/provider";

type SkillMode = "steering" | "event-storming" | "intent-init" | "ideation" | "inception" | "construction";
type IdeationInternalProcess =
  "scope-framing" |
  "feasibility-shaping" |
  "mock-framing" |
  "traceability-finalization";
type IdeationInternalMode = `ideation-internal-${IdeationInternalProcess}`;
type InceptionInternalProcess =
  "requirements-definition" |
  "interaction-modeling" |
  "execution-design" |
  "traceability-finalization";
type InceptionInternalMode = `inception-internal-${InceptionInternalProcess}`;
type ConstructionInternalProcess =
  "bolt-preparation" |
  "implementation-execution" |
  "verification-hardening" |
  "traceability-finalization";
type ConstructionInternalMode = `construction-internal-${ConstructionInternalProcess}`;
type InitialE2eMode = SkillMode | IdeationInternalMode | InceptionInternalMode | ConstructionInternalMode;
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
const validator = ".agents/skills/amadeus-validator/validator/AmadeusValidator.ts";
const requiredSkills = [
  "amadeus-steering",
  "amadeus-discovery",
  "amadeus-event-storming",
  "amadeus-intent-init",
  "amadeus-ideation",
  "amadeus-ideation-scope-framing",
  "amadeus-ideation-feasibility-shaping",
  "amadeus-ideation-mock-framing",
  "amadeus-ideation-traceability-finalization",
  "amadeus-inception",
  "amadeus-inception-requirements-definition",
  "amadeus-inception-interaction-modeling",
  "amadeus-inception-execution-design",
  "amadeus-inception-traceability-finalization",
  "amadeus-construction",
  "amadeus-construction-bolt-preparation",
  "amadeus-construction-implementation-execution",
  "amadeus-construction-verification-hardening",
  "amadeus-construction-traceability-finalization",
  "amadeus-validator",
  "japanese-tech-writing",
];
const fixtureIntent = "20260627-loan-self-service";
const returnReminderIntent = "20260627-return-reminder";
const ideationInternalProcesses = [
  "scope-framing",
  "feasibility-shaping",
  "mock-framing",
  "traceability-finalization",
] as const;
const ideationInternalModes = ideationInternalProcesses.map((process) => `ideation-internal-${process}` as const);
const inceptionInternalProcesses = [
  "requirements-definition",
  "interaction-modeling",
  "execution-design",
  "traceability-finalization",
] as const;
const inceptionInternalModes = inceptionInternalProcesses.map((process) => `inception-internal-${process}` as const);
const constructionInternalProcesses = [
  "bolt-preparation",
  "implementation-execution",
  "verification-hardening",
  "traceability-finalization",
] as const;
const constructionInternalModes = constructionInternalProcesses.map((process) => `construction-internal-${process}` as const);
const initialE2eModes = [
  "steering",
  "event-storming",
  "intent-init",
  "ideation",
  ...ideationInternalModes,
  "inception",
  ...inceptionInternalModes,
  "construction",
  ...constructionInternalModes,
] as const;
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

function applyEventStormingArtifacts(workspace: string): void {
  const source = join(root, ".agents/skills/amadeus-event-storming/templates/event-storming/session");
  const summarySource = join(root, ".agents/skills/amadeus-event-storming/templates/event-storming/session.md");
  const target = join(workspace, ".amadeus/event-storming/ES001-loan-flow");
  ensureFile(summarySource);
  cpSync(source, target, { recursive: true });
  writeFileSync(
    join(workspace, ".amadeus/event-storming/ES001-loan-flow.md"),
    [
      "# Event Storming Summary",
      "",
      "## Purpose",
      "",
      "- 利用者が図書貸出をセルフサービスで開始し、返却期限を確認する流れを整理する。",
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
      "| big-picture | ready | events.md, board.md, hotspots.md |",
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
      "| AGC001 | Aggregate Candidate | DEV001, DEV002 | 返却期限変更を同じ集約で扱うか |",
      "| BCC001 | Bounded Context Candidate | AGC001, DEV001, DEV002 | 利用者管理と境界を分けるか |",
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
    join(target, "events.md"),
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
    join(target, "flow.md"),
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
    join(target, "board.md"),
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
      "| 6 | Read Model | RM001 | 貸出状況 | DEV001, DEV002 | 利用者が参照する |",
      "| 7 | Aggregate Candidate | AGC001 | 貸出 | DEV001, DEV002 | 貸出と返却期限の一貫性境界候補 |",
      "| 8 | Bounded Context Candidate | BCC001 | 貸出管理 | AGC001 | 貸出関連ルールの境界候補 |",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(target, "aggregate-candidates.md"),
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
    join(target, "bounded-context-candidates.md"),
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
    join(target, "hotspots.md"),
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
    join(target, "state.json"),
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
      `| ${intent} | 利用者が図書貸出をセルフサービスで開始できるようにする。 | なし | [${intent}.md](intents/${intent}.md) |`,
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
  const intentSource = join(root, ".agents/skills/amadeus-intent-init/templates/intents/initialized.md");
  const target = join(workspace, ".amadeus/intents", intent);
  ensureFile(intentSource);
  cpSync(source, target, { recursive: true });
  writeFileSync(join(workspace, ".amadeus/intents", `${intent}.md`), readFileSync(intentSource, "utf8"));
  replaceInTree(target, {
    "<intent-id>-<slug>": intent,
    "<intent-name>": name,
    "<intent-purpose>": purpose,
  });
  replaceInFile(join(workspace, ".amadeus/intents", `${intent}.md`), {
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
  applyIdeationScopeFramingArtifacts(workspace);
  applyIdeationFeasibilityShapingArtifacts(workspace);
  applyIdeationMockFramingArtifacts(workspace);
  applyIdeationTraceabilityFinalizationArtifacts(workspace);
}

function prepareIdeationFeasibilityShapingFixture(workspace: string): void {
  prepareInitializedIntentFixture(workspace);
  applyIdeationScopeFramingArtifacts(workspace);
}

function prepareIdeationMockFramingFixture(workspace: string): void {
  prepareIdeationFeasibilityShapingFixture(workspace);
  applyIdeationFeasibilityShapingArtifacts(workspace);
}

function prepareIdeationTraceabilityFinalizationFixture(workspace: string): void {
  prepareIdeationMockFramingFixture(workspace);
  applyIdeationMockFramingArtifacts(workspace);
}

function applyIdeationScopeFramingArtifacts(workspace: string): void {
  copyIdeationTemplateEntries(workspace, ["scope.md"]);
}

function applyIdeationFeasibilityShapingArtifacts(workspace: string): void {
  copyIdeationTemplateEntries(workspace, ["ideation.md"]);
}

function applyIdeationMockFramingArtifacts(workspace: string): void {
  copyIdeationTemplateEntries(workspace, ["mocks"]);
}

function applyIdeationTraceabilityFinalizationArtifacts(workspace: string): void {
  copyIdeationTemplateEntries(workspace, ["traceability.md", "decisions.md", "decisions", "state.json"]);
  writeIdeationState(ideationTarget(workspace));
}

function copyIdeationTemplateEntries(workspace: string, entries: string[]): void {
  const source = ideationTemplateSource();
  const target = ideationTarget(workspace);
  for (const entry of entries) {
    const sourcePath = join(source, entry);
    const targetPath = join(target, entry);
    ensureFileOrDir(sourcePath);
    ensureDir(dirname(targetPath));
    cpSync(sourcePath, targetPath, { recursive: true });
  }
  replaceInFiles(copiedIdeationTargetFiles(source, target, entries), ideationReplacements());
}

function ideationTemplateSource(): string {
  return join(root, ".agents/skills/amadeus-ideation/templates/intents/ideation");
}

function ideationTarget(workspace: string): string {
  return join(workspace, ".amadeus/intents", fixtureIntent);
}

function copiedIdeationTargetFiles(source: string, target: string, entries: string[]): string[] {
  return entries.flatMap((entry) => {
    const sourcePath = join(source, entry);
    const files = statSync(sourcePath).isDirectory() ? listFiles(sourcePath) : [sourcePath];
    return files.map((file) => join(target, relative(source, file)));
  });
}

function ideationReplacements(): Record<string, string> {
  return {
    "<intent-id>-<slug>": fixtureIntent,
    "<dependency-or-none>": "なし",
  };
}

function writeIdeationState(target: string): void {
  writeFileSync(
    join(target, "state.json"),
    JSON.stringify({
      intent: fixtureIntent,
      phase: "ideation",
      status: "completed",
      initialized: {
        status: "completed",
        createdArtifacts: [`../${fixtureIntent}.md`, "state.json"],
        next: "ideation",
      },
      ideation: {
        status: "completed",
        requiredArtifacts: [`../${fixtureIntent}.md`, "scope.md", "ideation.md", "decisions.md", "traceability.md"],
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
  movePath(join(target, "units/U001-unit"), join(target, "units/U001-loan-eligibility-check"));
  movePath(join(target, "bolts/B001-bolt.md"), join(target, "bolts/B001-loan-eligibility-flow.md"));
  movePathIfExists(join(target, "bolts/B001-bolt"), join(target, "bolts/B001-loan-eligibility-flow"));
  replaceInFiles(copiedFiles, inceptionReplacements());

  writeInceptionDomainIndexes(target);
  replaceInFile(
    join(target, "units.md"),
    {
      "| U001 | 未確認 | R001 | 未確認 | なし | [U001-loan-eligibility-check.md](units/U001-loan-eligibility-check.md) |":
        "| U001 | 未確認 | R001 | BC001 | なし | [U001-loan-eligibility-check.md](units/U001-loan-eligibility-check.md) |",
    },
  );
}

function applyInceptionTraceabilityFinalizationArtifacts(workspace: string): void {
  const source = join(root, ".agents/skills/amadeus-inception/templates/intents/inception");
  const target = join(workspace, ".amadeus/intents", fixtureIntent);
  const entries = ["traceability.md", "decisions.md", "decisions", "state.json"];
  copyInceptionTemplateEntries(source, target, entries);

  const copiedFiles = copiedInceptionTargetFiles(source, target, entries, inceptionPathReplacements());
  movePath(join(target, "decisions/D001-inception-boundary.md"), join(target, "decisions/D002-inception-boundary.md"));
  replaceInFiles(copiedFiles, inceptionReplacements());

  const traceabilityPath = join(target, "traceability.md");
  const traceability = readFileSync(traceabilityPath, "utf8")
    .replace("| R001 | 未確認 | S001 | UC001 | U001 | B001 |", "| R001 | ACT001 | S001 | UC001 | U001 | B001 |")
    .replace("| 未確認 | 未確認 | なし | R001 |", "| OBJ001 | ACT001 | なし | R001 |")
    .replace("| U001 | 未確認 | R001 | UC001 | B001 |", "");
  writeFileSync(traceabilityPath, traceability);

  writeInceptionState(target);
}

function prepareConstructionIntentFixture(workspace: string): void {
  prepareInceptionIntentFixture(workspace);
  markInceptionReadyForConstruction(workspace);
  ensureConstructionReadyFixture(workspace);
}

function prepareConstructionImplementationExecutionFixture(workspace: string): void {
  prepareConstructionIntentFixture(workspace);
  applyConstructionBoltPreparationArtifacts(workspace);
}

function prepareConstructionVerificationHardeningFixture(workspace: string): void {
  prepareConstructionImplementationExecutionFixture(workspace);
  applyConstructionImplementationExecutionArtifacts(workspace);
}

function prepareConstructionTraceabilityFinalizationFixture(workspace: string): void {
  prepareConstructionVerificationHardeningFixture(workspace);
  applyConstructionVerificationHardeningArtifacts(workspace);
}

function applyConstructionIntentArtifacts(workspace: string): void {
  applyConstructionBoltPreparationArtifacts(workspace);
  applyConstructionImplementationExecutionArtifacts(workspace);
  applyConstructionVerificationHardeningArtifacts(workspace);
  applyConstructionTraceabilityFinalizationArtifacts(workspace);
}

function markInceptionReadyForConstruction(workspace: string): void {
  const statePath = join(constructionTarget(workspace), "state.json");
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  state.status = "completed";
  state.inception.status = "completed";
  state.inception.gate = "passed";
  writeFileSync(statePath, JSON.stringify(state, null, 2));
}

function writeConstructionReadyTasks(workspace: string): void {
  writeFileSync(
    join(constructionBoltTarget(workspace), "tasks.md"),
    [
      "# タスク",
      "",
      "- [ ] T001: 貸出可否確認の入力を受け取る",
      "  - 作業:",
      "    - 図書情報と利用者状態を受け取る。",
      "  - 要求: R001",
      "  - ユースケース: UC001",
      "  - 依存: なし",
      "  - 設計根拠: design.md#実装設計",
      "  - 証拠: 未登録",
      "- [ ] T002: 貸出可否と返却期限を判定する",
      "  - 作業:",
      "    - 入力された状態から貸出可否と返却期限を決める。",
      "  - 要求: R001",
      "  - ユースケース: UC001",
      "  - 依存: T001",
      "  - 設計根拠: design.md#実装設計",
      "  - 証拠: 未登録",
      "- [ ] T003: 判定結果を利用者に返す",
      "  - 作業:",
      "    - 貸出可否と返却期限を利用者向けの結果として返す。",
      "  - 要求: R001",
      "  - ユースケース: UC001",
      "  - 依存: T002",
      "  - 設計根拠: design.md#実装設計",
      "  - 証拠: 未登録",
      "",
    ].join("\n"),
  );
}

function ensureConstructionReadyFixture(workspace: string): void {
  const statePath = join(constructionTarget(workspace), "state.json");
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  if (state.phase !== "inception" || state.inception?.gate !== "passed") {
    fail("construction fixture must start from an Inception gate passed Intent");
  }
  ensureMissing(join(constructionBoltTarget(workspace), "tasks.md"));
}

function applyConstructionBoltPreparationArtifacts(workspace: string): void {
  copyConstructionTemplateEntries(workspace, ["bolts/B001-bolt/design.md", "bolts/B001-bolt/tasks.md", "bolts/B001-bolt/notes.md"]);
  writeConstructionReadyTasks(workspace);
  writeConstructionDesignReadyState(constructionTarget(workspace));
  appendConstructionDesignTrace(workspace);
}

function applyConstructionImplementationExecutionArtifacts(workspace: string): void {
  writeLoanEligibilityImplementation(workspace);

  const notesPath = join(constructionBoltTarget(workspace), "notes.md");
  ensureFile(notesPath);
  const notes = readFileSync(notesPath, "utf8")
    .replace("未確認", "貸出可否確認フローの最小実装を対象にする。")
    .replace("| T001 | 未着手 | 未確認 | 未登録 |", "| T001 | 実装済み | 貸出可否確認の入力と判定を実装する。 | 未登録 |");
  writeFileSync(notesPath, notes);
}

function writeLoanEligibilityImplementation(workspace: string): void {
  ensureDir(join(workspace, "src"));
  ensureDir(join(workspace, "test"));
  writeFileSync(
    join(workspace, "package.json"),
    [
      "{",
      "  \"scripts\": {",
      "    \"test\": \"node --test\"",
      "  }",
      "}",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(workspace, "src/loan-eligibility.js"),
    [
      "function decideLoanEligibility(input) {",
      "  const availableCopies = Number(input.availableCopies ?? 0);",
      "  const hasOverdueLoans = Boolean(input.hasOverdueLoans);",
      "  if (availableCopies <= 0) return { eligible: false, dueDays: 0 };",
      "  if (hasOverdueLoans) return { eligible: false, dueDays: 0 };",
      "  return { eligible: true, dueDays: 14 };",
      "}",
      "",
      "module.exports = { decideLoanEligibility };",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(workspace, "test/loan-eligibility.test.js"),
    [
      "const assert = require(\"node:assert/strict\");",
      "const test = require(\"node:test\");",
      "const { decideLoanEligibility } = require(\"../src/loan-eligibility.js\");",
      "",
      "test(\"available book can be loaned\", () => {",
      "  assert.deepEqual(decideLoanEligibility({ availableCopies: 1, hasOverdueLoans: false }), {",
      "    eligible: true,",
      "    dueDays: 14,",
      "  });",
      "});",
      "",
      "test(\"overdue loans block loan eligibility\", () => {",
      "  assert.deepEqual(decideLoanEligibility({ availableCopies: 1, hasOverdueLoans: true }), {",
      "    eligible: false,",
      "    dueDays: 0,",
      "  });",
      "});",
      "",
    ].join("\n"),
  );
}

function applyConstructionVerificationHardeningArtifacts(workspace: string): void {
  copyConstructionTemplateEntries(workspace, ["bolts/B001-bolt/test-results.md"]);
  const testResultsPath = join(constructionBoltTarget(workspace), "test-results.md");
  const testResults = readFileSync(testResultsPath, "utf8")
    .replace("| テスト | 未確認 | 未実行 | 未登録 |", "| テスト | npm test | pass | `npm test` |")
    .replace("| R001 | B001/T001 | 未登録 | 未確認 |", "| R001 | B001/T001 | `npm test` | 貸出可否確認の受け入れ条件を確認した。 |");
  writeFileSync(testResultsPath, testResults);
}

function applyConstructionTraceabilityFinalizationArtifacts(workspace: string): void {
  const target = constructionTarget(workspace);
  copyConstructionTemplateEntries(workspace, ["decisions/D003-construction-boundary.md", "state.json"]);
  writeConstructionState(target);

  const tasksPath = join(constructionBoltTarget(workspace), "tasks.md");
  const tasks = readFileSync(tasksPath, "utf8")
    .replace("- [ ] T001:", "- [x] T001:")
    .replace("- [ ] T002:", "- [x] T002:")
    .replace("- [ ] T003:", "- [x] T003:")
    .replaceAll("証拠: 未登録", "証拠: [test-results.md](test-results.md)");
  writeFileSync(tasksPath, tasks);

  const acceptancePath = join(target, "acceptance.md");
  const acceptance = readFileSync(acceptancePath, "utf8")
    .replace("| R001 | 採用済み | 未登録 |", "| R001 | 充足済み | [test-results.md](bolts/B001-loan-eligibility-flow/test-results.md) |");
  writeFileSync(acceptancePath, acceptance);

  const traceabilityPath = join(target, "traceability.md");
  const traceability = readFileSync(traceabilityPath, "utf8");
  if (!traceability.includes("## Construction からの追跡")) {
    writeFileSync(
      traceabilityPath,
      [
        traceability.trimEnd(),
        "",
        "## Construction からの追跡",
        "",
        "| ボルト | タスク | 証拠 | 状態 |",
        "|---|---|---|---|",
        "| B001 | B001/T001 | [test-results.md](bolts/B001-loan-eligibility-flow/test-results.md) | 充足済み |",
        "",
      ].join("\n"),
    );
  }

  const decisionsPath = join(target, "decisions.md");
  const decisions = readFileSync(decisionsPath, "utf8");
  if (!decisions.includes("D003-construction-boundary.md")) {
    writeFileSync(
      decisionsPath,
      decisions
        .replace("| D002 | Inception の境界を固定する | 未採用 | なし | [D002-inception-boundary.md](decisions/D002-inception-boundary.md) |", "| D002 | Inception の境界を固定する | 未採用 | なし | [D002-inception-boundary.md](decisions/D002-inception-boundary.md) |\n| D003 | Construction の境界を固定する | 採用 | D002 | [D003-construction-boundary.md](decisions/D003-construction-boundary.md) |")
        .replace("| D002 | なし | Inception 成果物の境界判断であり、未確認事項が残る間は採用しない。 |", "| D002 | なし | Inception 成果物の境界判断であり、未確認事項が残る間は採用しない。 |\n| D003 | D002 | Construction の実行境界を Inception 成果物に接続する。 |"),
    );
  }
}

function appendConstructionDesignTrace(workspace: string): void {
  const traceabilityPath = join(constructionTarget(workspace), "traceability.md");
  const traceability = readFileSync(traceabilityPath, "utf8");
  if (traceability.includes("## Construction Design からの追跡")) return;
  writeFileSync(
    traceabilityPath,
    [
      traceability.trimEnd(),
      "",
      "## Construction Design からの追跡",
      "",
      "| Construction Design | Task | 実装 | 検証 | PR | 状態 |",
      "|---|---|---|---|---|---|",
      "| [B001 Construction Design](bolts/B001-loan-eligibility-flow/design.md) | B001/T001, B001/T002, B001/T003 | 未実施 | 未実施 | 未実施 | ready |",
      "",
    ].join("\n"),
  );
}

function inceptionTemplateSource(): string {
  return join(root, ".agents/skills/amadeus-inception/templates/intents/inception");
}

function inceptionTarget(workspace: string): string {
  return join(workspace, ".amadeus/intents", fixtureIntent);
}

function constructionTarget(workspace: string): string {
  return inceptionTarget(workspace);
}

function constructionBoltTarget(workspace: string): string {
  return join(constructionTarget(workspace), "bolts/B001-loan-eligibility-flow");
}

function constructionTemplateSource(): string {
  return join(root, ".agents/skills/amadeus-construction/templates/intents/construction");
}

function constructionPathReplacements(): Record<string, string> {
  return {
    "B001-bolt": "B001-loan-eligibility-flow",
  };
}

function constructionReplacements(): Record<string, string> {
  return {
    "<intent-id>-<slug>": fixtureIntent,
    "B001-bolt": "B001-loan-eligibility-flow",
  };
}

function copyConstructionTemplateEntries(workspace: string, entries: string[]): void {
  const source = constructionTemplateSource();
  const target = constructionTarget(workspace);
  for (const entry of entries) {
    const sourcePath = join(source, entry);
    let targetPath = join(target, entry);
    for (const [from, to] of Object.entries(constructionPathReplacements())) {
      targetPath = targetPath.replaceAll(from, to);
    }
    ensureFileOrDir(sourcePath);
    ensureDir(dirname(targetPath));
    cpSync(sourcePath, targetPath, { recursive: true });
  }

  const copiedFiles = copiedTargetFiles(source, target, constructionPathReplacements())
    .filter((file) => entries.some((entry) => file.includes(entry.replace("B001-bolt", "B001-loan-eligibility-flow")) || file.endsWith(entry)));
  replaceInFiles(copiedFiles, constructionReplacements());
}

function inceptionPathReplacements(): Record<string, string> {
  return {
    "R001-requirement.md": "R001-loan-eligibility-check.md",
    "S001-story.md": "S001-know-loan-eligibility.md",
    "UC001-use-case.md": "UC001-check-loan-eligibility.md",
    "U001-unit": "U001-loan-eligibility-check",
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
    "U001-unit": "U001-loan-eligibility-check",
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
      "| SD001 | 貸出確認 | コア | 貸出可否確認を扱う。 | BC001 |",
      "",
      "## 未確認事項",
      "",
      "- 詳細なモデルと契約条件は Construction 以降で確認する。",
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
      "| BC001 | 貸出確認 | SD001 | 貸出可否確認を解決するモデル境界を扱う。 | [models.md](bounded-contexts/BC001-loan-check/models.md) | [contracts.md](bounded-contexts/BC001-loan-check/contracts.md) |",
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
      "| U001 | BC001 | 貸出可否確認 | 貸出可否確認を単独の解決モデルとして扱うため。 |",
      "",
      "## 境界外",
      "",
      "- 未確認",
      "",
      "## 未確認事項",
      "",
      "- 詳細なモデルと契約条件は Construction 以降で確認する。",
    ].join("\n"),
  );
  mkdirSync(join(target, "domain/bounded-contexts/BC001-loan-check"), { recursive: true });
  writeFileSync(
    join(target, "domain/bounded-contexts/BC001-loan-check.md"),
    [
      "# BC001: 貸出確認",
      "",
      "## 目的",
      "",
      "貸出確認は、利用者が貸出可否を確認するための判断境界を扱う。",
      "",
      "## 責務",
      "",
      "- 貸出可否確認の入力と判断結果を扱う。",
      "- 貸出確認に必要なモデルと契約を管理する。",
      "",
      "## 外部境界",
      "",
      "- 実際の予約登録や貸出実行は境界外である。",
      "",
      "## 関連成果物",
      "",
      "- [models.md](BC001-loan-check/models.md)",
      "- [contracts.md](BC001-loan-check/contracts.md)",
    ].join("\n"),
  );
  writeFileSync(
    join(target, "domain/bounded-contexts/BC001-loan-check/models.md"),
    [
      "# モデル",
      "",
      "## 一覧",
      "",
      "| 識別子 | 名前 | 種別 | 役割 | 詳細 |",
      "|---|---|---|---|---|",
      "",
      "詳細な DDD Module は未確認である。",
    ].join("\n"),
  );
  writeFileSync(
    join(target, "domain/bounded-contexts/BC001-loan-check/contracts.md"),
    [
      "# 契約",
      "",
      "## 事前条件",
      "",
      "| 識別子 | 条件 | 根拠 |",
      "|---|---|---|",
      "",
      "## 不変条件",
      "",
      "| 識別子 | 条件 | 根拠 |",
      "|---|---|---|",
      "",
      "## 事後条件",
      "",
      "| 識別子 | 条件 | 根拠 |",
      "|---|---|---|",
      "",
      "詳細な契約条件は未確認である。",
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
        createdArtifacts: [`../${fixtureIntent}.md`, "state.json"],
        next: "ideation",
      },
      ideation: {
        status: "completed",
        requiredArtifacts: [`../${fixtureIntent}.md`, "scope.md", "ideation.md", "decisions.md", "traceability.md"],
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
          "units/U001-loan-eligibility-check/design.md",
          "bolts.md",
          "domain/subdomains.md",
          "domain/bounded-contexts.md",
          "domain/bounded-contexts/BC001-loan-check.md",
          "traceability.md",
          "decisions.md",
          "decisions/D002-inception-boundary.md",
          "state.json",
        ],
        requiredBoltArtifacts: [
          "bolts/B001-loan-eligibility-flow.md",
        ],
        gate: "not_ready",
      },
    }, null, 2),
  );
}

function writeConstructionState(target: string): void {
  writeFileSync(
    join(target, "state.json"),
    JSON.stringify({
      intent: fixtureIntent,
      phase: "construction",
      status: "in_progress",
      initialized: {
        status: "completed",
        createdArtifacts: [`../${fixtureIntent}.md`, "state.json"],
        next: "ideation",
      },
      ideation: {
        status: "completed",
        requiredArtifacts: [`../${fixtureIntent}.md`, "scope.md", "ideation.md", "decisions.md", "traceability.md"],
        requiredMocks: ["mocks/initial-confirmation.puml"],
        gate: "passed",
      },
      inception: {
        status: "completed",
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
          "units/U001-loan-eligibility-check/design.md",
          "bolts.md",
          "domain/subdomains.md",
          "domain/bounded-contexts.md",
          "domain/bounded-contexts/BC001-loan-check.md",
          "traceability.md",
          "decisions.md",
          "decisions/D002-inception-boundary.md",
          "state.json",
        ],
        requiredBoltArtifacts: [
          "bolts/B001-loan-eligibility-flow.md",
        ],
        gate: "passed",
      },
      construction: {
        status: "in_progress",
        targetBolts: ["B001"],
        requiredArtifacts: [
          "requirements.md",
          "acceptance.md",
          "units.md",
          "bolts.md",
          "traceability.md",
          "decisions.md",
          "decisions/D003-construction-boundary.md",
          "state.json",
        ],
        requiredBoltArtifacts: [
          "bolts/B001-loan-eligibility-flow.md",
          "bolts/B001-loan-eligibility-flow/tasks.md",
          "bolts/B001-loan-eligibility-flow/design.md",
          "bolts/B001-loan-eligibility-flow/notes.md",
          "bolts/B001-loan-eligibility-flow/test-results.md",
        ],
        bolts: [
          {
            id: "B001",
            designGate: {
              status: "ready",
              reviewedBy: "ai",
              updatedAt: "2026-06-28",
              evidence: "bolts/B001-loan-eligibility-flow/design.md",
            },
            tasks: {
              status: "generated",
              reviewedBy: "ai",
              updatedAt: "2026-06-28",
              evidence: "bolts/B001-loan-eligibility-flow/tasks.md",
            },
          },
        ],
        gate: "not_ready",
      },
    }, null, 2),
  );
}

function writeConstructionDesignReadyState(target: string): void {
  const state = JSON.parse(readFileSync(join(target, "state.json"), "utf8"));
  state.phase = "construction";
  state.status = "in_progress";
  state.inception.status = "completed";
  state.inception.gate = "passed";
  state.construction = {
    status: "in_progress",
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
    requiredBoltArtifacts: [
      "bolts/B001-loan-eligibility-flow.md",
      "bolts/B001-loan-eligibility-flow/tasks.md",
      "bolts/B001-loan-eligibility-flow/design.md",
      "bolts/B001-loan-eligibility-flow/notes.md",
    ],
    bolts: [
      {
        id: "B001",
        designGate: {
          status: "ready",
          reviewedBy: "ai",
          updatedAt: "2026-06-28",
          evidence: "bolts/B001-loan-eligibility-flow/design.md",
        },
        tasks: {
          status: "generated",
          reviewedBy: "ai",
          updatedAt: "2026-06-28",
          evidence: "bolts/B001-loan-eligibility-flow/tasks.md",
        },
      },
    ],
    gate: "not_ready",
  };
  writeFileSync(join(target, "state.json"), JSON.stringify(state, null, 2));
}

function movePath(source: string, target: string): void {
  if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  renameSync(source, target);
}

function movePathIfExists(source: string, target: string): void {
  if (!existsSync(source)) return;
  movePath(source, target);
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
    "- 作成後に `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts .` を実行し、結果を要約してください。",
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
    "- `.amadeus/intents.md`、対象 Intent の `.amadeus/intents/<intent-id>.md`、`state.json` だけを作成または更新してください。",
    "- Ideation 成果物、Inception 成果物、domain 成果物は作らないでください。",
    "- git commit はしないでください。",
    "- 作成後に `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260627-return-reminder` を実行し、結果を要約してください。",
  ].join("\n");
}

function eventStormingPrompt(): string {
  return [
    "amadeus-event-storming を使ってください。",
    "",
    "pre-intent の Event Storming `ES001-loan-flow` を system-design level まで整理してください。",
    "",
    "Event Storming で分かっていること:",
    "- 対象シナリオ: 利用者が図書貸出をセルフサービスで開始し、返却期限を確認する。",
    "- Domain Event: DEV001 貸出が開始された。DEV002 返却期限が決まった。",
    "- Actor: ACT001 利用者。",
    "- Command: CMD001 貸出を開始する。",
    "- Policy: POL001 貸出開始時に返却期限を決める。",
    "- Read Model: RM001 貸出状況。",
    "- Aggregate Candidate: AGC001 貸出。",
    "- Bounded Context Candidate: BCC001 貸出管理。",
    "- Hotspot: HOT001 返却期限変更の扱いが未確定。",
    "",
    "作成対象:",
    "- `.amadeus/event-storming/ES001-loan-flow.md`",
    "- `.amadeus/event-storming/ES001-loan-flow/events.md`",
    "- `.amadeus/event-storming/ES001-loan-flow/flow.md`",
    "- `.amadeus/event-storming/ES001-loan-flow/board.md`",
    "- `.amadeus/event-storming/ES001-loan-flow/aggregate-candidates.md`",
    "- `.amadeus/event-storming/ES001-loan-flow/bounded-context-candidates.md`",
    "- `.amadeus/event-storming/ES001-loan-flow/hotspots.md`",
    "- `.amadeus/event-storming/ES001-loan-flow/state.json`",
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- 同梱テンプレートを使い、上の ID とファイル名で最小成果物を作成してください。",
    "- Event は Domain Event だけとして扱い、UI event、technical event、integration event、log event は Domain Event にしないでください。",
    "- Requirement、Use Case、Unit、Bolt、Task、domain model、実装、CI は作らないでください。",
    "- `amadeus-discovery`、`amadeus-intent-init`、`amadeus-inception`、`amadeus-domain-modeling` は自動実行しないでください。",
    "- git commit はしないでください。",
    "- 作成後に `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts .` を実行し、結果を要約してください。",
  ].join("\n");
}

function intentIdeationPrompt(): string {
  return [
    "amadeus-ideation を使ってください。",
    "",
    "既存の initialized Intent `20260627-loan-self-service` を Ideation へ進めてください。",
    "",
    "Ideation で分かっていること:",
    "- 対象: 利用者が貸出開始前に図書と利用者状態を確認する体験",
    "- 対象外: 決済、配送、職員向け蔵書管理",
    "- 初期モック: 貸出開始確認カード",
    "- Inception への引き継ぎ: 貸出可否、返却期限、通知要否を要求候補にする",
    "",
    "作成対象:",
    "- `scope.md`",
    "- `ideation.md`",
    "- `traceability.md`",
    "- `decisions.md` と `decisions/D001-complete-ideation.md`",
    "- `mocks/initial-confirmation.puml`",
    "- `state.json`",
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- 同梱テンプレートのファイル名を維持し、初期モックは必ず `mocks/initial-confirmation.puml` として作成してください。",
    "- 対象 Intent 配下の Ideation 成果物だけを作成または更新してください。",
    "- requirements、use-cases、units、bolts、domain 成果物は作らないでください。",
    "- git commit はしないでください。",
    "- 作成後に `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260627-loan-self-service` を実行し、結果を要約してください。",
  ].join("\n");
}

function intentIdeationInternalPrompt(process: IdeationInternalProcess): string {
  const processDetails: Record<IdeationInternalProcess, { skill: string; lines: string[] }> = {
    "scope-framing": {
      skill: "amadeus-ideation-scope-framing",
      lines: [
        "内部skill: amadeus-ideation-scope-framing。",
        "スコープ整理だけを進めてください。",
        "作成対象:",
        "- `scope.md`",
      ],
    },
    "feasibility-shaping": {
      skill: "amadeus-ideation-feasibility-shaping",
      lines: [
        "内部skill: amadeus-ideation-feasibility-shaping。",
        "実現可能性と体制整理だけを進めてください。",
        "作成対象:",
        "- `ideation.md`",
      ],
    },
    "mock-framing": {
      skill: "amadeus-ideation-mock-framing",
      lines: [
        "内部skill: amadeus-ideation-mock-framing。",
        "初期モック具体化だけを進めてください。",
        "作成対象:",
        "- `mocks/initial-confirmation.puml`",
      ],
    },
    "traceability-finalization": {
      skill: "amadeus-ideation-traceability-finalization",
      lines: [
        "内部skill: amadeus-ideation-traceability-finalization。",
        "追跡と状態確定だけを進めてください。",
        "作成または更新対象:",
        "- `traceability.md`",
        "- `decisions.md` と `decisions/D001-complete-ideation.md`",
        "- `state.json`",
      ],
    },
  };
  const detail = processDetails[process];

  return [
    `${detail.skill} を使ってください。`,
    "",
    "既存 Intent `20260627-loan-self-service` に対して、Ideation の内部skillを1つだけ実行してください。",
    "",
    "Ideation で分かっていること:",
    "- 対象: 利用者が貸出開始前に図書と利用者状態を確認する体験",
    "- 対象外: 決済、配送、職員向け蔵書管理",
    "- 初期モック: 貸出開始確認カード",
    "- Inception への引き継ぎ: 貸出可否、返却期限、通知要否を要求候補にする",
    "",
    ...detail.lines,
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- 同梱テンプレートのファイル名を維持し、初期モックは必ず `mocks/initial-confirmation.puml` として作成してください。",
    "- 対象 Intent 配下の、指定された内部プロセスの成果物だけを作成または更新してください。",
    "- requirements、use-cases、units、bolts、domain 成果物は作らないでください。",
    "- git commit はしないでください。",
    "- 作成後に `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260627-loan-self-service` を実行し、結果を要約してください。",
  ].join("\n");
}

function intentInceptionPrompt(): string {
  return [
    "amadeus-inception を使ってください。",
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
    "- `units.md` と `units/U001-loan-eligibility-check.md`、`units/U001-loan-eligibility-check/design.md`",
    "- `bolts.md` と `bolts/B001-loan-eligibility-flow.md`",
    "- `domain/subdomains.md` と `domain/bounded-contexts.md`",
    "- `traceability.md`、`decisions.md`、`decisions/D002-inception-boundary.md`、`state.json`",
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- できるだけ同梱テンプレートを使い、上の ID とファイル名で最小成果物を作成してください。",
    "- 対象 Intent 配下の Inception 成果物だけを作成または更新してください。",
    "- domain model、実装、CI は作らないでください。",
    "- greenfield なので `codebase-analysis.md` は必須成果物に含めず、対象外理由を traceability に残してください。",
    "- `inception.gate` を `passed` にする場合は、`domain/bounded-contexts.md` に少なくとも1件の BC を作成し、`units.md` の `コンテキスト` から参照してください。",
    "- BC が未確認なら `inception.gate` は `not_ready` にしてください。",
    "- Task は Construction Design を根拠に Construction phase で生成するため、Inception では `tasks.md` を作らないでください。",
    "- 初回作成時の各 Review Gate は自己点検として扱い、矛盾がない限り質問で止まらず `gate: not_ready` の成果物を作ってください。",
    "- git commit はしないでください。",
    "- 作成後に `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260627-loan-self-service` を実行し、結果を要約してください。",
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
        "- `units.md` と `units/U001-loan-eligibility-check.md`、`units/U001-loan-eligibility-check/design.md`",
        "- `bolts.md` と `bolts/B001-loan-eligibility-flow.md`",
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
    "- 作成後に `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260627-loan-self-service` を実行し、結果を要約してください。",
  ].join("\n");
}

function intentConstructionPrompt(): string {
  return [
    "amadeus-construction を使ってください。",
    "",
    "Inception gate passed の Intent `20260627-loan-self-service` の Bolt `B001-loan-eligibility-flow` を Construction へ進めてください。",
    "",
    "Construction で分かっていること:",
    "- 対象 Bolt: B001 loan-eligibility-flow。貸出可否確認フロー。",
    "- 対象 Task: T001, T002, T003。",
    "- 検証入口: npm test。",
    "- PR URL: なし。",
    "",
    "制約:",
    "- `amadeus-construction` は成果物や実装を直接作らず、内部 skill を順に呼び出してください。",
    "- 内部 skill は `amadeus-construction-bolt-preparation`、`amadeus-construction-implementation-execution`、`amadeus-construction-verification-hardening`、`amadeus-construction-traceability-finalization` の順に使ってください。",
    "- 対象 Bolt 配下の `design.md`、`notes.md`、`test-results.md` を作成し、`tasks.md`、`acceptance.md`、`traceability.md`、`decisions.md`、`state.json` を必要最小限更新してください。",
    "- PR URL がないので `pr.md` は作成しないでください。",
    "- Spec、`.kiro/specs`、`openspec`、Operation 成果物は作らないでください。",
    "- git commit はしないでください。",
    "- 作成後に `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260627-loan-self-service` を実行し、結果を要約してください。",
  ].join("\n");
}

function intentConstructionInternalPrompt(process: ConstructionInternalProcess): string {
  const processDetails: Record<ConstructionInternalProcess, { skill: string; lines: string[] }> = {
    "bolt-preparation": {
      skill: "amadeus-construction-bolt-preparation",
      lines: [
        "内部skill: amadeus-construction-bolt-preparation。",
        "Bolt 実行準備だけを進めてください。",
        "作成対象:",
        "- `bolts/B001-loan-eligibility-flow/design.md`",
        "- `bolts/B001-loan-eligibility-flow/tasks.md`",
        "- `bolts/B001-loan-eligibility-flow/notes.md`",
        "- `traceability.md` の `Construction Design からの追跡`",
        "- `state.json` の対象 Bolt Design Gate と tasks",
      ],
    },
    "implementation-execution": {
      skill: "amadeus-construction-implementation-execution",
      lines: [
        "内部skill: amadeus-construction-implementation-execution。",
        "実装実行だけを進めてください。",
        "更新対象:",
        "- `bolts/B001-loan-eligibility-flow/design.md`",
        "- `bolts/B001-loan-eligibility-flow/notes.md`",
      ],
    },
    "verification-hardening": {
      skill: "amadeus-construction-verification-hardening",
      lines: [
        "内部skill: amadeus-construction-verification-hardening。",
        "検証と堅牢化だけを進めてください。",
        "作成対象:",
        "- `bolts/B001-loan-eligibility-flow/test-results.md`",
      ],
    },
    "traceability-finalization": {
      skill: "amadeus-construction-traceability-finalization",
      lines: [
        "内部skill: amadeus-construction-traceability-finalization。",
        "追跡と状態確定だけを進めてください。",
        "作成または更新対象:",
        "- `tasks.md`",
        "- `acceptance.md`",
        "- `traceability.md`",
        "- `decisions.md` と `decisions/D003-construction-boundary.md`",
        "- `state.json`",
      ],
    },
  };
  const detail = processDetails[process];

  return [
    `${detail.skill} を使ってください。`,
    "",
    "Inception gate passed の Intent `20260627-loan-self-service` の Bolt `B001-loan-eligibility-flow` に対して、Construction の内部skillを1つだけ実行してください。",
    "",
    "Construction で分かっていること:",
    "- 対象 Bolt: B001 loan-eligibility-flow。貸出可否確認フロー。",
    "- 対象 Task: T001, T002, T003。",
    "- 検証入口: npm test。",
    "- PR URL: なし。",
    "",
    ...detail.lines,
    "",
    "制約:",
    "- 対象 Intent 配下の、指定された内部プロセスの成果物だけを作成または更新してください。",
    "- PR URL がないので `pr.md` は作成しないでください。",
    "- Spec、`.kiro/specs`、`openspec`、Operation 成果物は作らないでください。",
    "- git commit はしないでください。",
    "- 作成後に `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260627-loan-self-service` を実行し、結果を要約してください。",
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
    ".amadeus/steering/objective.md",
    ".amadeus/steering/product.md",
    ".amadeus/steering/tech.md",
    ".amadeus/steering/structure.md",
    ".amadeus/steering/actors.md",
    ".amadeus/steering/external-systems.md",
    ".amadeus/glossary.md",
    ".amadeus/steering/knowledge.md",
    ".amadeus/steering/knowledge/README.md",
    ".amadeus/steering/policies.md",
    ".amadeus/steering/policies/README.md",
    ".amadeus/domain/subdomains.md",
    ".amadeus/domain/bounded-contexts.md",
    ".amadeus/discoveries.md",
    ".amadeus/intents.md",
  ];
}

function steeringMarkdownArtifacts(): string[] {
  return markdownOnly(steeringArtifacts());
}

function eventStormingArtifacts(): string[] {
  return [
    ...steeringArtifacts(),
    ".amadeus/event-storming/ES001-loan-flow.md",
    ".amadeus/event-storming/ES001-loan-flow/events.md",
    ".amadeus/event-storming/ES001-loan-flow/flow.md",
    ".amadeus/event-storming/ES001-loan-flow/board.md",
    ".amadeus/event-storming/ES001-loan-flow/aggregate-candidates.md",
    ".amadeus/event-storming/ES001-loan-flow/bounded-context-candidates.md",
    ".amadeus/event-storming/ES001-loan-flow/hotspots.md",
    ".amadeus/event-storming/ES001-loan-flow/state.json",
  ];
}

function eventStormingMarkdownArtifacts(): string[] {
  return [
    ".amadeus/event-storming/ES001-loan-flow.md",
    ".amadeus/event-storming/ES001-loan-flow/events.md",
    ".amadeus/event-storming/ES001-loan-flow/flow.md",
    ".amadeus/event-storming/ES001-loan-flow/board.md",
    ".amadeus/event-storming/ES001-loan-flow/aggregate-candidates.md",
    ".amadeus/event-storming/ES001-loan-flow/bounded-context-candidates.md",
    ".amadeus/event-storming/ES001-loan-flow/hotspots.md",
  ];
}

function initializedIntentArtifacts(intent: string): string[] {
  return [
    ...steeringArtifacts(),
    `.amadeus/intents/${intent}.md`,
    `.amadeus/intents/${intent}/state.json`,
  ];
}

function initializedIntentMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}.md`,
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

function ideationScopeFramingArtifacts(intent: string): string[] {
  return [
    ...initializedIntentArtifacts(intent),
    `.amadeus/intents/${intent}/scope.md`,
  ];
}

function ideationScopeFramingMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/scope.md`,
  ];
}

function ideationFeasibilityShapingArtifacts(intent: string): string[] {
  return [
    ...ideationScopeFramingArtifacts(intent),
    `.amadeus/intents/${intent}/ideation.md`,
  ];
}

function ideationFeasibilityShapingMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/ideation.md`,
  ];
}

function ideationMockFramingArtifacts(intent: string): string[] {
  return [
    ...ideationFeasibilityShapingArtifacts(intent),
    `.amadeus/intents/${intent}/mocks/initial-confirmation.puml`,
  ];
}

function ideationMockFramingMarkdownArtifacts(_intent: string): string[] {
  return [];
}

function ideationTraceabilityFinalizationArtifacts(intent: string): string[] {
  return [
    ...ideationMockFramingArtifacts(intent),
    `.amadeus/intents/${intent}/traceability.md`,
    `.amadeus/intents/${intent}/decisions.md`,
    `.amadeus/intents/${intent}/decisions/D001-complete-ideation.md`,
  ];
}

function ideationTraceabilityFinalizationMarkdownArtifacts(intent: string): string[] {
  return [
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
    `.amadeus/intents/${intent}/units/U001-loan-eligibility-check/design.md`,
    `.amadeus/intents/${intent}/bolts.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow.md`,
    `.amadeus/intents/${intent}/domain/subdomains.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts/BC001-loan-check.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts/BC001-loan-check/models.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts/BC001-loan-check/contracts.md`,
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
    `.amadeus/intents/${intent}/units/U001-loan-eligibility-check/design.md`,
    `.amadeus/intents/${intent}/bolts.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow.md`,
    `.amadeus/intents/${intent}/domain/subdomains.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts/BC001-loan-check.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts/BC001-loan-check/models.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts/BC001-loan-check/contracts.md`,
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
    `.amadeus/intents/${intent}/units/U001-loan-eligibility-check/design.md`,
    `.amadeus/intents/${intent}/bolts.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow.md`,
    `.amadeus/intents/${intent}/domain/subdomains.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts/BC001-loan-check.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts/BC001-loan-check/models.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts/BC001-loan-check/contracts.md`,
  ];
}

function inceptionExecutionDesignMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/units.md`,
    `.amadeus/intents/${intent}/units/U001-loan-eligibility-check.md`,
    `.amadeus/intents/${intent}/units/U001-loan-eligibility-check/design.md`,
    `.amadeus/intents/${intent}/bolts.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow.md`,
    `.amadeus/intents/${intent}/domain/subdomains.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts/BC001-loan-check.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts/BC001-loan-check/models.md`,
    `.amadeus/intents/${intent}/domain/bounded-contexts/BC001-loan-check/contracts.md`,
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

function constructionIntentArtifacts(intent: string): string[] {
  return [
    ...inceptionIntentArtifacts(intent),
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/design.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/tasks.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/notes.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/test-results.md`,
    `.amadeus/intents/${intent}/decisions/D003-construction-boundary.md`,
  ];
}

function constructionIntentMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/design.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/tasks.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/notes.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/test-results.md`,
    `.amadeus/intents/${intent}/decisions/D003-construction-boundary.md`,
  ];
}

function constructionBoltPreparationArtifacts(intent: string): string[] {
  return [
    ...inceptionIntentArtifacts(intent),
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/design.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/tasks.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/notes.md`,
  ];
}

function constructionBoltPreparationMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/design.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/tasks.md`,
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/notes.md`,
  ];
}

function constructionImplementationExecutionArtifacts(intent: string): string[] {
  return constructionBoltPreparationArtifacts(intent);
}

function constructionImplementationExecutionMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/notes.md`,
  ];
}

function constructionVerificationHardeningArtifacts(intent: string): string[] {
  return [
    ...constructionImplementationExecutionArtifacts(intent),
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/test-results.md`,
  ];
}

function constructionVerificationHardeningMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/bolts/B001-loan-eligibility-flow/test-results.md`,
  ];
}

function constructionTraceabilityFinalizationArtifacts(intent: string): string[] {
  return [
    ...constructionVerificationHardeningArtifacts(intent),
    `.amadeus/intents/${intent}/decisions/D003-construction-boundary.md`,
  ];
}

function constructionTraceabilityFinalizationMarkdownArtifacts(intent: string): string[] {
  return [
    `.amadeus/intents/${intent}/decisions/D003-construction-boundary.md`,
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
      ".amadeus/intents/20260627-loan-self-service/bolts/B001-loan-eligibility-flow/pr.md",
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

function assertPromptContracts(): void {
  const prompt = intentIdeationPrompt();
  if (!prompt.includes("`mocks/initial-confirmation.puml`")) {
    fail("intent ideation prompt must pin mocks/initial-confirmation.puml");
  }
  if (!prompt.includes("同梱テンプレートのファイル名を維持")) {
    fail("intent ideation prompt must preserve template filenames");
  }
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
    "event-storming": {
      id: "event-storming",
      prompt: eventStormingPrompt(),
      prepareGiven: prepareSteeringFixture,
      givenMustRemainValid: ["."],
      applyMock: applyEventStormingArtifacts,
      expectedArtifacts: expectedArtifacts(eventStormingArtifacts(), ["."]),
      expectedMarkdownChanges: expectedMarkdownChanges(eventStormingMarkdownArtifacts(), []),
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
    "ideation": {
      id: "ideation",
      prompt: intentIdeationPrompt(),
      prepareGiven: prepareInitializedIntentFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyIdeationIntentArtifacts,
      expectedArtifacts: expectedArtifacts(ideationIntentArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(ideationIntentMarkdownArtifacts(fixtureIntent), []),
    },
    "ideation-internal-scope-framing": {
      id: "ideation-internal-scope-framing",
      prompt: intentIdeationInternalPrompt("scope-framing"),
      prepareGiven: prepareInitializedIntentFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyIdeationScopeFramingArtifacts,
      expectedArtifacts: expectedArtifacts(ideationScopeFramingArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        ideationScopeFramingMarkdownArtifacts(fixtureIntent),
        [],
      ),
    },
    "ideation-internal-feasibility-shaping": {
      id: "ideation-internal-feasibility-shaping",
      prompt: intentIdeationInternalPrompt("feasibility-shaping"),
      prepareGiven: prepareIdeationFeasibilityShapingFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyIdeationFeasibilityShapingArtifacts,
      expectedArtifacts: expectedArtifacts(ideationFeasibilityShapingArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        ideationFeasibilityShapingMarkdownArtifacts(fixtureIntent),
        [],
      ),
    },
    "ideation-internal-mock-framing": {
      id: "ideation-internal-mock-framing",
      prompt: intentIdeationInternalPrompt("mock-framing"),
      prepareGiven: prepareIdeationMockFramingFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyIdeationMockFramingArtifacts,
      expectedArtifacts: expectedArtifacts(ideationMockFramingArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        ideationMockFramingMarkdownArtifacts(fixtureIntent),
        [],
      ),
    },
    "ideation-internal-traceability-finalization": {
      id: "ideation-internal-traceability-finalization",
      prompt: intentIdeationInternalPrompt("traceability-finalization"),
      prepareGiven: prepareIdeationTraceabilityFinalizationFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyIdeationTraceabilityFinalizationArtifacts,
      expectedArtifacts: expectedArtifacts(ideationTraceabilityFinalizationArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        ideationTraceabilityFinalizationMarkdownArtifacts(fixtureIntent),
        [],
      ),
    },
    "inception": {
      id: "inception",
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
    "inception-internal-requirements-definition": {
      id: "inception-internal-requirements-definition",
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
    "inception-internal-interaction-modeling": {
      id: "inception-internal-interaction-modeling",
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
    "inception-internal-execution-design": {
      id: "inception-internal-execution-design",
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
    "inception-internal-traceability-finalization": {
      id: "inception-internal-traceability-finalization",
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
    construction: {
      id: "construction",
      prompt: intentConstructionPrompt(),
      prepareGiven: prepareConstructionIntentFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyConstructionIntentArtifacts,
      expectedArtifacts: expectedArtifacts(constructionIntentArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        constructionIntentMarkdownArtifacts(fixtureIntent),
        [
          `.amadeus/intents/${fixtureIntent}/acceptance.md`,
          `.amadeus/intents/${fixtureIntent}/traceability.md`,
          `.amadeus/intents/${fixtureIntent}/decisions.md`,
        ],
      ),
    },
    "construction-internal-bolt-preparation": {
      id: "construction-internal-bolt-preparation",
      prompt: intentConstructionInternalPrompt("bolt-preparation"),
      prepareGiven: prepareConstructionIntentFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyConstructionBoltPreparationArtifacts,
      expectedArtifacts: expectedArtifacts(constructionBoltPreparationArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        constructionBoltPreparationMarkdownArtifacts(fixtureIntent),
        [`.amadeus/intents/${fixtureIntent}/traceability.md`],
      ),
    },
    "construction-internal-implementation-execution": {
      id: "construction-internal-implementation-execution",
      prompt: intentConstructionInternalPrompt("implementation-execution"),
      prepareGiven: prepareConstructionImplementationExecutionFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyConstructionImplementationExecutionArtifacts,
      expectedArtifacts: expectedArtifacts(constructionImplementationExecutionArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        [],
        constructionImplementationExecutionMarkdownArtifacts(fixtureIntent),
        [`.amadeus/intents/${fixtureIntent}/bolts/B001-loan-eligibility-flow/design.md`],
      ),
    },
    "construction-internal-verification-hardening": {
      id: "construction-internal-verification-hardening",
      prompt: intentConstructionInternalPrompt("verification-hardening"),
      prepareGiven: prepareConstructionVerificationHardeningFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyConstructionVerificationHardeningArtifacts,
      expectedArtifacts: expectedArtifacts(constructionVerificationHardeningArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        constructionVerificationHardeningMarkdownArtifacts(fixtureIntent),
        [],
        [
          `.amadeus/intents/${fixtureIntent}/bolts/B001-loan-eligibility-flow/notes.md`,
        ],
      ),
    },
    "construction-internal-traceability-finalization": {
      id: "construction-internal-traceability-finalization",
      prompt: intentConstructionInternalPrompt("traceability-finalization"),
      prepareGiven: prepareConstructionTraceabilityFinalizationFixture,
      givenMustRemainValid: [fixtureIntent],
      applyMock: applyConstructionTraceabilityFinalizationArtifacts,
      expectedArtifacts: expectedArtifacts(constructionTraceabilityFinalizationArtifacts(fixtureIntent), [fixtureIntent]),
      expectedMarkdownChanges: expectedMarkdownChanges(
        constructionTraceabilityFinalizationMarkdownArtifacts(fixtureIntent),
        [
          `.amadeus/intents/${fixtureIntent}/bolts/B001-loan-eligibility-flow/tasks.md`,
          `.amadeus/intents/${fixtureIntent}/acceptance.md`,
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
      run(["bun", "run", validator, "."], workspace);
    } else {
      run(["bun", "run", validator, ".", target], workspace);
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
  assertPromptContracts();

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
