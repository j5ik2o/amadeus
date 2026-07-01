import { type BoltId } from "./bolt-id";
import { type RequirementId } from "./requirement-id";
import { type StoryId } from "./story-id";
import { type UnitId } from "./unit-id";
import { type UseCaseId } from "./use-case-id";

export type IdRefTargetId = RequirementId | StoryId | UseCaseId | UnitId | BoltId;
