import {
  type ArtifactPath,
  type BoltId,
  type RequirementId,
  type StoryId,
  type UnitId,
  type UseCaseId,
  artifactPath,
  boltId,
  requirementId,
  storyId,
  unitId,
  useCaseId,
} from "./primitives";
import { resolveArtifactLinkTarget } from "./artifact-links";
import { type BoltIdRef } from "./bolt-id-ref";
import { type CheckResult, fail, pass } from "./results";
import { type IdRefListOptions } from "./id-ref-list-options";
import { type IdRefListParseResult } from "./id-ref-list-parse-result";
import { type IdRefTargetId } from "./id-ref-target-id";
import { type IdRef } from "./id-ref-type";
import { type RequirementIdRef } from "./requirement-id-ref";
import { type StoryIdRef } from "./story-id-ref";
import { type UnitIdRef } from "./unit-id-ref";
import { type UseCaseIdRef } from "./use-case-id-ref";

type IdRefKind =
  | "RequirementIdRef"
  | "StoryIdRef"
  | "UseCaseIdRef"
  | "UnitIdRef"
  | "BoltIdRef";

type IdRefRule<TId extends IdRefTargetId> = {
  kind: IdRefKind;
  directory: string;
  parseId: (value: string) => TId;
};

export type { BoltIdRef } from "./bolt-id-ref";
export type { IdRefListOptions } from "./id-ref-list-options";
export type { IdRefListParseResult } from "./id-ref-list-parse-result";
export type { IdRefTargetId } from "./id-ref-target-id";
export type { IdRef } from "./id-ref-type";
export type { RequirementIdRef } from "./requirement-id-ref";
export type { StoryIdRef } from "./story-id-ref";
export type { UnitIdRef } from "./unit-id-ref";
export type { UseCaseIdRef } from "./use-case-id-ref";

type IdRefFactory<TId extends IdRefTargetId> = (
  value: string,
  sourcePath: ArtifactPath | string,
) => IdRef<TId>;

const requirementRule: IdRefRule<RequirementId> = {
  kind: "RequirementIdRef",
  directory: "inception/requirements",
  parseId: requirementId,
};

const storyRule: IdRefRule<StoryId> = {
  kind: "StoryIdRef",
  directory: "inception/user-stories",
  parseId: storyId,
};

const useCaseRule: IdRefRule<UseCaseId> = {
  kind: "UseCaseIdRef",
  directory: "inception/use-cases",
  parseId: useCaseId,
};

const unitRule: IdRefRule<UnitId> = {
  kind: "UnitIdRef",
  directory: "inception/units",
  parseId: unitId,
};

const boltRule: IdRefRule<BoltId> = {
  kind: "BoltIdRef",
  directory: "inception/bolts",
  parseId: boltId,
};

export function parseIdRef<TId extends IdRefTargetId>(
  value: string,
  sourcePath: ArtifactPath | string,
  parseId: (value: string) => TId,
): IdRef<TId> {
  const text = String(value ?? "").trim();
  const match = text.match(/^\[([^\]\n]+)\]\(([^()\s]+)\)$/);
  if (!match) throw new Error(`IdRef must be a single Markdown link: ${value}`);

  const displayText = match[1];
  const rawLinkTarget = match[2];
  rejectUnsupportedTarget(rawLinkTarget);

  const id = parseId(displayText);
  if (displayText !== id.value) throw new Error(`IdRef display text must equal ID: ${displayText}`);

  return {
    id,
    rawLinkTarget,
    path: resolveArtifactLinkTarget(sourcePath, rawLinkTarget),
  };
}

export function requirementIdRef(value: string, sourcePath: ArtifactPath | string): RequirementIdRef {
  return idRefForRule(value, sourcePath, requirementRule);
}

export function storyIdRef(value: string, sourcePath: ArtifactPath | string): StoryIdRef {
  return idRefForRule(value, sourcePath, storyRule);
}

export function useCaseIdRef(value: string, sourcePath: ArtifactPath | string): UseCaseIdRef {
  return idRefForRule(value, sourcePath, useCaseRule);
}

export function unitIdRef(value: string, sourcePath: ArtifactPath | string): UnitIdRef {
  return idRefForRule(value, sourcePath, unitRule);
}

export function boltIdRef(value: string, sourcePath: ArtifactPath | string): BoltIdRef {
  return idRefForRule(value, sourcePath, boltRule);
}

export function parseIdRefList<TId extends IdRefTargetId>(
  value: unknown,
  sourcePath: ArtifactPath | string,
  factory: IdRefFactory<TId>,
  options: IdRefListOptions = {},
): IdRefListParseResult<TId> {
  const source = asArtifactPath(sourcePath);
  const target = options.target ?? source.value;
  const condition = options.condition ?? "idRef.list";
  const text = String(value ?? "").trim();
  const items = splitList(text);
  const refs: IdRef<TId>[] = [];
  const results: CheckResult[] = [];

  if (text.length === 0) {
    results.push(fail(target, condition, "IdRef list must not be blank"));
    return { refs, results };
  }

  if (text === "なし") {
    if (options.allowNone) {
      results.push(pass(target, condition, "なし"));
    } else {
      results.push(fail(target, condition, "IdRef list does not allow なし"));
    }
    return { refs, results };
  }

  if (items.length === 0) {
    results.push(fail(target, condition, "IdRef list must include at least one reference"));
    return { refs, results };
  }

  for (const item of items) {
    try {
      refs.push(factory(item, source));
      results.push(pass(target, condition, item));
    } catch (error) {
      results.push(fail(target, condition, error instanceof Error ? error.message : String(error)));
    }
  }

  return { refs, results };
}

function idRefForRule<TId extends IdRefTargetId>(
  value: string,
  sourcePath: ArtifactPath | string,
  rule: IdRefRule<TId>,
): IdRef<TId> {
  const ref = parseIdRef(value, sourcePath, rule.parseId);
  ensurePlacement(ref, rule);
  return ref;
}

function ensurePlacement<TId extends IdRefTargetId>(ref: IdRef<TId>, rule: IdRefRule<TId>): void {
  const parts = ref.path.value.split("/");
  const fileName = parts.at(-1) ?? "";
  const directory = parts.slice(0, -1).join("/");
  if (!matchesPlacementDirectory(directory, rule.directory)) {
    throw new Error(`${rule.kind} path must be under ${rule.directory}: ${ref.path.value}`);
  }
  if (!fileName.endsWith(".md")) throw new Error(`${rule.kind} path must point to Markdown file: ${ref.path.value}`);

  const stem = fileName.slice(0, -".md".length);
  if (!stem.startsWith(`${ref.id.value}-`)) {
    throw new Error(`${rule.kind} file stem must start with ${ref.id.value}: ${ref.path.value}`);
  }
}

function rejectUnsupportedTarget(rawLinkTarget: string): void {
  const normalizedTarget = rawLinkTarget.replaceAll("\\", "/");
  if (rawLinkTarget.includes("#")) throw new Error(`IdRef target must not include anchor: ${rawLinkTarget}`);
  if (/^[a-z][a-z0-9+.-]*:/i.test(rawLinkTarget) || normalizedTarget.startsWith("//")) {
    throw new Error(`IdRef target must be a relative Markdown link: ${rawLinkTarget}`);
  }
  if (normalizedTarget.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(rawLinkTarget)) {
    throw new Error(`IdRef target must not be absolute: ${rawLinkTarget}`);
  }
}

function matchesPlacementDirectory(actual: string, expected: string): boolean {
  if (actual === expected) return true;
  return new RegExp(`^(?:\\.amadeus/)?intents/[^/]+/${escapeRegExp(expected)}$`).test(actual);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function asArtifactPath(value: ArtifactPath | string): ArtifactPath {
  return typeof value === "string" ? artifactPath(value) : value;
}

function splitList(value: string): string[] {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
