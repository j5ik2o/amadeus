#!/usr/bin/env bun

import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dir, "../../..");
const fixture = join(root, "examples/03-inception-completed/.amadeus");
const discovery = "20260629-ec-site-construction";
const intent = "20260629-minimum-purchase-flow";
const validator = ".agents/skills/amadeus-validator/validator/AmadeusValidator.ts";

const unit1 = "U001-minimum-purchase-flow";
const unit2 = "U002-order-creation";
const bolt1 = "B001-order-creation";
const bolt2 = "B002-order-content-confirmation";
const boundedContext1 = "BC004-sales-management";

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

function runExpectSuccessIncludes(command: string[], expected: string, cwd = root): void {
  const stdout = run(command, cwd);
  if (!stdout.includes(expected)) {
    fail(["command succeeded without expected evidence: " + expected, "stdout:", stdout].join("\n"));
  }
}

function workspaceCopy(): string {
  const workspace = mkdtempSync(join(tmpdir(), "amadeus-validator"));
  cpSync(fixture, join(workspace, ".amadeus"), { recursive: true });
  updateDiscoveryCandidateStatus(workspace, "intent_record_created");
  writeRootDomainMaps(workspace);
  return workspace;
}

function phaseWorkspaceCopy(): string {
  const workspace = workspaceCopy();
  ensureConstructionPhaseScaffold(workspace);
  return workspace;
}

function legacyIntentRootLayoutWorkspaceCopy(): string {
  const workspace = workspaceCopy();
  moveIntentPath(workspace, "inception/requirements.md", "requirements.md");
  return workspace;
}

function intentRoot(workspace: string): string {
  return join(workspace, ".amadeus/intents", intent);
}

function intentPath(workspace: string, path: string): string {
  return join(intentRoot(workspace), phaseRelativePath(path));
}

function rootArtifactPath(workspace: string, path: string): string {
  return join(workspace, ".amadeus", path);
}

function constructionIntentPath(workspace: string, path: string): string {
  return join(intentRoot(workspace), "construction", path);
}

function phaseRelativePath(path: string): string {
  if (path === "") return "ideation";
  if (path === "state.json") return path;
  if (
    path === "scope.md" ||
    path === "ideation.md" ||
    path.startsWith("mocks/")
  ) {
    return `ideation/${path}`;
  }
  if (path.startsWith("bolts/") && !path.match(/^bolts\/[^/]+\.md$/)) {
    return `construction/${path}`;
  }
  return `inception/${path}`;
}

function moveIntentPath(workspace: string, from: string, to: string): void {
  const source = join(intentRoot(workspace), from);
  if (!existsSync(source)) return;
  const target = join(intentRoot(workspace), to);
  mkdirSync(dirname(target), { recursive: true });
  renameSync(source, target);
}

function migrateIntentToPhaseLayout(workspace: string): void {
  for (const path of ["scope.md", "ideation.md", "mocks"]) moveIntentPath(workspace, path, `ideation/${path}`);
  for (const path of [
    "requirements.md",
    "requirements",
    "acceptance.md",
    "user-stories.md",
    "user-stories",
    "use-cases.md",
    "use-cases",
    "units.md",
    "units",
    "bolts.md",
    "traceability.md",
    "decisions.md",
    "decisions",
  ]) {
    moveIntentPath(workspace, path, `inception/${path}`);
  }

  const legacyBoltsRoot = join(intentRoot(workspace), "bolts");
  if (existsSync(legacyBoltsRoot)) {
    for (const entry of ["B001-order-creation.md", "B002-order-content-confirmation.md", "B003-product-selection.md"]) {
      moveIntentPath(workspace, `bolts/${entry}`, `inception/bolts/${entry}`);
    }
    rmSync(legacyBoltsRoot, { recursive: true, force: true });
  }

  mkdirSync(constructionIntentPath(workspace, "bolts"), { recursive: true });
  writeFileSync(
    constructionIntentPath(workspace, "traceability.md"),
    ["# Construction Traceability", ""].join("\n"),
  );
  writeFileSync(
    constructionIntentPath(workspace, "decisions.md"),
    ["# Construction Decisions", "", "## 一覧", "", "| 識別子 | 概要 | 状態 | 依存 | 詳細 |", "|---|---|---|---|---|", "", "## 依存関係", "", "| 判断 | 依存 | 理由 |", "|---|---|---|", ""].join("\n"),
  );
  replaceInFile(
    intentPath(workspace, "traceability.md"),
    "../../intents.md",
    "../../../intents.md",
    "traceability fixture does not contain expected intents link",
  );
  rewriteStateForPhaseLayout(workspace);
}

function ensureConstructionPhaseScaffold(workspace: string): void {
  mkdirSync(constructionIntentPath(workspace, "bolts"), { recursive: true });
  if (!existsSync(constructionIntentPath(workspace, "traceability.md"))) {
    writeFileSync(
      constructionIntentPath(workspace, "traceability.md"),
      ["# Construction Traceability", ""].join("\n"),
    );
  }
  if (!existsSync(constructionIntentPath(workspace, "decisions.md"))) {
    writeFileSync(
      constructionIntentPath(workspace, "decisions.md"),
      ["# Construction Decisions", "", "## 一覧", "", "| 識別子 | 概要 | 状態 | 依存 | 詳細 |", "|---|---|---|---|---|", "", "## 依存関係", "", "| 判断 | 依存 | 理由 |", "|---|---|---|", ""].join("\n"),
    );
  }
}

function rewriteStateForPhaseLayout(workspace: string): void {
  const path = intentPath(workspace, "state.json");
  const state = JSON.parse(readFileSync(path, "utf8"));
  if (state.ideation) {
    state.ideation.requiredArtifacts = (state.ideation.requiredArtifacts ?? []).map((value: string) => phaseStatePath(value, "ideation"));
    state.ideation.requiredMocks = (state.ideation.requiredMocks ?? []).map((value: string) => phaseStatePath(value, "ideation"));
  }
  if (state.inception) {
    state.inception.requiredArtifacts = (state.inception.requiredArtifacts ?? []).map((value: string) => phaseStatePath(value, "inception"));
    state.inception.requiredRequirementArtifacts = (state.inception.requiredRequirementArtifacts ?? []).map((value: string) => phaseStatePath(value, "inception"));
    state.inception.requiredStoryArtifacts = (state.inception.requiredStoryArtifacts ?? []).map((value: string) => phaseStatePath(value, "inception"));
    state.inception.requiredUseCaseArtifacts = (state.inception.requiredUseCaseArtifacts ?? []).map((value: string) => phaseStatePath(value, "inception"));
    state.inception.requiredDecisionArtifacts = (state.inception.requiredDecisionArtifacts ?? []).map((value: string) => phaseStatePath(value, "inception"));
    state.inception.requiredBoltArtifacts = (state.inception.requiredBoltArtifacts ?? []).map((value: string) => phaseStatePath(value, "inception"));
  }
  if (state.construction) {
    state.construction.requiredArtifacts = (state.construction.requiredArtifacts ?? []).map((value: string) => constructionStatePath(value));
    state.construction.requiredBoltArtifacts = (state.construction.requiredBoltArtifacts ?? []).map((value: string) => phaseStatePath(value, "construction"));
    for (const bolt of state.construction.bolts ?? []) {
      if (Array.isArray(bolt.taskGeneration?.evidence)) {
        for (const evidence of bolt.taskGeneration.evidence) {
          if (evidence?.path) evidence.path = phaseStatePath(evidence.path, "construction");
        }
      }
    }
  }
  writeFileSync(path, JSON.stringify(state, null, 2));
}

function updateDiscoveryCandidateStatus(workspace: string, status: string): void {
  const path = join(workspace, `.amadeus/discoveries/${discovery}.md`);
  const text = readFileSync(path, "utf8");
  if (!text.match(/\| 販売管理の最小購入フロー \| (initialized|intent_record_created|recommended) \|/)) {
    fail("discovery fixture does not contain expected candidate row");
  }
  const updated = text
    .replace(/\| 販売管理の最小購入フロー \| (initialized|intent_record_created|recommended) \|/, `| 販売管理の最小購入フロー | ${status} |`)
    .replace("`initialized` は「販売管理の最小購入フロー」だけである。", `\`${status}\` は「販売管理の最小購入フロー」だけである。`)
    .replace("`intent_record_created` は「販売管理の最小購入フロー」だけである。", `\`${status}\` は「販売管理の最小購入フロー」だけである。`)
    .replace("初期化済みである。", "Intent Record 作成済みである。");
  writeFileSync(path, updated);
}

function initializedPhaseWorkspaceCopy(): string {
  const workspace = workspaceCopy();
  updateDiscoveryCandidateStatus(workspace, "initialized");
  writeFileSync(
    intentPath(workspace, "state.json"),
    JSON.stringify({
      intent,
      phase: "initialized",
      status: "in_progress",
      initialized: {
        status: "completed",
        createdArtifacts: [
          `../${intent}.md`,
          "state.json",
        ],
        next: "ideation",
      },
    }, null, 2),
  );
  return workspace;
}

function ideationStartedWorkspaceCopy(): string {
  const workspace = workspaceCopy();
  rmSync(intentPath(workspace, ""), { recursive: true, force: true });
  rmSync(join(intentRoot(workspace), "inception"), { recursive: true, force: true });
  rmSync(join(intentRoot(workspace), "construction"), { recursive: true, force: true });
  writeFileSync(
    intentPath(workspace, "state.json"),
    JSON.stringify({
      intent,
      phase: "ideation",
      status: "in_progress",
      ideation: {
        status: "in_progress",
        intentCapture: {
          status: "completed",
          createdArtifacts: [
            `../${intent}.md`,
            "state.json",
          ],
          next: "ideation/scope-framing",
        },
        requiredArtifacts: [],
        requiredMocks: [],
        gate: "not_ready",
      },
    }, null, 2),
  );
  return workspace;
}

function phaseStatePath(value: string, phase: "ideation" | "inception" | "construction"): string {
  if (value.startsWith("../") || value === "state.json" || value.startsWith(`${phase}/`)) return value;
  return `${phase}/${value}`;
}

function constructionStatePath(value: string): string {
  if (value === "state.json" || value.startsWith("../") || value.startsWith("inception/") || value.startsWith("construction/")) return value;
  if (value === "traceability.md" || value === "decisions.md" || value.startsWith("decisions/")) return `construction/${value}`;
  return `inception/${value}`;
}

function replaceRequiredRequirementArtifactWithMissingPath(workspace: string): void {
  const path = intentPath(workspace, "state.json");
  const state = JSON.parse(readFileSync(path, "utf8"));
  state.inception.requiredRequirementArtifacts = [
    ...(state.inception.requiredRequirementArtifacts ?? []),
    "inception/requirements/R999-missing.md",
  ];
  writeFileSync(path, JSON.stringify(state, null, 2));
}

function removeConstructionDecisionsFromRequiredArtifacts(workspace: string): void {
  const path = intentPath(workspace, "state.json");
  const state = JSON.parse(readFileSync(path, "utf8"));
  state.construction.requiredArtifacts = (state.construction.requiredArtifacts ?? []).filter(
    (value: string) => value !== "construction/decisions.md",
  );
  writeFileSync(path, JSON.stringify(state, null, 2));
}

function assertValidatorModuleSplit(): void {
  const validatorRoot = join(root, "skills/amadeus-validator/validator");
  const requiredModules = [
    "phases/inception.ts",
    "phases/construction.ts",
    "phases/types.ts",
    "stages/inception/requirements-definition.ts",
    "stages/inception/user-stories.ts",
    "stages/inception/use-cases.ts",
    "stages/inception/units-generation.ts",
    "stages/construction/functional-design.ts",
    "stages/construction/bolt-preparation.ts",
  ];
  for (const modulePath of requiredModules) {
    if (!existsSync(join(validatorRoot, modulePath))) fail(`validator module missing: ${modulePath}`);
  }

  const main = readFileSync(join(validatorRoot, "AmadeusValidator.ts"), "utf8");
  for (const pattern of [
    "private checkInceptionIntent(",
    "private checkConstructionIntent(",
    "private checkInceptionStateJson(",
    "private checkConstructionStateJson(",
    "private checkTargetBolts(",
    "private checkConstructionFunctionalDesignState(",
    "private checkConstructionBoltTaskGeneration(",
    "private checkTargetBoltRequiredArtifacts(",
    "taskGenerationContract",
  ]) {
    if (main.includes(pattern)) fail(`AmadeusValidator.ts still owns phase/stage detail: ${pattern}`);
  }

  if (existsSync(join(validatorRoot, "contracts/stages")) || existsSync(join(validatorRoot, "contracts/phases"))) {
    fail("validator module must not define contracts/stages or contracts/phases");
  }
}

assertValidatorModuleSplit();

const legacyIntentRootLayoutWorkspace = legacyIntentRootLayoutWorkspaceCopy();
runExpectFailure(
  ["bun", "run", validator, legacyIntentRootLayoutWorkspace, intent],
  "Intent 直下の旧配置成果物を使わない",
);

const missingIntentDirectoryWorkspace = workspaceCopy();
removeIntentModuleDirectory(missingIntentDirectoryWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingIntentDirectoryWorkspace],
  "Intent 状態ファイルが存在する",
);

const initializedPhaseWorkspace = initializedPhaseWorkspaceCopy();
runExpectFailure(
  ["bun", "run", validator, initializedPhaseWorkspace, intent],
  "`phase` が既知である",
);

const ideationStartedWorkspace = ideationStartedWorkspaceCopy();
run(["bun", "run", validator, ideationStartedWorkspace, intent]);

const ideationStartedWithDownstreamWorkspace = ideationStartedWorkspaceCopy();
const downstreamArtifact = intentPath(ideationStartedWithDownstreamWorkspace, "requirements.md");
mkdirSync(dirname(downstreamArtifact), { recursive: true });
writeFileSync(downstreamArtifact, "# Requirements\n");
runExpectFailure(
  ["bun", "run", validator, ideationStartedWithDownstreamWorkspace, intent],
  "Ideation phase では後続 stage 成果物が存在しない",
);

const legacyIntentRootGrillingsWorkspace = phaseWorkspaceCopy();
writeGrillings(intentRoot(legacyIntentRootGrillingsWorkspace), {
  target: "ideation/scope.md",
  indexTarget: "[scope.md](ideation/scope.md)",
  sessionTarget: "ideation/scope.md",
  decisionTarget: "ideation/scope.md",
});
runExpectFailure(
  ["bun", "run", validator, legacyIntentRootGrillingsWorkspace, intent],
  "Intent 直下の旧配置成果物を使わない",
);

const invalidExecutionScopeWorkspace = phaseWorkspaceCopy();
replaceScopeExecutionScopeWithInvalidValue(invalidExecutionScopeWorkspace);
runExpectFailure(
  ["bun", "run", validator, invalidExecutionScopeWorkspace, intent],
  "`実行スコープ` が許可値である",
);

const invalidScopeDepthWorkspace = phaseWorkspaceCopy();
replaceScopeDepthWithInvalidValue(invalidScopeDepthWorkspace);
runExpectFailure(
  ["bun", "run", validator, invalidScopeDepthWorkspace, intent],
  "`深度` が許可値である",
);

const invalidScopeVerificationStrategyWorkspace = phaseWorkspaceCopy();
replaceScopeVerificationStrategyWithInvalidValue(invalidScopeVerificationStrategyWorkspace);
runExpectFailure(
  ["bun", "run", validator, invalidScopeVerificationStrategyWorkspace, intent],
  "`戦略` が許可値である",
);

const duplicateScopeIdWorkspace = phaseWorkspaceCopy();
duplicateScopeId(duplicateScopeIdWorkspace);
runExpectFailure(
  ["bun", "run", validator, duplicateScopeIdWorkspace, intent],
  "Scope ID が重複しない",
);

const omittedStageWithoutReasonWorkspace = phaseWorkspaceCopy();
removeOmittedStageReason(omittedStageWithoutReasonWorkspace);
runExpectFailure(
  ["bun", "run", validator, omittedStageWithoutReasonWorkspace, intent],
  "`省略 stage` の理由がある",
);

const stateWithScopeControlWorkspace = phaseWorkspaceCopy();
addScopeControlToState(stateWithScopeControlWorkspace);
runExpectFailure(
  ["bun", "run", validator, stateWithScopeControlWorkspace, intent],
  "state.json に scope 制御値を保存しない",
);

const traceabilityWithoutScopeControlWorkspace = phaseWorkspaceCopy();
removeScopeControlTraceabilityRow(traceabilityWithoutScopeControlWorkspace);
runExpectFailure(
  ["bun", "run", validator, traceabilityWithoutScopeControlWorkspace, intent],
  "Ideation 追跡が `実行制御` を含む",
);

const gatePassedWithUnconfirmedScopeControlWorkspace = phaseWorkspaceCopy();
replaceScopeExecutionScopeWithUnconfirmedValue(gatePassedWithUnconfirmedScopeControlWorkspace);
runExpectFailure(
  ["bun", "run", validator, gatePassedWithUnconfirmedScopeControlWorkspace, intent],
  "Ideation gate passed では `実行スコープ` が未確認ではない",
);

const inceptionTraceWithoutScopeWorkspace = phaseWorkspaceCopy();
removeInceptionScopeTraceabilityRow(inceptionTraceWithoutScopeWorkspace);
runExpectFailure(
  ["bun", "run", validator, inceptionTraceWithoutScopeWorkspace, intent],
  "対象境界からの追跡が採用済み SC-IN を含む",
);

const inceptionWithExcludedScopeWarningWorkspace = phaseWorkspaceCopy();
addExcludedScopeConflict(inceptionWithExcludedScopeWarningWorkspace);
runExpectSuccessIncludes(
  ["bun", "run", validator, inceptionWithExcludedScopeWarningWorkspace, intent],
  "Inception 成果物に SC-OUT に反する可能性がある項目がない",
);

const inceptionWithoutImplementationTargetWorkspace = phaseWorkspaceCopy();
removeImplementationTargetSection(inceptionWithoutImplementationTargetWorkspace);
runExpectFailure(
  ["bun", "run", validator, inceptionWithoutImplementationTargetWorkspace, intent],
  "`実装対象` 見出しがある",
);

function ensureBoltDirectory(workspace: string, bolt: string): void {
  mkdirSync(intentPath(workspace, `bolts/${bolt}`), { recursive: true });
}

function removeSteeringObjective(workspace: string): void {
  rmSync(join(workspace, ".amadeus/steering/objective.md"), { force: true });
}

function removeSteeringProduct(workspace: string): void {
  rmSync(join(workspace, ".amadeus/steering/product.md"), { force: true });
}

function removeIntentModuleDirectory(workspace: string): void {
  rmSync(intentRoot(workspace), { recursive: true, force: true });
}

function replaceInFile(path: string, from: string, to: string, message: string): void {
  const text = readFileSync(path, "utf8");
  if (!text.includes(from)) fail(message);
  writeFileSync(path, text.replace(from, to));
}

function replaceScopeExecutionScopeWithInvalidValue(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "scope.md"),
    "| 実行スコープ | mvp | 販売管理の最小購入フローに集中する。 |",
    "| 実行スコープ | enterprise-plus | 販売管理の最小購入フローに集中する。 |",
    "scope fixture does not contain expected execution scope",
  );
}

function replaceScopeExecutionScopeWithUnconfirmedValue(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "scope.md"),
    "| 実行スコープ | mvp | 販売管理の最小購入フローに集中する。 |",
    "| 実行スコープ | 未確認 | 販売管理の最小購入フローに集中する。 |",
    "scope fixture does not contain expected execution scope",
  );
}

function replaceScopeDepthWithInvalidValue(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "scope.md"),
    "| 深度 | standard | 販売管理の最小購入フローを、Inception で要求候補にできる粒度で整理する。 |",
    "| 深度 | exhaustive | 販売管理の最小購入フローを、Inception で要求候補にできる粒度で整理する。 |",
    "scope fixture does not contain expected artifact depth",
  );
}

function replaceScopeVerificationStrategyWithInvalidValue(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "scope.md"),
    "| 戦略 | standard | 注文内容確認画面の初期モックで、注文作成前の確認点を検証する。 |",
    "| 戦略 | exhaustive | 注文内容確認画面の初期モックで、注文作成前の確認点を検証する。 |",
    "scope fixture does not contain expected verification strategy",
  );
}

function duplicateScopeId(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "scope.md"),
    "| SC-IN-005 | 注文作成を扱う。 | 最小購入フローの完了条件である。 | 採用済み |",
    "| SC-IN-004 | 注文作成を扱う。 | 最小購入フローの完了条件である。 | 採用済み |",
    "scope fixture does not contain expected SC-IN row",
  );
}

function removeOmittedStageReason(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "scope.md"),
    "| 省略 stage | 運用後半の stage | 決済、配送、出荷、運用改善は対象外である。 |",
    "| 省略 stage | 運用後半の stage |  |",
    "scope fixture does not contain expected omitted stage row",
  );
}

function addScopeControlToState(workspace: string): void {
  const path = intentPath(workspace, "state.json");
  const state = JSON.parse(readFileSync(path, "utf8"));
  state.ideation.executionScope = "mvp";
  writeFileSync(path, JSON.stringify(state, null, 2));
}

function removeScopeControlTraceabilityRow(workspace: string): void {
  replaceInFile(
    join(intentRoot(workspace), "ideation/traceability.md"),
    "| 実行制御 | mvp | [scope.md](scope.md) | 後続 stage の実行範囲を決める入力にする。 |\n",
    "",
    "traceability fixture does not contain expected execution control row",
  );
}

function removeInceptionScopeTraceabilityRow(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "traceability.md"),
    "| SC-IN-005 | R004 | S001 | UC003 | U002 | B001 | 注文作成を Inception の対象として扱う。 |\n",
    "",
    "traceability fixture does not contain expected SC-IN row",
  );
}

function addExcludedScopeConflict(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "requirements/R003-buyer-information-recording.md"),
    "- 会員登録、ログイン、顧客台帳、購入履歴管理は対象外である。",
    "- 会員登録を扱う。",
    "requirement fixture does not contain expected excluded scope constraint",
  );
}

function removeImplementationTargetSection(workspace: string): void {
  const path = intentPath(workspace, `units/${unit1}.md`);
  const text = readFileSync(path, "utf8");
  const updated = text.replace(/\n## 実装対象\n\n\| 識別子 \| repository \| path \| branch \| PR \| CI \|\n\|---\|---\|---\|---\|---\|---\|\n\| IT001 \| 未確認 \| 未確認 \| 未確認 \| なし \| 未確認 \|\n/, "");
  if (updated === text) fail("unit fixture does not contain implementation target section");
  writeFileSync(path, updated);
}

function replaceDiscoveryDecision(workspace: string): void {
  replaceInFile(
    join(workspace, `.amadeus/discoveries/${discovery}.md`),
    "## 判定\n\nmulti_intent",
    "## 判定\n\nsingle_intent",
    "discovery fixture does not contain expected decision",
  );
}

function removeDiscoveryCandidate(workspace: string): void {
  const path = join(workspace, `.amadeus/discoveries/${discovery}.md`);
  const text = readFileSync(path, "utf8");
  const lines = text.split("\n");
  let inCandidates = false;
  let removed = 0;
  const updated = lines.filter((line) => {
    if (line === "## Intent 候補") {
      inCandidates = true;
      return true;
    }
    if (inCandidates && line.startsWith("## ") && line !== "## Intent 候補") {
      inCandidates = false;
    }
    if (inCandidates && line.startsWith("|") && line.includes("| waiting |")) {
      removed += 1;
      return false;
    }
    return true;
  });
  if (removed === 0) fail("discovery fixture does not contain waiting candidate rows");
  writeFileSync(path, updated.join("\n"));
}

function replaceDesignTraceDesignLink(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "traceability.md"),
    `| [design.md](units/${unit2}/design.md) | U002 | R004 | UC003 | B001 |`,
    `| [design.md](units/${unit1}/design.md) | U002 | R004 | UC003 | B001 |`,
    "traceability fixture does not contain expected design trace row",
  );
}

function replaceDesignTraceReferencesWithMissingIds(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "traceability.md"),
    `| [design.md](units/${unit2}/design.md) | U002 | R004 | UC003 | B001 |`,
    `| [design.md](units/${unit2}/design.md) | U002 | R999 | UC999 | B999 |`,
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
    "| R004 | 顧客 | S001 | UC003 | U002 | B001 |",
    "| R004 | 顧客 | S001 | UC003 | U002 | B001 | B001/T001 |",
    "traceability fixture does not contain expected requirement trace row",
  );
}

function removeTaskDesignReason(workspace: string): void {
  replaceInFile(
    intentPath(workspace, `bolts/${bolt1}/tasks.md`),
    "  - 設計根拠: ../../U002-order-creation/functional-design/business-logic-model.md#入力\n",
    "",
    "tasks fixture does not contain expected design reason",
  );
}

function writeConstructionTasks(workspace: string): void {
  ensureBoltDirectory(workspace, bolt1);
  writeFileSync(
    intentPath(workspace, `bolts/${bolt1}/tasks.md`),
    [
      "# Construction Tasks",
      "",
      "- [ ] T001: 注文作成入力の契約を定義する",
      "  - 作業:",
      "    - 注文内容、購入者情報、販売可能在庫の参照結果を注文作成の必須入力として扱う。",
      "    - B002 が確認済みにした注文内容を受け取る前提を明示する。",
      "    - 入力不足を注文作成失敗として扱える確認観点を残す。",
      "  - 要求: R004",
      "  - ユースケース: UC003",
      "  - 依存: なし",
      "  - 設計根拠: ../../U002-order-creation/functional-design/business-logic-model.md#入力",
      "  - 証拠: 未登録",
      "",
      "- [ ] T002: 注文モデルと不変条件を定義する",
      "  - 作業:",
      "    - 注文内容、購入者情報、販売可能在庫の参照結果を記録する注文を作成できるようにする。",
      "    - 注文状態を作成済みとして扱う。",
      "    - 決済、売上確定、在庫引当、出荷を実行しないことを不変条件として確認できるようにする。",
      "  - 要求: R004",
      "  - ユースケース: UC003",
      "  - 依存: T001",
      "  - 設計根拠: ../../U002-order-creation/functional-design/domain-entities.md#エンティティ",
      "  - 証拠: 未登録",
      "",
    ].join("\n"),
  );
}

function writeConstructionTasksForSecondBolt(workspace: string): void {
  ensureBoltDirectory(workspace, bolt2);
  writeFileSync(
    intentPath(workspace, `bolts/${bolt2}/tasks.md`),
    [
      "# Construction Tasks",
      "",
      "- [ ] T001: 注文内容確認の入力をそろえる",
      "  - 作業:",
      "    - 選択された商品、販売可能在庫の参照結果、購入者情報を注文内容確認の入力として扱う。",
      "  - 要求: R002, R003",
      "  - ユースケース: UC002",
      "  - 依存: なし",
      "  - 設計根拠: ../../U002-order-creation/functional-design/business-logic-model.md#入力",
      "  - 証拠: 未登録",
      "",
      "- [ ] T002: 注文内容を確認済みにする",
      "  - 作業:",
      "    - 購入者が確認した商品、数量、購入者情報を注文作成へ渡せる形にする。",
      "  - 要求: R002, R003",
      "  - ユースケース: UC002",
      "  - 依存: T001",
      "  - 設計根拠: ../../U002-order-creation/functional-design/business-rules.md#ルール",
      "  - 証拠: 未登録",
      "",
    ].join("\n"),
  );
}

function replaceTaskReferencesWithMissingIds(workspace: string): void {
  replaceInFile(
    intentPath(workspace, `bolts/${bolt1}/tasks.md`),
    "  - 要求: R004\n  - ユースケース: UC003\n  - 依存: なし",
    "  - 要求: R999\n  - ユースケース: UC999\n  - 依存: T999",
    "tasks fixture does not contain expected task references",
  );
}

function replaceTaskReferencesWithEmptyIds(workspace: string): void {
  replaceInFile(
    intentPath(workspace, `bolts/${bolt1}/tasks.md`),
    "  - 要求: R004\n  - ユースケース: UC003\n  - 依存: なし",
    "  - 要求:\n  - ユースケース:\n  - 依存:",
    "tasks fixture does not contain expected task references",
  );
}

function replaceTaskUseCaseWithNone(workspace: string): void {
  replaceInFile(
    intentPath(workspace, `bolts/${bolt1}/tasks.md`),
    "  - 要求: R004\n  - ユースケース: UC003\n  - 依存: なし",
    "  - 要求: R004\n  - ユースケース: なし\n  - 依存: なし",
    "tasks fixture does not contain expected task use case",
  );
}

function makeBoltReferenceMultipleUnits(workspace: string, withReason: boolean): void {
  const boltsPath = intentPath(workspace, "bolts.md");
  replaceInFile(
    boltsPath,
    `| B001 | 確認済み注文内容をもとに注文を作成する。 | U002 | [design.md](units/${unit2}/design.md) | B002 | [B001-order-creation.md](bolts/B001-order-creation.md) |`,
    `| B001 | 確認済み注文内容をもとに注文を作成する。 | U001, U002 | [design.md](units/${unit1}/design.md), [design.md](units/${unit2}/design.md) | B002 | [B001-order-creation.md](bolts/B001-order-creation.md) |`,
    "bolts fixture does not contain expected B001 row",
  );

  const boltPath = intentPath(workspace, `bolts/${bolt1}.md`);
  replaceInFile(
    boltPath,
    "## 対象ユニット\n\n- U002",
    "## 対象ユニット\n\n- U001\n- U002",
    "bolt fixture does not contain expected target unit section",
  );
  replaceInFile(
    boltPath,
    `## 設計\n\n- [U002 Unit Design](../units/${unit2}/design.md)`,
    `## 設計\n\n- [U001 Unit Design](../units/${unit1}/design.md)\n- [U002 Unit Design](../units/${unit2}/design.md)`,
    "bolt fixture does not contain expected design section",
  );
  if (withReason) {
    replaceInFile(
      boltPath,
      "## 完了条件",
      "## 複数 Unit を扱う理由\n\n- U001 と U002 を同じ実施で扱うと、注文内容確認と注文作成の整合をまとめて確認できるため。\n\n## 完了条件",
      "bolt fixture does not contain expected completion heading",
    );
  }
}

function replaceBoltUnitWithMissingId(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "bolts.md"),
    `| B001 | 確認済み注文内容をもとに注文を作成する。 | U002 | [design.md](units/${unit2}/design.md) | B002 | [B001-order-creation.md](bolts/B001-order-creation.md) |`,
    `| B001 | 確認済み注文内容をもとに注文を作成する。 | U999 | [design.md](units/${unit2}/design.md) | B002 | [B001-order-creation.md](bolts/B001-order-creation.md) |`,
    "bolts fixture does not contain expected B001 row",
  );
}

function replaceBoltUnitWithDuplicateId(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "bolts.md"),
    `| B001 | 確認済み注文内容をもとに注文を作成する。 | U002 | [design.md](units/${unit2}/design.md) | B002 | [B001-order-creation.md](bolts/B001-order-creation.md) |`,
    `| B001 | 確認済み注文内容をもとに注文を作成する。 | U002, U002 | [design.md](units/${unit2}/design.md) | B002 | [B001-order-creation.md](bolts/B001-order-creation.md) |`,
    "bolts fixture does not contain expected B001 row",
  );
}

function replaceUnitDetailWithNonModulePath(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "units.md"),
    `[${unit1}.md](units/${unit1}.md)`,
    `[unit.md](units/${unit1}/unit.md)`,
    "units fixture does not contain expected U001 module file link",
  );
}

function replaceBoltDetailWithNonModulePath(workspace: string): void {
  replaceInFile(
    intentPath(workspace, "bolts.md"),
    `[${bolt1}.md](bolts/${bolt1}.md)`,
    `[bolt.md](bolts/${bolt1}/bolt.md)`,
    "bolts fixture does not contain expected B001 module file link",
  );
}

function replaceDecisionDetailWithLegacyPath(workspace: string): void {
  cpSync(
    intentPath(workspace, "decisions/D001-inception-boundary.md"),
    intentPath(workspace, "decisions/D001.md"),
  );
  replaceInFile(
    intentPath(workspace, "decisions.md"),
    "[D001-inception-boundary.md](decisions/D001-inception-boundary.md)",
    "[D001.md](decisions/D001.md)",
    "decisions fixture does not contain expected D001 detail link",
  );
}

function writeRootDomainMaps(workspace: string): void {
  writeFileSync(
    rootArtifactPath(workspace, "intents/20260628-existing-boundaries.md"),
    ["# 既存 Boundary 採用", "", "## 目的", "", "Domain Map の既存 adopted Bounded Context を表す eval 用 Intent Record である。"].join("\n"),
  );
  writeFileSync(
    rootArtifactPath(workspace, "domain-map.md"),
    [
      "# Domain Map",
      "",
      "## Subdomains",
      "",
      "| 識別子 | 名前 | 種別 | 役割 | 状態 | 根拠 |",
      "|---|---|---|---|---|---|",
      "| SD001 | 商品管理 | 支援 | 商品情報を管理し、販売管理から参照できる状態にする。 | adopted | [D000](intents/20260628-existing-boundaries.md) |",
      "| SD002 | 顧客管理 | 支援 | 購入者または顧客に関する情報を管理する。 | adopted | [D000](intents/20260628-existing-boundaries.md) |",
      "| SD003 | 入荷管理 | 支援 | 商品が販売可能になる前の入荷を管理する。 | adopted | [D000](intents/20260628-existing-boundaries.md) |",
      "| SD004 | 販売管理 | コア | 商品選択から注文作成までの販売活動を扱う。 | adopted | [D000](intents/20260628-existing-boundaries.md) |",
      "| SD005 | 出荷管理 | 支援 | 注文後の商品発送を管理する。 | adopted | [D000](intents/20260628-existing-boundaries.md) |",
      "",
      "## Bounded Contexts",
      "",
      "| 識別子 | 名前 | サブドメイン | 役割 | 状態 | 根拠 |",
      "|---|---|---|---|---|---|",
      "| BC001 | 商品管理 | SD001 | 商品情報を管理し、販売管理から参照できる状態にする。 | adopted | [D000](intents/20260628-existing-boundaries.md) |",
      "| BC002 | 顧客管理 | SD002 | 購入者または顧客に関する情報を管理する。 | adopted | [D000](intents/20260628-existing-boundaries.md) |",
      "| BC003 | 入荷管理 | SD003 | 商品が販売可能になる前の入荷を管理する。 | adopted | [D000](intents/20260628-existing-boundaries.md) |",
      "| BC004 | 販売管理 | SD004 | 商品選択から注文作成までの販売活動を扱う。 | adopted | [D000](intents/20260628-existing-boundaries.md) |",
      "| BC005 | 出荷管理 | SD005 | 注文後の商品発送を管理する。 | adopted | [D000](intents/20260628-existing-boundaries.md) |",
      "",
    ].join("\n"),
  );
  writeFileSync(
    rootArtifactPath(workspace, "context-map.md"),
    [
      "# Context Map",
      "",
      "## Dependencies",
      "",
      "| Downstream | Upstream | 依存内容 | 組織パターン | 統合パターン | 状態 | 根拠 |",
      "|---|---|---|---|---|---|---|",
      "| BC004 | BC001 | 販売管理は商品情報を参照する。 | 顧客／供給者 | 公開ホストサービス（OHS） | adopted | [D000](intents/20260628-existing-boundaries.md) |",
      "",
    ].join("\n"),
  );
}

function replaceCurrentIntentDomainMapEvidenceWithDecision(workspace: string): void {
  replaceInFile(
    rootArtifactPath(workspace, "domain-map.md"),
    "| BC004 | 販売管理 | SD004 | 商品選択から注文作成までの販売活動を扱う。 | adopted | [D000](intents/20260628-existing-boundaries.md) |",
    "| BC004 | 販売管理 | SD004 | 商品選択から注文作成までの販売活動を扱う。 | adopted | [D002](intents/20260629-minimum-purchase-flow/inception/decisions/D002-bc004-ownership.md) |",
    "domain-map fixture does not contain expected BC004 existing intent evidence",
  );
}

function replaceCurrentIntentDomainMapEvidenceWithIntentRecord(workspace: string): void {
  replaceInFile(
    rootArtifactPath(workspace, "domain-map.md"),
    "| BC004 | 販売管理 | SD004 | 商品選択から注文作成までの販売活動を扱う。 | adopted | [D000](intents/20260628-existing-boundaries.md) |",
    "| BC004 | 販売管理 | SD004 | 商品選択から注文作成までの販売活動を扱う。 | adopted | [D002](intents/20260629-minimum-purchase-flow.md) |",
    "domain-map fixture does not contain expected BC004 existing intent evidence",
  );
}

function removeLegacyDomainDirectory(workspace: string): void {
  const traceabilityPath = intentPath(workspace, "traceability.md");
  const text = readFileSync(traceabilityPath, "utf8");
  const legacyText = text
    .replaceAll("../../../domain-map.md", "../../../domain/subdomains.md")
    .replaceAll("../../../context-map.md", "../../../domain/bounded-contexts.md");
  mkdirSync(join(workspace, ".amadeus/domain"), { recursive: true });
  writeFileSync(
    traceabilityPath,
    legacyText
      .replaceAll("../../../domain/subdomains.md", "../../../domain-map.md")
      .replaceAll("../../../domain/bounded-contexts.md", "../../../domain-map.md"),
  );
  rmSync(join(workspace, ".amadeus/domain"), { recursive: true, force: true });
}

function markDomainMapContextRetired(workspace: string, contextId: string): void {
  replaceInFile(
    rootArtifactPath(workspace, "domain-map.md"),
    `| ${contextId} |`,
    `| ${contextId} |`,
    "domain-map fixture does not contain expected context row",
  );
  const path = rootArtifactPath(workspace, "domain-map.md");
  const text = readFileSync(path, "utf8");
  const updated = text.replace(
    new RegExp(`(\\| ${contextId} \\|[^\\n]+\\| )adopted( \\| \\[[^\\n]+)`),
    "$1retired$2",
  );
  if (updated === text) fail(`domain-map fixture does not contain adopted ${contextId} row`);
  writeFileSync(path, updated);
}

function replaceDomainMapStatusWithCandidate(workspace: string): void {
  replaceInFile(
    rootArtifactPath(workspace, "domain-map.md"),
    "| BC004 | 販売管理 | SD004 | 商品選択から注文作成までの販売活動を扱う。 | adopted |",
    "| BC004 | 販売管理 | SD004 | 商品選択から注文作成までの販売活動を扱う。 | candidate |",
    "domain-map fixture does not contain expected BC004 row",
  );
}

function replaceDomainMapContextSubdomainWithMissingId(workspace: string): void {
  replaceInFile(
    rootArtifactPath(workspace, "domain-map.md"),
    "| BC004 | 販売管理 | SD004 | 商品選択から注文作成までの販売活動を扱う。 | adopted |",
    "| BC004 | 販売管理 | SD999 | 商品選択から注文作成までの販売活動を扱う。 | adopted |",
    "domain-map fixture does not contain expected BC004 row",
  );
}

function replaceContextMapUpstreamWithMissingId(workspace: string): void {
  replaceInFile(
    rootArtifactPath(workspace, "context-map.md"),
    "| BC004 | BC001 | 販売管理は商品情報を参照する。 |",
    "| BC004 | BC999 | 販売管理は商品情報を参照する。 |",
    "context-map fixture does not contain expected dependency row",
  );
}

function writeConstructionTestResults(workspace: string): void {
  ensureBoltDirectory(workspace, bolt1);
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
      "| R004 | B001/T001 | npm test | 注文作成入力の契約を確認した。 |",
      "",
    ].join("\n"),
  );
}

function replaceAcceptanceEvidenceRequirementWithMissingId(workspace: string): void {
  replaceInFile(
    intentPath(workspace, `bolts/${bolt1}/test-results.md`),
    "| R004 | B001/T001 | npm test | 注文作成入力の契約を確認した。 |",
    "| R999 | B001/T001 | npm test | 注文作成入力の契約を確認した。 |",
    "test-results fixture does not contain expected acceptance evidence row",
  );
}

function replaceAcceptanceEvidenceTaskWithMissingId(workspace: string): void {
  replaceInFile(
    intentPath(workspace, `bolts/${bolt1}/test-results.md`),
    "| R004 | B001/T001 | npm test | 注文作成入力の契約を確認した。 |",
    "| R004 | B001/T999 | npm test | 注文作成入力の契約を確認した。 |",
    "test-results fixture does not contain expected acceptance evidence row",
  );
}

function replaceTaskIdWithDuplicate(workspace: string): void {
  replaceInFile(
    intentPath(workspace, `bolts/${bolt1}/tasks.md`),
    "- [ ] T002: 注文モデルと不変条件を定義する",
    "- [ ] T001: 注文モデルと不変条件を定義する",
    "tasks fixture does not contain expected T002 row",
  );
}

function writeConstructionNotes(workspace: string): void {
  ensureBoltDirectory(workspace, bolt1);
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

function functionalDesignPaths(): string[] {
  return [
    `construction/${unit2}/functional-design/business-logic-model.md`,
    `construction/${unit2}/functional-design/business-rules.md`,
    `construction/${unit2}/functional-design/domain-entities.md`,
    `construction/${unit2}/functional-design/frontend-components.md`,
  ];
}

function taskGenerationEvidence(bolt = bolt1): Array<{ kind: string; path: string }> {
  return [
    ...functionalDesignPaths().map((path) => ({ kind: "functional_design", path })),
    { kind: "unit_design_brief", path: `inception/units/${unit2}/design.md` },
    { kind: "bolt_module", path: `inception/bolts/${bolt}.md` },
    { kind: "tasks", path: `construction/bolts/${bolt}/tasks.md` },
    { kind: "notes", path: `construction/bolts/${bolt}/notes.md` },
  ];
}

function writeFunctionalDesign(workspace: string, overrides: Record<string, string> = {}): void {
  const base = constructionIntentPath(workspace, `${unit2}/functional-design`);
  mkdirSync(base, { recursive: true });
  writeFileSync(
    join(base, "business-logic-model.md"),
    [
      "# Business Logic Model",
      "",
      "## 概要",
      "",
      overrides.overview ?? "- U002 は確認済み注文内容を受け取り、注文を作成済みにする。",
      "",
      "## 入力",
      "",
      overrides.input ?? "- 注文内容、購入者情報、販売可能在庫の参照結果を扱う。",
      "",
      "## 出力",
      "",
      overrides.output ?? "- 作成済み注文を返す。",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(base, "business-rules.md"),
    [
      "# Business Rules",
      "",
      "## ルール",
      "",
      overrides.rules ?? "- 決済、売上確定、在庫引当、出荷は行わない。",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(base, "domain-entities.md"),
    [
      "# Domain Entities",
      "",
      "## エンティティ",
      "",
      overrides.entities ?? "- 注文は注文内容、購入者情報、作成済み状態を持つ。",
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(base, "frontend-components.md"),
    [
      "# Frontend Components",
      "",
      "## コンポーネント",
      "",
      overrides.frontend ?? "- 注文作成結果を表示する最小の表面を扱う。",
      "",
    ].join("\n"),
  );
}

function writeBoltSideDesign(workspace: string, bolt = bolt1): void {
  ensureBoltDirectory(workspace, bolt);
  writeFileSync(intentPath(workspace, `bolts/${bolt}/design.md`), "# Bolt Design\n");
}

function writeEventStormingSession(workspace: string): void {
  const base = join(workspace, ".amadeus/event-storming/ES001-loan-flow");
  mkdirSync(base, { recursive: true });
  writeFileSync(
    join(workspace, ".amadeus/event-storming/ES001-loan-flow.md"),
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

function writeGrillings(targetRoot: string, overrides: Record<string, string> = {}): void {
  const sessionFile = overrides.sessionFile ?? "G001-ideation-scope.md";
  const extraSession = overrides.extraSession === "true";
  const extraSessionDecisionId = overrides.extraSessionDecisionId ?? "GD002";
  const questionUserAnswer = overrides.questionUserAnswer ?? "それでよい。";
  const target = overrides.target ?? "scope.md";
  mkdirSync(join(targetRoot, "grillings"), { recursive: true });
  writeFileSync(
    join(targetRoot, "grillings.md"),
    [
      "# Grillings",
      "",
      "## 一覧",
      "",
      "| ID | 主題 | 対象 | 状態 | 主な確定判断 | 反映先 | 詳細 |",
      "|---|---|---|---|---|---|---|",
      `| G001 | Ideation Scope | Intent | ${overrides.indexSessionState ?? overrides.sessionState ?? "completed"} | 対象範囲を管理画面に限定する | ${overrides.indexTarget ?? `[${target}](${target})`} | [G001](grillings/${sessionFile}) |`,
      ...(extraSession
        ? [
            `| G002 | Ideation Follow-up | Intent | completed | 追加境界を対象外にする | [scope.md](scope.md) | [G002](grillings/G002-ideation-follow-up.md) |`,
          ]
        : []),
      "",
    ].join("\n"),
  );
  writeFileSync(
    join(targetRoot, "grillings", sessionFile),
    [
      "# G001 Ideation Scope",
      "",
      "## 概要",
      "",
      `- 対象: ${intent}`,
      "- 目的: Ideation の対象範囲を確定する。",
      `- 状態: ${overrides.sessionState ?? "completed"}`,
      "- 開始日: 2026-06-28",
      "- 終了日: 2026-06-28",
      `- 反映先: ${overrides.sessionTarget ?? target}`,
      "",
      "## 確定判断",
      "",
      "| ID | 判断 | 状態 | 反映先 | 置き換え先 |",
      "|---|---|---|---|---|",
      `| GD001 | 対象範囲は管理画面に限定する。 | ${overrides.decisionState ?? "active"} | ${overrides.decisionTarget ?? target} | ${overrides.replacedBy ?? "該当なし"} |`,
      "",
      "## 質問記録",
      "",
      "### Q001",
      "",
      ...(overrides.omitQuestionPrompt === "true" ? [] : ["- 確認したいこと: 対象範囲をどこまで含めるか。"]),
      ...(overrides.omitQuestionReason === "true" ? [] : ["- 確認が必要な理由: 要求と初期モックの境界が変わるため。"]),
      ...(overrides.omitRecommendedAnswer === "true" ? [] : ["- 推奨回答: 管理画面に限定する。"]),
      ...(overrides.omitRecommendedReason === "true" ? [] : ["- 推奨理由: 最初の Intent として検証可能な粒度に収まるため。"]),
      ...(overrides.omitQuestionUserAnswer === "true" ? [] : [`- ユーザー回答: ${questionUserAnswer}`]),
      `- 確定判断: ${overrides.questionDecision ?? "GD001"}`,
      ...(overrides.extraQuestionWithoutDecision === "true"
        ? [
            "",
            "### Q002",
            "",
            "- 確認したいこと: 追加の境界を含めるか。",
            "- 確認が必要な理由: 後続判断に影響するため。",
            "- 推奨回答: 含めない。",
            "- 推奨理由: 初期範囲を保つため。",
            "- ユーザー回答: 含めない。",
          ]
        : []),
      "",
    ].join("\n"),
  );
  if (extraSession) {
    writeExtraGrillingSession(
      targetRoot,
      "G002-ideation-follow-up.md",
      extraSessionDecisionId,
      overrides.extraSessionQuestionDecision ?? extraSessionDecisionId,
    );
  }
}

function writeExtraGrillingSession(targetRoot: string, sessionFile: string, decisionId: string, questionDecision = decisionId): void {
  writeFileSync(
    join(targetRoot, "grillings", sessionFile),
    [
      "# G002 Ideation Follow-up",
      "",
      "## 概要",
      "",
      `- 対象: ${intent}`,
      "- 目的: Ideation の追加境界を確定する。",
      "- 状態: completed",
      "- 開始日: 2026-06-28",
      "- 終了日: 2026-06-28",
      "- 反映先: scope.md",
      "",
      "## 確定判断",
      "",
      "| ID | 判断 | 状態 | 反映先 | 置き換え先 |",
      "|---|---|---|---|---|",
      `| ${decisionId} | 追加境界は対象外にする。 | active | scope.md | 該当なし |`,
      "",
      "## 質問記録",
      "",
      "### Q001",
      "",
      "- 確認したいこと: 追加境界を含めるか。",
      "- 確認が必要な理由: Ideation の対象範囲に影響するため。",
      "- 推奨回答: 含めない。",
      "- 推奨理由: 初期範囲を保つため。",
      "- ユーザー回答: 含めない。",
      `- 確定判断: ${questionDecision}`,
      "",
    ].join("\n"),
  );
}

function writeOnlyGrillingsIndex(targetRoot: string): void {
  writeFileSync(
    join(targetRoot, "grillings.md"),
    [
      "# Grillings",
      "",
      "## 一覧",
      "",
      "| ID | 主題 | 対象 | 状態 | 主な確定判断 | 反映先 | 詳細 |",
      "|---|---|---|---|---|---|---|",
      "| G001 | Ideation Scope | Intent | completed | 対象範囲を管理画面に限定する | [scope.md](scope.md) | [G001](grillings/G001-ideation-scope.md) |",
      "",
    ].join("\n"),
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
  const summaryPath = join(workspace, ".amadeus/event-storming/ES001-loan-flow.md");
  replaceInFile(
    summaryPath,
    "| system-design | ready | aggregate-candidates.md, bounded-context-candidates.md |",
    "| system-design | draft | aggregate-candidates.md, bounded-context-candidates.md |",
    "event storming fixture does not contain expected system-design status",
  );
}

function removeEventStormingSummaryHandoff(workspace: string): void {
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow.md");
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
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow.md");
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
  const path = join(workspace, ".amadeus/event-storming/ES001-loan-flow.md");
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
    `"relatedIntent": "${intent}"`,
    "event storming fixture does not contain expected relatedIntent",
  );
}

function removeEventStormingState(workspace: string): void {
  rmSync(join(workspace, ".amadeus/event-storming/ES001-loan-flow/state.json"));
}

function removeEventStormingSessionDirectory(workspace: string): void {
  rmSync(join(workspace, ".amadeus/event-storming/ES001-loan-flow"), { recursive: true, force: true });
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

function writeConstructionState(workspace: string, overrides: Record<string, any> = {}): void {
  const path = intentPath(workspace, "state.json");
  const state = JSON.parse(readFileSync(path, "utf8"));
  const intentCapture = state.ideation?.intentCapture;
  state.phase = "construction";
  state.status = overrides.status ?? "in_progress";
  state.ideation = { status: "completed", gate: "passed", intentCapture };
  state.inception = overrides.inception ?? { status: "completed", gate: "passed" };
  state.construction = {
    status: overrides.constructionStatus ?? "in_progress",
    targetBolts: overrides.targetBolts ?? ["B001"],
    requiredArtifacts: [
      "inception/requirements.md",
      "inception/acceptance.md",
      "inception/units.md",
      "inception/bolts.md",
      "construction/traceability.md",
      "construction/decisions.md",
      "state.json",
    ],
    requiredBoltArtifacts: overrides.requiredBoltArtifacts ?? [
      `construction/bolts/${bolt1}/tasks.md`,
      `construction/bolts/${bolt1}/notes.md`,
      `construction/bolts/${bolt1}/test-results.md`,
    ],
    gate: overrides.constructionGate ?? "not_ready",
    bolts: overrides.bolts ?? [
      {
        id: "B001",
        taskGeneration: {
          status: "ready_for_approval",
          evidence: taskGenerationEvidence(bolt1),
        },
      },
    ],
  };
  const defaultFunctionalDesign = {
    targetUnits: ["U002"],
    units: [
      {
        unitId: "U001",
        requirement: "not_required",
        status: "skipped",
        frontendSurface: "present",
        targetSource: "construction_target_bolts",
        runMode: "initial",
        skipReason: "unit_not_in_construction_scope",
      },
      {
        unitId: "U002",
        requirement: "required",
        status: "ready_for_approval",
        frontendSurface: "present",
        targetSource: "construction_target_bolts",
        runMode: "initial",
      },
    ],
  };
  if ("functionalDesign" in overrides) {
    if (overrides.functionalDesign !== undefined) state.construction.functionalDesign = overrides.functionalDesign;
  } else {
    state.construction.functionalDesign = defaultFunctionalDesign;
  }
  writeFileSync(path, JSON.stringify(state, null, 2));
}

function writePrWithoutUrl(workspace: string): void {
  ensureBoltDirectory(workspace, bolt1);
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

function writePrWithUrl(workspace: string): void {
  ensureBoltDirectory(workspace, bolt1);
  writeFileSync(
    intentPath(workspace, `bolts/${bolt1}/pr.md`),
    [
      "# PR 記録",
      "",
      "## Pull Request",
      "",
      "- URL: https://github.com/j5ik2o/amadeus/pull/999",
      "- 状態: open",
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
      "| CI | pass | GitHub Actions |",
      "",
    ].join("\n"),
  );
}

function replacePrTargetWithMissingReferences(workspace: string): void {
  replaceInFile(
    intentPath(workspace, `bolts/${bolt1}/pr.md`),
    "| B001 | T001 | R001 |",
    "| B999 | T999 | R999 |",
    "pr fixture does not contain expected target row",
  );
}

function replacePrTargetWithEmptyBolt(workspace: string): void {
  replaceInFile(
    intentPath(workspace, `bolts/${bolt1}/pr.md`),
    "| B001 | T001 | R001 |",
    "|  | T001 | R001 |",
    "pr fixture does not contain expected target row",
  );
}

function appendEmptyConstructionTrace(workspace: string): void {
  const path = constructionIntentPath(workspace, "traceability.md");
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
  const path = constructionIntentPath(workspace, "traceability.md");
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

function appendTaskGenerationTrace(
  workspace: string,
  overrides: { task?: string; implementation?: string; verification?: string; pr?: string; status?: string } = {},
): void {
  const path = constructionIntentPath(workspace, "traceability.md");
  const text = readFileSync(path, "utf8");
  writeFileSync(
    path,
    [
      text.trimEnd(),
      "",
      "## Task Generation からの追跡",
      "",
      "| Evidence | Task | 実装 | 検証 | PR | 状態 |",
      "|---|---|---|---|---|---|",
      `| [tasks.md](bolts/${bolt1}/tasks.md) | ${overrides.task ?? "B001/T001, B001/T002"} | ${overrides.implementation ?? "未実施"} | ${overrides.verification ?? "未実施"} | ${overrides.pr ?? "未実施"} | ${overrides.status ?? "ready_for_approval"} |`,
      "",
    ].join("\n"),
  );
}

const phaseInceptionWorkspace = phaseWorkspaceCopy();
replaceCurrentIntentDomainMapEvidenceWithDecision(phaseInceptionWorkspace);
run(["bun", "run", validator, phaseInceptionWorkspace, intent]);

const domainMapWithoutLegacyDomainWorkspace = phaseWorkspaceCopy();
removeLegacyDomainDirectory(domainMapWithoutLegacyDomainWorkspace);
run(["bun", "run", validator, domainMapWithoutLegacyDomainWorkspace, intent]);

const currentIntentDomainMapEvidenceWithoutDecisionWorkspace = phaseWorkspaceCopy();
replaceCurrentIntentDomainMapEvidenceWithIntentRecord(currentIntentDomainMapEvidenceWithoutDecisionWorkspace);
runExpectFailure(
  ["bun", "run", validator, currentIntentDomainMapEvidenceWithoutDecisionWorkspace, intent],
  "現在の Intent で採用した Bounded Context の Domain Map 根拠が Inception 判断を指す",
);

const domainMapCandidateStatusWorkspace = phaseWorkspaceCopy();
replaceDomainMapStatusWithCandidate(domainMapCandidateStatusWorkspace);
runExpectFailure(
  ["bun", "run", validator, domainMapCandidateStatusWorkspace, intent],
  "`状態` が許可値である",
);

const unitContextReferencesRetiredDomainMapWorkspace = phaseWorkspaceCopy();
markDomainMapContextRetired(unitContextReferencesRetiredDomainMapWorkspace, "BC004");
runExpectFailure(
  ["bun", "run", validator, unitContextReferencesRetiredDomainMapWorkspace, intent],
  "Unit のコンテキストが Domain Map の adopted Bounded Context を参照する",
);

const domainMapContextWithMissingSubdomainWorkspace = phaseWorkspaceCopy();
replaceDomainMapContextSubdomainWithMissingId(domainMapContextWithMissingSubdomainWorkspace);
runExpectFailure(
  ["bun", "run", validator, domainMapContextWithMissingSubdomainWorkspace, intent],
  "`サブドメイン` が Domain Map の Subdomain に存在する",
);

const contextMapWithMissingUpstreamWorkspace = phaseWorkspaceCopy();
replaceContextMapUpstreamWithMissingId(contextMapWithMissingUpstreamWorkspace);
runExpectFailure(
  ["bun", "run", validator, contextMapWithMissingUpstreamWorkspace, intent],
  "`Upstream` が Domain Map の Bounded Context に存在する",
);

const missingRequiredRequirementArtifactWorkspace = phaseWorkspaceCopy();
replaceRequiredRequirementArtifactWithMissingPath(missingRequiredRequirementArtifactWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingRequiredRequirementArtifactWorkspace, intent],
  "Inception 必須 Requirement 成果物が存在する",
);

const missingSteeringObjectiveWorkspace = phaseWorkspaceCopy();
removeSteeringObjective(missingSteeringObjectiveWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingSteeringObjectiveWorkspace],
  "steering の目的一覧が存在する",
);

const missingSteeringProductWorkspace = phaseWorkspaceCopy();
removeSteeringProduct(missingSteeringProductWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingSteeringProductWorkspace],
  "steering のプロダクト概要が存在する",
);

const intentGrillingsWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(intentGrillingsWorkspace, ""));
run(["bun", "run", validator, intentGrillingsWorkspace, intent]);

const crossSessionQuestionReferenceWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(crossSessionQuestionReferenceWorkspace, ""), {
  extraSession: "true",
  extraSessionDecisionId: "GD002",
  extraSessionQuestionDecision: "GD001",
});
run(["bun", "run", validator, crossSessionQuestionReferenceWorkspace, intent]);

const supersededWithSessionDecisionReferenceWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(supersededWithSessionDecisionReferenceWorkspace, ""), {
  decisionState: "superseded",
  replacedBy: "G002 GD002",
  extraSession: "true",
  extraSessionDecisionId: "GD002",
});
run(["bun", "run", validator, supersededWithSessionDecisionReferenceWorkspace, intent]);

const discoveryGrillingsWorkspace = phaseWorkspaceCopy();
writeGrillings(join(discoveryGrillingsWorkspace, `.amadeus/discoveries/${discovery}`), {
  target: `../${discovery}.md`,
});
run(["bun", "run", validator, discoveryGrillingsWorkspace]);

const eventStormingWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingWorkspace);
run(["bun", "run", validator, eventStormingWorkspace]);

const eventStormingGrillingsWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingGrillingsWorkspace);
writeGrillings(join(eventStormingGrillingsWorkspace, ".amadeus/event-storming/ES001-loan-flow"), { target: "../ES001-loan-flow.md" });
run(["bun", "run", validator, eventStormingGrillingsWorkspace]);

const grillingsIndexWithoutDirectoryWorkspace = phaseWorkspaceCopy();
writeOnlyGrillingsIndex(intentPath(grillingsIndexWithoutDirectoryWorkspace, ""));
runExpectFailure(
  ["bun", "run", validator, grillingsIndexWithoutDirectoryWorkspace, intent],
  "`grillings.md` と `grillings/` が揃っている",
);

const grillingsBadSessionNameWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsBadSessionNameWorkspace, ""), { sessionFile: "G1-bad.md" });
runExpectFailure(
  ["bun", "run", validator, grillingsBadSessionNameWorkspace, intent],
  "grilling session ファイル名が Gnnn-<topic>.md 形式である",
);

const grillingsUnindexedSessionWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsUnindexedSessionWorkspace, ""));
writeExtraGrillingSession(intentPath(grillingsUnindexedSessionWorkspace, ""), "G002-unindexed.md", "GD002");
runExpectFailure(
  ["bun", "run", validator, grillingsUnindexedSessionWorkspace, intent],
  "grilling session が `grillings.md` に登録されている",
);

const grillingsDuplicateSessionIdWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsDuplicateSessionIdWorkspace, ""));
writeExtraGrillingSession(intentPath(grillingsDuplicateSessionIdWorkspace, ""), "G001-duplicate.md", "GD002");
runExpectFailure(
  ["bun", "run", validator, grillingsDuplicateSessionIdWorkspace, intent],
  "grilling session ID が対象 root 内で重複しない",
);

const grillingsMismatchedSessionStateWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsMismatchedSessionStateWorkspace, ""), {
  indexSessionState: "completed",
  sessionState: "active",
});
runExpectFailure(
  ["bun", "run", validator, grillingsMismatchedSessionStateWorkspace, intent],
  "grilling 索引と session の `状態` が一致する",
);

const grillingsIndexWithMissingTargetWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsIndexWithMissingTargetWorkspace, ""), { indexTarget: "[missing](missing.md)" });
runExpectFailure(
  ["bun", "run", validator, grillingsIndexWithMissingTargetWorkspace, intent],
  "grilling 索引の `反映先` が存在する",
);

const grillingsIndexWithExternalTargetWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsIndexWithExternalTargetWorkspace, ""), { indexTarget: "https://example.com/scope.md" });
runExpectFailure(
  ["bun", "run", validator, grillingsIndexWithExternalTargetWorkspace, intent],
  "grilling 索引の `反映先` が存在する",
);

const grillingsIndexWithOutOfRootTargetWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsIndexWithOutOfRootTargetWorkspace, ""), { indexTarget: "[README](../../../README.md)" });
runExpectFailure(
  ["bun", "run", validator, grillingsIndexWithOutOfRootTargetWorkspace, intent],
  "grilling の `反映先` が対象 root 内に収まる",
);

const grillingsSessionWithMissingTargetWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsSessionWithMissingTargetWorkspace, ""), { sessionTarget: "missing.md" });
runExpectFailure(
  ["bun", "run", validator, grillingsSessionWithMissingTargetWorkspace, intent],
  "grilling session の `反映先` が存在する",
);

const grillingsSessionWithOutOfRootTargetWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsSessionWithOutOfRootTargetWorkspace, ""), { sessionTarget: "../../../README.md" });
runExpectFailure(
  ["bun", "run", validator, grillingsSessionWithOutOfRootTargetWorkspace, intent],
  "grilling の `反映先` が対象 root 内に収まる",
);

const grillingsDecisionWithoutTargetWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsDecisionWithoutTargetWorkspace, ""), { decisionTarget: "" });
runExpectFailure(
  ["bun", "run", validator, grillingsDecisionWithoutTargetWorkspace, intent],
  "grilling 判断の `反映先` が空欄でない",
);

const grillingsDecisionWithMissingTargetWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsDecisionWithMissingTargetWorkspace, ""), { decisionTarget: "missing.md" });
runExpectFailure(
  ["bun", "run", validator, grillingsDecisionWithMissingTargetWorkspace, intent],
  "grilling 判断の `反映先` が存在する",
);

const grillingsDecisionWithOutOfRootTargetWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsDecisionWithOutOfRootTargetWorkspace, ""), { decisionTarget: "../../../README.md" });
runExpectFailure(
  ["bun", "run", validator, grillingsDecisionWithOutOfRootTargetWorkspace, intent],
  "grilling の `反映先` が対象 root 内に収まる",
);

const grillingsDecisionWithoutParseableTargetWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsDecisionWithoutParseableTargetWorkspace, ""), { decisionTarget: "," });
runExpectFailure(
  ["bun", "run", validator, grillingsDecisionWithoutParseableTargetWorkspace, intent],
  "grilling 判断の `反映先` が存在する",
);

const grillingsQuestionWithoutDecisionWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsQuestionWithoutDecisionWorkspace, ""), { extraQuestionWithoutDecision: "true" });
runExpectFailure(
  ["bun", "run", validator, grillingsQuestionWithoutDecisionWorkspace, intent],
  "質問記録が確定判断 ID を参照する",
);

const grillingsQuestionWithoutUserAnswerWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsQuestionWithoutUserAnswerWorkspace, ""), { omitQuestionUserAnswer: "true" });
runExpectFailure(
  ["bun", "run", validator, grillingsQuestionWithoutUserAnswerWorkspace, intent],
  "質問記録がユーザー回答を持つ",
);

const grillingsQuestionWithoutPromptWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsQuestionWithoutPromptWorkspace, ""), { omitQuestionPrompt: "true" });
runExpectFailure(
  ["bun", "run", validator, grillingsQuestionWithoutPromptWorkspace, intent],
  "質問記録が確認したいことを持つ",
);

const grillingsQuestionWithoutReasonWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsQuestionWithoutReasonWorkspace, ""), { omitQuestionReason: "true" });
runExpectFailure(
  ["bun", "run", validator, grillingsQuestionWithoutReasonWorkspace, intent],
  "質問記録が確認が必要な理由を持つ",
);

const grillingsQuestionWithoutRecommendedAnswerWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsQuestionWithoutRecommendedAnswerWorkspace, ""), { omitRecommendedAnswer: "true" });
runExpectFailure(
  ["bun", "run", validator, grillingsQuestionWithoutRecommendedAnswerWorkspace, intent],
  "質問記録が推奨回答を持つ",
);

const grillingsQuestionWithoutRecommendedReasonWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsQuestionWithoutRecommendedReasonWorkspace, ""), { omitRecommendedReason: "true" });
runExpectFailure(
  ["bun", "run", validator, grillingsQuestionWithoutRecommendedReasonWorkspace, intent],
  "質問記録が推奨理由を持つ",
);

const grillingsSupersededWithoutReplacementWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsSupersededWithoutReplacementWorkspace, ""), { decisionState: "superseded" });
runExpectFailure(
  ["bun", "run", validator, grillingsSupersededWithoutReplacementWorkspace, intent],
  "superseded の grilling 判断が置き換え先を持つ",
);

const grillingsSupersededWithUnknownReplacementWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsSupersededWithUnknownReplacementWorkspace, ""), {
  decisionState: "superseded",
  replacedBy: "GD999",
});
runExpectFailure(
  ["bun", "run", validator, grillingsSupersededWithUnknownReplacementWorkspace, intent],
  "superseded の grilling 判断が実在する置き換え先を参照する",
);

const grillingsActiveWithReplacementWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsActiveWithReplacementWorkspace, ""), {
  decisionState: "active",
  replacedBy: "GD002",
});
runExpectFailure(
  ["bun", "run", validator, grillingsActiveWithReplacementWorkspace, intent],
  "active の grilling 判断が置き換え先を持たない",
);

const grillingsDuplicateDecisionIdWorkspace = phaseWorkspaceCopy();
writeGrillings(intentPath(grillingsDuplicateDecisionIdWorkspace, ""), {
  extraSession: "true",
  extraSessionDecisionId: "GD001",
});
runExpectFailure(
  ["bun", "run", validator, grillingsDuplicateDecisionIdWorkspace, intent],
  "grilling 判断 ID が対象 root 内で重複しない",
);

const draftSystemDesignEventStormingWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(draftSystemDesignEventStormingWorkspace);
markEventStormingSystemDesignDraft(draftSystemDesignEventStormingWorkspace);
removeEventStormingSummaryHandoff(draftSystemDesignEventStormingWorkspace);
run(["bun", "run", validator, draftSystemDesignEventStormingWorkspace]);

const draftEventStormingWithFlowOnlyHotspotWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(draftEventStormingWithFlowOnlyHotspotWorkspace);
markEventStormingSystemDesignDraft(draftEventStormingWithFlowOnlyHotspotWorkspace);
removeEventStormingBoardReadModel(draftEventStormingWithFlowOnlyHotspotWorkspace);
replaceEventStormingHotspotRelatedWithFlowOnlyId(draftEventStormingWithFlowOnlyHotspotWorkspace);
run(["bun", "run", validator, draftEventStormingWithFlowOnlyHotspotWorkspace]);

const draftEventStormingWithUnknownReferenceWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(draftEventStormingWithUnknownReferenceWorkspace);
markEventStormingSystemDesignDraft(draftEventStormingWithUnknownReferenceWorkspace);
replaceEventStormingDraftReferencesWithUnknown(draftEventStormingWithUnknownReferenceWorkspace);
run(["bun", "run", validator, draftEventStormingWithUnknownReferenceWorkspace]);

const missingEventStormingBoardCandidateWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(missingEventStormingBoardCandidateWorkspace);
removeEventStormingBoardCandidate(missingEventStormingBoardCandidateWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingEventStormingBoardCandidateWorkspace],
  "`board.md` が system-design の Aggregate Candidate を含む",
);

const missingEventStormingBoardBoundedContextCandidateWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(missingEventStormingBoardBoundedContextCandidateWorkspace);
removeEventStormingBoardBoundedContextCandidate(missingEventStormingBoardBoundedContextCandidateWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingEventStormingBoardBoundedContextCandidateWorkspace],
  "`board.md` が system-design の Bounded Context Candidate を含む",
);

const missingEventStormingBoardProcessElementWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(missingEventStormingBoardProcessElementWorkspace);
removeEventStormingBoardProcessElement(missingEventStormingBoardProcessElementWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingEventStormingBoardProcessElementWorkspace],
  "`board.md` が process-modeling の要素を含む",
);

const missingEventStormingProcessReadyBoardElementWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(missingEventStormingProcessReadyBoardElementWorkspace);
markEventStormingProcessModelingReady(missingEventStormingProcessReadyBoardElementWorkspace);
removeEventStormingBoardProcessElement(missingEventStormingProcessReadyBoardElementWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingEventStormingProcessReadyBoardElementWorkspace],
  "`board.md` が process-modeling の要素を含む",
);

const completedProcessEventStormingWithBadBoardRefWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(completedProcessEventStormingWithBadBoardRefWorkspace);
markEventStormingCurrentLevelBigPictureWithProcessComplete(completedProcessEventStormingWithBadBoardRefWorkspace);
replaceEventStormingBoardRelatedWithMissingId(completedProcessEventStormingWithBadBoardRefWorkspace);
runExpectFailure(
  ["bun", "run", validator, completedProcessEventStormingWithBadBoardRefWorkspace],
  "`Related` が Event Storming 要素 ID またはなしである",
);

const bigPictureEventStormingWithBadBoardRefWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(bigPictureEventStormingWithBadBoardRefWorkspace);
markEventStormingBigPictureReady(bigPictureEventStormingWithBadBoardRefWorkspace);
replaceEventStormingBoardRelatedWithMissingId(bigPictureEventStormingWithBadBoardRefWorkspace);
runExpectFailure(
  ["bun", "run", validator, bigPictureEventStormingWithBadBoardRefWorkspace],
  "`Related` が Event Storming 要素 ID またはなしである",
);

const eventStormingWithoutStateWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingWithoutStateWorkspace);
removeEventStormingState(eventStormingWithoutStateWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithoutStateWorkspace],
  "Event Storming 状態ファイルが存在する",
);

const eventStormingWithoutDirectoryWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingWithoutDirectoryWorkspace);
removeEventStormingSessionDirectory(eventStormingWithoutDirectoryWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithoutDirectoryWorkspace],
  "Event Storming セッションディレクトリが存在する",
);

const eventStormingPreIntentWithRelatedIntentWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingPreIntentWithRelatedIntentWorkspace);
replaceEventStormingRelatedIntentWithValue(eventStormingPreIntentWithRelatedIntentWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingPreIntentWithRelatedIntentWorkspace],
  "`relatedIntent` が",
);

const eventStormingReadyWithoutCompletedSystemDesignWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingReadyWithoutCompletedSystemDesignWorkspace);
markEventStormingSystemDesignReadyWithoutCompletedLevel(eventStormingReadyWithoutCompletedSystemDesignWorkspace);
removeEventStormingSummaryHandoff(eventStormingReadyWithoutCompletedSystemDesignWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingReadyWithoutCompletedSystemDesignWorkspace],
  "Handoff To Domain Modeling",
);

const eventStormingWithoutHandoffRowsWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingWithoutHandoffRowsWorkspace);
removeEventStormingSummaryHandoffRows(eventStormingWithoutHandoffRowsWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithoutHandoffRowsWorkspace],
  "system-design ready の Handoff が1件以上ある",
);

const eventStormingWithBadHandoffCandidateWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingWithBadHandoffCandidateWorkspace);
replaceEventStormingSummaryHandoffCandidateWithMissingId(eventStormingWithBadHandoffCandidateWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithBadHandoffCandidateWorkspace],
  "`Candidate` が system-design 候補 ID である",
);

const eventStormingMissingCompletedLevelPrerequisiteWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingMissingCompletedLevelPrerequisiteWorkspace);
replaceEventStormingCompletedLevelsWithMissingPrerequisite(eventStormingMissingCompletedLevelPrerequisiteWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingMissingCompletedLevelPrerequisiteWorkspace],
  "`system-design` 完了は `process-modeling` 完了を前提にする",
);

const eventStormingWrongNextRecommendedSkillWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingWrongNextRecommendedSkillWorkspace);
replaceEventStormingNextRecommendedSkillWithWrongValue(eventStormingWrongNextRecommendedSkillWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWrongNextRecommendedSkillWorkspace],
  "`nextRecommendedSkill` が scope と level に対応する",
);

const eventStormingNextRecommendedSkillIgnoringCompletedLevelsWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingNextRecommendedSkillIgnoringCompletedLevelsWorkspace);
replaceEventStormingNextRecommendedSkillIgnoringCompletedLevels(eventStormingNextRecommendedSkillIgnoringCompletedLevelsWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingNextRecommendedSkillIgnoringCompletedLevelsWorkspace],
  "`nextRecommendedSkill` が scope と level に対応する",
);

const eventStormingMismatchedTypeIdPrefixWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingMismatchedTypeIdPrefixWorkspace);
replaceEventStormingFlowTypeWithMismatchedIdPrefix(eventStormingMismatchedTypeIdPrefixWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingMismatchedTypeIdPrefixWorkspace],
  "`Type` と `ID` 接頭辞が対応する",
);

const eventStormingMissingFlowDomainEventWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingMissingFlowDomainEventWorkspace);
removeEventStormingFlowDomainEvent(eventStormingMissingFlowDomainEventWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingMissingFlowDomainEventWorkspace],
  "`flow.md` が Domain Event を含む",
);

const eventStormingInvalidBoardOrderWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingInvalidBoardOrderWorkspace);
replaceEventStormingBoardOrderWithInvalidValue(eventStormingInvalidBoardOrderWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingInvalidBoardOrderWorkspace],
  "`Order` が正の整数である",
);

const eventStormingMissingHotspotReferenceWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingMissingHotspotReferenceWorkspace);
replaceEventStormingHotspotRelatedWithMissingId(eventStormingMissingHotspotReferenceWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingMissingHotspotReferenceWorkspace],
  "`Related` が Event Storming 要素 ID またはなしである",
);

const eventStormingWithoutEventsWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingWithoutEventsWorkspace);
removeEventStormingEventRows(eventStormingWithoutEventsWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithoutEventsWorkspace],
  "big-picture ready の Domain Event が1件以上ある",
);

const eventStormingWithoutAggregateCandidatesWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingWithoutAggregateCandidatesWorkspace);
removeEventStormingAggregateCandidateRows(eventStormingWithoutAggregateCandidatesWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithoutAggregateCandidatesWorkspace],
  "system-design ready の Aggregate Candidate が1件以上ある",
);

const eventStormingWithoutBoundedContextCandidatesWorkspace = phaseWorkspaceCopy();
writeEventStormingSession(eventStormingWithoutBoundedContextCandidatesWorkspace);
removeEventStormingBoundedContextCandidateRows(eventStormingWithoutBoundedContextCandidatesWorkspace);
runExpectFailure(
  ["bun", "run", validator, eventStormingWithoutBoundedContextCandidatesWorkspace],
  "system-design ready の Bounded Context Candidate が1件以上ある",
);

const discoveryDecisionMismatchWorkspace = phaseWorkspaceCopy();
replaceDiscoveryDecision(discoveryDecisionMismatchWorkspace);
runExpectFailure(
  ["bun", "run", validator, discoveryDecisionMismatchWorkspace],
  "state.json.decision と Discovery のモジュールファイルの判定が一致する",
);

const discoveryMultiIntentTooSmallWorkspace = phaseWorkspaceCopy();
removeDiscoveryCandidate(discoveryMultiIntentTooSmallWorkspace);
runExpectFailure(
  ["bun", "run", validator, discoveryMultiIntentTooSmallWorkspace],
  "multi_intent の Intent 候補が2件以上ある",
);

const wrongDesignTraceWorkspace = phaseWorkspaceCopy();
replaceDesignTraceDesignLink(wrongDesignTraceWorkspace);
runExpectFailure(
  ["bun", "run", validator, wrongDesignTraceWorkspace, intent],
  "`設計` が対象 Unit の Unit Design Brief を指す",
);

const wrongDesignTraceReferencesWorkspace = phaseWorkspaceCopy();
replaceDesignTraceReferencesWithMissingIds(wrongDesignTraceReferencesWorkspace);
runExpectFailure(
  ["bun", "run", validator, wrongDesignTraceReferencesWorkspace, intent],
  "`要求` が一覧内の既存 ID である",
);

const requirementTraceWithTaskColumnWorkspace = phaseWorkspaceCopy();
addTaskColumnToRequirementTrace(requirementTraceWithTaskColumnWorkspace);
runExpectFailure(
  ["bun", "run", validator, requirementTraceWithTaskColumnWorkspace, intent],
  "Inception の `要求からの追跡` は `タスク` 列を持たない",
);

const inceptionWithTaskFileWorkspace = phaseWorkspaceCopy();
writeConstructionTasks(inceptionWithTaskFileWorkspace);
runExpectFailure(
  ["bun", "run", validator, inceptionWithTaskFileWorkspace, intent],
  "Inception は Bolt 配下の tasks.md を持たない",
);

const missingTaskDesignReasonWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(missingTaskDesignReasonWorkspace);
writeConstructionTasks(missingTaskDesignReasonWorkspace);
writeConstructionNotes(missingTaskDesignReasonWorkspace);
appendTaskGenerationTrace(missingTaskDesignReasonWorkspace);
writeConstructionState(missingTaskDesignReasonWorkspace);
removeTaskDesignReason(missingTaskDesignReasonWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingTaskDesignReasonWorkspace, intent],
  "Task が `設計根拠` を持つ",
);

const wrongTaskReferencesWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(wrongTaskReferencesWorkspace);
writeConstructionTasks(wrongTaskReferencesWorkspace);
writeConstructionNotes(wrongTaskReferencesWorkspace);
appendTaskGenerationTrace(wrongTaskReferencesWorkspace);
writeConstructionState(wrongTaskReferencesWorkspace);
replaceTaskReferencesWithMissingIds(wrongTaskReferencesWorkspace);
runExpectFailure(
  ["bun", "run", validator, wrongTaskReferencesWorkspace, intent],
  "Task の `要求` が既存 ID またはなしである",
);

const emptyTaskReferencesWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(emptyTaskReferencesWorkspace);
writeConstructionTasks(emptyTaskReferencesWorkspace);
writeConstructionNotes(emptyTaskReferencesWorkspace);
appendTaskGenerationTrace(emptyTaskReferencesWorkspace);
writeConstructionState(emptyTaskReferencesWorkspace);
replaceTaskReferencesWithEmptyIds(emptyTaskReferencesWorkspace);
runExpectFailure(
  ["bun", "run", validator, emptyTaskReferencesWorkspace, intent],
  "Task の `要求` が既存 ID またはなしである",
);

const completedConstructionWithoutNoneUseCaseReasonWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(completedConstructionWithoutNoneUseCaseReasonWorkspace);
writeConstructionTasks(completedConstructionWithoutNoneUseCaseReasonWorkspace);
writeConstructionNotes(completedConstructionWithoutNoneUseCaseReasonWorkspace);
writeConstructionTestResults(completedConstructionWithoutNoneUseCaseReasonWorkspace);
replaceTaskUseCaseWithNone(completedConstructionWithoutNoneUseCaseReasonWorkspace);
appendTaskGenerationTrace(completedConstructionWithoutNoneUseCaseReasonWorkspace, {
  implementation: "実装済み",
  verification: "検証済み",
  pr: "https://github.com/j5ik2o/amadeus/pull/999",
  status: "completed",
});
appendConstructionTrace(completedConstructionWithoutNoneUseCaseReasonWorkspace);
writeConstructionState(completedConstructionWithoutNoneUseCaseReasonWorkspace, {
  status: "completed",
  constructionStatus: "completed",
  constructionGate: "passed",
});
runExpectFailure(
  ["bun", "run", validator, completedConstructionWithoutNoneUseCaseReasonWorkspace, intent],
  "Use Case を参照しない Task の理由がある",
);

const duplicateTaskIdWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(duplicateTaskIdWorkspace, {
  overview: "- B001/T001 を実装へ進められる粒度で設計した。",
  domain: "- 対象 Task: B001/T001。注文内容、購入者情報、販売可能在庫の参照結果を注文作成の入力として扱う。",
  logical: "- 対象 Task: B001/T001。確認済み注文内容から注文を作成し、決済、売上確定、在庫引当、出荷は実行しない。",
  implementation: "- 対象 Task: B001/T001。注文作成入力の契約を定義する。",
  verification: "- 対象 Task: B001/T001。validator で注文作成の要求、ユースケース、Task の追跡を確認する。",
});
writeConstructionTasks(duplicateTaskIdWorkspace);
writeConstructionNotes(duplicateTaskIdWorkspace);
writeConstructionTestResults(duplicateTaskIdWorkspace);
appendTaskGenerationTrace(duplicateTaskIdWorkspace, { task: "B001/T001" });
writeConstructionState(duplicateTaskIdWorkspace);
replaceTaskIdWithDuplicate(duplicateTaskIdWorkspace);
runExpectFailure(
  ["bun", "run", validator, duplicateTaskIdWorkspace, intent],
  "Task ID が重複しない",
);

const missingBoltsIndexWorkspace = phaseWorkspaceCopy();
rmSync(intentPath(missingBoltsIndexWorkspace, "bolts.md"));
runExpectFailure(
  ["bun", "run", validator, missingBoltsIndexWorkspace, intent],
  "bolts.md が存在する",
);

const multiUnitBoltWithReasonWorkspace = phaseWorkspaceCopy();
makeBoltReferenceMultipleUnits(multiUnitBoltWithReasonWorkspace, true);
run(["bun", "run", validator, multiUnitBoltWithReasonWorkspace, intent]);

const multiUnitBoltWithoutReasonWorkspace = phaseWorkspaceCopy();
makeBoltReferenceMultipleUnits(multiUnitBoltWithoutReasonWorkspace, false);
runExpectFailure(
  ["bun", "run", validator, multiUnitBoltWithoutReasonWorkspace, intent],
  "複数 Unit を同じ Bolt で扱う理由を記録する",
);

const missingBoltUnitReferenceWorkspace = phaseWorkspaceCopy();
replaceBoltUnitWithMissingId(missingBoltUnitReferenceWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingBoltUnitReferenceWorkspace, intent],
  "Bolt の `ユニット` が既存 Unit を参照する",
);

const duplicateBoltUnitReferenceWorkspace = phaseWorkspaceCopy();
replaceBoltUnitWithDuplicateId(duplicateBoltUnitReferenceWorkspace);
runExpectFailure(
  ["bun", "run", validator, duplicateBoltUnitReferenceWorkspace, intent],
  "Bolt の `ユニット` が重複しない",
);

const constructionWithoutInceptionRequiredWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(constructionWithoutInceptionRequiredWorkspace);
writeConstructionTasks(constructionWithoutInceptionRequiredWorkspace);
writeConstructionNotes(constructionWithoutInceptionRequiredWorkspace);
writeConstructionTestResults(constructionWithoutInceptionRequiredWorkspace);
appendTaskGenerationTrace(constructionWithoutInceptionRequiredWorkspace);
writeConstructionState(constructionWithoutInceptionRequiredWorkspace);
run(["bun", "run", validator, constructionWithoutInceptionRequiredWorkspace, intent]);

const missingConstructionDecisionsWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(missingConstructionDecisionsWorkspace);
writeConstructionTasks(missingConstructionDecisionsWorkspace);
writeConstructionNotes(missingConstructionDecisionsWorkspace);
writeConstructionTestResults(missingConstructionDecisionsWorkspace);
appendTaskGenerationTrace(missingConstructionDecisionsWorkspace);
writeConstructionState(missingConstructionDecisionsWorkspace);
removeConstructionDecisionsFromRequiredArtifacts(missingConstructionDecisionsWorkspace);
runExpectFailure(
  ["bun", "run", validator, missingConstructionDecisionsWorkspace, intent],
  "Construction 必須成果物に判断一覧が含まれる",
);

const testResultsWithMissingRequirementWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(testResultsWithMissingRequirementWorkspace);
writeConstructionTasks(testResultsWithMissingRequirementWorkspace);
writeConstructionNotes(testResultsWithMissingRequirementWorkspace);
writeConstructionTestResults(testResultsWithMissingRequirementWorkspace);
appendTaskGenerationTrace(testResultsWithMissingRequirementWorkspace);
writeConstructionState(testResultsWithMissingRequirementWorkspace);
replaceAcceptanceEvidenceRequirementWithMissingId(testResultsWithMissingRequirementWorkspace);
runExpectFailure(
  ["bun", "run", validator, testResultsWithMissingRequirementWorkspace, intent],
  "受け入れ証拠の `要求` が一覧内の既存 ID である",
);

const testResultsWithMissingTaskWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(testResultsWithMissingTaskWorkspace);
writeConstructionTasks(testResultsWithMissingTaskWorkspace);
writeConstructionNotes(testResultsWithMissingTaskWorkspace);
writeConstructionTestResults(testResultsWithMissingTaskWorkspace);
appendTaskGenerationTrace(testResultsWithMissingTaskWorkspace);
writeConstructionState(testResultsWithMissingTaskWorkspace);
replaceAcceptanceEvidenceTaskWithMissingId(testResultsWithMissingTaskWorkspace);
runExpectFailure(
  ["bun", "run", validator, testResultsWithMissingTaskWorkspace, intent],
  "受け入れ証拠の `タスク` が既存 Task を指す",
);

const constructionWithStaleInceptionRequiredWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(constructionWithStaleInceptionRequiredWorkspace);
writeConstructionTasks(constructionWithStaleInceptionRequiredWorkspace);
writeConstructionNotes(constructionWithStaleInceptionRequiredWorkspace);
writeConstructionTestResults(constructionWithStaleInceptionRequiredWorkspace);
appendTaskGenerationTrace(constructionWithStaleInceptionRequiredWorkspace);
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

const readyNonTargetBoltWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(readyNonTargetBoltWorkspace);
writeConstructionTasks(readyNonTargetBoltWorkspace);
writeConstructionTasksForSecondBolt(readyNonTargetBoltWorkspace);
writeConstructionNotes(readyNonTargetBoltWorkspace);
writeConstructionTestResults(readyNonTargetBoltWorkspace);
appendTaskGenerationTrace(readyNonTargetBoltWorkspace);
writeConstructionState(readyNonTargetBoltWorkspace, {
  requiredBoltArtifacts: [
    `construction/bolts/${bolt1}/tasks.md`,
    `construction/bolts/${bolt1}/notes.md`,
    `construction/bolts/${bolt1}/test-results.md`,
    `construction/bolts/${bolt2}/tasks.md`,
  ],
  bolts: [
    {
      id: "B001",
      taskGeneration: {
        status: "ready_for_approval",
        evidence: taskGenerationEvidence(bolt1),
      },
    },
    {
      id: "B002",
      taskGeneration: {
        status: "ready_for_approval",
        evidence: taskGenerationEvidence(bolt2).filter((item) => item.kind !== "notes"),
      },
    },
  ],
});
run(["bun", "run", validator, readyNonTargetBoltWorkspace, intent]);

const completedConstructionWithoutTestResultsWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(completedConstructionWithoutTestResultsWorkspace);
writeConstructionTasks(completedConstructionWithoutTestResultsWorkspace);
writeConstructionNotes(completedConstructionWithoutTestResultsWorkspace);
appendTaskGenerationTrace(completedConstructionWithoutTestResultsWorkspace, {
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
    `construction/bolts/${bolt1}/tasks.md`,
    `construction/bolts/${bolt1}/notes.md`,
  ],
});
runExpectFailure(
  ["bun", "run", validator, completedConstructionWithoutTestResultsWorkspace, intent],
  "Construction 完了時の必須 Bolt 成果物が test-results.md を含む",
);

const missingTargetBoltArtifactsWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(missingTargetBoltArtifactsWorkspace);
writeConstructionTasks(missingTargetBoltArtifactsWorkspace);
writeConstructionNotes(missingTargetBoltArtifactsWorkspace);
writeConstructionTestResults(missingTargetBoltArtifactsWorkspace);
appendTaskGenerationTrace(missingTargetBoltArtifactsWorkspace);
writeConstructionState(missingTargetBoltArtifactsWorkspace, {
  requiredBoltArtifacts: [
    `construction/bolts/${bolt1}/tasks.md`,
  ],
});
runExpectFailure(
  ["bun", "run", validator, missingTargetBoltArtifactsWorkspace, intent],
  "Construction 必須 Bolt 成果物が targetBolt の証拠成果物を含む",
);

const generatedTasksWithoutRequiredTasksWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(generatedTasksWithoutRequiredTasksWorkspace);
writeConstructionTasks(generatedTasksWithoutRequiredTasksWorkspace);
writeConstructionNotes(generatedTasksWithoutRequiredTasksWorkspace);
writeConstructionTestResults(generatedTasksWithoutRequiredTasksWorkspace);
appendTaskGenerationTrace(generatedTasksWithoutRequiredTasksWorkspace);
writeConstructionState(generatedTasksWithoutRequiredTasksWorkspace, {
  requiredBoltArtifacts: [
    `construction/bolts/${bolt1}/notes.md`,
  ],
});
runExpectFailure(
  ["bun", "run", validator, generatedTasksWithoutRequiredTasksWorkspace, intent],
  "Construction 必須 Bolt 成果物が targetBolt の証拠成果物を含む",
);

const notGeneratedTasksWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(notGeneratedTasksWorkspace, {
  overview: "- Functional Design は作成済みで、Task への分解は未着手である。",
});
writeConstructionNotes(notGeneratedTasksWorkspace);
writeConstructionState(notGeneratedTasksWorkspace, {
  requiredBoltArtifacts: [
    `construction/bolts/${bolt1}/notes.md`,
  ],
  bolts: [
    {
      id: "B001",
      taskGeneration: {
        status: "not_started",
        evidence: [],
      },
    },
  ],
});
run(["bun", "run", validator, notGeneratedTasksWorkspace, intent]);

const emptyTargetBoltsWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(emptyTargetBoltsWorkspace);
writeConstructionTasks(emptyTargetBoltsWorkspace);
writeConstructionNotes(emptyTargetBoltsWorkspace);
writeConstructionTestResults(emptyTargetBoltsWorkspace);
writeConstructionState(emptyTargetBoltsWorkspace, { targetBolts: [] });
runExpectFailure(
  ["bun", "run", validator, emptyTargetBoltsWorkspace, intent],
  "`construction.targetBolts` が1件以上の既存 Bolt を持つ",
);

const constructionWithoutFunctionalDesignWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(constructionWithoutFunctionalDesignWorkspace);
writeConstructionTasks(constructionWithoutFunctionalDesignWorkspace);
writeConstructionNotes(constructionWithoutFunctionalDesignWorkspace);
writeConstructionTestResults(constructionWithoutFunctionalDesignWorkspace);
appendTaskGenerationTrace(constructionWithoutFunctionalDesignWorkspace);
writeConstructionState(constructionWithoutFunctionalDesignWorkspace, { functionalDesign: undefined });
runExpectFailure(
  ["bun", "run", validator, constructionWithoutFunctionalDesignWorkspace, intent],
  "`construction.functionalDesign` がオブジェクトである",
);

const invalidFunctionalDesignStatusWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(invalidFunctionalDesignStatusWorkspace);
writeConstructionTasks(invalidFunctionalDesignStatusWorkspace);
writeConstructionNotes(invalidFunctionalDesignStatusWorkspace);
writeConstructionTestResults(invalidFunctionalDesignStatusWorkspace);
appendTaskGenerationTrace(invalidFunctionalDesignStatusWorkspace);
writeConstructionState(invalidFunctionalDesignStatusWorkspace, {
  functionalDesign: {
    targetUnits: ["U001"],
    units: [
      {
        unitId: "U001",
        requirement: "required",
        status: "skipped",
        frontendSurface: "present",
        targetSource: "construction_target_bolts",
        runMode: "initial",
      },
    ],
  },
});
runExpectFailure(
  ["bun", "run", validator, invalidFunctionalDesignStatusWorkspace, intent],
  "`construction.functionalDesign.units[]` の requirement と status の組み合わせが有効である",
);

const functionalDesignWithPersistedGateWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(functionalDesignWithPersistedGateWorkspace);
writeConstructionTasks(functionalDesignWithPersistedGateWorkspace);
writeConstructionNotes(functionalDesignWithPersistedGateWorkspace);
writeConstructionTestResults(functionalDesignWithPersistedGateWorkspace);
appendTaskGenerationTrace(functionalDesignWithPersistedGateWorkspace);
writeConstructionState(functionalDesignWithPersistedGateWorkspace, {
  functionalDesign: {
    targetUnits: ["U001"],
    gate: "waiting_approval",
    units: [
      {
        unitId: "U001",
        requirement: "required",
        status: "ready_for_approval",
        frontendSurface: "present",
        targetSource: "construction_target_bolts",
        runMode: "initial",
      },
    ],
  },
});
runExpectFailure(
  ["bun", "run", validator, functionalDesignWithPersistedGateWorkspace, intent],
  "`construction.functionalDesign.gate` を保存しない",
);

const functionalDesignReadyWithoutArtifactsWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(functionalDesignReadyWithoutArtifactsWorkspace);
writeConstructionTasks(functionalDesignReadyWithoutArtifactsWorkspace);
writeConstructionNotes(functionalDesignReadyWithoutArtifactsWorkspace);
writeConstructionTestResults(functionalDesignReadyWithoutArtifactsWorkspace);
appendTaskGenerationTrace(functionalDesignReadyWithoutArtifactsWorkspace);
writeConstructionState(functionalDesignReadyWithoutArtifactsWorkspace, {
  functionalDesign: {
    targetUnits: ["U001"],
    units: [
      {
        unitId: "U001",
        requirement: "required",
        status: "ready_for_approval",
        frontendSurface: "present",
        targetSource: "construction_target_bolts",
        runMode: "initial",
      },
    ],
  },
});
runExpectFailure(
  ["bun", "run", validator, functionalDesignReadyWithoutArtifactsWorkspace, intent],
  "Functional Design ready は Catalog 必須成果物を満たす",
);

const constructionDesignTraceWrongBoltWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(constructionDesignTraceWrongBoltWorkspace);
writeConstructionTasks(constructionDesignTraceWrongBoltWorkspace);
writeConstructionNotes(constructionDesignTraceWrongBoltWorkspace);
writeConstructionTestResults(constructionDesignTraceWrongBoltWorkspace);
appendTaskGenerationTrace(constructionDesignTraceWrongBoltWorkspace, { task: "B002/T001" });
writeConstructionState(constructionDesignTraceWrongBoltWorkspace);
runExpectFailure(
  ["bun", "run", validator, constructionDesignTraceWrongBoltWorkspace, intent],
  "`Task Generation からの追跡` が対象 Bolt の Task を指す",
);

const untrackedConstructionDesignWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(untrackedConstructionDesignWorkspace);
writeConstructionTasks(untrackedConstructionDesignWorkspace);
writeConstructionNotes(untrackedConstructionDesignWorkspace);
writeConstructionTestResults(untrackedConstructionDesignWorkspace);
appendTaskGenerationTrace(untrackedConstructionDesignWorkspace);
writeConstructionState(untrackedConstructionDesignWorkspace);
writeBoltSideDesign(untrackedConstructionDesignWorkspace, bolt2);
runExpectFailure(
  ["bun", "run", validator, untrackedConstructionDesignWorkspace, intent],
  "Bolt 側 design.md は存在しない",
);

const nonModuleUnitDetailWorkspace = phaseWorkspaceCopy();
replaceUnitDetailWithNonModulePath(nonModuleUnitDetailWorkspace);
runExpectFailure(
  ["bun", "run", validator, nonModuleUnitDetailWorkspace, intent],
  "`詳細` が units/<unit-id>-<slug>.md を指す",
);

const nonModuleBoltDetailWorkspace = phaseWorkspaceCopy();
replaceBoltDetailWithNonModulePath(nonModuleBoltDetailWorkspace);
runExpectFailure(
  ["bun", "run", validator, nonModuleBoltDetailWorkspace, intent],
  "`詳細` が bolts/<bolt-id>-<slug>.md を指す",
);

const legacyDecisionDetailWorkspace = phaseWorkspaceCopy();
replaceDecisionDetailWithLegacyPath(legacyDecisionDetailWorkspace);
runExpectFailure(
  ["bun", "run", validator, legacyDecisionDetailWorkspace, intent],
  "`詳細` が decisions/<decision-id>-<slug>.md を指す",
);

const missingConstructionTraceWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(missingConstructionTraceWorkspace);
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

const emptyConstructionTraceWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(emptyConstructionTraceWorkspace);
writeConstructionTasks(emptyConstructionTraceWorkspace);
writeConstructionNotes(emptyConstructionTraceWorkspace);
writeConstructionTestResults(emptyConstructionTraceWorkspace);
appendTaskGenerationTrace(emptyConstructionTraceWorkspace);
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

const completedConstructionWithUnimplementedDesignTraceWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(completedConstructionWithUnimplementedDesignTraceWorkspace);
writeConstructionTasks(completedConstructionWithUnimplementedDesignTraceWorkspace);
writeConstructionNotes(completedConstructionWithUnimplementedDesignTraceWorkspace);
writeConstructionTestResults(completedConstructionWithUnimplementedDesignTraceWorkspace);
appendTaskGenerationTrace(completedConstructionWithUnimplementedDesignTraceWorkspace);
appendConstructionTrace(completedConstructionWithUnimplementedDesignTraceWorkspace);
writeConstructionState(completedConstructionWithUnimplementedDesignTraceWorkspace, {
  status: "completed",
  constructionStatus: "completed",
  constructionGate: "passed",
});
runExpectFailure(
  ["bun", "run", validator, completedConstructionWithUnimplementedDesignTraceWorkspace, intent],
  "Construction 完了時の Task Generation 追跡が未実施を残さない",
);

const prWithoutUrlWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(prWithoutUrlWorkspace);
writeConstructionTasks(prWithoutUrlWorkspace);
writeConstructionNotes(prWithoutUrlWorkspace);
writeConstructionTestResults(prWithoutUrlWorkspace);
appendTaskGenerationTrace(prWithoutUrlWorkspace);
writePrWithoutUrl(prWithoutUrlWorkspace);
writeConstructionState(prWithoutUrlWorkspace, {
  requiredBoltArtifacts: [
    `construction/bolts/${bolt1}/tasks.md`,
    `construction/bolts/${bolt1}/notes.md`,
    `construction/bolts/${bolt1}/test-results.md`,
    `construction/bolts/${bolt1}/pr.md`,
  ],
});
runExpectFailure(
  ["bun", "run", validator, prWithoutUrlWorkspace, intent],
  "PR 記録が URL を持つ",
);

const existingPrWithoutUrlWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(existingPrWithoutUrlWorkspace);
writeConstructionTasks(existingPrWithoutUrlWorkspace);
writeConstructionNotes(existingPrWithoutUrlWorkspace);
writeConstructionTestResults(existingPrWithoutUrlWorkspace);
appendTaskGenerationTrace(existingPrWithoutUrlWorkspace);
writePrWithoutUrl(existingPrWithoutUrlWorkspace);
writeConstructionState(existingPrWithoutUrlWorkspace);
runExpectFailure(
  ["bun", "run", validator, existingPrWithoutUrlWorkspace, intent],
  "PR 記録が URL を持つ",
);

const prWithMissingTargetReferencesWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(prWithMissingTargetReferencesWorkspace);
writeConstructionTasks(prWithMissingTargetReferencesWorkspace);
writeConstructionNotes(prWithMissingTargetReferencesWorkspace);
writeConstructionTestResults(prWithMissingTargetReferencesWorkspace);
appendTaskGenerationTrace(prWithMissingTargetReferencesWorkspace);
writePrWithUrl(prWithMissingTargetReferencesWorkspace);
writeConstructionState(prWithMissingTargetReferencesWorkspace);
replacePrTargetWithMissingReferences(prWithMissingTargetReferencesWorkspace);
runExpectFailure(
  ["bun", "run", validator, prWithMissingTargetReferencesWorkspace, intent],
  "PR 対象の `ボルト` が一覧内の既存 ID である",
);

const prWithEmptyBoltTargetWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(prWithEmptyBoltTargetWorkspace);
writeConstructionTasks(prWithEmptyBoltTargetWorkspace);
writeConstructionNotes(prWithEmptyBoltTargetWorkspace);
writeConstructionTestResults(prWithEmptyBoltTargetWorkspace);
appendTaskGenerationTrace(prWithEmptyBoltTargetWorkspace);
writePrWithUrl(prWithEmptyBoltTargetWorkspace);
writeConstructionState(prWithEmptyBoltTargetWorkspace);
replacePrTargetWithEmptyBolt(prWithEmptyBoltTargetWorkspace);
runExpectFailure(
  ["bun", "run", validator, prWithEmptyBoltTargetWorkspace, intent],
  "PR 対象の `タスク` が既存 Task を指す",
);

const taskGenerationWithoutFunctionalDesignEvidenceWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(taskGenerationWithoutFunctionalDesignEvidenceWorkspace);
writeConstructionTasks(taskGenerationWithoutFunctionalDesignEvidenceWorkspace);
writeConstructionNotes(taskGenerationWithoutFunctionalDesignEvidenceWorkspace);
writeConstructionTestResults(taskGenerationWithoutFunctionalDesignEvidenceWorkspace);
appendTaskGenerationTrace(taskGenerationWithoutFunctionalDesignEvidenceWorkspace);
writeConstructionState(taskGenerationWithoutFunctionalDesignEvidenceWorkspace, {
  bolts: [
    {
      id: "B001",
      taskGeneration: {
        status: "ready_for_approval",
        evidence: taskGenerationEvidence(bolt1).filter((item) => item.kind !== "functional_design"),
      },
    },
  ],
});
runExpectFailure(
  ["bun", "run", validator, taskGenerationWithoutFunctionalDesignEvidenceWorkspace, intent],
  "Task Generation ready_for_approval は functional_design evidence を持つ",
);

const taskGenerationReadyWithBlockedReasonWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(taskGenerationReadyWithBlockedReasonWorkspace);
writeConstructionTasks(taskGenerationReadyWithBlockedReasonWorkspace);
writeConstructionNotes(taskGenerationReadyWithBlockedReasonWorkspace);
writeConstructionTestResults(taskGenerationReadyWithBlockedReasonWorkspace);
appendTaskGenerationTrace(taskGenerationReadyWithBlockedReasonWorkspace);
writeConstructionState(taskGenerationReadyWithBlockedReasonWorkspace, {
  bolts: [
    {
      id: "B001",
      taskGeneration: {
        status: "ready_for_approval",
        blockedReason: "required_input_missing",
        evidence: taskGenerationEvidence(bolt1),
      },
    },
  ],
});
runExpectFailure(
  ["bun", "run", validator, taskGenerationReadyWithBlockedReasonWorkspace, intent],
  "Task Generation ready_for_approval は blockedReason を持たない",
);

const constructionWithoutTaskGenerationWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(constructionWithoutTaskGenerationWorkspace);
writeConstructionTasks(constructionWithoutTaskGenerationWorkspace);
writeConstructionNotes(constructionWithoutTaskGenerationWorkspace);
writeConstructionTestResults(constructionWithoutTaskGenerationWorkspace);
appendTaskGenerationTrace(constructionWithoutTaskGenerationWorkspace);
writeConstructionState(constructionWithoutTaskGenerationWorkspace, { bolts: [] });
  runExpectFailure(
    ["bun", "run", validator, constructionWithoutTaskGenerationWorkspace, intent],
    "`construction.bolts` が targetBolt の taskGeneration を持つ",
  );

  const constructionWithoutTaskGenerationEvidenceWorkspace = phaseWorkspaceCopy();
  writeFunctionalDesign(constructionWithoutTaskGenerationEvidenceWorkspace);
  writeConstructionTasks(constructionWithoutTaskGenerationEvidenceWorkspace);
  writeConstructionNotes(constructionWithoutTaskGenerationEvidenceWorkspace);
  writeConstructionTestResults(constructionWithoutTaskGenerationEvidenceWorkspace);
  appendTaskGenerationTrace(constructionWithoutTaskGenerationEvidenceWorkspace);
  writeConstructionState(constructionWithoutTaskGenerationEvidenceWorkspace, {
    bolts: [
      {
        id: "B001",
        taskGeneration: {
          status: "ready_for_approval",
          evidence: [
            { kind: "bolt_module", path: `inception/bolts/${bolt1}.md` },
          ],
        },
      },
    ],
  });
  runExpectFailure(
    ["bun", "run", validator, constructionWithoutTaskGenerationEvidenceWorkspace, intent],
    "Task Generation ready_for_approval は functional_design evidence を持つ",
  );

  const constructionReadyWithoutDesignTraceWorkspace = phaseWorkspaceCopy();
writeFunctionalDesign(constructionReadyWithoutDesignTraceWorkspace);
writeConstructionTasks(constructionReadyWithoutDesignTraceWorkspace);
writeConstructionNotes(constructionReadyWithoutDesignTraceWorkspace);
writeConstructionTestResults(constructionReadyWithoutDesignTraceWorkspace);
writeConstructionState(constructionReadyWithoutDesignTraceWorkspace);
runExpectFailure(
  ["bun", "run", validator, constructionReadyWithoutDesignTraceWorkspace, intent],
  "`Task Generation からの追跡` の表がある",
);

console.log("amadeus validator eval: ok");
