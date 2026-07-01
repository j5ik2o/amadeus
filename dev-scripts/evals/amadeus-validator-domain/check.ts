#!/usr/bin/env bun

import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  artifactPath,
  boundedContextId,
  documentTitle,
  requirementId,
  tableColumnName,
  unitId,
} from "../../../skills/amadeus-validator/validator/domain/primitives";
import {
  boltIdRef,
  parseIdRefList,
  requirementIdRef,
  storyIdRef,
  unitIdRef,
  useCaseIdRef,
} from "../../../skills/amadeus-validator/validator/domain/id-ref";
import { resolveArtifactLinkTarget } from "../../../skills/amadeus-validator/validator/domain/artifact-links";
import { parseMarkdownDocument } from "../../../skills/amadeus-validator/validator/domain/markdown";
import {
  parseBusinessRules,
  parseUnitIndex,
} from "../../../skills/amadeus-validator/validator/domain/typed-documents";
import { parseConstructionFunctionalDesignState } from "../../../skills/amadeus-validator/validator/domain/functional-design-state";
import { checkConstructionFunctionalDesignStage } from "../../../skills/amadeus-validator/validator/stages/construction/functional-design";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

function assertThrows(fn: () => unknown, message: string): void {
  try {
    fn();
  } catch {
    return;
  }
  assert(false, message);
}

function runValidator(workspace: string, intentId: string): { status: number; output: string } {
  const result = Bun.spawnSync([
    "bun",
    "run",
    "skills/amadeus-validator/validator/AmadeusValidator.ts",
    workspace,
    intentId,
  ]);
  return {
    status: result.exitCode,
    output: `${result.stdout.toString()}\n${result.stderr.toString()}`,
  };
}

function withExampleWorkspace(fn: (workspace: string) => void, source = "examples/03-inception-completed"): void {
  const tempRoot = mkdtempSync(join(tmpdir(), "amadeus-validator-domain-"));
  const workspace = join(tempRoot, "workspace");
  try {
    cpSync(source, workspace, { recursive: true });
    fn(workspace);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function replaceDomainMapEvidence(workspace: string, evidence: string): void {
  const path = join(workspace, ".amadeus/domain-map.md");
  const original = readFileSync(path, "utf8");
  const updated = original.replace(
    "| BC004 | 販売管理 | SD004 | 商品選択から注文作成までの販売活動を扱う。 | adopted | [D002](intents/20260629-minimum-purchase-flow/inception/decisions/D002-bc004-ownership.md) |",
    `| BC004 | 販売管理 | SD004 | 商品選択から注文作成までの販売活動を扱う。 | adopted | ${evidence} |`,
  );
  assert(updated !== original, "Domain Map fixture row is replaced");
  writeFileSync(path, updated);
}

function addContextMapDependency(workspace: string, evidence: string): void {
  const path = join(workspace, ".amadeus/context-map.md");
  const original = readFileSync(path, "utf8");
  const row = `| BC004 | BC004 | 販売管理内のモデル連携を扱う。 | パートナーシップ | 共有カーネル | adopted | ${evidence} |`;
  const updated = original.replace(
    "|---|---|---|---|---|---|---|",
    `|---|---|---|---|---|---|---|\n${row}`,
  );
  assert(updated !== original, "Context Map dependency row is added");
  writeFileSync(path, updated);
}

function updateFunctionalDesignStatus(workspace: string, unitId: string, status: string): void {
  const path = join(workspace, ".amadeus/intents/20260629-minimum-purchase-flow/state.json");
  const state = JSON.parse(readFileSync(path, "utf8"));
  const unit = state.construction?.functionalDesign?.units?.find((item: { unitId?: string }) => item.unitId === unitId);
  assert(unit, "Functional Design unit state exists");
  unit.status = status;
  writeFileSync(path, JSON.stringify(state, null, 2));
}

const validUnitId = unitId("U001");
assert(validUnitId.value === "U001", "UnitId keeps valid value");
assertThrows(() => unitId("B001"), "UnitId rejects non Unit prefix");
assert(requirementId("R001").value === "R001", "RequirementId keeps valid value");
assert(boundedContextId("BC001").value === "BC001", "BoundedContextId keeps valid value");
assertThrows(() => artifactPath("/tmp/state.json"), "ArtifactPath rejects absolute path");
assert(documentTitle("用語集").value === "用語集", "DocumentTitle keeps non blank title");
assert(tableColumnName("識別子").value === "識別子", "TableColumnName keeps non blank column");

const unitRef = unitIdRef("[U001](inception/units/U001-unit.md)", artifactPath("traceability.md"));
assert(unitRef.id.value === "U001", "UnitIdRef keeps typed UnitId");
assert(unitRef.rawLinkTarget === "inception/units/U001-unit.md", "UnitIdRef keeps raw link target");
assert(unitRef.path.value === "inception/units/U001-unit.md", "UnitIdRef keeps artifact-root relative path");

const relativeUnitRef = unitIdRef("[U001](../inception/units/U001-unit.md)", artifactPath("construction/traceability.md"));
assert(relativeUnitRef.path.value === "inception/units/U001-unit.md", "UnitIdRef normalizes source-relative path");
const intentUnitRef = unitIdRef("[U001](units/U001-unit.md)", artifactPath("intents/20260629-minimum-purchase-flow/inception/units.md"));
assert(intentUnitRef.path.value === "intents/20260629-minimum-purchase-flow/inception/units/U001-unit.md", "UnitIdRef allows Intent-rooted artifact path");
const dotAmadeusIntentUnitRef = unitIdRef("[U001](units/U001-unit.md)", artifactPath(".amadeus/intents/20260629-minimum-purchase-flow/inception/units.md"));
assert(dotAmadeusIntentUnitRef.path.value === ".amadeus/intents/20260629-minimum-purchase-flow/inception/units/U001-unit.md", "UnitIdRef allows .amadeus-rooted artifact path");
assert(resolveArtifactLinkTarget(".amadeus/domain-map.md", "./intents/20260629-minimum-purchase-flow.md").value === ".amadeus/intents/20260629-minimum-purchase-flow.md", "Artifact link resolves dot-relative Domain Map evidence");
assert(resolveArtifactLinkTarget(".amadeus/domain-map.md", "intents/20260629-minimum-purchase-flow.md").value === ".amadeus/intents/20260629-minimum-purchase-flow.md", "Artifact link resolves plain Domain Map evidence");
assertThrows(() => resolveArtifactLinkTarget(".amadeus/domain-map.md", "https://example.com/intent.md"), "Artifact link rejects external target");
assert(requirementIdRef("[R001](inception/requirements/R001-requirement.md)", artifactPath("traceability.md")).id.value === "R001", "RequirementIdRef parses valid link");
assert(storyIdRef("[S001](inception/user-stories/S001-story.md)", artifactPath("traceability.md")).id.value === "S001", "StoryIdRef parses valid link");
assert(useCaseIdRef("[UC001](inception/use-cases/UC001-use-case.md)", artifactPath("traceability.md")).id.value === "UC001", "UseCaseIdRef parses valid link");
assert(boltIdRef("[B001](inception/bolts/B001-bolt.md)", artifactPath("traceability.md")).id.value === "B001", "BoltIdRef parses valid link");
assertThrows(() => unitIdRef("[購入 Unit](inception/units/U001-unit.md)", artifactPath("traceability.md")), "IdRef rejects display text that is not an ID");
assertThrows(() => unitIdRef("[U001](inception/requirements/U001-unit.md)", artifactPath("traceability.md")), "IdRef rejects mismatched artifact directory");
assertThrows(() => unitIdRef("[U001](inception/units/U002-unit.md)", artifactPath("traceability.md")), "IdRef rejects stem that does not start with the ID");
assertThrows(() => unitIdRef("[U001](inception/units/U001-unit.md#overview)", artifactPath("traceability.md")), "IdRef rejects anchor link");
assertThrows(() => unitIdRef("[U001](https://example.com/U001-unit.md)", artifactPath("traceability.md")), "IdRef rejects external link");
assertThrows(() => unitIdRef("[U001](/inception/units/U001-unit.md)", artifactPath("traceability.md")), "IdRef rejects absolute path");
assertThrows(() => unitIdRef("[U001](\\inception\\units\\U001-unit.md)", artifactPath("traceability.md")), "IdRef rejects backslash absolute path");
assertThrows(() => unitIdRef("[U001](\\\\inception\\units\\U001-unit.md)", artifactPath("traceability.md")), "IdRef rejects UNC-like path");
assertThrows(() => unitIdRef("[U001](../inception/units/U001-unit.md)", artifactPath("traceability.md")), "IdRef rejects path outside artifact root");
assertThrows(() => unitIdRef("[U001](inception/units/U001-unit.md) and [U002](inception/units/U002-unit.md)", artifactPath("traceability.md")), "IdRef rejects multiple links as single ref");
assertThrows(() => unitIdRef("U001", artifactPath("traceability.md")), "IdRef rejects plain ID as link ref");
assertThrows(() => unitIdRef("なし", artifactPath("traceability.md")), "IdRef rejects none marker as single ref");
assertThrows(() => unitIdRef("", artifactPath("traceability.md")), "IdRef rejects blank single ref");

const idRefList = parseIdRefList(
  "[U001](inception/units/U001-unit.md), [U002](inception/units/U002-order.md)",
  artifactPath("traceability.md"),
  unitIdRef,
  { target: "traceability.md", condition: "unit.idRefs" },
);
assert(idRefList.refs.length === 2, "parseIdRefList parses comma-separated ID links");
assert(idRefList.refs[1]?.id.value === "U002", "parseIdRefList keeps second ID link");
assert(idRefList.results.every((result) => result.result === "pass"), "parseIdRefList records pass results");

const noneIdRefList = parseIdRefList("なし", artifactPath("traceability.md"), unitIdRef, {
  target: "traceability.md",
  condition: "unit.idRefs",
  allowNone: true,
});
assert(noneIdRefList.refs.length === 0, "parseIdRefList treats allowed none as empty list");
assert(noneIdRefList.results.some((result) => result.result === "pass" && result.evidence === "なし"), "parseIdRefList records allowed none");

const rejectedNoneIdRefList = parseIdRefList("なし", artifactPath("traceability.md"), unitIdRef, {
  target: "traceability.md",
  condition: "unit.idRefs",
});
assert(rejectedNoneIdRefList.results.some((result) => result.result === "fail"), "parseIdRefList rejects none unless allowed");

const invalidIdRefList = parseIdRefList("[U001](inception/requirements/U001-unit.md)", artifactPath("traceability.md"), unitIdRef, {
  target: "traceability.md",
  condition: "unit.idRefs",
});
assert(invalidIdRefList.refs.length === 0, "parseIdRefList omits invalid refs");
assert(invalidIdRefList.results.some((result) => result.result === "fail"), "parseIdRefList records failed refs");
assert(parseIdRefList(",", artifactPath("traceability.md"), unitIdRef).results.some((result) => result.result === "fail"), "parseIdRefList rejects delimiter-only value");
assert(parseIdRefList(" , ", artifactPath("traceability.md"), unitIdRef).results.some((result) => result.result === "fail"), "parseIdRefList rejects blank items only");

const markdown = parseMarkdownDocument(
  [
    "# Units",
    "",
    "## 一覧",
    "",
    "| 識別子 | 概要 | 要求 | コンテキスト | 依存 | 詳細 |",
    "|---|---|---|---|---|---|",
    "| U001 | 購入 | R001, R002 | BC001 | なし | [詳細](units/U001-purchase.md) |",
    "| U002 | 注文 | R003 | BC001 | U001 | [詳細](units/U002-order.md) |",
    "",
  ].join("\n"),
  artifactPath("inception/units.md"),
);
assert(markdown.title.value === "Units", "MarkdownDocument parses title");
assert(markdown.sections.some((section) => section.title.value === "一覧"), "MarkdownDocument parses sections");
assert(markdown.sections[0]?.tables[0]?.headers[0]?.value === "識別子", "MarkdownTable headers use TableColumnName");

const unitIndex = parseUnitIndex(markdown);
assert(unitIndex.document.units[0]?.unitId.value === "U001", "UnitIndex parses Unit ID");
assert(unitIndex.document.units[0]?.requirementIds[1]?.value === "R002", "UnitIndex stores Requirement references as IDs");
assert(unitIndex.document.units[0]?.contextIds[0]?.value === "BC001", "UnitIndex stores Bounded Context references as IDs");
assert(unitIndex.document.units[1]?.dependencyUnitIds[0]?.value === "U001", "UnitIndex stores Unit dependencies as IDs");
assert(unitIndex.results.some((result) => result.result === "pass"), "ParseResult carries structured pass CheckResult");

const partialUnitIndex = parseUnitIndex(parseMarkdownDocument(
  [
    "# Units",
    "",
    "## 一覧",
    "",
    "| 識別子 | 概要 | 要求 | コンテキスト | 依存 | 詳細 |",
    "|---|---|---|---|---|---|",
    "| U003 | 破損参照 | B001 | BC999 | U999 | [詳細](units/U003-broken.md) |",
    "",
  ].join("\n"),
  artifactPath("inception/units.md"),
));
assert(partialUnitIndex.document.units[0]?.unitId.value === "U003", "UnitIndex keeps partial row when references fail");
assert(partialUnitIndex.results.some((result) => result.result === "fail" && result.condition === "unit.requirement"), "UnitIndex reports invalid Requirement references");

const incompleteBusinessRules = parseBusinessRules(parseMarkdownDocument(
  [
    "# Business Rules",
    "",
    "## 業務ルール",
    "",
    "| 識別子 | 規則 |",
    "|---|---|",
    "| BR001 | 商品を選択する |",
    "",
  ].join("\n"),
  artifactPath("construction/U001-purchase/functional-design/business-rules.md"),
));
assert(incompleteBusinessRules.document.rules.length === 1, "BusinessRules returns partial document");
assert(incompleteBusinessRules.results.some((result) => result.result === "fail" && result.condition === "table.columns"), "BusinessRules reports missing Catalog columns");

const functionalDesignState = parseConstructionFunctionalDesignState(".amadeus/intents/intent/state.json", {
  targetUnits: ["U001"],
  units: [
    {
      unitId: "U001",
      requirement: "required",
      status: "passed",
      frontendSurface: "absent",
      targetSource: "functional_design_target_units",
      runMode: "initial",
    },
    {
      unitId: "U002",
      requirement: "not_required",
      status: "passed",
      frontendSurface: "absent",
      targetSource: "construction_target_units",
      runMode: "initial",
    },
  ],
});
assert(functionalDesignState.document.units[0]?.unitId.value === "U001", "ConstructionFunctionalDesignState uses UnitId domain primitive");
assert(functionalDesignState.results.some((result) => result.result === "fail" && result.condition.includes("requirement と status")), "ConstructionFunctionalDesignState rejects invalid state matrix");

const functionalDesignStage = checkConstructionFunctionalDesignStage({
  statePath: ".amadeus/intents/intent/state.json",
  value: {
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
  existingUnitIds: new Set(["U001"]),
  unitDirectories: new Map([["U001", ".amadeus/intents/intent/inception/units/U001-purchase"]]),
  constructionBase: ".amadeus/intents/intent/construction",
  intentBase: ".amadeus/intents/intent",
  fileExists: () => false,
  relativeToIntent: (_base, path) => path,
});
assert(functionalDesignStage.results.some((result) => result.result === "fail" && result.condition.includes("requirement と status")), "Functional Design stage module validates state matrix");

withExampleWorkspace((workspace) => {
  replaceDomainMapEvidence(workspace, "[Intent](./intents/20260629-minimum-purchase-flow.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 1, "Domain Map evidence with ./ current Intent record is rejected");
  assert(result.output.includes("現在の Intent で採用した Bounded Context の Domain Map 根拠が Inception 判断を指す"), "Domain Map evidence rejection explains expected Inception decision evidence");
});

withExampleWorkspace((workspace) => {
  replaceDomainMapEvidence(workspace, "[D002](./intents/20260629-minimum-purchase-flow/inception/decisions/D002-bc004-ownership.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 0, "Domain Map evidence with ./ Inception decision is accepted");
});

withExampleWorkspace((workspace) => {
  replaceDomainMapEvidence(workspace, "[D001](./intents/20260629-minimum-purchase-flow/construction/decisions/D001-b001-task-generation-ready.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 0, "Domain Map evidence with Construction decision is accepted in Construction phase");
}, "examples/04-construction-design-ready");

withExampleWorkspace((workspace) => {
  replaceDomainMapEvidence(workspace, "[Functional Design](./intents/20260629-minimum-purchase-flow/construction/U002-order-creation/functional-design/business-logic-model.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 1, "Domain Map evidence with ready_for_approval Functional Design is rejected");
  assert(result.output.includes("Domain Map の Functional Design 採用根拠が passed である"), "Domain Map Functional Design rejection explains expected status");
}, "examples/04-construction-design-ready");

withExampleWorkspace((workspace) => {
  updateFunctionalDesignStatus(workspace, "U002", "passed");
  replaceDomainMapEvidence(workspace, "[Functional Design](./intents/20260629-minimum-purchase-flow/construction/U002-order-creation/functional-design/business-logic-model.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 0, "Domain Map evidence with Functional Design is accepted in Construction phase");
}, "examples/04-construction-design-ready");

withExampleWorkspace((workspace) => {
  rmSync(join(workspace, ".amadeus/context-map.md"), { force: true });
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 1, "Missing Context Map is reported as validation failure");
  assert(result.output.includes("Context Map が存在する"), "Missing Context Map reports the structure condition");
  assert(!result.output.includes("検証対象を読める"), "Missing Context Map does not abort later validation as unreadable target");
});

withExampleWorkspace((workspace) => {
  addContextMapDependency(workspace, "[Intent](./intents/20260629-minimum-purchase-flow.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 1, "Context Map dependency evidence with current Intent record is rejected");
  assert(result.output.includes("現在の Intent で採用した Context Map 依存の根拠が Inception 判断または Inception 追跡を指す"), "Context Map evidence rejection explains expected Inception evidence");
});

withExampleWorkspace((workspace) => {
  writeFileSync(join(workspace, ".amadeus/intents/20260628-existing-boundaries.md"), "# Existing Boundaries\n");
  addContextMapDependency(workspace, "[D000](./intents/20260628-existing-boundaries.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 1, "Context Map dependency involving current Intent Bounded Context rejects other Intent-only evidence");
  assert(result.output.includes("現在の Intent で採用した Context Map 依存の根拠が Inception 判断または Inception 追跡を指す"), "Context Map dependency rejection explains expected current Intent evidence");
});

withExampleWorkspace((workspace) => {
  addContextMapDependency(workspace, "[D002](./intents/20260629-minimum-purchase-flow/inception/decisions/D002-bc004-ownership.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 0, "Context Map dependency evidence with Inception decision is accepted");
});

withExampleWorkspace((workspace) => {
  addContextMapDependency(workspace, "[Traceability](./intents/20260629-minimum-purchase-flow/inception/traceability.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 0, "Context Map dependency evidence with Inception traceability is accepted");
});

withExampleWorkspace((workspace) => {
  addContextMapDependency(workspace, "[D001](./intents/20260629-minimum-purchase-flow/construction/decisions/D001-b001-task-generation-ready.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 0, "Context Map dependency evidence with Construction decision is accepted in Construction phase");
}, "examples/04-construction-design-ready");

withExampleWorkspace((workspace) => {
  addContextMapDependency(workspace, "[Functional Design](./intents/20260629-minimum-purchase-flow/construction/U002-order-creation/functional-design/business-logic-model.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 1, "Context Map dependency evidence with ready_for_approval Functional Design is rejected");
  assert(result.output.includes("Context Map の Functional Design 採用根拠が passed である"), "Context Map Functional Design rejection explains expected status");
}, "examples/04-construction-design-ready");

withExampleWorkspace((workspace) => {
  updateFunctionalDesignStatus(workspace, "U002", "passed");
  addContextMapDependency(workspace, "[Functional Design](./intents/20260629-minimum-purchase-flow/construction/U002-order-creation/functional-design/business-logic-model.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 0, "Context Map dependency evidence with Functional Design is accepted in Construction phase");
}, "examples/04-construction-design-ready");

withExampleWorkspace((workspace) => {
  addContextMapDependency(workspace, "[Traceability](./intents/20260629-minimum-purchase-flow/construction/traceability.md)");
  const result = runValidator(workspace, "20260629-minimum-purchase-flow");
  assert(result.status === 0, "Context Map dependency evidence with Construction traceability is accepted in Construction phase");
}, "examples/04-construction-design-ready");

console.log("amadeus validator domain eval: ok");
