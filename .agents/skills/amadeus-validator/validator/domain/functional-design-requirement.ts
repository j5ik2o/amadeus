import { functionalDesignContract } from "../generated/functional-design-contract";

export type FunctionalDesignRequirement = (typeof functionalDesignContract.requirements)[number];
