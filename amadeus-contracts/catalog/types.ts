export type ArtifactContract = {
  artifactType: string;
  pathPattern: string;
  documentType: string;
  requiredHeadings: readonly string[];
  tables: readonly TableContract[];
};

export type TableContract = {
  heading: string;
  columns: readonly string[];
};

export type ArtifactRequirement = {
  artifactType: string;
  fileName: string;
  requiredWhen: string;
};

export type ConditionalArtifactRequirement = ArtifactRequirement & {
  conditionField: string;
  conditionValue: string;
};

export type StageContract = {
  phase: string;
  stage: string;
  execution: "ALWAYS" | "CONDITIONAL";
  requiredArtifacts: readonly ArtifactRequirement[];
  conditionalArtifacts: readonly ConditionalArtifactRequirement[];
  referenceRules: readonly string[];
};

export type PhaseContract = {
  phase: string;
  statePath: string;
  stages: readonly string[];
  gateRules: readonly string[];
};
