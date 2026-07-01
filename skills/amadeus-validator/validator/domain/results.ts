import { type CheckResult } from "./check-result";

export type { CheckResult } from "./check-result";
export type { CheckResultKind } from "./check-result-kind";
export type { ParseResult } from "./parse-result";

export function pass(target: string, condition: string, evidence: string): CheckResult {
  return { result: "pass", target, condition, evidence };
}

export function warning(target: string, condition: string, evidence: string): CheckResult {
  return { result: "warning", target, condition, evidence };
}

export function fail(target: string, condition: string, evidence: string): CheckResult {
  return { result: "fail", target, condition, evidence };
}

export function blocked(target: string, condition: string, evidence: string): CheckResult {
  return { result: "blocked", target, condition, evidence };
}

export function skipped(target: string, condition: string, evidence: string): CheckResult {
  return { result: "skipped", target, condition, evidence };
}
