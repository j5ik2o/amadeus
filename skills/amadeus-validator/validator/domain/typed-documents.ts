import { artifactContracts } from "../generated/artifact-contracts";
import { type MarkdownDocument, section } from "./markdown";
import {
  type BoundedContextId,
  type RequirementId,
  type RuleId,
  type TableColumnName,
  type UnitId,
  boundedContextId,
  requirementId,
  ruleId,
  unitId,
} from "./primitives";
import { type BusinessLogicModel } from "./business-logic-model";
import { type BusinessRule } from "./business-rule";
import { type BusinessRules } from "./business-rules";
import { type DomainEntities } from "./domain-entities";
import { type FrontendComponents } from "./frontend-components";
import { type CheckResult, type ParseResult, fail, pass } from "./results";
import { type UnitIndex } from "./unit-index";
import { type UnitIndexRow } from "./unit-index-row";

export type { BusinessLogicModel } from "./business-logic-model";
export type { BusinessRule } from "./business-rule";
export type { BusinessRules } from "./business-rules";
export type { DomainEntities } from "./domain-entities";
export type { FrontendComponents } from "./frontend-components";
export type { UnitIndex } from "./unit-index";
export type { UnitIndexRow } from "./unit-index-row";

export function parseUnitIndex(document: MarkdownDocument): ParseResult<UnitIndex> {
  const results: CheckResult[] = [];
  const contract = contractFor("inception.units.index");
  const list = section(document, "一覧");
  if (!list) {
    results.push(fail(document.path.value, "section.exists", "一覧"));
    return { document: { kind: "UnitIndex", units: [] }, results };
  }
  results.push(pass(document.path.value, "section.exists", "一覧"));

  const table = list.tables[0];
  if (!table) {
    results.push(fail(document.path.value, "table.exists", "一覧"));
    return { document: { kind: "UnitIndex", units: [] }, results };
  }

  const tableContract = contract?.tables.find((item) => item.heading === "一覧");
  results.push(...checkColumns(document.path.value, table.headers, tableContract?.columns ?? []));
  const units: UnitIndexRow[] = [];
  for (const row of table.rows) {
    try {
      const parsedUnitId = unitId(row["識別子"] ?? "");
      units.push({
        unitId: parsedUnitId,
        summary: row["概要"] ?? "",
        requirementIds: parseList(row["要求"], requirementId, document.path.value, "unit.requirement", results),
        contextIds: parseList(row["コンテキスト"], boundedContextId, document.path.value, "unit.context", results),
        dependencyUnitIds: parseList(row["依存"], unitId, document.path.value, "unit.dependency", results),
        detail: row["詳細"] ?? "",
      });
      results.push(pass(document.path.value, "unit.id", row["識別子"] ?? ""));
    } catch (error) {
      results.push(fail(document.path.value, "unit.id", error instanceof Error ? error.message : String(error)));
    }
  }

  return { document: { kind: "UnitIndex", units }, results };
}

export function parseBusinessLogicModel(document: MarkdownDocument): ParseResult<BusinessLogicModel> {
  return {
    document: { kind: "BusinessLogicModel", text: document.text },
    results: checkCatalogHeadings(document, "functional-design.business-logic-model"),
  };
}

export function parseBusinessRules(document: MarkdownDocument): ParseResult<BusinessRules> {
  const results = checkCatalogHeadings(document, "functional-design.business-rules");
  const rulesSection = section(document, "業務ルール");
  const table = rulesSection?.tables[0];
  if (!table) {
    results.push(fail(document.path.value, "table.exists", "業務ルール"));
    return { document: { kind: "BusinessRules", rules: [] }, results };
  }
  const tableContract = contractFor("functional-design.business-rules")?.tables.find((item) => item.heading === "業務ルール");
  results.push(...checkColumns(document.path.value, table.headers, tableContract?.columns ?? []));

  const rules: BusinessRule[] = [];
  for (const row of table.rows) {
    try {
      rules.push({
        ruleId: ruleId(row["識別子"] ?? ""),
        rule: row["規則"] ?? "",
        source: row["根拠"] ?? "",
        status: row["状態"] ?? "",
      });
    } catch (error) {
      results.push(fail(document.path.value, "rule.id", error instanceof Error ? error.message : String(error)));
    }
  }
  return { document: { kind: "BusinessRules", rules }, results };
}

export function parseDomainEntities(document: MarkdownDocument): ParseResult<DomainEntities> {
  const results = checkCatalogHeadings(document, "functional-design.domain-entities");
  const entities = rowsAfterHeading(document, "Domain Entity");
  return { document: { kind: "DomainEntities", entities }, results };
}

export function parseFrontendComponents(document: MarkdownDocument): ParseResult<FrontendComponents> {
  const results = checkCatalogHeadings(document, "functional-design.frontend-components");
  const components = rowsAfterHeading(document, "UI 構成");
  return { document: { kind: "FrontendComponents", components }, results };
}

function checkCatalogHeadings(document: MarkdownDocument, artifactType: string): CheckResult[] {
  const contract = contractFor(artifactType);
  if (!contract) return [fail(document.path.value, "artifact.contract", artifactType)];
  return contract.requiredHeadings.map((heading) => {
    if (section(document, heading)) return pass(document.path.value, "section.exists", heading);
    return fail(document.path.value, "section.exists", heading);
  });
}

function checkColumns(target: string, actual: readonly TableColumnName[], expected: readonly string[]): CheckResult[] {
  const actualValues = actual.map((column) => column.value);
  const missing = expected.filter((column) => !actualValues.includes(column));
  if (missing.length === 0) return [pass(target, "table.columns", expected.join(", "))];
  return [fail(target, "table.columns", `不足: ${missing.join(", ")}`)];
}

function rowsAfterHeading(document: MarkdownDocument, heading: string): Record<string, string>[] {
  return section(document, heading)?.tables[0]?.rows ?? [];
}

function contractFor(artifactType: string) {
  return artifactContracts.find((contract) => contract.artifactType === artifactType);
}

function parseList<TPrimitive>(
  value: unknown,
  parser: (value: string) => TPrimitive,
  target: string,
  condition: string,
  results: CheckResult[],
): TPrimitive[] {
  const values = splitValues(value);
  if (values.length === 1 && values[0] === "なし") return [];
  const parsed: TPrimitive[] = [];
  for (const item of values) {
    try {
      parsed.push(parser(item));
      results.push(pass(target, condition, item));
    } catch (error) {
      results.push(fail(target, condition, error instanceof Error ? error.message : String(error)));
    }
  }
  return parsed;
}

function splitValues(value: unknown): string[] {
  const text = String(value ?? "").trim();
  if (text.length === 0) return [""];
  return text.split(",").map((item) => item.trim()).filter(Boolean);
}
