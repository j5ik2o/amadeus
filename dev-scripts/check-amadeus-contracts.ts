#!/usr/bin/env bun

import { staleGeneratedContractFiles } from "./amadeus-contracts";

const stale = staleGeneratedContractFiles();
if (stale.length > 0) {
  console.error("amadeus contracts: stale generated files");
  for (const path of stale) console.error(`- ${path}`);
  process.exit(1);
}

console.log("amadeus contracts: ok");
