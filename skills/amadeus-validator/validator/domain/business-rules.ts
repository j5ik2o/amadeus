import { type BusinessRule } from "./business-rule";

export type BusinessRules = {
  kind: "BusinessRules";
  rules: BusinessRule[];
};
