#!/usr/bin/env bun

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { checkPublicTypeFile, writePublicTypeFileBaseline } from "./check";

const root = resolve(import.meta.dir, "../..");

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function writeProject(files: Record<string, string>): string {
  const projectRoot = mkdtempSync(join(tmpdir(), "amadeus-public-type-file"));
  for (const [path, text] of Object.entries(files)) {
    const absolutePath = join(projectRoot, path);
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, text);
  }
  return projectRoot;
}

const sampleRoot = writeProject({
  "src/good.ts": `
export type Good = {
  value: string;
};

type Internal = {
  value: string;
};

class InternalImplementation {
  value = "internal";
}

export function useGood(value: Good): Internal {
  new InternalImplementation();
  return value;
}
`,
  "src/bad.ts": `
export type First = {
  value: string;
};

export interface Second {
  value: string;
}
`,
  "src/listed.ts": `
type ListedFirst = {
  value: string;
};

interface ListedSecond {
  value: string;
}

class ListedThird {
  value = "third";
}

export type { ListedFirst };
export { type ListedSecond, ListedThird };
`,
  "src/default-local.ts": `
type DefaultFirst = {
  value: string;
};

class DefaultSecond {
  value = "second";
}

export type { DefaultFirst };
export default DefaultSecond;
`,
  "src/re-export.ts": `
export type { First, Second } from "./bad";
`,
});
process.once("exit", () => {
  rmSync(sampleRoot, { recursive: true, force: true });
});

const failedCheck = checkPublicTypeFile({
  root: sampleRoot,
  include: ["src"],
  baselinePath: join(sampleRoot, "public-type-file-baseline.json"),
});
assert(!failedCheck.ok, "file with multiple public types must fail without baseline");
assert(failedCheck.violations.length === 3, `three files must violate: ${failedCheck.violations.length}`);
assert(
  failedCheck.violations.some((violation) => violation.file === "src/listed.ts" && violation.publicTypeCount === 3),
  "same-file export list must count as public types",
);
assert(
  failedCheck.violations.some((violation) => violation.file === "src/default-local.ts" && violation.publicTypeCount === 2),
  "default export assignment of local type must count as a public type",
);
assert(
  failedCheck.messages.some((message) => message.includes("new public type file violation")),
  "new violation must be reported",
);

const baseline = writePublicTypeFileBaseline({
  root: sampleRoot,
  include: ["src"],
  baselinePath: join(sampleRoot, "public-type-file-baseline.json"),
});
assert(baseline.entries.length === 3, `baseline must capture three violations: ${baseline.entries.length}`);

const baselineCheck = checkPublicTypeFile({
  root: sampleRoot,
  include: ["src"],
  baselinePath: join(sampleRoot, "public-type-file-baseline.json"),
});
assert(baselineCheck.ok, "baseline violation must pass when public type count is unchanged");

writeFileSync(
  join(sampleRoot, "src/bad.ts"),
  `
export type First = {
  value: string;
};

export interface Second {
  value: string;
}

export type Third = {
  value: string;
};
`,
);
const increasedCheck = checkPublicTypeFile({
  root: sampleRoot,
  include: ["src"],
  baselinePath: join(sampleRoot, "public-type-file-baseline.json"),
});
assert(!increasedCheck.ok, "baseline violation must fail when public type count increases");
assert(
  increasedCheck.messages.some((message) => message.includes("public type count increased")),
  "public type count increase must be reported",
);

writeFileSync(
  join(sampleRoot, "src/bad.ts"),
  `
export type First = {
  value: string;
};
`,
);
const decreasedCheck = checkPublicTypeFile({
  root: sampleRoot,
  include: ["src"],
  baselinePath: join(sampleRoot, "public-type-file-baseline.json"),
});
assert(!decreasedCheck.ok, "baseline violation must fail when public type count decreases");
assert(
  decreasedCheck.messages.some((message) => message.includes("stale public type file baseline")),
  "public type count decrease must request baseline update",
);

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
  scripts?: Record<string, string>;
};
assert(
  packageJson.scripts?.["lint:public-type-file:report"] === "bun run lints/public-type-file/check.ts --report",
  "package script mismatch: lint:public-type-file:report",
);
assert(
  packageJson.scripts?.["lint:public-type-file:check"] === "bun run lints/public-type-file/check.ts --check",
  "package script mismatch: lint:public-type-file:check",
);
assert(
  packageJson.scripts?.["test:it:public-type-file"] === "bun run lints/public-type-file/eval.ts",
  "package script mismatch: test:it:public-type-file",
);
assert(
  packageJson.scripts?.["test:it:all"]?.includes("npm run test:it:public-type-file"),
  "test:it:all must run public-type-file eval",
);

const repoBaseline = JSON.parse(readFileSync(join(root, "lints/public-type-file/baseline.json"), "utf8")) as {
  entries?: unknown[];
};
assert(repoBaseline.entries?.length === 0, "public-type-file baseline must stay empty");

console.log("public type file eval: ok");
