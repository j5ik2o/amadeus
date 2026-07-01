import { type TableContract } from "./table-contract";

export type ArtifactContract = {
  artifactType: string;
  pathPattern: string;
  documentType: string;
  requiredHeadings: readonly string[];
  tables: readonly TableContract[];
};
