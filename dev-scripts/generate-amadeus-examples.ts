#!/usr/bin/env bun

import { createHash } from "node:crypto";
import { createWriteStream, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

type Provider = "real";

type Options = {
  dryRun: boolean;
  provider: Provider;
  runner: string;
};

type GenerationStep = {
  id: string;
  snapshot: string;
  prompt: string;
  expectedState: Record<string, string>;
  provenanceSkillFiles: string[];
  runtimeSkillFiles?: string[];
};

type BackupEntry = {
  target: string;
  backup: string;
  existed: boolean;
};

const root = resolve(import.meta.dir, "..");
const workspace = join(root, ".tmp/amadeus-example-generation/workspace");
const logs = join(root, ".tmp/amadeus-example-generation/logs");
const stagedSnapshots = join(root, ".tmp/amadeus-example-generation/snapshots");
const intentId = "20260628-discovery-brief-creation";
const defaultRunner = "dev-scripts/run-codex-corporate.sh";
const provenanceManifestPath = join(root, "examples/skill-provenance.json");

function parseArgs(args: string[]): Options {
  const options: Options = {
    dryRun: false,
    provider: "real",
    runner: defaultRunner,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--provider") {
      const value = args[index + 1];
      if (value !== "real") fail("--provider currently supports only real");
      options.provider = value;
      index += 1;
    } else if (arg === "--runner") {
      const value = args[index + 1];
      if (!value) fail("--runner requires a path");
      options.runner = value;
      index += 1;
    } else {
      fail(`unknown argument: ${arg}`);
    }
  }

  return options;
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function ensureDir(path: string): void {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

function ensureFile(path: string): void {
  if (!existsSync(path)) fail(`missing file: ${path}`);
}

function md5File(path: string): string {
  return createHash("md5").update(readFileSync(path)).digest("hex");
}

function resetDir(path: string): void {
  rmSync(path, { recursive: true, force: true });
  mkdirSync(path, { recursive: true });
}

function runOrThrow(command: string[], cwd: string): string {
  const result = Bun.spawnSync(command, {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
  });
  const stdout = new TextDecoder().decode(result.stdout);
  const stderr = new TextDecoder().decode(result.stderr);
  if (result.exitCode !== 0) {
    throw new Error([
      `command failed: ${command.join(" ")}`,
      "stdout:",
      stdout,
      "stderr:",
      stderr,
    ].join("\n"));
  }
  return stdout;
}

function run(command: string[], cwd: string): string {
  try {
    return runOrThrow(command, cwd);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}

async function writeStream(stream: ReadableStream<Uint8Array>, path: string): Promise<void> {
  const writer = createWriteStream(path);
  try {
    for await (const chunk of stream) writer.write(chunk);
  } finally {
    writer.end();
  }
}

async function runLogged(command: string[], cwd: string, stdoutPath: string, stderrPath: string): Promise<void> {
  const process = Bun.spawn(command, {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
  });
  await Promise.all([
    writeStream(process.stdout, stdoutPath),
    writeStream(process.stderr, stderrPath),
  ]);
  const exitCode = await process.exited;
  if (exitCode !== 0) {
    fail([
      `command failed: ${command.join(" ")}`,
      `stdout log: ${stdoutPath}`,
      `stderr log: ${stderrPath}`,
    ].join("\n"));
  }
}

function prepareWorkspace(): void {
  resetDir(workspace);
  resetDir(logs);
  resetDir(stagedSnapshots);

  cpSync(join(root, "examples/02-intent-initialized/.amadeus"), join(workspace, ".amadeus"), { recursive: true });
  ensureDir(join(workspace, ".agents"));
  cpSync(join(root, ".agents/skills"), join(workspace, ".agents/skills"), { recursive: true });
  cpSync(join(root, ".agents/rules"), join(workspace, ".agents/rules"), { recursive: true });
  writeFileSync(
    join(workspace, "AGENTS.md"),
    [
      "# AGENTS.md",
      "",
      "- 必ず日本語で返答すること。",
      "- `.agents/rules/**/*.md` を守ること。",
      "- 日本語を書くときは `japanese-tech-writing` skill を使うこと。",
      "- Amadeus 成果物を作る場合は、対象 skill の同梱テンプレートを使うこと。",
      "- git commit はしないでください。",
      "",
    ].join("\n"),
  );
}

function listFiles(path: string): string[] {
  if (!existsSync(path)) return [];
  const result: string[] = [];
  const visit = (dir: string, prefix: string): void => {
    for (const entry of readdirSync(dir).sort()) {
      const entryPath = join(dir, entry);
      const relativePath = prefix ? `${prefix}/${entry}` : entry;
      const stats = statSync(entryPath);
      if (stats.isDirectory()) {
        visit(entryPath, relativePath);
      } else if (stats.isFile()) {
        result.push(relativePath);
      }
    }
  };
  visit(path, "");
  return result;
}

function ensurePromotedSkillMatchesSource(skillFile: string): void {
  const sourcePath = join(root, skillFile);
  const runtimePath = join(root, skillFile.replace(/^skills\//, ".agents/skills/"));
  ensureFile(sourcePath);
  ensureFile(runtimePath);
  const sourceMd5 = md5File(sourcePath);
  const runtimeMd5 = md5File(runtimePath);
  if (sourceMd5 !== runtimeMd5) {
    fail(`${skillFile}: source skill and .agents runtime skill differ; run the promotion flow before generating examples`);
  }

  const sourceTemplates = join(dirname(sourcePath), "templates");
  const runtimeTemplates = join(dirname(runtimePath), "templates");
  const sourceTemplateFiles = listFiles(sourceTemplates);
  const runtimeTemplateFiles = listFiles(runtimeTemplates);
  if (sourceTemplateFiles.join("\n") !== runtimeTemplateFiles.join("\n")) {
    fail(`${skillFile}: source templates and .agents runtime templates differ; run the promotion flow before generating examples`);
  }
  for (const templateFile of sourceTemplateFiles) {
    const sourceTemplatePath = join(sourceTemplates, templateFile);
    const runtimeTemplatePath = join(runtimeTemplates, templateFile);
    if (md5File(sourceTemplatePath) !== md5File(runtimeTemplatePath)) {
      fail(`${skillFile}: source template and .agents runtime template differ: templates/${templateFile}; run the promotion flow before generating examples`);
    }
  }
}

function replaceDir(source: string, target: string): void {
  const parent = dirname(target);
  const name = basename(target) || "snapshot";
  const temp = join(parent, `.${name}.tmp-${process.pid}`);
  const backup = join(parent, `.${name}.backup-${process.pid}`);
  let targetMoved = false;
  rmSync(temp, { recursive: true, force: true });
  rmSync(backup, { recursive: true, force: true });
  ensureDir(parent);
  cpSync(source, temp, { recursive: true });

  try {
    if (existsSync(target)) {
      renameSync(target, backup);
      targetMoved = true;
    }
    renameSync(temp, target);
    rmSync(backup, { recursive: true, force: true });
  } catch (error) {
    if (targetMoved) {
      rmSync(target, { recursive: true, force: true });
      if (existsSync(backup)) renameSync(backup, target);
    }
    throw error;
  } finally {
    rmSync(temp, { recursive: true, force: true });
    rmSync(backup, { recursive: true, force: true });
  }
}

function stageSnapshot(snapshot: string): void {
  const target = join(stagedSnapshots, snapshot, ".amadeus");
  rmSync(target, { recursive: true, force: true });
  ensureDir(dirname(target));
  cpSync(join(workspace, ".amadeus"), target, { recursive: true });
}

function applyStagedSnapshots(): void {
  for (const step of steps) {
    replaceDir(join(stagedSnapshots, step.snapshot, ".amadeus"), join(root, step.snapshot, ".amadeus"));
  }
}

function backupTarget(target: string, backupRoot: string, index: number): BackupEntry {
  const backup = join(backupRoot, String(index));
  rmSync(backup, { recursive: true, force: true });
  if (!existsSync(target)) {
    return { target, backup, existed: false };
  }
  cpSync(target, backup, { recursive: true });
  return { target, backup, existed: true };
}

function restoreBackups(backups: BackupEntry[]): void {
  for (const entry of backups) {
    rmSync(entry.target, { recursive: true, force: true });
    if (entry.existed) {
      ensureDir(dirname(entry.target));
      cpSync(entry.backup, entry.target, { recursive: true });
    }
  }
}

function applyStagedSnapshotsAndProvenance(provenanceText: string): void {
  const transaction = join(root, ".tmp/amadeus-example-generation/apply-transaction");
  resetDir(transaction);
  const targets = [
    ...steps.map((step) => join(root, step.snapshot, ".amadeus")),
    provenanceManifestPath,
  ];
  const backups = targets.map((target, index) => backupTarget(target, transaction, index));
  let failure: unknown;
  let preserveTransaction = false;

  try {
    applyStagedSnapshots();
    writeFileSync(provenanceManifestPath, provenanceText);
    runOrThrow(["bun", "run", "dev-scripts/validate-amadeus-examples.ts", "--all"], root);
  } catch (error) {
    try {
      restoreBackups(backups);
    } catch (restoreError) {
      failure = new Error([
        error instanceof Error ? error.message : String(error),
        "rollback failed:",
        restoreError instanceof Error ? restoreError.message : String(restoreError),
        `rollback backups preserved at: ${transaction}`,
      ].join("\n"));
      preserveTransaction = true;
    }
    failure ??= error;
  } finally {
    if (!preserveTransaction) {
      rmSync(transaction, { recursive: true, force: true });
    }
  }

  if (failure) {
    fail(failure instanceof Error ? failure.message : String(failure));
  }
}

function validateWorkspace(): void {
  run(["bun", "run", ".agents/skills/amadeus-validator/validator/AmadeusValidator.ts", ".", intentId], workspace);
}

async function runCodexStep(options: Options, step: GenerationStep): Promise<void> {
  const runner = resolve(root, options.runner);
  ensureFile(runner);
  const output = join(logs, `${step.id}-last-message.md`);
  const stdout = join(logs, `${step.id}-codex-events.jsonl`);
  const stderr = join(logs, `${step.id}-codex-stderr.log`);
  const command = [
    runner,
    "exec",
    "--skip-git-repo-check",
    "--ignore-user-config",
    "--cd",
    workspace,
    "--json",
    "--output-last-message",
    output,
    step.prompt,
  ];
  await runLogged(command, workspace, stdout, stderr);
  ensureFile(output);
  validateWorkspace();
  assertIntentState(join(workspace, ".amadeus/intents", intentId, "state.json"), step.expectedState);
  stageSnapshot(step.snapshot);
}

function assertIntentState(statePath: string, expectedState: Record<string, string>): void {
  const state = JSON.parse(readFileSync(statePath, "utf8"));
  for (const [path, expected] of Object.entries(expectedState)) {
    const actual = path.split(".").reduce<unknown>((current, key) => {
      if (current && typeof current === "object" && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, state);
    if (actual !== expected) {
      fail(`${statePath}: expected ${path} to be ${JSON.stringify(expected)}, actual ${JSON.stringify(actual)}`);
    }
  }
}

function updatedProvenanceText(): string {
  const manifest = JSON.parse(readFileSync(provenanceManifestPath, "utf8"));
  const regeneratedSkillFilesBySnapshot = new Map(steps.map((step) => [step.snapshot, new Set(step.provenanceSkillFiles)]));
  for (const entry of manifest.entries ?? []) {
    const regeneratedSkillFiles = regeneratedSkillFilesBySnapshot.get(entry.snapshot);
    if (!regeneratedSkillFiles) continue;
    for (const skillFile of entry.skillFiles ?? []) {
      if (!regeneratedSkillFiles.has(skillFile.path)) continue;
      const sourcePath = join(root, skillFile.path);
      ensureFile(sourcePath);
      skillFile.md5 = md5File(sourcePath);
      delete skillFile.staleReason;
    }
  }
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function printPlan(options: Options): void {
  console.log(`provider: ${options.provider}`);
  console.log(`dryRun: ${String(options.dryRun)}`);
  console.log(`workspace: ${workspace}`);
  console.log(`runner: ${options.runner}`);
  console.log("snapshots:");
  for (const step of steps) console.log(`- ${step.snapshot}`);
}

function ideationPrompt(): string {
  return [
    "amadeus-ideation を使ってください。",
    "",
    `既存の initialized Intent \`${intentId}\` を Ideation へ進めてください。`,
    "",
    "Intent の目的:",
    "- 大きな入力テーマを、Intent 化前に Discovery Brief として整理できるようにする。",
    "- multi_intent の場合に、最初に Intent 化する候補を1件に絞れるようにする。",
    "- 後続の Ideation と Inception が参照できる粒度で、Discovery の責務境界を保つ。",
    "",
    "Ideation で分かっていること:",
    "- 対象: ユーザーが大きな開発テーマを渡したとき、AI が Discovery Brief と Intent 候補を記録できる体験。",
    "- 対象外: Intent 初期化の自動実行、Requirement、Use Case、Unit、Bolt、Task の定義、実装方針や Construction の証拠化。",
    "- 初期モック: Discovery Brief 確認カード。",
    "- Inception への引き継ぎ: Discovery Brief 記録と Intent 候補提示を要求候補にする。",
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- 対象 Intent 配下の Ideation 成果物だけを作成または更新してください。",
    "- Inception 成果物、Construction 成果物、domain 成果物、実装コードは作らないでください。",
    "- Task ID は導入しないでください。",
    "- Ideation traceability finalization まで完了し、Ideation gate passed の状態にしてください。",
    '- `state.json` は `phase: "ideation"`、`status: "completed"`、`ideation.status: "completed"`、`ideation.gate: "passed"` にしてください。',
    "- git commit はしないでください。",
    `- 作成後に \`bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . ${intentId}\` を実行し、結果を要約してください。`,
  ].join("\n");
}

function inceptionPrompt(): string {
  return [
    "amadeus-inception を使ってください。",
    "",
    `Ideation 完了済み Intent \`${intentId}\` を Inception へ進めてください。`,
    "",
    "Inception で分かっていること:",
    "- Requirement 候補は、Discovery Brief を記録できることと、Intent 候補を提示できることの2つです。",
    "- Story 候補は、利用者が Discovery Brief を読み、最初の Intent 候補を選べることです。",
    "- Use Case 候補は、入力テーマと判断を記録すること、Intent 候補を確認することです。",
    "- サブドメインは SD001 Amadeus 利用支援です。",
    "- 境界づけられたコンテキストは BC001 Discovery 支援です。",
    "- U001 と U002 は BC001 を参照します。",
    "- Unit 候補は、Discovery Brief 記録と Intent 候補提示です。",
    "- Bolt 候補は、B001 Discovery Brief 記録と B002 Intent 候補提示です。",
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- 対象 Intent 配下の Inception 成果物だけを作成または更新してください。",
    "- `tasks.md` は作らないでください。",
    "- Construction 成果物、実装コード、CI は作らないでください。",
    "- `domain/bounded-contexts.md` に BC001 を記録し、`units.md` の `コンテキスト` は BC001 にしてください。",
    "- 詳細なモデルと契約条件が未確認の場合は、BC001 の `models.md` と `contracts.md` に未確認事項として残してください。",
    "- Inception traceability finalization まで完了し、Inception gate passed の状態にしてください。",
    '- `state.json` は `phase: "inception"`、`status: "completed"`、`inception.status: "completed"`、`inception.gate: "passed"` にしてください。',
    "- git commit はしないでください。",
    `- 作成後に \`bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . ${intentId}\` を実行し、結果を要約してください。`,
  ].join("\n");
}

function constructionPrompt(): string {
  return [
    "amadeus-construction-bolt-preparation を使ってください。",
    "",
    `Inception gate passed の Intent \`${intentId}\` について、B001 の Construction Design ready まで進めてください。`,
    "",
    "対象:",
    "- 対象 Bolt: B001",
    "- 目的: Discovery Brief 記録を実装可能な Task 集合へ分解する。",
    "- Construction Design は Task 生成の根拠になる粒度にしてください。",
    "",
    "作成または更新対象:",
    "- B001 の `design.md`",
    "- B001 の `tasks.md`",
    "- B001 の `notes.md`",
    "- `traceability.md` の Construction Design からの追跡",
    "- `state.json` の Construction 状態",
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- 実装コード、テストコード、test-results.md、PR 記録は作らないでください。",
    "- `designGate.status` は実装へ進める粒度になった場合だけ `ready` にしてください。",
    "- `tasks.status` は Task 集合を生成した場合だけ `generated` にしてください。",
    "- git commit はしないでください。",
    `- 作成後に \`bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . ${intentId}\` を実行し、結果を要約してください。`,
  ].join("\n");
}

const steps: GenerationStep[] = [
  {
    id: "03-ideation",
    snapshot: "examples/03-ideation-completed",
    prompt: ideationPrompt(),
    expectedState: {
      phase: "ideation",
      status: "completed",
      "ideation.status": "completed",
      "ideation.gate": "passed",
    },
    provenanceSkillFiles: [
      "skills/amadeus-ideation/SKILL.md",
      "skills/amadeus-ideation-scope-framing/SKILL.md",
      "skills/amadeus-ideation-feasibility-shaping/SKILL.md",
      "skills/amadeus-ideation-mock-framing/SKILL.md",
      "skills/amadeus-ideation-traceability-finalization/SKILL.md",
    ],
  },
  {
    id: "04-inception",
    snapshot: "examples/04-inception-completed",
    prompt: inceptionPrompt(),
    expectedState: {
      phase: "inception",
      status: "completed",
      "inception.status": "completed",
      "inception.gate": "passed",
    },
    provenanceSkillFiles: [
      "skills/amadeus-ideation/SKILL.md",
      "skills/amadeus-ideation-scope-framing/SKILL.md",
      "skills/amadeus-ideation-feasibility-shaping/SKILL.md",
      "skills/amadeus-ideation-mock-framing/SKILL.md",
      "skills/amadeus-ideation-traceability-finalization/SKILL.md",
      "skills/amadeus-inception/SKILL.md",
      "skills/amadeus-inception-requirements-definition/SKILL.md",
      "skills/amadeus-inception-interaction-modeling/SKILL.md",
      "skills/amadeus-inception-execution-design/SKILL.md",
      "skills/amadeus-inception-traceability-finalization/SKILL.md",
    ],
  },
  {
    id: "05-construction-design-ready",
    snapshot: "examples/05-construction-design-ready",
    prompt: constructionPrompt(),
    expectedState: {
      phase: "construction",
      status: "in_progress",
      "inception.status": "completed",
      "inception.gate": "passed",
      "construction.status": "in_progress",
      "construction.bolts.0.designGate.status": "ready",
      "construction.bolts.0.tasks.status": "generated",
    },
    provenanceSkillFiles: [
      "skills/amadeus-ideation/SKILL.md",
      "skills/amadeus-ideation-scope-framing/SKILL.md",
      "skills/amadeus-ideation-feasibility-shaping/SKILL.md",
      "skills/amadeus-ideation-mock-framing/SKILL.md",
      "skills/amadeus-ideation-traceability-finalization/SKILL.md",
      "skills/amadeus-inception/SKILL.md",
      "skills/amadeus-inception-requirements-definition/SKILL.md",
      "skills/amadeus-inception-interaction-modeling/SKILL.md",
      "skills/amadeus-inception-execution-design/SKILL.md",
      "skills/amadeus-inception-traceability-finalization/SKILL.md",
      "skills/amadeus-construction-bolt-preparation/SKILL.md",
    ],
    runtimeSkillFiles: [
      "skills/amadeus-construction/SKILL.md",
    ],
  },
];

const options = parseArgs(Bun.argv.slice(2));
printPlan(options);
for (const skillFile of new Set(steps.flatMap((step) => [
  ...step.provenanceSkillFiles,
  ...(step.runtimeSkillFiles ?? []),
]))) {
  ensurePromotedSkillMatchesSource(skillFile);
}
if (!options.dryRun) {
  prepareWorkspace();
  for (const step of steps) {
    console.log(`running: ${step.id}`);
    await runCodexStep(options, step);
    console.log(`snapshot staged: ${step.snapshot}`);
  }
  const provenanceText = updatedProvenanceText();
  applyStagedSnapshotsAndProvenance(provenanceText);
  console.log("example generation: ok");
}
