import { type UnitId } from "./unit-id";
import { type FunctionalDesignBlockedReason } from "./functional-design-blocked-reason";
import { type FunctionalDesignFrontendSurface } from "./functional-design-frontend-surface";
import { type FunctionalDesignRequirement } from "./functional-design-requirement";
import { type FunctionalDesignRunMode } from "./functional-design-run-mode";
import { type FunctionalDesignSkipReason } from "./functional-design-skip-reason";
import { type FunctionalDesignStatus } from "./functional-design-status";
import { type FunctionalDesignTargetSource } from "./functional-design-target-source";

export type FunctionalDesignUnitState = {
  unitId: UnitId;
  requirement: FunctionalDesignRequirement;
  status: FunctionalDesignStatus;
  frontendSurface: FunctionalDesignFrontendSurface;
  targetSource: FunctionalDesignTargetSource;
  runMode: FunctionalDesignRunMode;
  skipReason?: FunctionalDesignSkipReason;
  blockedReason?: FunctionalDesignBlockedReason;
};
