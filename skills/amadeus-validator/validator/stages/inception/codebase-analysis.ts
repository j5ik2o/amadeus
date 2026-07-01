import { dirname } from "node:path";
import { type PhaseValidationContext } from "../../phases/types";

const requirementValues = new Set(["required", "not_required", "unresolved"]);
const statusValues = new Set(["not_started", "in_progress", "ready_for_approval", "passed", "failed", "skipped", "blocked", "stale"]);
const skipReasonValues = new Set(["greenfield", "no_existing_code", "not_in_scope"]);
const blockedReasonValues = new Set(["target_scope_unresolved", "required_input_missing", "analysis_conflict"]);
const freshnessValues = new Set(["current", "stale", "unknown"]);

export function checkInceptionCodebaseAnalysisStage(
  context: PhaseValidationContext,
  input: { inceptionBase: string; state: Record<string, any> },
): void {
  const statePath = `${dirname(input.inceptionBase)}/state.json`;
  const value = input.state.inception?.codebaseAnalysis;
  if (value === undefined) {
    context.failRow(statePath, "`inception.codebaseAnalysis` がオブジェクトである", "未定義");
    context.checkCodebaseAnalysis(input.inceptionBase, input.state);
    return;
  }
  if (!context.isObject(value)) {
    context.failRow(statePath, "`inception.codebaseAnalysis` がオブジェクトである", context.typeName(value));
    context.checkCodebaseAnalysis(input.inceptionBase, input.state);
    return;
  }

  context.pass(statePath, "`inception.codebaseAnalysis` がオブジェクトである", "オブジェクトを確認");
  context.checkAllowed(statePath, "inception.codebaseAnalysis.requirement", value.requirement, requirementValues);
  context.checkAllowed(statePath, "inception.codebaseAnalysis.status", value.status, statusValues);
  if (value.skipReason !== undefined) {
    context.checkAllowed(statePath, "inception.codebaseAnalysis.skipReason", value.skipReason, skipReasonValues);
  }
  if (value.blockedReason !== undefined) {
    context.checkAllowed(statePath, "inception.codebaseAnalysis.blockedReason", value.blockedReason, blockedReasonValues);
  }
  if (value.freshness !== undefined) {
    context.checkAllowed(statePath, "inception.codebaseAnalysis.freshness", value.freshness, freshnessValues);
  }

  checkCodebaseAnalysisEvidence(context, statePath, dirname(input.inceptionBase), value);
  checkCodebaseAnalysisTargetScope(context, statePath, value);
  checkCodebaseAnalysisStateMatrix(context, statePath, input.state, value);
  context.checkCodebaseAnalysis(input.inceptionBase, input.state);
}

function checkCodebaseAnalysisEvidence(context: PhaseValidationContext, path: string, intentBase: string, value: Record<string, any>): void {
  if (!Array.isArray(value.evidence)) {
    context.failRow(path, "`inception.codebaseAnalysis.evidence` が配列である", context.typeName(value.evidence));
    return;
  }
  context.pass(path, "`inception.codebaseAnalysis.evidence` が配列である", `${value.evidence.length}件`);
  for (const item of value.evidence) {
    if (!context.isObject(item)) {
      context.failRow(path, "`inception.codebaseAnalysis.evidence[].kind` がある", context.typeName(item));
      continue;
    }
    const kind = String(item.kind ?? "").trim();
    const reference = codebaseAnalysisEvidenceReference(item);
    if (kind) context.pass(path, "`inception.codebaseAnalysis.evidence[].kind` がある", kind);
    else context.failRow(path, "`inception.codebaseAnalysis.evidence[].kind` がある", "空欄");
    if (reference) context.pass(path, "`inception.codebaseAnalysis.evidence[]` は参照先を持つ", `${kind}: ${reference}`);
    else context.failRow(path, "`inception.codebaseAnalysis.evidence[]` は参照先を持つ", kind || "kindなし");
    checkCodebaseAnalysisEvidencePath(context, path, intentBase, kind, item.path);
  }
}

function codebaseAnalysisEvidenceReference(item: Record<string, any>): string {
  for (const key of ["path", "url", "ref", "id"]) {
    const value = String(item[key] ?? "").trim();
    if (value) return value;
  }
  return "";
}

function checkCodebaseAnalysisEvidencePath(
  context: PhaseValidationContext,
  path: string,
  intentBase: string,
  kind: string,
  value: unknown,
): void {
  const evidencePath = String(value ?? "").trim();
  if (!evidencePath) return;
  if (evidencePath.startsWith("/") || evidencePath.startsWith("../") || evidencePath.includes("/../")) {
    context.failRow(path, "`inception.codebaseAnalysis.evidence[].path` が相対パスである", `${kind}: ${evidencePath}`);
    return;
  }
  context.pass(path, "`inception.codebaseAnalysis.evidence[].path` が相対パスである", `${kind}: ${evidencePath}`);
  if (!evidencePath.startsWith("inception/") && !evidencePath.startsWith("construction/")) return;
  if (context.isFile(`${intentBase}/${evidencePath}`)) {
    context.pass(path, "`inception.codebaseAnalysis.evidence[].path` が Intent 成果物を指す", evidencePath);
  } else {
    context.failRow(path, "`inception.codebaseAnalysis.evidence[].path` が Intent 成果物を指す", `${evidencePath} が存在しない`);
  }
}

function checkCodebaseAnalysisTargetScope(context: PhaseValidationContext, path: string, value: Record<string, any>): void {
  if (!Array.isArray(value.targetScope)) {
    context.failRow(path, "`inception.codebaseAnalysis.targetScope` が配列である", context.typeName(value.targetScope));
    return;
  }
  context.pass(path, "`inception.codebaseAnalysis.targetScope` が配列である", `${value.targetScope.length}件`);
}

function checkCodebaseAnalysisStateMatrix(context: PhaseValidationContext, path: string, state: Record<string, any>, value: Record<string, any>): void {
  const requirement = String(value.requirement ?? "").trim();
  const status = String(value.status ?? "").trim();
  checkRequiredCodebaseAnalysisState(context, path, value, requirement, status);
  checkNotRequiredCodebaseAnalysisState(context, path, value, requirement, status);
  checkUnresolvedCodebaseAnalysisState(context, path, requirement, status);
  checkBlockedCodebaseAnalysisState(context, path, value, status);
  checkGatePassedCodebaseAnalysisState(context, path, state, requirement, status);
}

function checkRequiredCodebaseAnalysisState(
  context: PhaseValidationContext,
  path: string,
  value: Record<string, any>,
  requirement: string,
  status: string,
): void {
  const hasEvidence = Array.isArray(value.evidence) && value.evidence.length > 0;
  const targetScopeCount = Array.isArray(value.targetScope) ? value.targetScope.length : 0;

  if (requirement === "required" && (status === "passed" || status === "ready_for_approval")) {
    if (hasEvidence) context.pass(path, "required の Codebase Analysis は evidence を持つ", `${value.evidence.length}件`);
    else context.failRow(path, "required の Codebase Analysis は evidence を持つ", "0件");
    if (targetScopeCount > 0) context.pass(path, "required の Codebase Analysis は targetScope を持つ", `${targetScopeCount}件`);
    else context.failRow(path, "required の Codebase Analysis は targetScope を持つ", "0件");
  }
  if (requirement === "required" && status === "skipped") {
    context.failRow(path, "required の Codebase Analysis は skipped ではない", status);
  }
}

function checkNotRequiredCodebaseAnalysisState(
  context: PhaseValidationContext,
  path: string,
  value: Record<string, any>,
  requirement: string,
  status: string,
): void {
  if (requirement === "not_required") {
    if (status === "skipped") context.pass(path, "not_required の Codebase Analysis は skipped である", status);
    else context.failRow(path, "not_required の Codebase Analysis は skipped である", status || "空欄");
    if (String(value.skipReason ?? "").trim()) context.pass(path, "not_required の Codebase Analysis は skipReason を持つ", String(value.skipReason));
    else context.failRow(path, "not_required の Codebase Analysis は skipReason を持つ", "空欄");
  }
}

function checkUnresolvedCodebaseAnalysisState(context: PhaseValidationContext, path: string, requirement: string, status: string): void {
  if (requirement === "unresolved" && status !== "blocked" && status !== "not_started" && status !== "in_progress") {
    context.failRow(path, "unresolved の Codebase Analysis は未解決状態である", status || "空欄");
  }
}

function checkBlockedCodebaseAnalysisState(context: PhaseValidationContext, path: string, value: Record<string, any>, status: string): void {
  if (status === "blocked") {
    if (String(value.blockedReason ?? "").trim()) context.pass(path, "blocked の Codebase Analysis は blockedReason を持つ", String(value.blockedReason));
    else context.failRow(path, "blocked の Codebase Analysis は blockedReason を持つ", "空欄");
  }
}

function checkGatePassedCodebaseAnalysisState(
  context: PhaseValidationContext,
  path: string,
  state: Record<string, any>,
  requirement: string,
  status: string,
): void {
  const gatePassed = String(state.inception?.gate ?? "").trim() === "passed";
  if (gatePassed && requirement === "required" && status !== "passed") {
    context.failRow(path, "Inception gate passed の required Codebase Analysis は passed である", status || "空欄");
  }
}
