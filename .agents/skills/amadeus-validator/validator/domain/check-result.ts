import { type CheckResultKind } from "./check-result-kind";

export type CheckResult = {
  result: CheckResultKind;
  target: string;
  condition: string;
  evidence: string;
};
