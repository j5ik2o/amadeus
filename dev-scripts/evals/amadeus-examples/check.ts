#!/usr/bin/env bun

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

import { domainPlacementContract, functionalDesignContract, taskGenerationContract } from "../../../amadeus-contracts/catalog";

type SkillFile = {
  path?: unknown;
  md5?: unknown;
  staleReason?: unknown;
};

type ProvenanceEntry = {
  snapshot?: unknown;
  skillFiles?: unknown;
};

const root = resolve(import.meta.dir, "../../..");
const provenancePath = "examples/skill-provenance.json";

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function md5File(path: string): string {
  return createHash("md5").update(readFileSync(path)).digest("hex");
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertHeading(path: string, heading: string): void {
  const text = readFileSync(path, "utf8");
  assert(new RegExp(`^## ${heading}$`, "m").test(text), `${path} must have heading: ${heading}`);
}

const manifest = JSON.parse(readFileSync(`${root}/${provenancePath}`, "utf8")) as { entries?: ProvenanceEntry[] };
assert(Array.isArray(manifest.entries), `${provenancePath} must have entries`);
const entries = manifest.entries;

for (const entry of entries) {
  const snapshot = String(entry.snapshot ?? "");
  assert(snapshot.startsWith("examples/"), `snapshot must be examples path: ${snapshot}`);
  assert(Array.isArray(entry.skillFiles), `${snapshot}: skillFiles must be an array`);

  for (const skillFile of entry.skillFiles as SkillFile[]) {
    const path = String(skillFile.path ?? "");
    assert(path.startsWith("skills/") && path.endsWith("/SKILL.md"), `${snapshot}: invalid skill path: ${path}`);
    assert(existsSync(`${root}/${path}`), `${snapshot}: missing skill file: ${path}`);

    const expected = String(skillFile.md5 ?? "");
    assert(/^[a-f0-9]{32}$/.test(expected), `${snapshot}: invalid md5 for ${path}: ${expected}`);
    const actual = md5File(`${root}/${path}`);
    if (actual !== expected) {
      assert(typeof skillFile.staleReason === "string" && skillFile.staleReason.trim().length > 0, `${snapshot}: md5 mismatch for ${path}: expected ${expected}, actual ${actual}`);
    } else {
      assert(skillFile.staleReason === undefined, `${snapshot}: staleReason must be removed when md5 is current for ${path}`);
    }
  }
}

const constructionExample = `${root}/examples/04-construction-design-ready/.amadeus/intents/20260629-minimum-purchase-flow`;
assert(
  !existsSync([constructionExample, ...domainPlacementContract.legacyIntentDomainSegments].join("/")),
  "construction example must not include the legacy Intent domain directory",
);
assert(
  !existsSync([constructionExample, "construction", "bolts", "B001-order-creation", "design.md"].join("/")),
  "construction example must not include bolt design.md",
);

const state = readJson(`${constructionExample}/state.json`);
assert(isRecord(state), "construction example state must be an object");
assert(isRecord(state.construction), "construction example must have construction state");
assert(Array.isArray(state.construction.bolts), "construction example must have construction bolts");

const bolt = state.construction.bolts.find((item) => isRecord(item) && item.id === "B001");
assert(isRecord(bolt), "construction example must have B001 bolt state");
assert(bolt.designGate === undefined, "construction example must not have designGate");
assert(isRecord(bolt.taskGeneration), "construction example must have taskGeneration");
const taskGeneration = bolt.taskGeneration;
assert(typeof taskGeneration.status === "string", "taskGeneration status must be a string");
assert(Array.isArray(taskGeneration.evidence), "taskGeneration evidence must be an array");

const taskGenerationRule = taskGenerationContract.allowedStateMatrix.find((item) => item.status === taskGeneration.status);
assert(taskGenerationRule, `unknown taskGeneration status: ${taskGeneration.status}`);

const evidence = taskGeneration.evidence;
const evidenceKinds = new Set<string>();
for (const item of evidence) {
  assert(isRecord(item), "taskGeneration evidence item must be an object");
  assert(typeof item.kind === "string", "taskGeneration evidence kind must be a string");
  assert(typeof item.path === "string", "taskGeneration evidence path must be a string");
  assert(
    taskGenerationContract.evidenceKinds.includes(item.kind as (typeof taskGenerationContract.evidenceKinds)[number]),
    `unknown taskGeneration evidence kind: ${item.kind}`,
  );
  evidenceKinds.add(item.kind);
  assert(existsSync(`${constructionExample}/${item.path}`), `missing taskGeneration evidence path: ${item.path}`);
}

for (const kind of taskGenerationRule.requiredEvidenceKinds) {
  assert(evidenceKinds.has(kind), `taskGeneration evidence must include ${kind}`);
}

for (const artifact of functionalDesignContract.artifacts) {
  const fileName = basename(artifact.pathPattern);
  const matchingEvidence = evidence.find((item) => {
    assert(isRecord(item), "taskGeneration evidence item must be an object");
    return item.kind === "functional_design" && typeof item.path === "string" && basename(item.path) === fileName;
  });
  assert(isRecord(matchingEvidence), `taskGeneration evidence must include ${fileName}`);
  assert(typeof matchingEvidence.path === "string", `functional design evidence path must be a string: ${fileName}`);
  const fullPath = `${constructionExample}/${matchingEvidence.path}`;
  assert(existsSync(fullPath), `functional design artifact must exist: ${matchingEvidence.path}`);
  for (const heading of artifact.requiredHeadings) assertHeading(fullPath, heading);
}

console.log("amadeus examples eval: ok");
