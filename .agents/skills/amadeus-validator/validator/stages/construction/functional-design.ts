import { basename } from "node:path";
import { functionalDesignContract } from "../../generated/functional-design-contract";
import {
  type FunctionalDesignStatus,
  deriveFunctionalDesignGateResult,
  functionalDesignUnitStateCombinationIsValid,
} from "../../domain/functional-design-state";
import { type CheckResult, fail, pass } from "../../domain/results";

type StageResult = {
  results: CheckResult[];
  checkedFiles: string[];
};

type FunctionalDesignStageInput = {
  statePath: string;
  value: unknown;
  existingUnitIds: Set<string>;
  unitDirectories: Map<string, string>;
  constructionBase: string;
  intentBase: string;
  fileExists: (path: string) => boolean;
  relativeToIntent: (base: string, path: string) => string;
};

const requirementValues = new Set<string>(functionalDesignContract.requirements);
const statusValues = new Set<string>(functionalDesignContract.statuses);
const frontendSurfaceValues = new Set<string>(functionalDesignContract.frontendSurfaces);
const skipReasonValues = new Set<string>(functionalDesignContract.skipReasons);
const blockedReasonValues = new Set<string>(functionalDesignContract.blockedReasons);
const targetSourceValues = new Set<string>(functionalDesignContract.targetSources);
const runModeValues = new Set<string>(functionalDesignContract.runModes);

export function checkConstructionFunctionalDesignStage(input: FunctionalDesignStageInput): StageResult {
  const results: CheckResult[] = [];
  const checkedFiles: string[] = [];
  const path = input.statePath;
  const value = input.value;
  if (!isObject(value)) {
    results.push(fail(path, "`construction.functionalDesign` がオブジェクトである", typeName(value)));
    return { results, checkedFiles };
  }
  results.push(pass(path, "`construction.functionalDesign` がオブジェクトである", "オブジェクトを確認"));

  for (const key of ["artifacts", "required", "surfaces", "gate"]) {
    if (key in value) results.push(fail(path, `\`construction.functionalDesign.${key}\` を保存しない`, "派生値または成果物契約は state に持たせない"));
    else results.push(pass(path, `\`construction.functionalDesign.${key}\` を保存しない`, "未保存"));
  }

  const targetUnits = value.targetUnits;
  if (!Array.isArray(targetUnits)) {
    results.push(fail(path, "`construction.functionalDesign.targetUnits` が配列である", typeName(targetUnits)));
    return { results, checkedFiles };
  }
  results.push(pass(path, "`construction.functionalDesign.targetUnits` が配列である", `${targetUnits.length}件`));

  const targetUnitSet = new Set<string>();
  for (const item of targetUnits) {
    const unitIdValue = String(item ?? "").trim();
    if (unitIdValue.length === 0) results.push(fail(path, "`construction.functionalDesign.targetUnits[]` が空欄でない", "空欄"));
    else if (targetUnitSet.has(unitIdValue)) results.push(fail(path, "`construction.functionalDesign.targetUnits[]` が重複しない", unitIdValue));
    else {
      targetUnitSet.add(unitIdValue);
      results.push(pass(path, "`construction.functionalDesign.targetUnits[]` が空欄でない", unitIdValue));
      results.push(pass(path, "`construction.functionalDesign.targetUnits[]` が重複しない", unitIdValue));
    }
  }

  const units = value.units;
  if (!Array.isArray(units)) {
    results.push(fail(path, "`construction.functionalDesign.units` が配列である", typeName(units)));
    return { results, checkedFiles };
  }
  results.push(pass(path, "`construction.functionalDesign.units` が配列である", `${units.length}件`));

  const byUnit = new Map<string, Record<string, unknown>>();
  for (const item of units) {
    if (!isObject(item)) {
      results.push(fail(path, "`construction.functionalDesign.units[]` がオブジェクトである", typeName(item)));
      continue;
    }
    results.push(pass(path, "`construction.functionalDesign.units[]` がオブジェクトである", "オブジェクトを確認"));
    const unitIdValue = String(item.unitId ?? "").trim();
    if (unitIdValue.length === 0) {
      results.push(fail(path, "`construction.functionalDesign.units[].unitId` が空欄でない", "空欄"));
    } else {
      if (byUnit.has(unitIdValue)) results.push(fail(path, "`construction.functionalDesign.units[].unitId` が重複しない", unitIdValue));
      else {
        byUnit.set(unitIdValue, item);
        results.push(pass(path, "`construction.functionalDesign.units[].unitId` が重複しない", unitIdValue));
      }
      results.push(pass(path, "`construction.functionalDesign.units[].unitId` が空欄でない", unitIdValue));
      if (input.existingUnitIds.has(unitIdValue) || requirementOf(item) === "unresolved") {
        results.push(pass(path, "`construction.functionalDesign.units[].unitId` が既存 Unit または未解決である", unitIdValue));
      } else {
        results.push(fail(path, "`construction.functionalDesign.units[].unitId` が既存 Unit または未解決である", unitIdValue));
      }
    }

    results.push(checkAllowed(path, "construction.functionalDesign.units[].requirement", item.requirement, requirementValues));
    results.push(checkAllowed(path, "construction.functionalDesign.units[].status", item.status, statusValues));
    results.push(checkAllowed(path, "construction.functionalDesign.units[].frontendSurface", item.frontendSurface, frontendSurfaceValues));
    results.push(checkAllowed(path, "construction.functionalDesign.units[].targetSource", item.targetSource, targetSourceValues));
    results.push(checkAllowed(path, "construction.functionalDesign.units[].runMode", item.runMode, runModeValues));
    if (item.skipReason !== undefined) results.push(checkAllowed(path, "construction.functionalDesign.units[].skipReason", item.skipReason, skipReasonValues));
    if (item.blockedReason !== undefined) results.push(checkAllowed(path, "construction.functionalDesign.units[].blockedReason", item.blockedReason, blockedReasonValues));

    for (const key of ["artifacts", "required", "surfaces", "gate"]) {
      if (key in item) results.push(fail(path, `\`construction.functionalDesign.units[].${key}\` を保存しない`, `${unitIdValue}: 派生値または成果物契約は state に持たせない`));
      else results.push(pass(path, `\`construction.functionalDesign.units[].${key}\` を保存しない`, unitIdValue || "未確認"));
    }

    if (functionalDesignUnitStateCombinationIsValid(item)) {
      results.push(pass(path, "`construction.functionalDesign.units[]` の requirement と status の組み合わせが有効である", unitIdValue || "未確認"));
    } else {
      results.push(fail(path, "`construction.functionalDesign.units[]` の requirement と status の組み合わせが有効である", unitIdValue || "未確認"));
    }

    const status = String(item.status ?? "").trim();
    if (statusValues.has(status)) {
      results.push(pass(path, "`FunctionalDesignGateResult` は status から導出できる", `${unitIdValue || "未確認"}: ${deriveFunctionalDesignGateResult(status as FunctionalDesignStatus)}`));
    }
    if (requirementOf(item) === "required" && (status === "ready_for_approval" || status === "passed")) {
      const artifactResult = checkFunctionalDesignCatalogArtifacts(input, item);
      results.push(...artifactResult.results);
      checkedFiles.push(...artifactResult.checkedFiles);
    }
  }

  for (const unitIdValue of targetUnitSet) {
    const item = byUnit.get(unitIdValue);
    if (!item) {
      results.push(fail(path, "`construction.functionalDesign.targetUnits` が対応する Unit state を持つ", unitIdValue));
      continue;
    }
    results.push(pass(path, "`construction.functionalDesign.targetUnits` が対応する Unit state を持つ", unitIdValue));
    if (input.existingUnitIds.has(unitIdValue) && requirementOf(item) === "required") {
      results.push(pass(path, "対象 Unit の Functional Design requirement が required である", unitIdValue));
    } else if (!input.existingUnitIds.has(unitIdValue) && requirementOf(item) === "unresolved") {
      results.push(pass(path, "未解決 Unit の Functional Design requirement が unresolved である", unitIdValue));
    } else {
      results.push(fail(path, "対象 Unit の Functional Design requirement が required である", `${unitIdValue}: ${String(item.requirement ?? "").trim()}`));
    }
  }

  return { results, checkedFiles };
}

function checkFunctionalDesignCatalogArtifacts(input: FunctionalDesignStageInput, item: Record<string, unknown>): StageResult {
  const unitIdValue = String(item.unitId ?? "").trim();
  const unitDirectory = input.unitDirectories.get(unitIdValue);
  if (!unitDirectory) {
    return {
      results: [fail(input.statePath, "Functional Design ready は Catalog 必須成果物を満たす", `${unitIdValue}: Unit ディレクトリ未解決`)],
      checkedFiles: [],
    };
  }

  const unitName = basename(unitDirectory);
  const artifactPaths = functionalDesignContract.coreArtifacts
    .map((artifact) => `${input.constructionBase}/${unitName}/functional-design/${artifact.fileName}`);
  if (String(item.frontendSurface ?? "").trim() === "present") {
    artifactPaths.push(`${input.constructionBase}/${unitName}/functional-design/${functionalDesignContract.frontendArtifact.fileName}`);
  }

  const results: CheckResult[] = [];
  const checkedFiles: string[] = [];
  for (const artifactPath of artifactPaths) {
    const relativePath = input.relativeToIntent(input.intentBase, artifactPath);
    if (input.fileExists(artifactPath)) {
      checkedFiles.push(artifactPath);
      results.push(pass(input.statePath, "Functional Design ready は Catalog 必須成果物を満たす", `${unitIdValue}: ${relativePath}`));
    } else {
      results.push(fail(input.statePath, "Functional Design ready は Catalog 必須成果物を満たす", `${unitIdValue}: ${relativePath}`));
    }
  }
  return { results, checkedFiles };
}

function requirementOf(item: Record<string, unknown>): string {
  return String(item.requirement ?? "").trim();
}

function checkAllowed(path: string, column: string, actual: unknown, allowed: Set<string>): CheckResult {
  const value = String(actual ?? "").trim();
  if (allowed.has(value)) return pass(path, `\`${column}\` が許可値である`, value);
  return fail(path, `\`${column}\` が許可値である`, value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function typeName(value: unknown): string {
  if (Array.isArray(value)) return "Array";
  if (value === null) return "null";
  return typeof value;
}
