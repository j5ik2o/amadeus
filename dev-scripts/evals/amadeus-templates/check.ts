#!/usr/bin/env bun

import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "../../..");

type Contract = {
  skillText: string[];
  files: Record<string, string[]>;
  absentFiles?: string[];
  textExcludes?: Record<string, string[]>;
};

type TextContract = {
  path: string;
  includes: string[];
  excludes: string[];
  promotedPath?: string;
};

const targetSkills: Record<string, Contract> = {
  "amadeus-steering": {
    skillText: [".amadeus/settings/templates", "templates/steering"],
    files: {
      "templates/steering/README.md": ["基本方針", "テンプレート一覧"],
      "templates/steering/steering.md": ["役割", "対象成果物", "読む順序", "Intent Layer へ進む基準", "責務境界"],
      "templates/steering/steering/knowledge.md": ["背景", "前提", "未確認事項"],
      "templates/steering/steering/knowledge/README.md": ["役割", "記録方針"],
      "templates/steering/steering/policies.md": ["方針", "禁止事項", "判断基準"],
      "templates/steering/steering/policies/README.md": ["役割", "記録方針"],
      "templates/steering/steering/objective.md": ["一覧"],
      "templates/steering/steering/product.md": ["コア能力", "主要ユースケース", "価値仮説"],
      "templates/steering/steering/tech.md": ["アーキテクチャ", "主要技術", "開発標準", "開発環境", "主要技術判断"],
      "templates/steering/steering/structure.md": ["編成方針", "ディレクトリパターン", "命名規約", "依存関係の整理", "コード構成原則"],
      "templates/steering/steering/actors.md": ["一覧"],
      "templates/steering/steering/external-systems.md": ["一覧"],
      "templates/steering/glossary.md": ["用語", "避ける語", "禁止ワード"],
      "templates/steering/domain/subdomains.md": ["一覧"],
      "templates/steering/domain/bounded-contexts.md": ["一覧", "外部境界", "コンテキスト間の依存", "パターン分類"],
      "templates/steering/discoveries.md": ["一覧"],
      "templates/steering/intents.md": ["一覧", "依存関係"],
    },
  },
  "amadeus-discovery": {
    skillText: [".amadeus/settings/templates", "templates/discoveries/discovery"],
    files: {
      "templates/discoveries/discovery.md": [
        "入力テーマ",
        "確認した前提",
        "判定",
        "判定理由",
        "Intent Draft",
        "Intent 候補",
        "候補判断",
        "既存 Intent との関係",
        "推奨次アクション",
      ],
      "templates/discoveries/discovery/state.json": [],
    },
  },
  "amadeus-event-storming": {
    skillText: [".amadeus/settings/templates", "templates/event-storming/session"],
    files: {
      "templates/event-storming/session.md": [
        "Purpose",
        "Scope",
        "Related Discovery",
        "Related Intent",
        "Level Status",
        "Next Skill",
        "Supersession",
      ],
      "templates/event-storming/session/events.md": ["一覧"],
      "templates/event-storming/session/flow.md": ["Flow"],
      "templates/event-storming/session/board.md": ["Board"],
      "templates/event-storming/session/aggregate-candidates.md": ["一覧"],
      "templates/event-storming/session/bounded-context-candidates.md": ["一覧"],
      "templates/event-storming/session/hotspots.md": ["一覧"],
      "templates/event-storming/session/state.json": [],
    },
  },
  "amadeus-ideation-intent-capture": {
    skillText: [".amadeus/settings/templates", "templates/intents/intent-record"],
    files: {
      "templates/intents/intent-record.md": ["目的", "成功条件", "範囲"],
      "templates/intents/intent-record/state.json": [],
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
    },
    absentFiles: ["templates/intents/ideation/state.json"],
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
      "templates/intents/inception/units/U001-unit.md": ["ユニット", "対象要求", "価値境界", "検証観点", "未確認事項", "関連成果物"],
      "templates/intents/inception/units/U001-unit/design.md": [
        "概要",
        "設計戦略",
        "責務境界",
        "構成候補",
        "データと契約候補",
        "検証観点",
        "Bolt 分割方針",
        "Construction への引き継ぎ",
      ],
      "templates/intents/inception/bolts.md": ["一覧", "依存関係"],
      "templates/intents/inception/bolts/B001-bolt.md": ["概要", "対象ユニット", "設計", "完了条件", "依存", "未確認事項"],
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
    },
    absentFiles: ["templates/intents/inception/bolts/B001-bolt/tasks.md", "templates/intents/inception/state.json"],
    textExcludes: {
      "templates/intents/inception/traceability.md": ["タスク", "T001"],
    },
  },
  "amadeus-construction": {
    skillText: [".amadeus/settings/templates", "templates/intents/construction"],
    files: {
      "templates/intents/construction/U001-unit/functional-design/business-logic-model.md": ["目的", "対象 Unit", "業務ロジック", "入力", "出力", "未確認事項"],
      "templates/intents/construction/U001-unit/functional-design/business-rules.md": ["目的", "業務ルール", "例外", "未確認事項"],
      "templates/intents/construction/U001-unit/functional-design/domain-entities.md": ["目的", "Domain Entity", "関係", "未確認事項"],
      "templates/intents/construction/U001-unit/functional-design/frontend-components.md": ["目的", "UI 構成", "状態", "未確認事項"],
      "templates/intents/construction/bolts/B001-bolt/tasks.md": [],
      "templates/intents/construction/bolts/B001-bolt/notes.md": ["実行方針", "対象タスク", "未確認事項"],
      "templates/intents/construction/bolts/B001-bolt/test-results.md": ["検証結果", "安全性確認", "CI確認", "受け入れ証拠"],
      "templates/intents/construction/bolts/B001-bolt/pr.md": ["Pull Request", "対象", "確認状況"],
      "templates/intents/construction/traceability.md": ["Task Generation からの追跡", "Deployment Unit からの追跡"],
      "templates/intents/construction/decisions.md": ["一覧", "依存関係"],
      "templates/intents/construction/decisions/D003-construction-boundary.md": ["背景", "判断", "理由", "影響"],
    },
    absentFiles: ["templates/intents/construction/state.json", ["templates/intents/construction/bolts/B001-bolt", "design.md"].join("/")],
  },
};

const textContracts: TextContract[] = [
  {
    path: "README.md",
    includes: [
      "対象 Intent の `domain-notes.md`、`.amadeus/domain/**`、`inception/traceability.md`、Construction の Functional Design",
    ],
    excludes: [
      "対象 Intent の `domain-notes.md`、`domain/**`、`traceability.md`",
      "対象 Intent の `domain-notes.md`、`inception/domain/**`",
    ],
  },
  {
    path: "skills/amadeus-discovery/SKILL.md",
    promotedPath: ".agents/skills/amadeus-discovery/SKILL.md",
    includes: [
      "関連しそうな既存 Intent の `ideation/scope.md`、`inception/requirements.md`、`inception/traceability.md`",
    ],
    excludes: [
      "関連しそうな既存 Intent の `scope.md`、`requirements.md`、`traceability.md`",
    ],
  },
  {
    path: "skills/amadeus-domain-modeling/SKILL.md",
    promotedPath: ".agents/skills/amadeus-domain-modeling/SKILL.md",
    includes: [
      ".amadeus/domain/**",
      "Construction の Functional Design",
      ".amadeus/intents/<intent-id>-<slug>/inception/traceability.md",
      ".amadeus/intents/<intent-id>-<slug>/inception/decisions.md",
    ],
    excludes: [
      ".amadeus/intents/<intent-id>-<slug>/domain/**",
      ".amadeus/intents/<intent-id>-<slug>/inception/domain/**",
      ".amadeus/intents/<intent-id>-<slug>/traceability.md",
      ".amadeus/intents/<intent-id>-<slug>/decisions.md",
    ],
  },
  {
    path: "skills/amadeus-domain-grilling/SKILL.md",
    promotedPath: ".agents/skills/amadeus-domain-grilling/SKILL.md",
    includes: [
      ".amadeus/domain/**",
      "Construction の Functional Design",
      "対象 Intent の `inception/traceability.md`",
    ],
    excludes: [
      ".amadeus/intents/<intent-id>-<slug>/domain/**",
      ".amadeus/intents/<intent-id>-<slug>/inception/domain/**",
      "対象 Intent の `traceability.md`",
    ],
  },
  {
    path: "skills/amadeus-inception/SKILL.md",
    promotedPath: ".agents/skills/amadeus-inception/SKILL.md",
    includes: [
      "Inception は `inception/domain/**` を作らない。",
      "`inception/units.md` の `コンテキスト`",
      "既存のドメイン用語、境界づけられたコンテキスト、契約が不足している場合は、Inception 成果物の中で推測して確定しない。",
    ],
    excludes: [
      "`domain/subdomains.md` と `domain/bounded-contexts.md`",
      "`units.md` の `コンテキスト`",
      "対象 Intent の `domain/bounded-contexts.md`",
      "`inception/domain/subdomains.md` と `inception/domain/bounded-contexts.md`",
    ],
  },
];

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

function assertFileMissing(path: string): void {
  if (existsSync(path)) fail(`unexpected file: ${path}`);
}

function assertTextIncludes(path: string, needle: string): void {
  const text = readFileSync(path, "utf8");
  if (!text.includes(needle)) fail(`${path} does not include ${JSON.stringify(needle)}`);
}

function assertTextExcludes(path: string, needle: string): void {
  const text = readFileSync(path, "utf8");
  if (text.includes(needle)) fail(`${path} unexpectedly includes ${JSON.stringify(needle)}`);
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

  for (const relative of contract.absentFiles ?? []) {
    assertFileMissing(join(root, "skills", skill, relative));
    assertFileMissing(join(root, ".agents/skills", skill, relative));
  }

  for (const [relative, needles] of Object.entries(contract.textExcludes ?? {})) {
    const source = join(root, "skills", skill, relative);
    const promoted = join(root, ".agents/skills", skill, relative);
    assertFile(source);
    assertFile(promoted);
    for (const needle of needles) {
      assertTextExcludes(source, needle);
      assertTextExcludes(promoted, needle);
    }
  }
}

for (const contract of textContracts) {
  const source = join(root, contract.path);
  assertFile(source);
  for (const needle of contract.includes) assertTextIncludes(source, needle);
  for (const needle of contract.excludes) assertTextExcludes(source, needle);

  if (contract.promotedPath) {
    const promoted = join(root, contract.promotedPath);
    assertFile(promoted);
    for (const needle of contract.includes) assertTextIncludes(promoted, needle);
    for (const needle of contract.excludes) assertTextExcludes(promoted, needle);
  }
}

const tmp = mkdtempSync(join(tmpdir(), "amadeus-template-promotion"));
const agentsRoot = join(tmp, ".agents/skills");
for (const skill of Object.keys(targetSkills)) {
  run(["bun", "run", "dev-scripts/promote-skill.ts", skill, "--agents-root", agentsRoot]);
  run(["diff", "-qr", `skills/${skill}/templates`, join(agentsRoot, skill, "templates")]);
}

run(["bun", "run", "dev-scripts/validate-amadeus-examples.ts", "--all"]);

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
if (packageJson.scripts?.["examples:generate:real"] !== "bun run dev-scripts/generate-amadeus-examples.ts --provider real") {
  fail("package.json must expose examples:generate:real");
}
assertFile(join(root, "dev-scripts/generate-amadeus-examples.ts"));
const dryRun = run(["bun", "run", "dev-scripts/generate-amadeus-examples.ts", "--provider", "real", "--dry-run"]);
for (const expected of [
  "examples/02-ideation-completed",
  "examples/03-inception-completed",
  "examples/04-construction-design-ready",
  "provider: real",
  "dryRun: true",
]) {
  if (!dryRun.includes(expected)) fail(`example generation dry-run missing ${JSON.stringify(expected)}`);
}

console.log("amadeus template eval: ok");
