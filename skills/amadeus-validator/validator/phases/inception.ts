import { checkInceptionRequirementsDefinitionStage } from "../stages/inception/requirements-definition";
import { checkInceptionUserStoriesStage } from "../stages/inception/user-stories";
import { checkInceptionUseCasesStage } from "../stages/inception/use-cases";
import { checkInceptionUnitsGenerationStage } from "../stages/inception/units-generation";
import { type PhaseValidationContext } from "./types";

export function checkInceptionPhase(
  context: PhaseValidationContext,
  input: { base: string; state: Record<string, any> },
): void {
  const statePath = `${input.base}/state.json`;
  const inceptionBase = `${input.base}/inception`;
  checkInceptionStateJson(context, statePath, input.state);
  context.checkGrillings(inceptionBase);

  checkInceptionRequirementsDefinitionStage(context, { inceptionBase, state: input.state });
  const requireDomainBoundary = String(input.state.inception?.gate ?? "").trim() === "passed";
  context.checkNoInceptionDomainArtifacts(inceptionBase);
  checkInceptionUserStoriesStage(context, { inceptionBase });
  checkInceptionUseCasesStage(context, { inceptionBase });
  checkInceptionUnitsGenerationStage(context, { inceptionBase, state: input.state, requireDomainBoundary });
  context.checkNoInceptionConstructionArtifacts(input.base);
  context.checkTraceability(`${inceptionBase}/traceability.md`);
}

function checkInceptionStateJson(context: PhaseValidationContext, path: string, state: Record<string, any>): void {
  context.checkJsonValue(path, "intent", state.intent, context.intentId ?? "");
  context.checkJsonValue(path, "phase", state.phase, "inception");
  context.checkAllowed(path, "status", state.status, context.statusValues);

  const ideation = state.ideation;
  if (!context.isObject(ideation)) {
    context.failRow(path, "`ideation` がオブジェクトである", context.typeName(ideation));
    return;
  }
  context.pass(path, "`ideation` がオブジェクトである", "オブジェクトを確認");
  context.checkJsonValue(path, "ideation.status", ideation.status, "completed");
  context.checkJsonValue(path, "ideation.gate", ideation.gate, "passed");
  context.checkIntentCaptureState(path, ideation.intentCapture);

  const inception = state.inception;
  if (!context.isObject(inception)) {
    context.failRow(path, "`inception` がオブジェクトである", context.typeName(inception));
    return;
  }
  context.pass(path, "`inception` がオブジェクトである", "オブジェクトを確認");
  context.checkAllowed(path, "inception.status", inception.status, context.statusValues);
  context.checkAllowed(path, "inception.gate", inception.gate, context.gateValues);
  context.checkStatePaths(path, inception, "requiredArtifacts", "Inception 必須成果物が存在する", false, "inception");
  context.checkStatePaths(path, inception, "requiredRequirementArtifacts", "Inception 必須 Requirement 成果物が存在する", false, "inception");
  context.checkStatePaths(path, inception, "requiredStoryArtifacts", "Inception Story 成果物が存在する", false, "inception");
  context.checkStatePaths(path, inception, "requiredUseCaseArtifacts", "Inception 必須 Use Case 成果物が存在する", false, "inception");
  context.checkStatePaths(path, inception, "requiredDecisionArtifacts", "Inception 必須 Decision 成果物が存在する", false, "inception");
  context.checkStatePaths(path, inception, "requiredBoltArtifacts", "Inception 必須 Bolt 成果物が存在する", false, "inception");

  if (String(state.status ?? "").trim() === "completed") {
    context.checkJsonValue(path, "inception.status", inception.status, "completed");
    context.checkJsonValue(path, "inception.gate", inception.gate, "passed");
  }
}
