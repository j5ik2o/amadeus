import { type LlmRequest } from "./llm-request";

export type MockLlmCase = {
  apply?: (request: LlmRequest) => Promise<void> | void;
  message: string;
};
