import { functionalDesignArtifacts } from "./functional-design";
import { inceptionArtifacts } from "./inception";

export const artifactContracts = [
  ...inceptionArtifacts,
  ...functionalDesignArtifacts,
] as const;
