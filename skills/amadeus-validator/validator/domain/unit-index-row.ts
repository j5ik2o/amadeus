import { type BoundedContextId } from "./bounded-context-id";
import { type RequirementId } from "./requirement-id";
import { type UnitId } from "./unit-id";

export type UnitIndexRow = {
  unitId: UnitId;
  summary: string;
  requirementIds: RequirementId[];
  contextIds: BoundedContextId[];
  dependencyUnitIds: UnitId[];
  detail: string;
};
