import { dirname } from "node:path";
import { checkConstructionBoltPreparationStage } from "../stages/construction/bolt-preparation";
import { checkConstructionFunctionalDesignStage } from "../stages/construction/functional-design";
import { type PhaseValidationContext } from "./types";

export function checkConstructionPhase(
  context: PhaseValidationContext,
  input: { base: string; state: Record<string, any> },
): void {
  const statePath = `${input.base}/state.json`;
  const inceptionBase = `${input.base}/inception`;
  const constructionBase = `${input.base}/construction`;
  checkConstructionStateJson(context, statePath, input.state);
  context.checkGrillings(constructionBase);

  context.checkRequirements(`${inceptionBase}/requirements.md`);
  context.checkAcceptance(`${inceptionBase}/acceptance.md`, `${inceptionBase}/requirements.md`);
  context.checkCodebaseAnalysis(inceptionBase, input.state);
  context.checkNoInceptionDomainArtifacts(inceptionBase);

  for (const [filename, spec] of Object.entries(context.indexSpecs)) {
    const path = `${inceptionBase}/${filename}`;
    if (filename === "decisions.md" || filename === "units.md" || filename === "bolts.md" || filename === "user-stories.md" || filename === "use-cases.md") {
      if (context.isFile(path)) context.checkOptionalIndex(path, spec);
    }
  }
  context.checkUnitContextReferences(
    inceptionBase,
    true,
    ".amadeus/domain-map.md",
    "Unit のコンテキストが Domain Map の adopted Bounded Context を参照する",
    ["inception", "construction"],
  );

  context.checkUnitDesignArtifacts(inceptionBase, input.state);
  context.checkBoltDesignReferences(inceptionBase);
  context.checkNoInceptionBoltDesignBriefArtifacts(inceptionBase, input.state);
  context.checkTraceability(`${inceptionBase}/traceability.md`);
  context.checkFile(`${constructionBase}/traceability.md`, "Construction 追跡ファイルが存在する");
  context.checkOptionalIndex(`${constructionBase}/decisions.md`, context.indexSpecs["decisions.md"]);
  context.checkTaskGenerationTraceability(`${constructionBase}/traceability.md`, input.state);
  context.checkConstructionTraceability(`${constructionBase}/traceability.md`, input.state);
  context.checkConstructionBoltArtifacts(inceptionBase, constructionBase, input.state);
}

function checkConstructionStateJson(context: PhaseValidationContext, path: string, state: Record<string, any>): void {
  context.checkJsonValue(path, "intent", state.intent, context.intentId ?? "");
  context.checkJsonValue(path, "phase", state.phase, "construction");
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
  context.checkJsonValue(path, "inception.status", inception.status, "completed");
  context.checkJsonValue(path, "inception.gate", inception.gate, "passed");

  const construction = state.construction;
  if (!context.isObject(construction)) {
    context.failRow(path, "`construction` がオブジェクトである", context.typeName(construction));
    return;
  }
  context.pass(path, "`construction` がオブジェクトである", "オブジェクトを確認");
  context.checkAllowed(path, "construction.status", construction.status, context.statusValues);
  context.checkAllowed(path, "construction.gate", construction.gate, context.gateValues);
  context.checkStatePaths(path, construction, "requiredArtifacts", "Construction 必須成果物が存在する", false, "construction");
  context.checkRequiredStatePath(path, construction, "requiredArtifacts", "construction/decisions.md", "Construction 必須成果物に判断一覧が含まれる");
  context.checkStatePaths(path, construction, "requiredBoltArtifacts", "Construction 必須 Bolt 成果物が存在する", false, "construction");
  checkTargetBolts(context, path, construction);
  checkConstructionFunctionalDesignState(context, path, construction);
  const boltPreparation = checkConstructionBoltPreparationStage({
    statePath: path,
    construction,
    typeName: context.typeName,
    isObject: context.isObject,
    inceptionBaseForStatePath: context.inceptionBaseForStatePath,
    constructionBaseForStatePath: context.constructionBaseForStatePath,
    constructionBoltDirectories: context.constructionBoltDirectories,
    relativeToIntent: context.relativeToIntent,
    fileExists: context.isFile,
  });
  context.recordCheckResults(boltPreparation.results);
  context.recordCheckedFiles(boltPreparation.checkedFiles);

  if (String(state.status ?? "").trim() === "completed") {
    context.checkJsonValue(path, "construction.status", construction.status, "completed");
    context.checkJsonValue(path, "construction.gate", construction.gate, "passed");
  }
}

function checkTargetBolts(context: PhaseValidationContext, path: string, construction: Record<string, any>): void {
  const values = construction.targetBolts;
  if (!Array.isArray(values)) {
    context.failRow(path, "`construction.targetBolts` が配列である", context.typeName(values));
    return;
  }

  context.pass(path, "`construction.targetBolts` が配列である", `${values.length}件`);
  const inceptionBase = context.inceptionBaseForStatePath(path);
  const boltIds = context.idsFor(`${inceptionBase}/bolts.md`);
  let existingBoltCount = 0;
  for (const value of values) {
    const boltId = String(value ?? "").trim();
    if (boltIds.has(boltId)) {
      existingBoltCount += 1;
      context.pass(path, "`construction.targetBolts` が既存 Bolt を参照する", boltId);
    } else {
      context.failRow(path, "`construction.targetBolts` が既存 Bolt を参照する", boltId);
    }
  }
  if (existingBoltCount > 0) context.pass(path, "`construction.targetBolts` が1件以上の既存 Bolt を持つ", `${existingBoltCount}件`);
  else context.failRow(path, "`construction.targetBolts` が1件以上の既存 Bolt を持つ", `${values.length}件`);
}

function checkConstructionFunctionalDesignState(context: PhaseValidationContext, path: string, construction: Record<string, any>): void {
  const inceptionBase = context.inceptionBaseForStatePath(path);
  const constructionBase = context.constructionBaseForStatePath(path);
  const existingUnitIds = context.idsFor(`${inceptionBase}/units.md`);
  const result = checkConstructionFunctionalDesignStage({
    statePath: path,
    value: construction.functionalDesign,
    existingUnitIds,
    unitDirectories: context.unitDirectories(inceptionBase, existingUnitIds),
    constructionBase,
    intentBase: dirname(path),
    fileExists: context.isFile,
    relativeToIntent: context.relativeToIntent,
  });
  context.recordCheckResults(result.results);
  context.recordCheckedFiles(result.checkedFiles);
}
