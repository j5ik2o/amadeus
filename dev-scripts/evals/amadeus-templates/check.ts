#!/usr/bin/env bun

import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "../../..");

type Contract = {
  skillText: string[];
  files: Record<string, string[]>;
};

const targetSkills: Record<string, Contract> = {
  "amadeus-steering": {
    skillText: [".amadeus/settings/templates", "templates/steering"],
    files: {
      "templates/steering/README.md": ["基本方針", "テンプレート一覧"],
      "templates/steering/steering.md": ["役割", "対象成果物", "読む順序", "Intent Layer へ進む基準", "責務境界"],
      "templates/steering/knowledge.md": ["背景", "前提", "未確認事項"],
      "templates/steering/policies.md": ["方針", "禁止事項", "判断基準"],
      "templates/steering/objective.md": ["一覧"],
      "templates/steering/actors.md": ["一覧"],
      "templates/steering/external-systems.md": ["一覧"],
      "templates/steering/glossary.md": ["用語", "避ける語", "禁止ワード"],
      "templates/steering/domain/subdomains.md": ["一覧"],
      "templates/steering/domain/bounded-contexts.md": ["一覧", "外部境界", "コンテキスト間の依存", "パターン分類"],
      "templates/steering/intents.md": ["一覧", "依存関係"],
    },
  },
  "amadeus-intent-init": {
    skillText: [".amadeus/settings/templates", "templates/intents/initialized"],
    files: {
      "templates/intents/initialized/intent.md": ["目的", "成功条件", "範囲"],
      "templates/intents/initialized/state.json": [],
    },
  },
  "amadeus-ideation": {
    skillText: [".amadeus/settings/templates", "templates/intents/ideation"],
    files: {
      "templates/intents/ideation/scope.md": ["対象", "対象外", "詳細度", "検証深度", "Inception への引き継ぎ"],
      "templates/intents/ideation/ideation.md": ["実現可能性", "体制", "初期モック", "未確定事項", "学習候補"],
      "templates/intents/ideation/traceability.md": ["Ideation からの追跡", "依存関係からの追跡"],
      "templates/intents/ideation/decisions.md": ["一覧", "依存関係"],
      "templates/intents/ideation/decisions/D001-complete-ideation.md": ["背景", "判断", "理由", "影響"],
      "templates/intents/ideation/mocks/initial-confirmation.puml": [],
      "templates/intents/ideation/state.json": [],
    },
  },
  "amadeus-inception": {
    skillText: [".amadeus/settings/templates", "templates/intents/inception"],
    files: {
      "templates/intents/inception/requirements.md": ["一覧", "依存関係", "受け入れ状態"],
      "templates/intents/inception/requirements/R001-requirement.md": ["要求", "受け入れ条件", "根拠", "未確認事項"],
      "templates/intents/inception/acceptance.md": ["要求状態", "状態ルール"],
      "templates/intents/inception/user-stories.md": ["一覧", "依存関係"],
      "templates/intents/inception/user-stories/S001-story.md": ["ストーリー", "受け入れ条件", "根拠", "未確認事項"],
      "templates/intents/inception/use-cases.md": ["一覧", "依存関係"],
      "templates/intents/inception/use-cases/UC001-use-case.md": ["システム境界", "事前条件", "基本フロー", "代替フロー", "事後条件", "BCE候補", "責務候補"],
      "templates/intents/inception/codebase-analysis.md": ["対象コード", "既存能力", "統合点", "ギャップ", "リスク", "Inception への入力"],
      "templates/intents/inception/units.md": ["一覧", "依存関係"],
      "templates/intents/inception/units/U001-unit.md": ["ユニット", "対象要求", "価値境界", "検証観点", "未確認事項"],
      "templates/intents/inception/bolts.md": ["一覧", "依存関係"],
      "templates/intents/inception/bolts/B001-bolt/bolt.md": ["概要", "対象ユニット", "完了条件", "依存", "未確認事項"],
      "templates/intents/inception/bolts/B001-bolt/design.md": ["概要", "責務境界", "構成", "データと契約", "検証方針", "Task への入力"],
      "templates/intents/inception/bolts/B001-bolt/tasks.md": [],
      "templates/intents/inception/traceability.md": [
        "要求からの追跡",
        "背景からの追跡",
        "ボルトからの追跡",
        "設計からの追跡",
        "既存コード分析からの追跡",
        "ユニットからの追跡",
        "ドメインモデルからの追跡",
        "依存関係からの追跡",
      ],
      "templates/intents/inception/decisions.md": ["一覧", "依存関係"],
      "templates/intents/inception/decisions/D001-inception-boundary.md": ["背景", "判断", "理由", "影響"],
      "templates/intents/inception/state.json": [],
    },
  },
};

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function run(command: string[]): string {
  const result = Bun.spawnSync(command, { cwd: root, stdout: "pipe", stderr: "pipe" });
  const stdout = new TextDecoder().decode(result.stdout);
  const stderr = new TextDecoder().decode(result.stderr);
  if (result.exitCode !== 0) {
    fail(["command failed: " + command.join(" "), "stdout:", stdout, "stderr:", stderr].join("\n"));
  }
  return stdout;
}

function assertFile(path: string): void {
  if (!existsSync(path)) fail(`missing file: ${path}`);
}

function assertTextIncludes(path: string, needle: string): void {
  const text = readFileSync(path, "utf8");
  if (!text.includes(needle)) fail(`${path} does not include ${JSON.stringify(needle)}`);
}

function assertHeading(path: string, heading: string): void {
  const text = readFileSync(path, "utf8");
  if (!new RegExp(`^## ${escapeRegExp(heading)}$`, "m").test(text)) {
    fail(`${path} is missing heading: ## ${heading}`);
  }
}

function assertJsonTemplate(path: string): void {
  try {
    JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`${path} is not valid JSON: ${(error as Error).message}`);
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const [skill, contract] of Object.entries(targetSkills)) {
  const skillMd = join(root, "skills", skill, "SKILL.md");
  assertFile(skillMd);
  for (const needle of contract.skillText) assertTextIncludes(skillMd, needle);

  for (const [relative, headings] of Object.entries(contract.files)) {
    const source = join(root, "skills", skill, relative);
    const promoted = join(root, ".agents/skills", skill, relative);
    assertFile(source);
    assertFile(promoted);
    for (const heading of headings) assertHeading(source, heading);
    if (source.endsWith(".json")) assertJsonTemplate(source);
  }
}

const tmp = mkdtempSync(join(tmpdir(), "amadeus-template-promotion"));
const agentsRoot = join(tmp, ".agents/skills");
for (const skill of Object.keys(targetSkills)) {
  run(["bun", "run", "dev-scripts/promote-skill.ts", skill, "--agents-root", agentsRoot]);
  run(["diff", "-qr", `skills/${skill}/templates`, join(agentsRoot, skill, "templates")]);
}

run(["bun", "run", ".agents/skills/amadeus-intent-validator/validator/IntentValidator.ts", "."]);
const glob = new Bun.Glob(".amadeus/intents/*/state.json");
for (const statePath of [...glob.scanSync({ cwd: root })].sort()) {
  const intent = statePath.split("/").at(-2);
  if (intent) run(["bun", "run", ".agents/skills/amadeus-intent-validator/validator/IntentValidator.ts", ".", intent]);
}

console.log("amadeus template eval: ok");
