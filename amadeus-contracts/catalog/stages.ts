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
] as const satisfies readonly StageContract[];
