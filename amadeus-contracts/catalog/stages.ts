import { functionalDesignCoreArtifacts, functionalDesignFrontendArtifact } from "./functional-design";
import type { StageContract } from "./types";

export const stageContracts = [
  {
    phase: "construction",
    stage: "3.1 Functional Design",
    execution: "CONDITIONAL",
    requiredArtifacts: functionalDesignCoreArtifacts,
    conditionalArtifacts: [functionalDesignFrontendArtifact],
    referenceRules: [
      "Unit state is resolved from state.json.construction.functionalDesign",
      "FunctionalDesignGateResult is derived from FunctionalDesignStatus and artifact validation",
    ],
  },
  {
    phase: "construction",
    stage: "3.2 Bolt Preparation",
    execution: "ALWAYS",
    requiredArtifacts: [],
    conditionalArtifacts: [],
    referenceRules: [
      "TaskGenerationGateResult is derived from TaskGenerationStatus and evidence validation",
      "Task generation evidence must not point to bolt-side design artifacts",
      "Task generation input is Functional Design, Unit Design Brief, and the target Bolt module file",
    ],
  },
] as const satisfies readonly StageContract[];
