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
    blockedReason: "forbidden",
  },
  {
    status: "in_progress",
    requiredEvidenceKinds: ["bolt_module"],
    blockedReason: "forbidden",
  },
  {
    status: "ready_for_approval",
    requiredEvidenceKinds: ["functional_design", "unit_design_brief", "bolt_module", "tasks"],
    blockedReason: "forbidden",
  },
  {
    status: "passed",
    requiredEvidenceKinds: ["functional_design", "unit_design_brief", "bolt_module", "tasks", "approval"],
    blockedReason: "forbidden",
  },
  {
    status: "failed",
    requiredEvidenceKinds: [],
    blockedReason: "optional",
  },
  {
    status: "blocked",
    requiredEvidenceKinds: [],
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
