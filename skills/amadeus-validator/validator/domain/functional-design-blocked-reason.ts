import { functionalDesignContract } from "../generated/functional-design-contract";

export type FunctionalDesignBlockedReason = (typeof functionalDesignContract.blockedReasons)[number];
