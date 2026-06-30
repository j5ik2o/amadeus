#!/usr/bin/env bun

import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { domainPlacementContract } from "../amadeus-contracts/catalog";

type ExampleSnapshot = {
  name: string;
  workdir: string;
  intent?: string;
  statePath?: string;
  expectedState?: Record<string, string>;
};

type SkillProvenanceManifest = {
  version: 1;
  entries: SkillProvenanceEntry[];
};

type SkillProvenanceEntry = {
  snapshot: string;
  skillFiles: SkillFileDigest[];
};

type SkillFileDigest = {
  path: string;
  md5: string;
  staleReason?: string;
};

const expectedGenerationSnapshots = [
  "examples/01-discovery-completed",
  "examples/02-ideation-completed",
  "examples/03-inception-completed",
  "examples/04-construction-design-ready",
];
const validator = ".agents/skills/amadeus-validator/validator/AmadeusValidator.ts";
const provenanceManifestPath = "examples/skill-provenance.json";
const snapshots: ExampleSnapshot[] = [
  {
    name: "Discovery completed",
    workdir: "examples/01-discovery-completed",
    statePath: "examples/01-discovery-completed/.amadeus/discoveries/20260629-ec-site-construction/state.json",
    expectedState: {
      phase: "discovery",
      status: "completed",
      decision: "multi_intent",
      gate: "passed",
    },
  },
  {
    name: "Ideation completed",
    workdir: "examples/02-ideation-completed",
    intent: "20260629-minimum-purchase-flow",
    expectedState: {
      phase: "ideation",
      status: "completed",
      "ideation.status": "completed",
      "ideation.gate": "passed",
    },
  },
  {
    name: "Inception completed",
    workdir: "examples/03-inception-completed",
    intent: "20260629-minimum-purchase-flow",
    expectedState: {
      phase: "inception",
      status: "completed",
      "inception.status": "completed",
      "inception.gate": "passed",
    },
  },
  {
    name: "Construction task generation ready",
    workdir: "examples/04-construction-design-ready",
    intent: "20260629-minimum-purchase-flow",
    expectedState: {
      phase: "construction",
      status: "in_progress",
      "inception.status": "completed",
      "inception.gate": "passed",
      "construction.status": "in_progress",
      "construction.functionalDesign.units.1.requirement": "required",
      "construction.functionalDesign.units.1.status": "ready_for_approval",
      "construction.bolts.0.taskGeneration.status": "ready_for_approval",
    },
  },
];

const mode = Bun.argv[2] ?? "--all";
if (mode === "--generation-plan") {
  process.exitCode = validateGenerationPlan() ? 0 : 1;
  process.exit();
}
const targets = selectTargets(mode);
let failed = false;

if (mode === "--workspaces-only" || mode === "--all") {
  failed = !validateSkillProvenance() || failed;
}

failed = !validateSnapshotStates(stateValidationTargets(targets)) || failed;
failed = !validateSharedDomainMaps(stateValidationTargets(targets)) || failed;
failed = !validateNoInceptionDomainFileSets(stateValidationTargets(targets)) || failed;
failed = !validateNoLegacySharedDomainReferences(stateValidationTargets(targets)) || failed;

for (const target of targets) {
  const args = ["run", validator, target.workdir, ...(target.intent ? [target.intent] : [])];
  console.log(`## ${target.name}`);
  console.log(`$ bun ${args.join(" ")}`);

  const result = Bun.spawnSync({
    cmd: ["bun", ...args],
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = new TextDecoder().decode(result.stdout);
  const stderr = new TextDecoder().decode(result.stderr);
  if (stdout.trim().length > 0) console.log(stdout.trimEnd());
  if (stderr.trim().length > 0) console.error(stderr.trimEnd());

  if (!result.success || /## 判定\s*\n\s*(fail|blocked)/.test(stdout)) {
    failed = true;
  }
}

function stateValidationTargets(targets: ExampleSnapshot[]): ExampleSnapshot[] {
  const targetWorkdirs = new Set(targets.map((target) => target.workdir));
  return snapshots.filter((snapshot) => targetWorkdirs.has(snapshot.workdir));
}

function validateSnapshotStates(targets: ExampleSnapshot[]): boolean {
  const errors: string[] = [];
  for (const target of targets) {
    if (!target.expectedState) continue;
    const statePath = target.statePath ?? `${target.workdir}/.amadeus/intents/${target.intent}/state.json`;
    if (!existsSync(statePath)) {
      errors.push(`${target.workdir}: missing state file: ${statePath}`);
      continue;
    }
    let state: unknown;
    try {
      state = JSON.parse(readFileSync(statePath, "utf8"));
    } catch (error) {
      errors.push(`${target.workdir}: invalid state JSON: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    for (const [path, expected] of Object.entries(target.expectedState)) {
      const actual = stateValue(state, path);
      if (actual !== expected) {
        errors.push(`${target.workdir}: expected state.${path} to be ${JSON.stringify(expected)}, actual ${JSON.stringify(actual)}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("## Example snapshot states");
    for (const error of errors) console.error(`- ${error}`);
    return false;
  }

  console.log("## Example snapshot states");
  console.log("snapshot states: ok");
  return true;
}

function validateNoInceptionDomainFileSets(targets: ExampleSnapshot[]): boolean {
  const errors: string[] = [];
  for (const target of targets) {
    const legacySharedDomainRoot = `${target.workdir}/${domainPlacementContract.legacySharedDomainRoot}`;
    if (existsSync(legacySharedDomainRoot)) {
      errors.push(`${target.workdir}: legacy shared domain directory must not exist`);
    }
    if (!target.intent) continue;
    const domainRoot = [
      target.workdir,
      ".amadeus",
      "intents",
      target.intent,
      ...domainPlacementContract.legacyIntentDomainSegments,
    ].join("/");
    if (existsSync(domainRoot)) errors.push(`${target.workdir}: legacy Intent domain directory must not exist`);
  }

  if (errors.length > 0) {
    console.error("## Example inception domain files");
    for (const error of errors) console.error(`- ${error}`);
    return false;
  }

  console.log("## Example inception domain files");
  console.log("inception domain files: ok");
  return true;
}

function validateSharedDomainMaps(targets: ExampleSnapshot[]): boolean {
  const errors: string[] = [];
  for (const target of targets) {
    for (const artifact of domainPlacementContract.sharedDomainArtifacts) {
      const path = `${target.workdir}/${artifact}`;
      if (!existsSync(path)) errors.push(`${target.workdir}: missing shared domain artifact: ${artifact}`);
    }
  }

  if (errors.length > 0) {
    console.error("## Example shared domain maps");
    for (const error of errors) console.error(`- ${error}`);
    return false;
  }

  console.log("## Example shared domain maps");
  console.log("shared domain maps: ok");
  return true;
}

function validateNoLegacySharedDomainReferences(targets: ExampleSnapshot[]): boolean {
  const errors: string[] = [];
  const legacyFragments = [
    "domain/subdomains.md",
    "domain/bounded-contexts.md",
    ".amadeus/domain/",
  ];
  for (const target of targets) {
    const root = `${target.workdir}/.amadeus`;
    for (const file of listFiles(root)) {
      const path = `${root}/${file}`;
      const text = readFileSync(path, "utf8");
      for (const fragment of legacyFragments) {
        if (text.includes(fragment)) errors.push(`${path}: legacy shared domain reference remains: ${fragment}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("## Example legacy shared domain references");
    for (const error of errors) console.error(`- ${error}`);
    return false;
  }

  console.log("## Example legacy shared domain references");
  console.log("legacy shared domain references: ok");
  return true;
}

function listFiles(root: string, prefix = ""): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(prefix ? `${root}/${prefix}` : root)) {
    const relativePath = prefix ? `${prefix}/${entry}` : entry;
    const absolutePath = `${root}/${relativePath}`;
    if (statSync(absolutePath).isDirectory()) {
      files.push(...listFiles(root, relativePath));
    } else {
      files.push(relativePath);
    }
  }
  return files.sort();
}

function stateValue(state: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, state);
}

if (failed) {
  process.exitCode = 1;
}

function selectTargets(mode: string): ExampleSnapshot[] {
  if (mode === "--workspaces-only") {
    return snapshots.map(({ name, workdir }) => ({ name, workdir }));
  }
  if (mode === "--intents-only") {
    return snapshots.filter((snapshot) => snapshot.intent);
  }
  if (mode === "--all") {
    return [
      ...snapshots.map(({ name, workdir }) => ({ name, workdir })),
      ...snapshots.filter((snapshot) => snapshot.intent),
    ];
  }
  console.error(`unknown mode: ${mode}`);
  process.exit(1);
}

function validateGenerationPlan(): boolean {
  console.log("## Example generation plan");
  let ok = true;
  ok = validateGenerationPlanCase([], expectedGenerationSnapshots, "01-discovery", "none") && ok;
  ok = validateGenerationPlanCase(
    ["--from", "03-inception"],
    [
      "examples/03-inception-completed",
      "examples/04-construction-design-ready",
    ],
    "03-inception",
    "examples/02-ideation-completed",
  ) && ok;
  ok = validateGenerationPlanCase(
    ["--from", "04-construction-design-ready"],
    [
      "examples/04-construction-design-ready",
    ],
    "04-construction-design-ready",
    "examples/03-inception-completed",
  ) && ok;
  ok = validatePartialProvenancePreservesUpstreamDigests() && ok;
  if (ok) console.log("generation plan: ok");
  return ok;
}

function validatePartialProvenancePreservesUpstreamDigests(): boolean {
  const ideationAndEarlierPaths = [
    "skills/amadeus-steering/SKILL.md",
    "skills/amadeus-discovery/SKILL.md",
    "skills/amadeus-ideation/SKILL.md",
    "skills/amadeus-ideation-intent-capture/SKILL.md",
    "skills/amadeus-ideation-scope-framing/SKILL.md",
    "skills/amadeus-ideation-feasibility-shaping/SKILL.md",
    "skills/amadeus-ideation-mock-framing/SKILL.md",
    "skills/amadeus-ideation-traceability-finalization/SKILL.md",
  ];
  const inceptionPaths = [
    "skills/amadeus-inception/SKILL.md",
    "skills/amadeus-inception-requirements-definition/SKILL.md",
    "skills/amadeus-inception-user-stories/SKILL.md",
    "skills/amadeus-inception-use-cases/SKILL.md",
    "skills/amadeus-inception-units-generation/SKILL.md",
    "skills/amadeus-inception-traceability-finalization/SKILL.md",
  ];

  return validatePartialProvenanceCase(
    "03-inception",
    ["examples/03-inception-completed", "examples/04-construction-design-ready"],
    ideationAndEarlierPaths,
  ) && validatePartialProvenanceCase(
    "04-construction-design-ready",
    ["examples/04-construction-design-ready"],
    [...ideationAndEarlierPaths, ...inceptionPaths],
  );
}

function validatePartialProvenanceCase(from: string, snapshotsToMutate: string[], upstreamPathsToPreserve: string[]): boolean {
  const tempDir = mkdtempSync(join(tmpdir(), "amadeus-provenance-"));
  const tempManifestPath = join(tempDir, "skill-provenance.json");
  try {
    const manifest = JSON.parse(readFileSync(provenanceManifestPath, "utf8")) as SkillProvenanceManifest;
    const sentinelMd5 = "00000000000000000000000000000176";
    const sentinelReason = "fixture stale digest from earlier snapshot";
    const upstreamPaths = new Set(upstreamPathsToPreserve);

    for (const entry of manifest.entries) {
      if (!snapshotsToMutate.includes(entry.snapshot)) continue;
      for (const skillFile of entry.skillFiles) {
        if (upstreamPaths.has(skillFile.path)) {
          skillFile.md5 = sentinelMd5;
          skillFile.staleReason = sentinelReason;
        }
      }
    }
    writeFileSync(tempManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const result = Bun.spawnSync({
      cmd: ["bun", "run", "dev-scripts/generate-amadeus-examples.ts", "--dry-run", "--print-provenance", "--from", from],
      env: {
        ...Bun.env,
        AMADEUS_EXAMPLES_PROVENANCE_MANIFEST: tempManifestPath,
      },
      stdout: "pipe",
      stderr: "pipe",
    });
    const stdout = new TextDecoder().decode(result.stdout);
    const stderr = new TextDecoder().decode(result.stderr);
    if (!result.success) {
      if (stdout.trim().length > 0) console.log(stdout.trimEnd());
      if (stderr.trim().length > 0) console.error(stderr.trimEnd());
      return false;
    }

    const provenanceMarker = "provenance:\n";
    const provenanceIndex = stdout.indexOf(provenanceMarker);
    if (provenanceIndex < 0) {
      console.error("- missing provenance output");
      return false;
    }
    const printedManifest = JSON.parse(stdout.slice(provenanceIndex + provenanceMarker.length)) as SkillProvenanceManifest;
    const errors: string[] = [];
    for (const snapshot of snapshotsToMutate) {
      const entry = printedManifest.entries.find((item) => item.snapshot === snapshot);
      if (!entry) {
        errors.push(`${snapshot}: missing provenance entry`);
        continue;
      }
      for (const path of upstreamPaths) {
        const skillFile = entry.skillFiles.find((item) => item.path === path);
        if (!skillFile) {
          errors.push(`${snapshot}: missing upstream skill file: ${path}`);
        } else if (skillFile.md5 !== sentinelMd5) {
          errors.push(`${snapshot}: upstream digest was not preserved for ${path}`);
        } else if (skillFile.staleReason !== sentinelReason) {
          errors.push(`${snapshot}: upstream staleReason was not preserved for ${path}`);
        }
      }
    }
    if (errors.length > 0) {
      for (const error of errors) console.error(`- ${error}`);
      return false;
    }
    return true;
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function validateGenerationPlanCase(args: string[], expectedSnapshots: string[], expectedFrom: string, expectedInputSnapshot: string): boolean {
  const result = Bun.spawnSync({
    cmd: ["bun", "run", "dev-scripts/generate-amadeus-examples.ts", "--dry-run", ...args],
    stdout: "pipe",
    stderr: "pipe",
  });
  const stdout = new TextDecoder().decode(result.stdout);
  const stderr = new TextDecoder().decode(result.stderr);
  if (stdout.trim().length > 0) console.log(stdout.trimEnd());
  if (stderr.trim().length > 0) console.error(stderr.trimEnd());
  if (!result.success) return false;

  const actualFrom = stdout.split("\n").find((line) => line.startsWith("from: "))?.slice("from: ".length).trim();
  const actualInputSnapshot = stdout.split("\n").find((line) => line.startsWith("inputSnapshot: "))?.slice("inputSnapshot: ".length).trim();
  const actualSnapshots = stdout
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
  const errors: string[] = [];
  if (actualFrom !== expectedFrom) {
    errors.push(`from expected ${expectedFrom}, actual ${actualFrom ?? "missing"}`);
  }
  if (actualInputSnapshot !== expectedInputSnapshot) {
    errors.push(`inputSnapshot expected ${expectedInputSnapshot}, actual ${actualInputSnapshot ?? "missing"}`);
  }
  if (actualSnapshots.length !== expectedSnapshots.length) {
    errors.push(`expected ${expectedSnapshots.length} snapshots, actual ${actualSnapshots.length}`);
  }
  for (const [index, expectedSnapshot] of expectedSnapshots.entries()) {
    if (actualSnapshots[index] !== expectedSnapshot) {
      errors.push(`snapshot[${index}] expected ${expectedSnapshot}, actual ${actualSnapshots[index] ?? "missing"}`);
    }
  }
  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    return false;
  }
  return true;
}

function findProvenanceSkillFile(manifest: SkillProvenanceManifest, snapshot: string, path: string): SkillFileDigest | undefined {
  return manifest.entries.find((entry) => entry.snapshot === snapshot)?.skillFiles.find((skillFile) => skillFile.path === path);
}

function validateSkillProvenance(): boolean {
  console.log("## Example skill provenance");
  if (!existsSync(provenanceManifestPath)) {
    console.error(`missing provenance manifest: ${provenanceManifestPath}`);
    return false;
  }

  let manifest: SkillProvenanceManifest;
  try {
    manifest = JSON.parse(readFileSync(provenanceManifestPath, "utf8")) as SkillProvenanceManifest;
  } catch (error) {
    console.error(`invalid provenance manifest JSON: ${provenanceManifestPath}`);
    console.error(error instanceof Error ? error.message : String(error));
    return false;
  }

  const errors: string[] = [];
  if (manifest.version !== 1) {
    errors.push("version must be 1");
  }
  if (!Array.isArray(manifest.entries)) {
    errors.push("entries must be an array");
  }
  if (errors.length > 0 || !Array.isArray(manifest.entries)) {
    return reportProvenanceErrors(errors);
  }

  const expectedSnapshots = new Set(snapshots.map((snapshot) => snapshot.workdir));
  const seenSnapshots = new Set<string>();

  for (const entry of manifest.entries) {
    if (!expectedSnapshots.has(entry.snapshot)) {
      errors.push(`unknown snapshot: ${entry.snapshot}`);
      continue;
    }
    if (seenSnapshots.has(entry.snapshot)) {
      errors.push(`duplicate snapshot: ${entry.snapshot}`);
    }
    seenSnapshots.add(entry.snapshot);

    if (!Array.isArray(entry.skillFiles) || entry.skillFiles.length === 0) {
      errors.push(`${entry.snapshot}: skillFiles must be a non-empty array`);
      continue;
    }

    for (const skillFile of entry.skillFiles) {
      if (!skillFile.path.startsWith("skills/") || !skillFile.path.endsWith("/SKILL.md")) {
        errors.push(`${entry.snapshot}: skill file path must be skills/**/SKILL.md: ${skillFile.path}`);
        continue;
      }
      if (!/^[a-f0-9]{32}$/.test(skillFile.md5)) {
        errors.push(`${entry.snapshot}: invalid md5 for ${skillFile.path}: ${skillFile.md5}`);
        continue;
      }
      if (!existsSync(skillFile.path)) {
        errors.push(`${entry.snapshot}: missing skill file: ${skillFile.path}`);
        continue;
      }

      const actualMd5 = md5File(skillFile.path);
      if (actualMd5 !== skillFile.md5) {
        if (typeof skillFile.staleReason === "string" && skillFile.staleReason.trim().length > 0) {
          console.warn(`${entry.snapshot}: stale skill provenance for ${skillFile.path}: ${skillFile.staleReason}`);
        } else {
          errors.push(`${entry.snapshot}: md5 mismatch for ${skillFile.path}: expected ${skillFile.md5}, actual ${actualMd5}`);
        }
      } else if (skillFile.staleReason !== undefined) {
        errors.push(`${entry.snapshot}: staleReason must be removed when md5 is current for ${skillFile.path}`);
      }
    }
  }

  for (const snapshot of expectedSnapshots) {
    if (!seenSnapshots.has(snapshot)) {
      errors.push(`missing snapshot provenance: ${snapshot}`);
    }
  }

  if (errors.length > 0) {
    return reportProvenanceErrors(errors);
  }

  console.log("skill provenance: ok");
  return true;
}

function md5File(path: string): string {
  return createHash("md5").update(readFileSync(path)).digest("hex");
}

function reportProvenanceErrors(errors: string[]): boolean {
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  return false;
}
