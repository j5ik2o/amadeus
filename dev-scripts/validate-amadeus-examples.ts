#!/usr/bin/env bun

type ExampleSnapshot = {
  name: string;
  workdir: string;
  intent?: string;
};

const validator = ".agents/skills/amadeus-validator/validator/AmadeusValidator.ts";
const snapshots: ExampleSnapshot[] = [
  {
    name: "Discovery completed",
    workdir: "examples/01-discovery-completed",
  },
  {
    name: "Intent initialized",
    workdir: "examples/02-intent-initialized",
    intent: "20260628-discovery-brief-creation",
  },
  {
    name: "Ideation completed",
    workdir: "examples/03-ideation-completed",
    intent: "20260628-discovery-brief-creation",
  },
  {
    name: "Inception completed",
    workdir: "examples/04-inception-completed",
    intent: "20260628-discovery-brief-creation",
  },
];

const mode = Bun.argv[2] ?? "--all";
const targets = selectTargets(mode);
let failed = false;

for (const target of targets) {
  const args = ["run", validator, target.workdir, ...(target.intent ? [target.intent] : [])];
  console.log(`## ${target.name}`);
  console.log(`$ bun ${args.join(" ")}`);

  const result = Bun.spawnSync({
    cmd: ["bun", ...args],
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = new TextDecoder().decode(result.stdout);
  const stderr = new TextDecoder().decode(result.stderr);
  if (stdout.trim().length > 0) console.log(stdout.trimEnd());
  if (stderr.trim().length > 0) console.error(stderr.trimEnd());

  if (!result.success || /## 判定\s*\n\s*(fail|blocked)/.test(stdout)) {
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
}

function selectTargets(mode: string): ExampleSnapshot[] {
  if (mode === "--workspaces-only") {
    return snapshots.map(({ name, workdir }) => ({ name, workdir }));
  }
  if (mode === "--intents-only") {
    return snapshots.filter((snapshot) => snapshot.intent);
  }
  if (mode === "--all") {
    return [
      ...snapshots.map(({ name, workdir }) => ({ name, workdir })),
      ...snapshots.filter((snapshot) => snapshot.intent),
    ];
  }
  console.error(`unknown mode: ${mode}`);
  process.exit(1);
}
