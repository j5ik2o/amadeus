import { type ArtifactRequirement } from "./artifact-requirement";
import { type ConditionalArtifactRequirement } from "./conditional-artifact-requirement";

export type StageContract = {
  phase: string;
  stage: string;
  execution: "ALWAYS" | "CONDITIONAL";
  requiredArtifacts: readonly ArtifactRequirement[];
  conditionalArtifacts: readonly ConditionalArtifactRequirement[];
  referenceRules: readonly string[];
};
