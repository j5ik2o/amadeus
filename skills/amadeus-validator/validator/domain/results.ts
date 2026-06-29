export type CheckResultKind = "pass" | "fail" | "blocked" | "skipped";

export type CheckResult = {
  result: CheckResultKind;
  target: string;
  condition: string;
  evidence: string;
};

export type ParseResult<TDocument> = {
  document: TDocument;
  results: CheckResult[];
};

export function pass(target: string, condition: string, evidence: string): CheckResult {
  return { result: "pass", target, condition, evidence };
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
