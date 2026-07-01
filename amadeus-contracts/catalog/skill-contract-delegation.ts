export type SkillContractDelegation = {
  allowed: readonly {
    skillId: string;
    purpose: string;
  }[];
  order: readonly string[];
  prohibited: readonly string[];
};
