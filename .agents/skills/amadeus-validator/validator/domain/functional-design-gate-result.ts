import { functionalDesignContract } from "../generated/functional-design-contract";
import { type FunctionalDesignStatus } from "./functional-design-status";

export type FunctionalDesignGateResult = (typeof functionalDesignContract.gateResultByStatus)[FunctionalDesignStatus];
