import { type CheckResult } from "./check-result";
import { type IdRefTargetId } from "./id-ref-target-id";
import { type IdRef } from "./id-ref-type";

export type IdRefListParseResult<TId extends IdRefTargetId> = {
  refs: IdRef<TId>[];
  results: CheckResult[];
};
