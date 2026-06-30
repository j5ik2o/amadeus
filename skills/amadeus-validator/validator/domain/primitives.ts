type PrimitiveName =
  | "RequirementId"
  | "StoryId"
  | "UseCaseId"
  | "UnitId"
  | "BoltId"
  | "ImplementationTargetId"
  | "ImplementationRepository"
  | "ImplementationPath"
  | "ImplementationBranch"
  | "PullRequestUrl"
  | "CiName"
  | "BoundedContextId"
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
export type ImplementationTargetId = DomainPrimitive<"ImplementationTargetId">;
export type ImplementationRepository = DomainPrimitive<"ImplementationRepository">;
export type ImplementationPath = DomainPrimitive<"ImplementationPath">;
export type ImplementationBranch = DomainPrimitive<"ImplementationBranch">;
export type PullRequestUrl = DomainPrimitive<"PullRequestUrl">;
export type CiName = DomainPrimitive<"CiName">;
export type BoundedContextId = DomainPrimitive<"BoundedContextId">;
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

export function implementationTargetId(value: string): ImplementationTargetId {
  return primitive("ImplementationTargetId", value, /^IT\d{3}$/);
}

export function implementationRepository(value: string): ImplementationRepository {
  return primitive("ImplementationRepository", value, /^(?:[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+|https:\/\/github\.com\/[^/\s]+\/[^/\s]+|git@github\.com:[^/\s]+\/[^/\s]+(?:\.git)?)$/);
}

export function implementationPath(value: string): ImplementationPath {
  const normalized = normalize(value);
  if (normalized.length === 0) throw new Error("ImplementationPath must not be blank");
  if (normalized.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(normalized)) throw new Error(`ImplementationPath must be repository-relative: ${value}`);
  if (normalized.split("/").includes("..")) throw new Error(`ImplementationPath must stay inside repository root: ${value}`);
  return { kind: "ImplementationPath", value: normalized };
}

export function implementationBranch(value: string): ImplementationBranch {
  return primitive("ImplementationBranch", value, /^(?!\/|.*(?:^|\/)\.|.*\/\/|.*@\{|.*\\|.*\s|.*\.\.|.*\/$|.*\.lock$).+$/);
}

export function pullRequestUrl(value: string): PullRequestUrl {
  return primitive("PullRequestUrl", value, /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/pull\/\d+(?:[?#]\S*)?$/);
}

export function ciName(value: string): CiName {
  return primitive("CiName", value, /^[A-Za-z0-9][A-Za-z0-9 _./:@+-]*$/);
}

export function boundedContextId(value: string): BoundedContextId {
  return primitive("BoundedContextId", value, /^BC\d{3}(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?$/);
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
