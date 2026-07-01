import type { SkillContractBoundary } from "./skill-contract-boundary";
import type { SkillContractCondition } from "./skill-contract-condition";
import type { SkillContractConsumerReference } from "./skill-contract-consumer-reference";
import type { SkillContractDelegation } from "./skill-contract-delegation";

export type SkillContract = {
  skillId: string;
  skillName: string;
  sourcePaths: readonly string[];
  generatedReferencePaths: readonly string[];
  prerequisites: readonly SkillContractCondition[];
  invariants: readonly SkillContractCondition[];
  postconditions: readonly SkillContractCondition[];
  readBoundary: SkillContractBoundary;
  writeBoundary: SkillContractBoundary;
  delegation: SkillContractDelegation;
  grillingConditions: readonly SkillContractCondition[];
  feedbackConditions: readonly SkillContractCondition[];
  consumerReferences: readonly SkillContractConsumerReference[];
};
