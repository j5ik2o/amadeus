#!/usr/bin/env bun

import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { analyzeTsComplexity, checkTsComplexity } from "./check";

const root = resolve(import.meta.dir, "../..");

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function writeProject(files: Record<string, string>): string {
  const projectRoot = mkdtempSync(join(tmpdir(), "amadeus-ts-complexity"));
  for (const [path, text] of Object.entries(files)) {
    const absolutePath = join(projectRoot, path);
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, text);
  }
  return projectRoot;
}

const sampleSource = `
export function simple(value: string): string {
  return value;
}

export function complex(value: number): string {
  function nested(input: number): string {
    if (input > 0) return "positive";
    return "other";
  }

  class First {
    constructor(input: number) {
      if (input > 0) {
        this.state = "positive";
      }
    }

    private state = "first";

    get value(): string {
      if (this.state.length > 0) return this.state;
      return "empty";
    }

    set value(next: string) {
      if (next.length > 0) {
        this.state = next;
      }
    }

    run(): string {
      return "first";
    }
  }

  class Second {
    run(): string {
      return "second";
    }
  }

  const labels = [1, 2]
    .map((input) => {
      if (input > 1) return "many";
      return "one";
    })
    .filter((label) => {
      if (label.length > 0) return true;
      return false;
    });
  labels.forEach((label) => {
    if (label.length > 1) return;
  });
  labels.forEach((label) => {
    if (label.length > 2) return;
  });
  const objectOne = {
    run(): string {
      if (labels.length > 0) return "one";
      return "empty";
    },
  };
  const objectTwo = {
    run(): string {
      if (labels.length > 1) return "two";
      return "empty";
    },
  };
  objectOne.run();
  objectTwo.run();
  nested(value);
  const first = new First(value);
  first.value = "updated";
  first.value;
  first.run();
  new Second().run();

  if (value > 0) {
    return "positive";
  }
  if (value === 0 || value === 1) {
    return "small";
  }
  switch (value) {
    case 2:
      return "two";
    case 3:
      return "three";
    default:
      return value > 10 ? "large" : "other";
  }
}
`;

const sampleRoot = writeProject({
  "src/sample.ts": sampleSource,
  "lints/lint-sample.ts": `
export function lintSample(value: number): string {
  if (value > 0) return "positive";
  return "other";
}
`,
});
process.once("exit", () => {
  rmSync(sampleRoot, { recursive: true, force: true });
});

const measurements = analyzeTsComplexity({
  root: sampleRoot,
  include: ["src"],
});
const defaultMeasurements = analyzeTsComplexity({ root: sampleRoot });
assert(
  defaultMeasurements.some((measurement) => measurement.file === "lints/lint-sample.ts"),
  "default include must measure lints directory",
);
const complexMeasurement = measurements.find((measurement) => measurement.name === "complex");
assert(complexMeasurement, "complex function must be measured");
assert(complexMeasurement.complexity === 8, `complex function score must be 8: ${complexMeasurement.complexity}`);
const nestedMeasurement = measurements.find((measurement) => measurement.name === "nested");
assert(nestedMeasurement, "nested function must be measured separately");
assert(measurements.some((measurement) => measurement.name === "constructor"), "constructor must be measured");
assert(measurements.some((measurement) => measurement.name === "value"), "accessor must be measured");
const runMeasurements = measurements.filter((measurement) => measurement.name === "run");
assert(runMeasurements.length === 4, `same-name methods must all be measured: ${runMeasurements.length}`);
assert(new Set(runMeasurements.map((measurement) => measurement.id)).size === 4, "same-name methods must not share IDs");
const accessorMeasurements = measurements.filter((measurement) => measurement.name === "value");
assert(
  new Set(accessorMeasurements.map((measurement) => measurement.id)).size === accessorMeasurements.length,
  "getter and setter must not share IDs",
);
const anonymousMeasurements = measurements.filter((measurement) => measurement.name === "<anonymous>");
assert(
  new Set(anonymousMeasurements.map((measurement) => measurement.id)).size === anonymousMeasurements.length,
  "same-parent anonymous callbacks must not share IDs",
);

const failedCheck = checkTsComplexity({
  root: sampleRoot,
  include: ["src"],
  maxComplexity: 4,
  baselinePath: join(sampleRoot, "complexity-baseline.json"),
});
assert(!failedCheck.ok, "new complexity violation must fail");
assert(
  failedCheck.messages.some((message) => message.includes("new complexity violation")),
  "new complexity violation must be reported",
);

writeFileSync(
  join(sampleRoot, "complexity-baseline.json"),
  JSON.stringify(
    {
      maxComplexity: 4,
      entries: [
        {
          id: "src/sample.ts#function:complex",
          complexity: 8,
          file: "src/sample.ts",
          name: "complex",
          line: 6,
        },
      ],
    },
    null,
    2,
  ) + "\n",
);
const baselineCheck = checkTsComplexity({
  root: sampleRoot,
  include: ["src"],
  maxComplexity: 4,
  baselinePath: join(sampleRoot, "complexity-baseline.json"),
});
assert(baselineCheck.ok, "baseline violation must pass when complexity is unchanged");

writeFileSync(join(sampleRoot, "src/sample.ts"), `\n${sampleSource}`);
const shiftedLineCheck = checkTsComplexity({
  root: sampleRoot,
  include: ["src"],
  maxComplexity: 4,
  baselinePath: join(sampleRoot, "complexity-baseline.json"),
});
assert(shiftedLineCheck.ok, "baseline ID must not change when unrelated lines are inserted");

writeFileSync(
  join(sampleRoot, "src/sample.ts"),
  `
export function simple(value: string): string {
  return value;
}

export function complex(value: number): string {
  if (value > 0) {
    return "positive";
  }
  if (value === 0 || value === 1) {
    return "small";
  }
  switch (value) {
    case 2:
      return "two";
    case 3:
      return "three";
    default:
      return "other";
  }
}
`,
);
const decreasedCheck = checkTsComplexity({
  root: sampleRoot,
  include: ["src"],
  maxComplexity: 4,
  baselinePath: join(sampleRoot, "complexity-baseline.json"),
});
assert(!decreasedCheck.ok, "baseline violation must fail when complexity decreases but remains over the limit");
assert(
  decreasedCheck.messages.some((message) => message.includes("complexity baseline is stale")),
  "complexity decrease must request baseline update",
);

writeFileSync(
  join(sampleRoot, "src/sample.ts"),
  `
export function simple(value: string): string {
  return value;
}

export function complex(value: number): string {
  if (value > 0) return "positive";
  if (value === 0 || value === 1) return "small";
  if (value === 2) return "two";
  if (value === 3) return "three";
  if (value === 4) return "four";
  if (value === 5) return "five";
  return value > 10 ? "large" : "other";
}
`,
);
const increasedCheck = checkTsComplexity({
  root: sampleRoot,
  include: ["src"],
  maxComplexity: 4,
  baselinePath: join(sampleRoot, "complexity-baseline.json"),
});
assert(!increasedCheck.ok, "baseline violation must fail when complexity increases");
assert(
  increasedCheck.messages.some((message) => message.includes("complexity increased")),
  "complexity increase must be reported",
);

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
  scripts?: Record<string, string>;
};
assert(packageJson.scripts?.["lint:check"], "package script missing: lint:check");
assert(packageJson.scripts?.["lint:ts-complexity:report"], "package script missing: lint:ts-complexity:report");
assert(packageJson.scripts?.["lint:ts-complexity:check"], "package script missing: lint:ts-complexity:check");
assert(
  packageJson.scripts?.["test:ci:mock"]?.includes("npm run lint:check"),
  "test:ci:mock must run lint:check",
);

console.log("ts complexity eval: ok");
