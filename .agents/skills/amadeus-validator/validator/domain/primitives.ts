type PrimitiveName =
  | "RequirementId"
  | "StoryId"
  | "UseCaseId"
  | "UnitId"
  | "BoltId"
  | "ArtifactPath"
  | "DocumentTitle"
  | "SectionTitle"
  | "TableColumnName"
  | "RuleId";

export type DomainPrimitive<TName extends PrimitiveName> = {
  readonly kind: TName;
  readonly value: string;
};

export type RequirementId = DomainPrimitive<"RequirementId">;
export type StoryId = DomainPrimitive<"StoryId">;
export type UseCaseId = DomainPrimitive<"UseCaseId">;
export type UnitId = DomainPrimitive<"UnitId">;
export type BoltId = DomainPrimitive<"BoltId">;
export type ArtifactPath = DomainPrimitive<"ArtifactPath">;
export type DocumentTitle = DomainPrimitive<"DocumentTitle">;
export type SectionTitle = DomainPrimitive<"SectionTitle">;
export type TableColumnName = DomainPrimitive<"TableColumnName">;
export type RuleId = DomainPrimitive<"RuleId">;

export function requirementId(value: string): RequirementId {
  return primitive("RequirementId", value, /^R\d{3}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/);
}

export function storyId(value: string): StoryId {
  return primitive("StoryId", value, /^S\d{3}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/);
}

export function useCaseId(value: string): UseCaseId {
  return primitive("UseCaseId", value, /^UC\d{3}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/);
}

export function unitId(value: string): UnitId {
  return primitive("UnitId", value, /^U\d{3}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/);
}

export function boltId(value: string): BoltId {
  return primitive("BoltId", value, /^B\d{3}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/);
}

export function artifactPath(value: string): ArtifactPath {
  const normalized = normalize(value);
  if (normalized.length === 0) throw new Error("ArtifactPath must not be blank");
  if (normalized.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(normalized)) throw new Error(`ArtifactPath must be relative: ${value}`);
  if (normalized.split("/").includes("..")) throw new Error(`ArtifactPath must stay inside artifact root: ${value}`);
  return { kind: "ArtifactPath", value: normalized };
}

export function documentTitle(value: string): DocumentTitle {
  return nonBlank("DocumentTitle", value);
}

export function sectionTitle(value: string): SectionTitle {
  return nonBlank("SectionTitle", value);
}

export function tableColumnName(value: string): TableColumnName {
  return nonBlank("TableColumnName", value);
}

export function ruleId(value: string): RuleId {
  return primitive("RuleId", value, /^[A-Z]{2,5}\d{3}$/);
}

function primitive<TName extends PrimitiveName>(kind: TName, value: string, pattern: RegExp): DomainPrimitive<TName> {
  const normalized = normalize(value);
  if (!pattern.test(normalized)) throw new Error(`${kind} is invalid: ${value}`);
  return { kind, value: normalized };
}

function nonBlank<TName extends PrimitiveName>(kind: TName, value: string): DomainPrimitive<TName> {
  const normalized = normalize(value);
  if (normalized.length === 0) throw new Error(`${kind} must not be blank`);
  return { kind, value: normalized };
}

function normalize(value: string): string {
  return String(value ?? "").trim().replaceAll("\\", "/");
}
