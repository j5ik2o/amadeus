import type { PhaseContract } from "./types";

export const phaseContracts = [
  {
    phase: "construction",
    statePath: "state.json",
    stages: [
      "3.1 Functional Design",
      "3.2 Bolt Preparation",
      "3.3 Implementation Execution",
      "3.4 Verification Hardening",
      "3.5 Traceability Finalization",
    ],
    gateRules: [
      "Construction gate is derived from stage gates and human approval",
    ],
  },
] as const satisfies readonly PhaseContract[];
