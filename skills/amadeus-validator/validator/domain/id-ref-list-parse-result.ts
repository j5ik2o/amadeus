import { type CheckResult } from "./check-result";
import { type IdRef } from "./id-ref-type";

export type IdRefListParseResult<TId extends { readonly kind: string; readonly value: string }> = {
  refs: IdRef<TId>[];
  results: CheckResult[];
};
