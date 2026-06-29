import { functionalDesignContract } from "../generated/functional-design-contract";
import { type UnitId, unitId } from "./primitives";
import { type CheckResult, type ParseResult, fail, pass } from "./results";

export type FunctionalDesignRequirement = (typeof functionalDesignContract.requirements)[number];
export type FunctionalDesignStatus = (typeof functionalDesignContract.statuses)[number];
export type FunctionalDesignGateResult = (typeof functionalDesignContract.gateResultByStatus)[FunctionalDesignStatus];
export type FunctionalDesignFrontendSurface = (typeof functionalDesignContract.frontendSurfaces)[number];
export type FunctionalDesignSkipReason = (typeof functionalDesignContract.skipReasons)[number];
export type FunctionalDesignBlockedReason = (typeof functionalDesignContract.blockedReasons)[number];
export type FunctionalDesignTargetSource = (typeof functionalDesignContract.targetSources)[number];
export type FunctionalDesignRunMode = (typeof functionalDesignContract.runModes)[number];

export type FunctionalDesignUnitState = {
  unitId: UnitId;
  requirement: FunctionalDesignRequirement;
  status: FunctionalDesignStatus;
  frontendSurface: FunctionalDesignFrontendSurface;
  targetSource: FunctionalDesignTargetSource;
  runMode: FunctionalDesignRunMode;
  skipReason?: FunctionalDesignSkipReason;
  blockedReason?: FunctionalDesignBlockedReason;
};

export type ConstructionFunctionalDesignState = {
  targetUnits: UnitId[];
  units: FunctionalDesignUnitState[];
};

type UnitStateLike = {
  requirement?: unknown;
  status?: unknown;
  frontendSurface?: unknown;
  skipReason?: unknown;
  blockedReason?: unknown;
};

const requirementValues = new Set<string>(functionalDesignContract.requirements);
const statusValues = new Set<string>(functionalDesignContract.statuses);
const frontendSurfaceValues = new Set<string>(functionalDesignContract.frontendSurfaces);
const requiredBlockedReasonValues = new Set<string>(functionalDesignContract.requiredBlockedReasons);

export function parseConstructionFunctionalDesignState(target: string, value: unknown): ParseResult<ConstructionFunctionalDesignState> {
  const results: CheckResult[] = [];
  if (!isObject(value)) {
    results.push(fail(target, "`construction.functionalDesign` がオブジェクトである", typeName(value)));
    return { document: { targetUnits: [], units: [] }, results };
  }
  results.push(pass(target, "`construction.functionalDesign` がオブジェクトである", "オブジェクトを確認"));

  const targetUnits = parseUnitIdArray(target, "`construction.functionalDesign.targetUnits`", value.targetUnits, results);
  const units: FunctionalDesignUnitState[] = [];
  if (!Array.isArray(value.units)) {
    results.push(fail(target, "`construction.functionalDesign.units` が配列である", typeName(value.units)));
    return { document: { targetUnits, units }, results };
  }
  results.push(pass(target, "`construction.functionalDesign.units` が配列である", `${value.units.length}件`));

  for (const item of value.units) {
    if (!isObject(item)) {
      results.push(fail(target, "`construction.functionalDesign.units[]` がオブジェクトである", typeName(item)));
      continue;
    }
    results.push(pass(target, "`construction.functionalDesign.units[]` がオブジェクトである", "オブジェクトを確認"));
    const parsed = parseFunctionalDesignUnitState(target, item, results);
    if (parsed) units.push(parsed);
  }

  return { document: { targetUnits, units }, results };
}

export function deriveFunctionalDesignGateResult(status: FunctionalDesignStatus): FunctionalDesignGateResult {
  return functionalDesignContract.gateResultByStatus[status];
}

export function functionalDesignUnitStateCombinationIsValid(item: UnitStateLike): boolean {
  const requirement = String(item.requirement ?? "").trim();
  const status = String(item.status ?? "").trim();
  const frontendSurface = String(item.frontendSurface ?? "").trim();
  const skipReason = String(item.skipReason ?? "").trim();
  const blockedReason = String(item.blockedReason ?? "").trim();

  if (!requirementValues.has(requirement)) return false;
  if (!statusValues.has(status)) return false;
  if (!frontendSurfaceValues.has(frontendSurface)) return false;

  if (requirement === "required") {
    if (skipReason.length > 0) return false;
    if (status === "skipped") return false;
    if (blockedReason === "target_unit_unresolved") return false;
    if (frontendSurface === "unresolved") return status === "blocked" && blockedReason === "frontend_surface_unresolved";
    if (status === "blocked") return requiredBlockedReasonValues.has(blockedReason);
    return ["not_started", "in_progress", "ready_for_approval", "passed", "failed"].includes(status) && blockedReason.length === 0;
  }

  if (requirement === "not_required") {
    return status === "skipped" && skipReason === "unit_not_in_construction_scope" && blockedReason.length === 0;
  }

  return status === "blocked" && blockedReason === "target_unit_unresolved" && skipReason.length === 0;
}

function parseFunctionalDesignUnitState(
  target: string,
  item: Record<string, unknown>,
  results: CheckResult[],
): FunctionalDesignUnitState | undefined {
  const parsedUnitId = parseUnitId(target, "`construction.functionalDesign.units[].unitId`", item.unitId, results);
  const requirement = parseAllowed(target, "construction.functionalDesign.units[].requirement", item.requirement, functionalDesignContract.requirements, results);
  const status = parseAllowed(target, "construction.functionalDesign.units[].status", item.status, functionalDesignContract.statuses, results);
  const frontendSurface = parseAllowed(target, "construction.functionalDesign.units[].frontendSurface", item.frontendSurface, functionalDesignContract.frontendSurfaces, results);
  const targetSource = parseAllowed(target, "construction.functionalDesign.units[].targetSource", item.targetSource, functionalDesignContract.targetSources, results);
  const runMode = parseAllowed(target, "construction.functionalDesign.units[].runMode", item.runMode, functionalDesignContract.runModes, results);
  const skipReason = item.skipReason === undefined
    ? undefined
    : parseAllowed(target, "construction.functionalDesign.units[].skipReason", item.skipReason, functionalDesignContract.skipReasons, results);
  const blockedReason = item.blockedReason === undefined
    ? undefined
    : parseAllowed(target, "construction.functionalDesign.units[].blockedReason", item.blockedReason, functionalDesignContract.blockedReasons, results);

  if (functionalDesignUnitStateCombinationIsValid(item)) {
    results.push(pass(target, "`construction.functionalDesign.units[]` の requirement と status の組み合わせが有効である", parsedUnitId?.value ?? "未確認"));
  } else {
    results.push(fail(target, "`construction.functionalDesign.units[]` の requirement と status の組み合わせが有効である", parsedUnitId?.value ?? "未確認"));
  }

  if (!parsedUnitId || !requirement || !status || !frontendSurface || !targetSource || !runMode) return undefined;
  return {
    unitId: parsedUnitId,
    requirement,
    status,
    frontendSurface,
    targetSource,
    runMode,
    ...(skipReason ? { skipReason } : {}),
    ...(blockedReason ? { blockedReason } : {}),
  };
}

function parseUnitIdArray(target: string, condition: string, value: unknown, results: CheckResult[]): UnitId[] {
  if (!Array.isArray(value)) {
    results.push(fail(target, `${condition} が配列である`, typeName(value)));
    return [];
  }
  results.push(pass(target, `${condition} が配列である`, `${value.length}件`));
  return value.map((item) => parseUnitId(target, `${condition}[]`, item, results)).filter((item): item is UnitId => Boolean(item));
}

function parseUnitId(target: string, condition: string, value: unknown, results: CheckResult[]): UnitId | undefined {
  try {
    const parsed = unitId(String(value ?? ""));
    results.push(pass(target, `${condition} が UnitId である`, parsed.value));
    return parsed;
  } catch (error) {
    results.push(fail(target, `${condition} が UnitId である`, error instanceof Error ? error.message : String(error)));
    return undefined;
  }
}

function parseAllowed<const TAllowed extends readonly string[]>(
  target: string,
  field: string,
  actual: unknown,
  allowed: TAllowed,
  results: CheckResult[],
): TAllowed[number] | undefined {
  const value = String(actual ?? "").trim();
  if (allowed.includes(value)) {
    results.push(pass(target, `\`${field}\` が許可値である`, value));
    return value as TAllowed[number];
  }
  results.push(fail(target, `\`${field}\` が許可値である`, value));
  return undefined;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function typeName(value: unknown): string {
  if (Array.isArray(value)) return "Array";
  if (value === null) return "null";
  return typeof value;
}
