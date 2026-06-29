export const taskGenerationStatuses = [
  "not_started",
  "in_progress",
  "ready_for_approval",
  "passed",
  "failed",
  "blocked",
] as const;

export const taskGenerationGateResultByStatus = {
  not_started: "not_ready",
  in_progress: "not_ready",
  ready_for_approval: "waiting_approval",
  passed: "passed",
  failed: "failed",
  blocked: "blocked",
} as const;

export const taskGenerationBlockedReasons = [
  "functional_design_missing",
  "functional_design_not_passed",
  "unit_design_missing",
  "bolt_scope_unresolved",
  "required_input_missing",
  "task_generation_conflict",
] as const;

export const taskGenerationEvidenceKinds = [
  "functional_design",
  "unit_design_brief",
  "bolt_module",
  "tasks",
  "notes",
  "approval",
] as const;

export const taskGenerationAllowedStateMatrix = [
  {
    status: "not_started",
    requiredEvidenceKinds: [],
    evidence: "forbidden",
    blockedReason: "forbidden",
  },
  {
    status: "in_progress",
    requiredEvidenceKinds: ["bolt_module"],
    evidence: "required",
    blockedReason: "forbidden",
  },
  {
    status: "ready_for_approval",
    requiredEvidenceKinds: ["functional_design", "unit_design_brief", "bolt_module", "tasks"],
    evidence: "required",
    blockedReason: "forbidden",
  },
  {
    status: "passed",
    requiredEvidenceKinds: ["functional_design", "unit_design_brief", "bolt_module", "tasks", "approval"],
    evidence: "required",
    blockedReason: "forbidden",
  },
  {
    status: "failed",
    requiredEvidenceKinds: [],
    evidence: "required",
    blockedReason: "optional",
  },
  {
    status: "blocked",
    requiredEvidenceKinds: [],
    evidence: "required",
    blockedReason: "required",
  },
] as const;

export const taskGenerationContract = {
  statuses: taskGenerationStatuses,
  gateResultByStatus: taskGenerationGateResultByStatus,
  blockedReasons: taskGenerationBlockedReasons,
  evidenceKinds: taskGenerationEvidenceKinds,
  allowedStateMatrix: taskGenerationAllowedStateMatrix,
} as const;
