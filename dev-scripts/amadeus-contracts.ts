import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { artifactContracts, functionalDesignContract, phaseContracts, stageContracts } from "../amadeus-contracts/catalog";

const root = resolve(import.meta.dir, "..");

type GeneratedFile = {
  path: string;
  content: string;
};

export function generatedContractFiles(): GeneratedFile[] {
  const artifactsJson = stableJson({
    artifactContracts,
  });
  const stagesJson = stableJson({
    phaseContracts,
    stageContracts,
    functionalDesign: functionalDesignContract,
  });
  const references = [
    "# Amadeus DLC Contract Catalog Reference",
    "",
    "この文書は `amadeus-contracts/catalog/**` から生成する。",
    "直接編集せず、Catalog を更新してから `npm run contracts:generate` を実行する。",
    "",
    "## Functional Design",
    "",
    "Functional Design は Construction の `3.1 Functional Design` で扱う。",
    "Execution は `CONDITIONAL` である。",
    "必要性は `state.json.construction.functionalDesign` で表す。",
    "成果物の必須性は Catalog から導出する。",
    "",
    "### Core Artifacts",
    "",
    ...functionalDesignContract.coreArtifacts.map((artifact) => `- \`${artifact.fileName}\`: ${artifact.requiredWhen}`),
    "",
    "### Conditional Artifacts",
    "",
    `- \`${functionalDesignContract.frontendArtifact.fileName}\`: \`${functionalDesignContract.frontendArtifact.conditionField}: ${functionalDesignContract.frontendArtifact.conditionValue}\` の場合に必須である。`,
    "",
    "### Gate Result",
    "",
    ...Object.entries(functionalDesignContract.gateResultByStatus).map(([status, gate]) => `- \`${status}\` -> \`${gate}\``),
    "",
  ].join("\n");
  const validatorCopy = [
    "// Generated from amadeus-contracts/catalog/**. Do not edit by hand.",
    `export const functionalDesignContract = ${stableJson(functionalDesignContract).trimEnd()} as const;`,
    "",
  ].join("\n");

  return [
    { path: "amadeus-contracts/generated/artifacts.json", content: artifactsJson },
    { path: "amadeus-contracts/generated/stages.json", content: stagesJson },
    { path: "amadeus-contracts/generated/references.md", content: references },
    { path: "skills/amadeus-validator/validator/generated/functional-design-contract.ts", content: validatorCopy },
  ];
}

export function writeGeneratedContractFiles(): void {
  for (const file of generatedContractFiles()) {
    const target = join(root, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content);
  }
}

export function staleGeneratedContractFiles(): string[] {
  const stale: string[] = [];
  for (const file of generatedContractFiles()) {
    const target = join(root, file.path);
    let current = "";
    try {
      current = readFileSync(target, "utf8");
    } catch {
      stale.push(file.path);
      continue;
    }
    if (current !== file.content) stale.push(file.path);
  }
  return stale;
}

function stableJson(value: unknown): string {
  return JSON.stringify(value, null, 2) + "\n";
}
