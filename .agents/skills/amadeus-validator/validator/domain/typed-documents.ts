import { functionalDesignContract } from "../generated/functional-design-contract";
import { type MarkdownDocument, section } from "./markdown";
import { type RuleId, type UnitId, ruleId, unitId } from "./primitives";
import { type CheckResult, type ParseResult, fail, pass } from "./results";

export type UnitIndex = {
  kind: "UnitIndex";
  units: UnitIndexRow[];
};

export type UnitIndexRow = {
  unitId: UnitId;
  name: string;
  detail: string;
};

export type BusinessLogicModel = {
  kind: "BusinessLogicModel";
  text: string;
};

export type BusinessRule = {
  ruleId: RuleId;
  rule: string;
  source: string;
  status: string;
};

export type BusinessRules = {
  kind: "BusinessRules";
  rules: BusinessRule[];
};

export type DomainEntities = {
  kind: "DomainEntities";
  entities: Record<string, string>[];
};

export type FrontendComponents = {
  kind: "FrontendComponents";
  components: Record<string, string>[];
};

export function parseUnitIndex(document: MarkdownDocument): ParseResult<UnitIndex> {
  const results: CheckResult[] = [];
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

  results.push(...checkColumns(document.path.value, table.headers, ["識別子", "名前", "詳細"]));
  const units: UnitIndexRow[] = [];
  for (const row of table.rows) {
    try {
      units.push({
        unitId: unitId(row["識別子"] ?? ""),
        name: row["名前"] ?? "",
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

function checkColumns(target: string, actual: readonly string[], expected: readonly string[]): CheckResult[] {
  const missing = expected.filter((column) => !actual.includes(column));
  if (missing.length === 0) return [pass(target, "table.columns", expected.join(", "))];
  return [fail(target, "table.columns", `不足: ${missing.join(", ")}`)];
}

function rowsAfterHeading(document: MarkdownDocument, heading: string): Record<string, string>[] {
  return section(document, heading)?.tables[0]?.rows ?? [];
}

function contractFor(artifactType: string) {
  return functionalDesignContract.artifacts.find((contract) => contract.artifactType === artifactType);
}
