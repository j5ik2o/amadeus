import { functionalDesignContract } from "../generated/functional-design-contract";

export type FunctionalDesignRunMode = (typeof functionalDesignContract.runModes)[number];
