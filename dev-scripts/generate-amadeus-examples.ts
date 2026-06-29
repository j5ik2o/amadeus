#!/usr/bin/env bun

import { createHash } from "node:crypto";
import { createWriteStream, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

type Provider = "real";

type Options = {
  dryRun: boolean;
  provider: Provider;
  runner: string;
  from?: string;
};

type GenerationStep = {
  id: string;
  snapshot: string;
  prompt: string;
  expectedState?: Record<string, string>;
  expectedStatePath?: string;
  validationIntent?: string;
  provenanceSkillFiles: string[];
  runtimeSkillFiles?: string[];
};

type BackupEntry = {
  target: string;
  backup: string;
  existed: boolean;
};

type GenerationPlan = {
  fromIndex: number;
  fromStep: GenerationStep;
  inputStep?: GenerationStep;
  targetSteps: GenerationStep[];
};

const root = resolve(import.meta.dir, "..");
const workspace = join(root, ".tmp/amadeus-example-generation/workspace");
const logs = join(root, ".tmp/amadeus-example-generation/logs");
const stagedSnapshots = join(root, ".tmp/amadeus-example-generation/snapshots");
const discoveryId = "20260629-ec-site-construction";
const intentId = "20260629-minimum-purchase-flow";
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
    } else if (arg === "--from") {
      const value = args[index + 1];
      if (!value) fail("--from requires a step id");
      options.from = value;
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

function prepareWorkspace(inputStep?: GenerationStep): void {
  resetDir(workspace);
  resetDir(logs);
  resetDir(stagedSnapshots);

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
  if (inputStep) {
    cpSync(join(root, inputStep.snapshot, ".amadeus"), join(workspace, ".amadeus"), { recursive: true });
  }
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

function applyStagedSnapshots(targetSteps: GenerationStep[]): void {
  for (const step of targetSteps) {
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

function applyStagedSnapshotsAndProvenance(provenanceText: string, targetSteps: GenerationStep[]): void {
  const transaction = join(root, ".tmp/amadeus-example-generation/apply-transaction");
  resetDir(transaction);
  const targets = [
    ...targetSteps.map((step) => join(root, step.snapshot, ".amadeus")),
    provenanceManifestPath,
  ];
  const backups = targets.map((target, index) => backupTarget(target, transaction, index));
  let failure: unknown;
  let preserveTransaction = false;

  try {
    applyStagedSnapshots(targetSteps);
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

function validateWorkspace(intent?: string): void {
  run(["bun", "run", ".agents/skills/amadeus-validator/validator/AmadeusValidator.ts", ".", ...(intent ? [intent] : [])], workspace);
}

function writeWorkspaceFile(relativePath: string, lines: string[]): void {
  writeFileSync(join(workspace, relativePath), `${lines.join("\n")}\n`);
}

function snapshotStateText(stepId: string): {
  readmeStatus: string;
  structureIntentPolicy: string;
  discoveryNextAction: string;
  discoveryDetailActions: string[];
} {
  if (stepId === "01-discovery") {
    return {
      readmeStatus: "- Intent は未作成である。",
      structureIntentPolicy: "- Intent は、この Discovery では作成しない。",
      discoveryNextAction: "`recommended` の Intent 候補を `amadeus-intent-init` に渡す。",
      discoveryDetailActions: [
        "- `recommended` の Intent 候補である「販売管理の最小購入フロー」を `amadeus-intent-init` に渡す。",
      ],
    };
  }
  if (stepId === "02-intent-initialized") {
    return {
      readmeStatus: `- Intent \`${intentId}\` は initialized であり、次に Ideation へ進める。`,
      structureIntentPolicy: `- Intent は \`.amadeus/intents/\` 配下に置く。例: \`.amadeus/intents/${intentId}/\`。`,
      discoveryNextAction: `初期化済み Intent \`${intentId}\` を \`amadeus-ideation\` に進める。`,
      discoveryDetailActions: [
        `- 初期化済み Intent \`${intentId}\` を \`amadeus-ideation\` に進める。`,
        "- Ideation では、商品選択、販売可能在庫の確認、購入者情報の記録、注文内容確認、注文作成を範囲として具体化する。",
        "- Ideation では、会員登録、ログイン、顧客台帳、購入履歴管理、決済詳細、売上確定、在庫引当、入荷、棚卸し、出荷を対象外として保持する。",
      ],
    };
  }
  if (stepId === "03-ideation") {
    return {
      readmeStatus: `- Intent \`${intentId}\` は Ideation completed であり、次に Inception へ進める。`,
      structureIntentPolicy: `- Intent は \`.amadeus/intents/\` 配下に置く。例: \`.amadeus/intents/${intentId}/\`。`,
      discoveryNextAction: `Ideation 完了済み Intent \`${intentId}\` を \`amadeus-inception\` に進める。`,
      discoveryDetailActions: [
        `- Ideation 完了済み Intent \`${intentId}\` を \`amadeus-inception\` に進める。`,
        "- Inception では、要求、ユースケース、Unit、Bolt、境界づけられたコンテキストを整理する。",
      ],
    };
  }
  if (stepId === "04-inception") {
    return {
      readmeStatus: `- Intent \`${intentId}\` は Inception completed であり、次に B001 の Construction Design ready へ進める。`,
      structureIntentPolicy: `- Intent は \`.amadeus/intents/\` 配下に置く。例: \`.amadeus/intents/${intentId}/\`。`,
      discoveryNextAction: `Inception 完了済み Intent \`${intentId}\` の B001 を \`amadeus-construction-bolt-preparation\` に進める。`,
      discoveryDetailActions: [
        `- Inception 完了済み Intent \`${intentId}\` の B001 を \`amadeus-construction-bolt-preparation\` に進める。`,
        "- Construction では、注文作成 Bolt の design.md、tasks.md、notes.md を実装前の粒度に整える。",
      ],
    };
  }
  return {
    readmeStatus: `- Intent \`${intentId}\` は B001 の Construction Design ready であり、次に実装へ進める。`,
    structureIntentPolicy: `- Intent は \`.amadeus/intents/\` 配下に置く。例: \`.amadeus/intents/${intentId}/\`。`,
    discoveryNextAction: `Construction Design ready の B001 を \`amadeus-construction-implementation-execution\` に進める。`,
    discoveryDetailActions: [
      "- Construction Design ready の B001 を `amadeus-construction-implementation-execution` に進める。",
      "- 実装では、B001 の tasks.md に沿って注文作成入力と注文作成モデルを実装する。",
    ],
  };
}

function normalizeSnapshotNarrative(stepId: string): void {
  const state = snapshotStateText(stepId);
  writeWorkspaceFile(".amadeus/README.md", [
    "# ECサイト構築例示 workspace",
    "",
    "## 役割",
    "",
    "この workspace は、ECサイト構築という大きな入力テーマを Amadeus DLC で段階的に扱うための例示成果物を置く。",
    "",
    "## 読む順序",
    "",
    "1. `steering.md`",
    "2. `steering/objective.md`",
    "3. `steering/actors.md`",
    "4. `domain/subdomains.md`",
    "5. `discoveries.md`",
    "6. `intents.md`",
    "",
    "## 現在の状態",
    "",
    "- Steering layer は、ECサイト構築を複数の Intent 候補へ分けるための共有前提を扱う。",
    "- Discovery layer は、入力テーマ「ECサイトを構築したい」を `multi_intent` として整理する。",
    state.readmeStatus,
  ]);
  writeWorkspaceFile(".amadeus/steering/structure.md", [
    "# プロジェクト構造",
    "",
    "この文書は、複数 Intent で共有するディレクトリ編成、命名、依存関係、コード構成の原則を扱う。",
    "",
    "ファイルツリーの網羅ではなく、新しいファイルを置く判断に使うパターンだけを記録する。",
    "",
    "## 編成方針",
    "",
    "- Amadeus 成果物は `.amadeus/` 配下に置く。",
    "- Discovery は `.amadeus/discoveries/` 配下に置く。",
    state.structureIntentPolicy,
    "",
    "## ディレクトリパターン",
    "",
    "| パターン | 場所 | 役割 | 例 | 状態 |",
    "|---|---|---|---|---|",
    "| Steering layer | `.amadeus/steering/` | 複数 Intent で共有する目的、方針、知識を扱う。 | `.amadeus/steering/objective.md` | 確認済み |",
    "| Discovery layer | `.amadeus/discoveries/` | Intent 化前の入力テーマを整理する。 | `.amadeus/discoveries/20260629-ec-site-construction.md` | 確認済み |",
    "| Intent layer | `.amadeus/intents/` | Intent ごとの状態、要求、設計、実施単位を扱う。 | `.amadeus/intents/20260629-minimum-purchase-flow/` | 段階に応じて利用 |",
    "",
    "## 命名規約",
    "",
    "| 対象 | 規約 | 例 | 状態 |",
    "|---|---|---|---|",
    "| Discovery ディレクトリ名 | `YYYYMMDD-<slug>` | `20260629-ec-site-construction` | 確認済み |",
    "| Intent ディレクトリ名 | `YYYYMMDD-<slug>` | `20260629-minimum-purchase-flow` | 確認済み |",
    "",
    "## 依存関係の整理",
    "",
    "- Discovery は steering layer を参照する。",
    "- Intent は Discovery の recommended 候補から初期化する。",
    "- この例では、最初の Intent として販売管理の最小購入フローを扱う。",
    "",
    "## コード構成原則",
    "",
    "- 未確認",
  ]);
  writeWorkspaceFile(".amadeus/discoveries.md", [
    "# Discovery 一覧",
    "",
    "## 一覧",
    "",
    "| 識別子 | テーマ | 状態 | 判定 | 推奨次アクション | 詳細 |",
    "|---|---|---|---|---|---|",
    `| ${discoveryId} | ECサイトを構築したい | completed | multi_intent | ${state.discoveryNextAction} | [Discovery のモジュールファイル](discoveries/${discoveryId}.md) |`,
  ]);
  const discoveryPath = join(workspace, `.amadeus/discoveries/${discoveryId}.md`);
  ensureFile(discoveryPath);
  const discoveryText = readFileSync(discoveryPath, "utf8");
  const nextActionIndex = discoveryText.indexOf("## 推奨次アクション");
  if (nextActionIndex >= 0) {
    const beforeNextAction = discoveryText.slice(0, nextActionIndex).trimEnd();
    writeFileSync(discoveryPath, `${beforeNextAction}\n\n## 推奨次アクション\n\n${state.discoveryDetailActions.join("\n")}\n`);
  }
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
  normalizeSnapshotNarrative(step.id);
  validateWorkspace(step.validationIntent);
  if (step.expectedState) {
    assertState(join(workspace, step.expectedStatePath ?? `.amadeus/intents/${intentId}/state.json`), step.expectedState);
  }
  stageSnapshot(step.snapshot);
}

function assertState(statePath: string, expectedState: Record<string, string>): void {
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

function readProvenanceManifest(): Record<string, unknown> & { entries?: Array<{ snapshot: string; skillFiles?: Array<{ path: string; md5?: string; staleReason?: string }> }> } {
  return JSON.parse(readFileSync(provenanceManifestPath, "utf8"));
}

function updatedProvenanceText(targetSteps: GenerationStep[]): string {
  const manifest = readProvenanceManifest();
  const regeneratedSkillFilesBySnapshot = new Map(targetSteps.map((step) => [step.snapshot, new Set(step.provenanceSkillFiles)]));
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

function buildGenerationPlan(options: Options): GenerationPlan {
  const requestedFrom = options.from ?? steps[0].id;
  const fromIndex = steps.findIndex((step) => step.id === requestedFrom);
  if (fromIndex < 0) {
    fail(`unknown --from step id: ${requestedFrom}; available step ids: ${steps.map((step) => step.id).join(", ")}`);
  }
  return {
    fromIndex,
    fromStep: steps[fromIndex],
    inputStep: fromIndex > 0 ? steps[fromIndex - 1] : undefined,
    targetSteps: steps.slice(fromIndex),
  };
}

function statePathForStep(step: GenerationStep): string {
  return join(root, step.snapshot, step.expectedStatePath ?? `.amadeus/intents/${intentId}/state.json`);
}

function assertPrerequisiteState(plan: GenerationPlan): void {
  const inputStep = plan.inputStep;
  if (!inputStep) return;

  const snapshotRoot = join(root, inputStep.snapshot);
  const amadeusRoot = join(snapshotRoot, ".amadeus");
  if (!existsSync(snapshotRoot)) {
    fail(`resume prerequisite failed: missing input snapshot for ${plan.fromStep.id}: ${inputStep.snapshot}`);
  }
  if (!existsSync(amadeusRoot) || !statSync(amadeusRoot).isDirectory()) {
    fail(`resume prerequisite failed: missing input snapshot .amadeus for ${plan.fromStep.id}: ${inputStep.snapshot}/.amadeus`);
  }
  if (!inputStep.expectedState) return;

  const statePath = statePathForStep(inputStep);
  if (!existsSync(statePath)) {
    fail(`resume prerequisite failed: ${inputStep.snapshot}: missing state file: ${statePath}`);
  }
  let state: unknown;
  try {
    state = JSON.parse(readFileSync(statePath, "utf8"));
  } catch (error) {
    fail(`resume prerequisite failed: ${inputStep.snapshot}: invalid state JSON: ${error instanceof Error ? error.message : String(error)}`);
  }

  const errors: string[] = [];
  for (const [path, expected] of Object.entries(inputStep.expectedState)) {
    const actual = stateValue(state, path);
    if (actual !== expected) {
      errors.push(`${inputStep.snapshot}: state.${path} expected ${JSON.stringify(expected)}, actual ${JSON.stringify(actual)}`);
    }
  }
  if (errors.length > 0) {
    fail([
      `resume prerequisite failed for --from ${plan.fromStep.id}`,
      ...errors.map((error) => `- ${error}`),
    ].join("\n"));
  }
}

function stateValue(state: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, state);
}

function printPlan(options: Options, plan: GenerationPlan): void {
  console.log(`provider: ${options.provider}`);
  console.log(`dryRun: ${String(options.dryRun)}`);
  console.log(`workspace: ${workspace}`);
  console.log(`runner: ${options.runner}`);
  console.log(`from: ${plan.fromStep.id}`);
  console.log(`inputSnapshot: ${plan.inputStep?.snapshot ?? "none"}`);
  console.log("snapshots:");
  for (const step of plan.targetSteps) console.log(`- ${step.snapshot}`);
}

function steeringDiscoveryPrompt(): string {
  return [
    "amadeus-steering と amadeus-discovery を順に使ってください。",
    "",
    "新規 workspace に、ECサイト構築の例示用 steering layer を作成してください。",
    "その後、入力テーマを Discovery として整理してください。",
    "",
    "入力テーマ:",
    "- ECサイトを構築したい",
    "",
    "Discovery ディレクトリ名:",
    `- ${discoveryId}`,
    "",
    "steering layer で分かっていること:",
    "- 目的: ECサイトを構築する大きな入力テーマを、複数の Intent 候補へ分けて段階的に進められるようにする。",
    "- 主な利用者: ECサイト構築を依頼する事業担当者、ECサイトを設計または実装する開発者。",
    "- 主要領域: 商品管理、顧客管理、入荷管理、販売管理、出荷管理。",
    "- 外部システム連携: 決済代行と配送事業者は存在し得るが、この Discovery では未確定として扱う。",
    "",
    "Discovery で確定している判断:",
    "- 判定は multi_intent にしてください。",
    "- recommended の Intent 候補は「販売管理の最小購入フロー」にしてください。",
    "- recommended 候補の範囲は、商品選択、販売可能在庫の確認、購入者情報の記録、注文内容確認、注文作成です。",
    "- recommended 候補の除外範囲は、会員登録、ログイン、顧客台帳、購入履歴管理、決済詳細、売上確定、在庫引当、入荷、棚卸し、出荷です。",
    "- その他の候補として、商品情報公開、顧客管理、入荷管理、在庫管理、支払い管理、出荷管理を記録してください。",
    "",
    "実行条件:",
    "- 質問せずに続行してください。",
    "- amadeus-discovery の成果物契約に従い、Discovery を完了してください。",
    "- Discovery completed snapshot として保存できる状態まで進めてください。",
    "- git commit はしないでください。",
    "- 作成後に `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts .` を実行し、結果を要約してください。",
  ].join("\n");
}

function intentInitPrompt(): string {
  return [
    "amadeus-intent-init を使ってください。",
    "",
    `Discovery \`${discoveryId}\` の recommended 候補から、新しい Intent の入れ物だけを初期化してください。`,
    "",
    "Intent ディレクトリ名:",
    `- ${intentId}`,
    "",
    "Intent の目的:",
    "- 顧客が商品を選び、販売可能在庫を確認し、購入者情報と注文内容をもとに注文を作成できるようにする。",
    "",
    "成功条件:",
    "- 商品選択、販売可能在庫の確認、購入者情報の記録、注文内容確認、注文作成が Intent の範囲として記録されている。",
    "- 会員登録、ログイン、顧客台帳、購入履歴管理、決済詳細、売上確定、在庫引当、入荷、棚卸し、出荷が対象外として記録されている。",
    "- `.amadeus/intents.md` に Intent が登録されている。",
    `- Discovery の recommended 候補「販売管理の最小購入フロー」の Intent 欄を \`${intentId}\` に更新してください。`,
    `- Discovery の \`既存 Intent との関係\` には \`${intentId}\` が登録済みであることを書いてください。`,
    "- `.amadeus/discoveries.md` の推奨次アクションは、Intent 初期化済みで次に Ideation へ進める内容に更新してください。",
    "",
    "実行条件:",
    "- 質問せずに続行してください。",
    "- 対象 Discovery の gate passed を確認してから進めてください。",
    "- amadeus-intent-init の成果物契約に従い、Intent を初期化してください。",
    "- Intent initialized snapshot として保存できる状態まで進めてください。",
    "- git commit はしないでください。",
    `- 作成後に \`bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . ${intentId}\` を実行し、結果を要約してください。`,
  ].join("\n");
}

function ideationPrompt(): string {
  return [
    "amadeus-ideation を使ってください。",
    "",
    `既存の initialized Intent \`${intentId}\` を Ideation へ進めてください。`,
    "",
    "Intent の目的:",
    "- 顧客が商品を選び、販売可能在庫を確認し、購入者情報と注文内容をもとに注文を作成できるようにする。",
    "",
    "Ideation で分かっていること:",
    "- 対象: 商品選択、販売可能在庫の確認、購入者情報の記録、注文内容確認、注文作成。",
    "- 対象外: 会員登録、ログイン、顧客台帳、購入履歴管理、決済詳細、売上確定、在庫引当、入荷、棚卸し、出荷。",
    "- 初期モック: 注文内容確認画面。",
    "- Inception への引き継ぎ: 最小購入フローを要求候補にする。",
    "",
    "実行条件:",
    "- 質問せずに続行してください。",
    "- amadeus-ideation の成果物契約に従い、Ideation を完了してください。",
    "- Ideation completed snapshot として保存できる状態まで進めてください。",
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
    "- Requirement 候補は、商品を選べること、販売可能在庫を確認できること、購入者情報を記録できること、注文を作成できることです。",
    "- Story 候補は、顧客が商品を選び、注文内容を確認して注文を作成できることです。",
    "- Use Case 候補は、商品を選択すること、注文内容を確認すること、注文を作成することです。",
    "- steering layer のサブドメイン ID を維持してください。SD001 は商品管理、SD002 は顧客管理、SD003 は入荷管理、SD004 は販売管理、SD005 は出荷管理です。",
    "- Intent の中心サブドメインは SD004 販売管理です。",
    "- 在庫管理を Intent 内で明示する場合は、既存 ID と衝突させず SD006 在庫管理として追加してください。",
    "- 境界づけられたコンテキストは BC001 販売管理を中心にしてください。",
    "- BC001 販売管理は SD004 販売管理に対応させてください。",
    "- この Intent が所有する境界づけられたコンテキストは BC001 販売管理だけにしてください。",
    "- 商品管理、顧客管理、入荷管理、出荷管理、在庫管理は、Intent 配下の境界づけられたコンテキストとして展開せず、必要な依存は BC001 の契約または未確認事項で扱ってください。",
    "- BC001 は、販売可能在庫の参照では在庫管理に依存しますが、在庫引当は今回の範囲外にしてください。",
    "- BC001 は、購入者情報を注文に記録しますが、会員登録、ログイン、顧客台帳、購入履歴管理は今回の範囲外にしてください。",
    "- Unit 候補は、最小購入フローと注文作成です。",
    "- Bolt 候補は、B001 注文作成、B002 注文内容確認、B003 商品選択です。",
    "",
    "実行条件:",
    "- 質問せずに続行してください。",
    "- amadeus-inception の成果物契約に従い、Inception を完了してください。",
    "- Inception completed snapshot として保存できる状態まで進めてください。",
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
    "- 目的: 注文作成を実装可能な Task 集合へ分解する。",
    "- 注文作成は、注文内容、購入者情報、販売可能在庫の参照結果をもとに注文を作成する Bolt としてください。",
    "- Construction Design は Task 生成の根拠になる粒度にしてください。",
    "",
    "実行条件:",
    "- 質問せずに続行してください。",
    "- amadeus-construction-bolt-preparation の成果物契約に従い、Bolt 実行準備を完了してください。",
    "- Construction design ready snapshot として保存できる状態まで進めてください。",
    "- git commit はしないでください。",
    `- 作成後に \`bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . ${intentId}\` を実行し、結果を要約してください。`,
  ].join("\n");
}

const steps: GenerationStep[] = [
  {
    id: "01-discovery",
    snapshot: "examples/01-discovery-completed",
    prompt: steeringDiscoveryPrompt(),
    expectedStatePath: `.amadeus/discoveries/${discoveryId}/state.json`,
    expectedState: {
      phase: "discovery",
      status: "completed",
      decision: "multi_intent",
      gate: "passed",
    },
    provenanceSkillFiles: [
      "skills/amadeus-steering/SKILL.md",
      "skills/amadeus-discovery/SKILL.md",
    ],
  },
  {
    id: "02-intent-initialized",
    snapshot: "examples/02-intent-initialized",
    prompt: intentInitPrompt(),
    validationIntent: intentId,
    expectedState: {
      phase: "initialized",
      status: "in_progress",
      "initialized.status": "completed",
    },
    provenanceSkillFiles: [
      "skills/amadeus-steering/SKILL.md",
      "skills/amadeus-discovery/SKILL.md",
      "skills/amadeus-intent-init/SKILL.md",
    ],
  },
  {
    id: "03-ideation",
    snapshot: "examples/03-ideation-completed",
    prompt: ideationPrompt(),
    validationIntent: intentId,
    expectedState: {
      phase: "ideation",
      "ideation.status": "completed",
      "ideation.gate": "passed",
    },
    provenanceSkillFiles: [
      "skills/amadeus-steering/SKILL.md",
      "skills/amadeus-discovery/SKILL.md",
      "skills/amadeus-intent-init/SKILL.md",
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
    validationIntent: intentId,
    expectedState: {
      phase: "inception",
      "inception.status": "completed",
      "inception.gate": "passed",
    },
    provenanceSkillFiles: [
      "skills/amadeus-steering/SKILL.md",
      "skills/amadeus-discovery/SKILL.md",
      "skills/amadeus-intent-init/SKILL.md",
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
    validationIntent: intentId,
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
      "skills/amadeus-steering/SKILL.md",
      "skills/amadeus-discovery/SKILL.md",
      "skills/amadeus-intent-init/SKILL.md",
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
const plan = buildGenerationPlan(options);
assertPrerequisiteState(plan);
printPlan(options, plan);
for (const skillFile of new Set(plan.targetSteps.flatMap((step) => [
  ...step.provenanceSkillFiles,
  ...(step.runtimeSkillFiles ?? []),
]))) {
  ensurePromotedSkillMatchesSource(skillFile);
}
if (!options.dryRun) {
  prepareWorkspace(plan.inputStep);
  for (const step of plan.targetSteps) {
    console.log(`running: ${step.id}`);
    await runCodexStep(options, step);
    console.log(`snapshot staged: ${step.snapshot}`);
  }
  const provenanceText = updatedProvenanceText(plan.targetSteps);
  applyStagedSnapshotsAndProvenance(provenanceText, plan.targetSteps);
  console.log("example generation: ok");
}
