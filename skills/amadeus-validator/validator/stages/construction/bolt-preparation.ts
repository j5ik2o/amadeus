import { dirname } from "node:path";
import { taskGenerationContract } from "../../generated/task-generation-contract";
import { type CheckResult, fail, pass } from "../../domain/results";

type StageResult = {
  results: CheckResult[];
  checkedFiles: string[];
};

type BoltPreparationStageInput = {
  statePath: string;
  construction: Record<string, any>;
  typeName: (value: unknown) => string;
  isObject: (value: unknown) => value is Record<string, any>;
  inceptionBaseForStatePath: (path: string) => string;
  constructionBaseForStatePath: (path: string) => string;
  constructionBoltDirectories: (inceptionBase: string, constructionBase: string) => Map<string, string>;
  relativeToIntent: (intentBase: string, artifactPath: string) => string;
  fileExists: (artifactPath: string) => boolean;
};

const taskGenerationStatusValues = new Set<string>(taskGenerationContract.statuses);
const taskGenerationBlockedReasonValues = new Set<string>(taskGenerationContract.blockedReasons);
const taskGenerationEvidenceKindValues = new Set<string>(taskGenerationContract.evidenceKinds);
const taskGenerationStateMatrixByStatus = new Map<string, {
  requiredEvidenceKinds: readonly string[];
  evidence: "forbidden" | "optional" | "required";
  blockedReason: "forbidden" | "optional" | "required";
}>(taskGenerationContract.allowedStateMatrix.map((item) => [item.status, item]));

export function checkConstructionBoltPreparationStage(input: BoltPreparationStageInput): StageResult {
  const taskGeneration = checkConstructionBoltTaskGeneration(input);
  return {
    results: [
      ...taskGeneration.results,
      ...checkTargetBoltRequiredArtifacts(input),
    ],
    checkedFiles: taskGeneration.checkedFiles,
  };
}

function checkConstructionBoltTaskGeneration(input: BoltPreparationStageInput): StageResult {
  const path = input.statePath;
  const construction = input.construction;
  const targetBolts = construction.targetBolts;
  if (!Array.isArray(targetBolts)) return { results: [], checkedFiles: [] };

  const results: CheckResult[] = [];
  const checkedFiles: string[] = [];
  const values = construction.bolts;
  if (!Array.isArray(values)) {
    results.push(fail(path, "`construction.bolts` が配列である", input.typeName(values)));
    return { results, checkedFiles };
  }
  results.push(pass(path, "`construction.bolts` が配列である", `${values.length}件`));

  const intentBase = dirname(path);
  const inceptionBase = input.inceptionBaseForStatePath(path);
  const constructionBase = input.constructionBaseForStatePath(path);
  const boltDirectories = input.constructionBoltDirectories(inceptionBase, constructionBase);
  const byId = new Map<string, Record<string, any>>();
  for (const item of values) {
    if (!input.isObject(item)) {
      results.push(fail(path, "`construction.bolts[]` がオブジェクトである", input.typeName(item)));
      continue;
    }
    const id = String(item.id ?? "").trim();
    if (id.length === 0) {
      results.push(fail(path, "`construction.bolts[].id` が空欄でない", "空欄"));
      continue;
    }
    byId.set(id, item);
  }

  for (const value of targetBolts) {
    const boltId = String(value ?? "").trim();
    const item = byId.get(boltId);
    if (!item) {
      results.push(fail(path, "`construction.bolts` が targetBolt の taskGeneration を持つ", boltId));
      continue;
    }
    results.push(pass(path, "`construction.bolts` が targetBolt の taskGeneration を持つ", boltId));

    if (input.isObject(item.designGate)) {
      results.push(fail(path, "`construction.bolts[].designGate` を残さない", boltId));
    } else {
      results.push(pass(path, "`construction.bolts[].designGate` を残さない", boltId));
    }
    if (input.isObject(item.tasks)) {
      results.push(fail(path, "`construction.bolts[].tasks` を状態契約に残さない", boltId));
    } else {
      results.push(pass(path, "`construction.bolts[].tasks` を状態契約に残さない", boltId));
    }

    const taskGeneration = item.taskGeneration;
    if (!input.isObject(taskGeneration)) {
      results.push(fail(path, "`construction.bolts[].taskGeneration` がオブジェクトである", `${boltId}: ${input.typeName(taskGeneration)}`));
      continue;
    }
    results.push(pass(path, "`construction.bolts[].taskGeneration` がオブジェクトである", boltId));
    const status = String(taskGeneration.status ?? "").trim();
    results.push(checkAllowed(path, "construction.bolts[].taskGeneration.status", status, taskGenerationStatusValues));

    const blockedReason = String(taskGeneration.blockedReason ?? "").trim();
    if (blockedReason.length > 0) results.push(checkAllowed(path, "construction.bolts[].taskGeneration.blockedReason", blockedReason, taskGenerationBlockedReasonValues));

    const evidenceValues = Array.isArray(taskGeneration.evidence) ? taskGeneration.evidence : [];
    if (Array.isArray(taskGeneration.evidence)) {
      results.push(pass(path, "`construction.bolts[].taskGeneration.evidence` が配列である", `${boltId}: ${evidenceValues.length}件`));
    } else {
      results.push(fail(path, "`construction.bolts[].taskGeneration.evidence` が配列である", `${boltId}: ${input.typeName(taskGeneration.evidence)}`));
    }

    const evidenceByKind = new Map<string, string[]>();
    for (const evidence of evidenceValues) {
      if (!input.isObject(evidence)) {
        results.push(fail(path, "Task Generation evidence がオブジェクトである", `${boltId}: ${input.typeName(evidence)}`));
        continue;
      }
      const kind = String(evidence.kind ?? "").trim();
      const evidencePath = String(evidence.path ?? "").trim();
      results.push(checkAllowed(path, "Task Generation evidence kind", kind, taskGenerationEvidenceKindValues));
      if (evidencePath.length === 0) {
        results.push(fail(path, "Task Generation evidence.path が空欄でない", `${boltId}: ${kind}`));
      } else {
        results.push(pass(path, "Task Generation evidence.path が空欄でない", `${boltId}: ${kind}: ${evidencePath}`));
        if (evidencePath.includes("/../") || evidencePath.startsWith("/") || !evidencePath.startsWith("inception/") && !evidencePath.startsWith("construction/")) {
          results.push(fail(path, "Task Generation evidence.path が Intent 内相対パスである", `${boltId}: ${evidencePath}`));
        } else {
          results.push(pass(path, "Task Generation evidence.path が Intent 内相対パスである", `${boltId}: ${evidencePath}`));
        }
        if (evidencePath.endsWith("/design.md") && evidencePath.includes("construction/bolts/")) {
          results.push(fail(path, "Task Generation evidence は Bolt 側 design.md を指さない", `${boltId}: ${evidencePath}`));
        } else {
          results.push(pass(path, "Task Generation evidence は Bolt 側 design.md を指さない", `${boltId}: ${evidencePath}`));
        }
        const evidenceArtifactPath = `${intentBase}/${evidencePath}`;
        if (input.fileExists(evidenceArtifactPath)) {
          checkedFiles.push(evidenceArtifactPath);
          results.push(pass(path, "Task Generation evidence が存在する", evidencePath));
        } else {
          results.push(fail(path, "Task Generation evidence が存在する", `${evidencePath} が存在しない`));
        }
      }
      if (!evidenceByKind.has(kind)) evidenceByKind.set(kind, []);
      evidenceByKind.get(kind)?.push(evidencePath);
    }

    checkTaskGenerationStateMatrix(results, path, {
      boltId,
      status,
      blockedReason,
      evidenceCount: evidenceValues.length,
      evidenceByKind,
    });

    const boltDir = boltDirectories.get(boltId);
    const expectedTaskEvidence = boltDir ? input.relativeToIntent(intentBase, `${boltDir}/tasks.md`) : "";
    if ((status === "ready_for_approval" || status === "passed") && expectedTaskEvidence.length > 0) {
      const taskEvidence = evidenceByKind.get("tasks") ?? [];
      if (taskEvidence.includes(expectedTaskEvidence)) {
        results.push(pass(path, "Task Generation tasks evidence が対象 tasks.md を指す", `${boltId}: ${expectedTaskEvidence}`));
      } else {
        results.push(fail(path, "Task Generation tasks evidence が対象 tasks.md を指す", `${boltId}: ${taskEvidence.join(", ") || "空欄"}`));
      }
    }
  }
  return { results, checkedFiles };
}

function checkTargetBoltRequiredArtifacts(input: BoltPreparationStageInput): CheckResult[] {
  const path = input.statePath;
  const construction = input.construction;
  const targetBolts = construction.targetBolts;
  const requiredBoltArtifacts = construction.requiredBoltArtifacts;
  if (!Array.isArray(targetBolts) || !Array.isArray(requiredBoltArtifacts)) return [];

  const results: CheckResult[] = [];
  const intentBase = dirname(path);
  const inceptionBase = input.inceptionBaseForStatePath(path);
  const constructionBase = input.constructionBaseForStatePath(path);
  const required = new Set(requiredBoltArtifacts.map((value: unknown) => String(value ?? "").trim()));
  const boltDirectories = input.constructionBoltDirectories(inceptionBase, constructionBase);
  const taskGenerationStatuses = new Map<string, string>();
  if (Array.isArray(construction.bolts)) {
    for (const item of construction.bolts) {
      if (!input.isObject(item) || !input.isObject(item.taskGeneration)) continue;
      const id = String(item.id ?? "").trim();
      if (id.length === 0) continue;
      taskGenerationStatuses.set(id, String(item.taskGeneration.status ?? "").trim());
    }
  }
  const requiresTestResults =
    String(construction.status ?? "").trim() === "completed" || String(construction.gate ?? "").trim() === "passed";
  for (const value of targetBolts) {
    const boltId = String(value ?? "").trim();
    const boltDir = boltDirectories.get(boltId);
    if (!boltDir) continue;
    const artifactPaths = [`${boltDir}/notes.md`];
    const taskPath = input.relativeToIntent(intentBase, `${boltDir}/tasks.md`);
    const taskGenerationStatus = taskGenerationStatuses.get(boltId);
    if (taskGenerationStatus === "ready_for_approval" || taskGenerationStatus === "passed" || taskGenerationStatus === "failed") {
      artifactPaths.push(`${boltDir}/tasks.md`);
    } else if (taskGenerationStatus === "not_started" || taskGenerationStatus === "in_progress" || taskGenerationStatus === "blocked") {
      if (required.has(taskPath)) {
        results.push(fail(path, "`taskGeneration.status` 未生成時は requiredBoltArtifacts に tasks.md を含めない", `${boltId}: ${taskPath}`));
      } else {
        results.push(pass(path, "`taskGeneration.status` 未生成時は requiredBoltArtifacts に tasks.md を含めない", `${boltId}: ${taskPath}`));
      }
    }
    if (requiresTestResults) artifactPaths.push(`${boltDir}/test-results.md`);
    for (const artifactPath of artifactPaths) {
      const relativePath = input.relativeToIntent(intentBase, artifactPath);
      const condition = artifactPath.endsWith("/test-results.md")
        ? "Construction 完了時の必須 Bolt 成果物が test-results.md を含む"
        : "Construction 必須 Bolt 成果物が targetBolt の証拠成果物を含む";
      if (required.has(relativePath)) results.push(pass(path, condition, `${boltId}: ${relativePath}`));
      else results.push(fail(path, condition, `${boltId}: ${relativePath}`));
    }
  }
  return results;
}

function checkTaskGenerationStateMatrix(
  results: CheckResult[],
  path: string,
  input: {
    boltId: string;
    status: string;
    blockedReason: string;
    evidenceCount: number;
    evidenceByKind: Map<string, string[]>;
  },
): void {
  const rule = taskGenerationStateMatrixByStatus.get(input.status);
  if (!rule) return;

  for (const kind of rule.requiredEvidenceKinds) {
    requireKind(results, path, input.evidenceByKind, input.boltId, input.status, kind);
  }

  if (rule.evidence === "forbidden") {
    if (input.evidenceCount === 0) results.push(pass(path, `Task Generation ${input.status} は evidence を持たない`, input.boltId));
    else results.push(fail(path, `Task Generation ${input.status} は evidence を持たない`, `${input.boltId}: ${input.evidenceCount}件`));
  } else if (rule.evidence === "required") {
    if (input.evidenceCount > 0) results.push(pass(path, `Task Generation ${input.status} は evidence を持つ`, `${input.boltId}: ${input.evidenceCount}件`));
    else results.push(fail(path, `Task Generation ${input.status} は evidence を持つ`, input.boltId));
  }

  if (rule.blockedReason === "forbidden") {
    if (input.blockedReason.length === 0) results.push(pass(path, `Task Generation ${input.status} は blockedReason を持たない`, input.boltId));
    else results.push(fail(path, `Task Generation ${input.status} は blockedReason を持たない`, `${input.boltId}: ${input.blockedReason}`));
  } else if (rule.blockedReason === "required") {
    if (input.blockedReason.length > 0) results.push(pass(path, `Task Generation ${input.status} は blockedReason を持つ`, `${input.boltId}: ${input.blockedReason}`));
    else results.push(fail(path, `Task Generation ${input.status} は blockedReason を持つ`, input.boltId));
  }
}

function requireKind(
  results: CheckResult[],
  path: string,
  evidenceByKind: Map<string, string[]>,
  boltId: string,
  status: string,
  kind: string,
): void {
  if ((evidenceByKind.get(kind) ?? []).length > 0) {
    results.push(pass(path, `Task Generation ${status} は ${kind} evidence を持つ`, boltId));
  } else {
    results.push(fail(path, `Task Generation ${status} は ${kind} evidence を持つ`, boltId));
  }
}

function checkAllowed(path: string, column: string, actual: unknown, allowed: Set<string>): CheckResult {
  const value = String(actual ?? "").trim();
  if (allowed.has(value)) return pass(path, `\`${column}\` が許可値である`, value);
  return fail(path, `\`${column}\` が許可値である`, value);
}
