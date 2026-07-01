import { type UnitId } from "./unit-id";
import { type FunctionalDesignUnitState } from "./functional-design-unit-state";

export type ConstructionFunctionalDesignState = {
  targetUnits: UnitId[];
  units: FunctionalDesignUnitState[];
};
