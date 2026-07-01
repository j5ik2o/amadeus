import type { SkillContractConsumer } from "./skill-contract-consumer";

export type SkillContractConsumerReference = {
  consumer: SkillContractConsumer;
  purpose: string;
  inputs: readonly string[];
};
