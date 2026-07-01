import { functionalDesignContract } from "../generated/functional-design-contract";

export type FunctionalDesignStatus = (typeof functionalDesignContract.statuses)[number];
