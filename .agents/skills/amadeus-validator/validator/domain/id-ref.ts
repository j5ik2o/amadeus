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
import { type CheckResult, fail, pass } from "./results";

type IdRefKind =
  | "RequirementIdRef"
  | "StoryIdRef"
  | "UseCaseIdRef"
  | "UnitIdRef"
  | "BoltIdRef";

type TypedId = {
  readonly kind: string;
  readonly value: string;
};

type IdRefRule<TId extends TypedId> = {
  kind: IdRefKind;
  directory: string;
  parseId: (value: string) => TId;
};

export type IdRef<TId extends TypedId> = {
  readonly id: TId;
  readonly rawLinkTarget: string;
  readonly path: ArtifactPath;
};

export type RequirementIdRef = IdRef<RequirementId>;
export type StoryIdRef = IdRef<StoryId>;
export type UseCaseIdRef = IdRef<UseCaseId>;
export type UnitIdRef = IdRef<UnitId>;
export type BoltIdRef = IdRef<BoltId>;

export type IdRefListParseResult<TId extends TypedId> = {
  refs: IdRef<TId>[];
  results: CheckResult[];
};

export type IdRefListOptions = {
  target?: string;
  condition?: string;
  allowNone?: boolean;
};

type IdRefFactory<TId extends TypedId> = (
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

export function parseIdRef<TId extends TypedId>(
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
    path: resolveArtifactPath(sourcePath, rawLinkTarget),
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

export function parseIdRefList<TId extends TypedId>(
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

function idRefForRule<TId extends TypedId>(
  value: string,
  sourcePath: ArtifactPath | string,
  rule: IdRefRule<TId>,
): IdRef<TId> {
  const ref = parseIdRef(value, sourcePath, rule.parseId);
  ensurePlacement(ref, rule);
  return ref;
}

function ensurePlacement<TId extends TypedId>(ref: IdRef<TId>, rule: IdRefRule<TId>): void {
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

function resolveArtifactPath(sourcePath: ArtifactPath | string, rawLinkTarget: string): ArtifactPath {
  const source = asArtifactPath(sourcePath);
  const sourceDir = dirname(source.value);
  const path = normalizeInsideArtifactRoot([...splitPath(sourceDir), ...splitPath(rawLinkTarget)], rawLinkTarget);
  return artifactPath(path);
}

function asArtifactPath(value: ArtifactPath | string): ArtifactPath {
  return typeof value === "string" ? artifactPath(value) : value;
}

function dirname(path: string): string {
  const index = path.lastIndexOf("/");
  if (index === -1) return "";
  return path.slice(0, index);
}

function splitPath(path: string): string[] {
  if (path.length === 0) return [];
  return path.replaceAll("\\", "/").split("/");
}

function normalizeInsideArtifactRoot(segments: string[], rawLinkTarget: string): string {
  const stack: string[] = [];
  for (const segment of segments) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") {
      if (stack.length === 0) throw new Error(`IdRef target must stay inside artifact root: ${rawLinkTarget}`);
      stack.pop();
    } else {
      stack.push(segment);
    }
  }
  if (stack.length === 0) throw new Error(`IdRef target must not point to artifact root: ${rawLinkTarget}`);
  return stack.join("/");
}

function splitList(value: string): string[] {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
