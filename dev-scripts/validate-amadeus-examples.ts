#!/usr/bin/env bun

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

type ExampleSnapshot = {
  name: string;
  workdir: string;
  intent?: string;
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

const validator = ".agents/skills/amadeus-validator/validator/AmadeusValidator.ts";
const provenanceManifestPath = "examples/skill-provenance.json";
const snapshots: ExampleSnapshot[] = [
  {
    name: "Discovery completed",
    workdir: "examples/01-discovery-completed",
  },
  {
    name: "Intent initialized",
    workdir: "examples/02-intent-initialized",
    intent: "20260628-discovery-brief-creation",
    expectedState: {
      phase: "initialized",
      status: "in_progress",
      "initialized.status": "completed",
    },
  },
  {
    name: "Ideation completed",
    workdir: "examples/03-ideation-completed",
    intent: "20260628-discovery-brief-creation",
    expectedState: {
      phase: "ideation",
      status: "completed",
      "ideation.status": "completed",
      "ideation.gate": "passed",
    },
  },
  {
    name: "Inception completed",
    workdir: "examples/04-inception-completed",
    intent: "20260628-discovery-brief-creation",
    expectedState: {
      phase: "inception",
      status: "completed",
      "inception.status": "completed",
      "inception.gate": "passed",
    },
  },
  {
    name: "Construction design ready",
    workdir: "examples/05-construction-design-ready",
    intent: "20260628-discovery-brief-creation",
    expectedState: {
      phase: "construction",
      status: "in_progress",
      "inception.status": "completed",
      "inception.gate": "passed",
      "construction.status": "in_progress",
      "construction.bolts.0.designGate.status": "ready",
      "construction.bolts.0.tasks.status": "generated",
    },
  },
];

const mode = Bun.argv[2] ?? "--all";
const targets = selectTargets(mode);
let failed = false;

if (mode === "--workspaces-only" || mode === "--all") {
  failed = !validateSkillProvenance() || failed;
}

failed = !validateSnapshotStates(stateValidationTargets(targets)) || failed;

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
    if (!target.intent || !target.expectedState) continue;
    const statePath = `${target.workdir}/.amadeus/intents/${target.intent}/state.json`;
    if (!existsSync(statePath)) {
      errors.push(`${target.workdir}: missing intent state: ${statePath}`);
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
