import { type ArtifactRequirement } from "./artifact-requirement";

export type ConditionalArtifactRequirement = ArtifactRequirement & {
  conditionField: string;
  conditionValue: string;
};
