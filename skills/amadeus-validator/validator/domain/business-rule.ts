import { type RuleId } from "./rule-id";

export type BusinessRule = {
  ruleId: RuleId;
  rule: string;
  source: string;
  status: string;
};
