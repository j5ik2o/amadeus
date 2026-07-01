import { type LlmRequest } from "./llm-request";
import { type LlmResult } from "./llm-result";

export type LlmProvider = {
  describe(): string;
  previewCommand(request: LlmRequest): string[];
  run(request: LlmRequest): Promise<LlmResult>;
};
