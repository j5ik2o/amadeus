#!/usr/bin/env bun

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, cpSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

type Options = {
  dryRun: boolean;
  keep: boolean;
  mode: "ping" | "steering";
  printCommand: boolean;
  workspace?: string;
};

const root = resolve(import.meta.dir, "../../..");
const codexPersonalRunner = join(root, "dev-scripts/run-codex-personal.sh");
const validator = ".agents/skills/amadeus-intent-validator/validator/IntentValidator.rb";
const requiredSkills = [
  "amadeus-steering",
  "amadeus-intent-validator",
  "japanese-tech-writing",
];

function parseArgs(args: string[]): Options {
  const options: Options = { dryRun: false, keep: false, mode: "steering", printCommand: false };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--keep") {
      options.keep = true;
    } else if (arg === "--print-command") {
      options.printCommand = true;
    } else if (arg === "--mode") {
      const value = args[index + 1];
      if (value !== "ping" && value !== "steering") fail("--mode requires ping or steering");
      options.mode = value;
      index += 1;
    } else if (arg === "--workspace") {
      const value = args[index + 1];
      if (!value) fail("--workspace requires a path");
      options.workspace = resolve(value);
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

function run(command: string[], cwd: string): string {
  const result = Bun.spawnSync(command, {
    cwd,
    stdout: "pipe",
    stderr: "pipe",
  });

  const stdout = new TextDecoder().decode(result.stdout);
  const stderr = new TextDecoder().decode(result.stderr);

  if (result.exitCode !== 0) {
    fail([
      `command failed: ${command.join(" ")}`,
      "stdout:",
      stdout,
      "stderr:",
      stderr,
    ].join("\n"));
  }

  return stdout;
}

function ensureFile(path: string): void {
  if (!existsSync(path)) fail(`missing file: ${path}`);
}

function ensureDir(path: string): void {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

function createWorkspace(options: Options): string {
  const workspace = options.workspace ?? mkdtempSync(join(tmpdir(), "amadeus-llm-template-eval-"));
  ensureDir(workspace);
  return workspace;
}

function prepareWorkspace(workspace: string): void {
  ensureDir(join(workspace, ".agents/skills"));
  ensureDir(join(workspace, ".agents/rules"));

  for (const skill of requiredSkills) {
    const source = join(root, ".agents/skills", skill);
    const target = join(workspace, ".agents/skills", skill);
    ensureFile(join(source, "SKILL.md"));
    cpSync(source, target, { recursive: true });
  }

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
      "",
    ].join("\n"),
  );
}

function steeringPrompt(): string {
  return [
    "amadeus-steering を使ってください。",
    "",
    "空の workspace に Amadeus steering layer を scaffold-only で作成してください。",
    "",
    "題材:",
    "- プロダクト名: 図書貸出セルフサービス",
    "- 主目的: 利用者が図書館カウンターに並ばずに貸出と返却を進められる",
    "- 主なアクター: 利用者, 図書館職員",
    "- 外部システム: 図書管理システム",
    "- 主要領域: 貸出, 返却, 利用者通知",
    "",
    "制約:",
    "- 質問せずに続行してください。",
    "- `.amadeus/` 配下だけを作成してください。",
    "- git commit はしないでください。",
    "- 作成後に `ruby .agents/skills/amadeus-intent-validator/validator/IntentValidator.rb .` を実行し、結果を要約してください。",
  ].join("\n");
}

function pingPrompt(): string {
  return [
    "動作確認です。",
    "ファイルを作成せず、コマンドも実行しないでください。",
    "最後の返答は `pong` だけにしてください。",
  ].join("\n");
}

function codexCommand(workspace: string, output: string, prompt: string): string[] {
  return [
    codexPersonalRunner,
    "exec",
    "--skip-git-repo-check",
    "--cd",
    workspace,
    "--output-last-message",
    output,
    prompt,
  ];
}

function shellQuote(value: string): string {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

function runCodex(workspace: string, prompt: string): string {
  const output = join(workspace, "last-message.md");
  const command = codexCommand(workspace, output, prompt);

  run(command, workspace);
  ensureFile(output);
  return output;
}

function assertGeneratedWorkspace(workspace: string): void {
  const requiredFiles = [
    ".amadeus/README.md",
    ".amadeus/steering.md",
    ".amadeus/objective.md",
    ".amadeus/actors.md",
    ".amadeus/external-systems.md",
    ".amadeus/glossary.md",
    ".amadeus/knowledge.md",
    ".amadeus/policies.md",
    ".amadeus/domain/subdomains.md",
    ".amadeus/domain/bounded-contexts.md",
    ".amadeus/intents.md",
  ];

  for (const file of requiredFiles) {
    ensureFile(join(workspace, file));
  }

  run(["ruby", validator, "."], workspace);
}

function assertPing(output: string): void {
  const message = readFileSync(output, "utf8").trim();
  if (message !== "pong") {
    fail(`ping response must be exactly "pong", but was: ${JSON.stringify(message)}`);
  }
}

function main(): void {
  const options = parseArgs(Bun.argv.slice(2));
  ensureFile(codexPersonalRunner);
  ensureFile(join(root, validator));

  const workspace = createWorkspace(options);
  prepareWorkspace(workspace);
  const output = join(workspace, "last-message.md");
  const selectedPrompt = options.mode === "ping" ? pingPrompt() : steeringPrompt();

  if (options.printCommand) {
    const command = codexCommand(workspace, output, selectedPrompt).map(shellQuote).join(" ");
    console.log(command);
    console.log(`workspace: ${workspace}`);
    return;
  }

  if (options.dryRun) {
    console.log(`llm template eval dry-run: ok`);
    console.log(`mode: ${options.mode}`);
    console.log(`workspace: ${workspace}`);
    console.log(`runner: ${codexPersonalRunner}`);
    console.log(`codex home: ${process.env.CODEX_HOME ?? "<set by run-codex-personal.sh>"}`);
    if (!options.keep && !options.workspace) rmSync(workspace, { recursive: true, force: true });
    return;
  }

  try {
    console.log(`workspace: ${workspace}`);
    console.log(`mode: ${options.mode}`);
    const outputPath = runCodex(workspace, selectedPrompt);
    if (options.mode === "ping") {
      assertPing(outputPath);
      console.log("llm ping eval: ok");
    } else {
      assertGeneratedWorkspace(workspace);
      console.log("llm template eval: ok");
    }
  } finally {
    if (!options.keep && !options.workspace) rmSync(workspace, { recursive: true, force: true });
  }
}

main();
