#!/usr/bin/env bun

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

type ExampleSnapshot = {
  name: string;
  workdir: string;
  intent?: string;
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
  },
  {
    name: "Ideation completed",
    workdir: "examples/03-ideation-completed",
    intent: "20260628-discovery-brief-creation",
  },
  {
    name: "Inception completed",
    workdir: "examples/04-inception-completed",
    intent: "20260628-discovery-brief-creation",
  },
  {
    name: "Construction design ready",
    workdir: "examples/05-construction-design-ready",
    intent: "20260628-discovery-brief-creation",
  },
];

const mode = Bun.argv[2] ?? "--all";
const targets = selectTargets(mode);
let failed = false;

if (mode === "--workspaces-only" || mode === "--all") {
  failed = !validateSkillProvenance() || failed;
}

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
        errors.push(`${entry.snapshot}: md5 mismatch for ${skillFile.path}: expected ${skillFile.md5}, actual ${actualMd5}`);
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
