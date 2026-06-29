#!/usr/bin/env bun

import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { generatedContractFiles, staleGeneratedContractFiles, writeGeneratedContractFiles } from "../../amadeus-contracts";

const root = resolve(import.meta.dir, "../../..");

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function assert(condition: boolean, message: string): void {
  if (!condition) fail(message);
}

const generatedPaths = generatedContractFiles().map((file) => file.path).sort();
for (const path of [
  "amadeus-contracts/generated/artifacts.json",
  "amadeus-contracts/generated/stages.json",
  "amadeus-contracts/generated/references.md",
  "skills/amadeus-validator/validator/generated/artifact-contracts.ts",
  "skills/amadeus-validator/validator/generated/functional-design-contract.ts",
  "skills/amadeus-validator/validator/generated/task-generation-contract.ts",
  ".agents/skills/amadeus-validator/validator/generated/artifact-contracts.ts",
  ".agents/skills/amadeus-validator/validator/generated/functional-design-contract.ts",
  ".agents/skills/amadeus-validator/validator/generated/task-generation-contract.ts",
]) {
  assert(generatedPaths.includes(path), `generated contract file is not tracked: ${path}`);
}

for (const path of [
  "amadeus-contracts/catalog/artifacts.ts",
  "amadeus-contracts/catalog/inception.ts",
  "amadeus-contracts/catalog/phases.ts",
  "amadeus-contracts/catalog/stages.ts",
  "amadeus-contracts/catalog/functional-design.ts",
  "amadeus-contracts/catalog/task-generation.ts",
]) {
  assert(existsSync(join(root, path)), `contract catalog source missing: ${path}`);
}

const stale = staleGeneratedContractFiles();
assert(stale.length === 0, `generated contracts are stale: ${stale.join(", ")}`);

const tempRoot = mkdtempSync(join(tmpdir(), "amadeus-contracts-eval"));
writeGeneratedContractFiles(tempRoot);
writeFileSync(join(tempRoot, "amadeus-contracts/generated/artifacts.json"), "{\n  \"edited\": true\n}\n");
const staleAfterEdit = staleGeneratedContractFiles(tempRoot);
assert(
  staleAfterEdit.includes("amadeus-contracts/generated/artifacts.json"),
  "contracts check detects direct edits to generated files",
);

console.log("amadeus contracts eval: ok");
