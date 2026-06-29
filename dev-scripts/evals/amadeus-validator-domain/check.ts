#!/usr/bin/env bun

import {
  artifactPath,
  boundedContextId,
  documentTitle,
  requirementId,
  tableColumnName,
  unitId,
} from "../../../skills/amadeus-validator/validator/domain/primitives";
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

const validUnitId = unitId("U001");
assert(validUnitId.value === "U001", "UnitId keeps valid value");
assertThrows(() => unitId("B001"), "UnitId rejects non Unit prefix");
assert(requirementId("R001").value === "R001", "RequirementId keeps valid value");
assert(boundedContextId("BC001").value === "BC001", "BoundedContextId keeps valid value");
assertThrows(() => artifactPath("/tmp/state.json"), "ArtifactPath rejects absolute path");
assert(documentTitle("用語集").value === "用語集", "DocumentTitle keeps non blank title");
assert(tableColumnName("識別子").value === "識別子", "TableColumnName keeps non blank column");

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

console.log("amadeus validator domain eval: ok");
