import { type CheckResult } from "./check-result";

export type ParseResult<TDocument> = {
  document: TDocument;
  results: CheckResult[];
};
