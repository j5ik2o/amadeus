#!/usr/bin/env bun

import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { domainPlacementContract } from "../../../amadeus-contracts/catalog";

const root = resolve(import.meta.dir, "../../..");
const legacyIntentDomainPattern = `${domainPlacementContract.legacyIntentDomainSegments.join("/")}/**`;

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
      "templates/steering/discoveries.md": ["一覧"],
      "templates/steering/intents.md": ["一覧", "依存関係"],
    },
    absentFiles: ["templates/steering/domain/subdomains.md", "templates/steering/domain/bounded-contexts.md"],
    textExcludes: {
      "SKILL.md": [
        "domain/subdomains.md",
        "domain/bounded-contexts.md",
        ".amadeus/domain/subdomains.md",
        ".amadeus/domain/bounded-contexts.md",
      ],
      "templates/steering/README.md": ["domain/subdomains.md", "domain/bounded-contexts.md"],
      "templates/steering/steering.md": ["domain/subdomains.md", "domain/bounded-contexts.md"],
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
      "templates/intents/intent-record.md": ["目標プロファイル", "目的", "成功条件", "範囲"],
      "templates/intents/intent-record/state.json": [],
    },
  },
  "amadeus-ideation": {
    skillText: [".amadeus/settings/templates", "templates/intents/ideation"],
    files: {
      "templates/intents/ideation/scope.md": ["対象境界", "実行制御", "成果物深度", "検証戦略", "Inception への引き継ぎ"],
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
      "templates/intents/inception/codebase-analysis.md": ["対象コード", "既存能力", "統合点", "ギャップ", "リスク", "Inception への入力", "証拠", "鮮度", "未確認事項"],
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
        "対象境界からの追跡",
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
      "templates/intents/construction/traceability.md": ["Task Generation からの追跡", "Construction からの追跡", "Deployment Unit からの追跡"],
      "templates/intents/construction/decisions.md": ["一覧", "依存関係"],
      "templates/intents/construction/decisions/D003-construction-boundary.md": ["背景", "判断", "理由", "影響"],
    },
    absentFiles: ["templates/intents/construction/state.json", ["templates/intents/construction/bolts/B001-bolt", "design.md"].join("/")],
  },
};

const textContracts: TextContract[] = [
  {
    path: "README.ja.md",
    includes: [
      "対象 Intent の `domain-notes.md`、`.amadeus/domain-map.md`、`.amadeus/context-map.md`、`inception/traceability.md`、Construction の Functional Design",
    ],
    excludes: [
      "対象 Intent の `domain-notes.md`、`domain/**`、`traceability.md`",
      `対象 Intent の \`domain-notes.md\`、\`${legacyIntentDomainPattern}\``,
    ],
  },
  {
    path: "skills/amadeus-discovery/SKILL.md",
    promotedPath: ".agents/skills/amadeus-discovery/SKILL.md",
    includes: [
      "- `.amadeus/steering/product.md`",
      "- `.amadeus/steering/tech.md`",
      "- `.amadeus/steering/structure.md`",
      "関連しそうな既存 Intent の `ideation/scope.md`、`inception/requirements.md`、`inception/traceability.md`",
    ],
    excludes: [
      "関連しそうな既存 Intent の `scope.md`、`requirements.md`、`traceability.md`",
    ],
  },
  {
    path: "skills/amadeus-event-storming/SKILL.md",
    promotedPath: ".agents/skills/amadeus-event-storming/SKILL.md",
    includes: [
      "- `.amadeus/steering/product.md`",
      "- `.amadeus/steering/tech.md`",
      "- `.amadeus/steering/structure.md`",
    ],
    excludes: [],
  },
  {
    path: "skills/amadeus-domain-modeling/SKILL.md",
    promotedPath: ".agents/skills/amadeus-domain-modeling/SKILL.md",
    includes: [
      ".amadeus/domain-map.md",
      ".amadeus/context-map.md",
      "Construction の Functional Design",
      ".amadeus/intents/<intent-id>-<slug>/inception/traceability.md",
      ".amadeus/intents/<intent-id>-<slug>/inception/decisions.md",
    ],
    excludes: [
      ".amadeus/domain/",
      ".amadeus/domain/**",
      ".amadeus/intents/<intent-id>-<slug>/domain/**",
      `.amadeus/intents/<intent-id>-<slug>/${legacyIntentDomainPattern}`,
      ".amadeus/intents/<intent-id>-<slug>/traceability.md",
      ".amadeus/intents/<intent-id>-<slug>/decisions.md",
    ],
  },
  {
    path: "skills/amadeus-domain-grilling/SKILL.md",
    promotedPath: ".agents/skills/amadeus-domain-grilling/SKILL.md",
    includes: [
      ".amadeus/domain-map.md",
      ".amadeus/context-map.md",
      "Construction の Functional Design",
      "対象 Intent の `inception/traceability.md`",
    ],
    excludes: [
      ".amadeus/domain/",
      ".amadeus/domain/**",
      ".amadeus/intents/<intent-id>-<slug>/domain/**",
      `.amadeus/intents/<intent-id>-<slug>/${legacyIntentDomainPattern}`,
      "対象 Intent の `traceability.md`",
    ],
  },
  {
    path: "skills/amadeus-ideation/SKILL.md",
    promotedPath: ".agents/skills/amadeus-ideation/SKILL.md",
    includes: [
      "## 実行時問題報告",
      "現在の Intent 対象、後続 Issue 候補、報告不要",
      "GitHub Issue を作成するのは、人間が Issue 化を承認した場合だけである。",
      "validator の `pass` は、実行時に参照できる最低限の構造条件を満たすという意味であり、内容承認として扱わない。",
    ],
    excludes: [],
  },
  {
    path: "skills/amadeus-inception/SKILL.md",
    promotedPath: ".agents/skills/amadeus-inception/SKILL.md",
    includes: [
      "Inception は Intent 固有の正式な Domain Model や Contracts を作らない。",
      "`inception/units.md` の `コンテキスト`",
      "Domain Map の `adopted` Bounded Context",
      "Domain Map 未登録の Bounded Context",
      "新規 Boundary を採用する場合は、Finalization で Domain Map へ `adopted` Bounded Context として反映し、`根拠` に Inception の判断を置く。",
      "`scope.md` の対象境界、実行制御、成果物深度、検証戦略",
      "## 実行時問題報告",
      "現在の Intent 対象、後続 Issue 候補、報告不要",
      "GitHub Issue を作成するのは、人間が Issue 化を承認した場合だけである。",
      "validator の `pass` は、実行時に参照できる最低限の構造条件を満たすという意味であり、内容承認として扱わない。",
    ],
    excludes: [
      ".amadeus/domain/**",
      "domain layer",
      "`domain/subdomains.md` と `domain/bounded-contexts.md`",
      "`units.md` の `コンテキスト`",
      "対象 Intent の `domain/bounded-contexts.md`",
      `\`${domainPlacementContract.legacyIntentDomainSegments.join("/")}/subdomains.md\` と \`${domainPlacementContract.legacyIntentDomainSegments.join("/")}/bounded-contexts.md\``,
    ],
  },
  {
    path: "skills/amadeus-inception-codebase-analysis/SKILL.md",
    promotedPath: ".agents/skills/amadeus-inception-codebase-analysis/SKILL.md",
    includes: [
      "`state.json.inception.codebaseAnalysis`",
      "既存コードに載せる場合は、`requirement` を `required` にする。",
      "greenfield の Intent では `codebase-analysis.md` を作らず",
      "Impact Mapping を独立 stage として作らない。",
    ],
    excludes: ["Spec、実装、CI を作る"],
  },
  {
    path: "skills/amadeus-inception-units-generation/SKILL.md",
    promotedPath: ".agents/skills/amadeus-inception-units-generation/SKILL.md",
    includes: [
      "Unit の `コンテキスト` は Domain Map の `adopted` Bounded Context、または Inception で採用判断する境界候補として扱う。",
      "Domain Map 未登録の Bounded Context を仮参照する場合は、Finalization で Domain Map へ反映する必要がある未確認事項として残す。",
    ],
    excludes: [".amadeus/domain/**", "domain layer"],
  },
  {
    path: "skills/amadeus-inception-traceability-finalization/SKILL.md",
    promotedPath: ".agents/skills/amadeus-inception-traceability-finalization/SKILL.md",
    includes: [
      "既存 Boundary を参照する場合、Unit から参照する Bounded Context が Domain Map で `adopted` であることを確認する。",
      "新規 Boundary を採用する場合、Domain Map へ `adopted` Bounded Context として反映し、`根拠` に Inception の判断を置く。",
      "Unit から参照する Bounded Context が Domain Map で `adopted` ではない場合、`state.json.inception.gate` は `not_ready` にする。",
      "Bounded Context と Unit 参照が採用済み Boundary として確定している場合は `passed` にしてよい。",
    ],
    excludes: ["BC と Unit 参照が確定している場合は `passed` にしてよい。"],
  },
  {
    path: "skills/amadeus-inception/templates/intents/inception/units.md",
    promotedPath: ".agents/skills/amadeus-inception/templates/intents/inception/units.md",
    includes: [
      "Unit の `コンテキスト` は Domain Map の `adopted` Bounded Context、または Inception で採用判断する境界候補を記録する。",
      "Domain Map 未登録の Bounded Context を仮参照する場合は、Finalization で Domain Map へ反映する必要がある未確認事項として残す。",
    ],
    excludes: [".amadeus/domain/**", "domain layer"],
  },
  {
    path: "skills/amadeus-construction/SKILL.md",
    promotedPath: ".agents/skills/amadeus-construction/SKILL.md",
    includes: [
      "Functional Design は詳細な Domain Model と Intent Contracts の管理元である。",
      "Functional Design 承認後に、共有境界として採用する内容は Domain Map、コンテキスト間依存として採用する内容は Context Map へ反映できる。",
      "Domain Map と Context Map は候補を扱わず、`adopted` と `retired` の現在の索引だけを扱う。",
      "## 実行時問題報告",
      "現在の Intent 対象、後続 Issue 候補、報告不要",
      "GitHub Issue を作成するのは、人間が Issue 化を承認した場合だけである。",
      "validator の `pass` は、実行時に参照できる最低限の構造条件を満たすという意味であり、内容承認として扱わない。",
    ],
    excludes: [".amadeus/domain/**", "domain layer"],
  },
  {
    path: "skills/amadeus-construction-functional-design/SKILL.md",
    promotedPath: ".agents/skills/amadeus-construction-functional-design/SKILL.md",
    includes: [
      "Functional Design は詳細な Domain Model と Intent Contracts の管理元である。",
      "Functional Design の承認後に Domain Map と Context Map へ昇格する候補を、`domain-entities.md` の `Domain Map と Context Map への反映候補` に記録する。",
      "Functional Design が `passed` で、共有境界として採用する判断がある場合は Domain Map、コンテキスト間依存として採用する判断がある場合は Context Map へ反映できる。",
      "Functional Design が `passed` で、共有境界として採用する判断がある場合は Domain Map、コンテキスト間依存として採用する判断がある場合は Context Map を、`adopted` または `retired` の現在の索引として更新する。",
      "template に Catalog 外の補助見出しがある場合は、その見出しも保持する。",
      "Domain Map と Context Map には候補を載せない。",
    ],
    excludes: [".amadeus/domain/**", "domain layer"],
  },
  {
    path: "skills/amadeus-construction-bolt-preparation/SKILL.md",
    promotedPath: ".agents/skills/amadeus-construction-bolt-preparation/SKILL.md",
    includes: [
      "Functional Design の業務ロジック、業務ルール、Intent Contracts、Domain Entity、必要な UI 構成が Task に反映されている。",
      "ユースケースは Use Case ID または `なし` にする。",
      "`なし` は、相互作用がない内部作業の場合だけ使う。",
    ],
    excludes: [".amadeus/domain/**", "domain layer"],
  },
  {
    path: "skills/amadeus-construction-traceability-finalization/SKILL.md",
    promotedPath: ".agents/skills/amadeus-construction-traceability-finalization/SKILL.md",
    includes: [
      "Functional Design 承認後に共有境界として採用する内容が未反映の場合は Domain Map、コンテキスト間依存として採用する内容が未反映の場合は Context Map を、`adopted` または `retired` の現在の索引として更新する。",
      "Domain Map と Context Map の更新判断と根拠を `decisions.md` に残す。",
    ],
    excludes: [".amadeus/domain/**", "domain layer"],
  },
  {
    path: "skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/domain-entities.md",
    promotedPath:
      ".agents/skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/domain-entities.md",
    includes: [
      "Functional Design は詳細な Domain Model と Intent Contracts の管理元である。",
      "Domain Map と Context Map への反映候補",
    ],
    excludes: [".amadeus/domain/**", "domain layer"],
  },
  {
    path: "skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-rules.md",
    promotedPath:
      ".agents/skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-rules.md",
    includes: ["Intent Contracts", "| 識別子 | 種別 | 条件 | 根拠 | 状態 |"],
    excludes: [".amadeus/domain/**", "domain layer"],
  },
  {
    path: "skills/amadeus-ideation-scope-framing/SKILL.md",
    promotedPath: ".agents/skills/amadeus-ideation-scope-framing/SKILL.md",
    includes: [
      "`対象境界`",
      "`実行制御`",
      "`成果物深度`",
      "`検証戦略`",
      "AI-DLC v2 の Scope ではない。",
      "成果物深度と検証戦略は独立して判断する。",
    ],
    excludes: ["`詳細度`", "`検証深度`"],
  },
  {
    path: "skills/amadeus-ideation-feasibility-shaping/SKILL.md",
    promotedPath: ".agents/skills/amadeus-ideation-feasibility-shaping/SKILL.md",
    includes: ["対象境界、実行スコープ、成果物深度、検証戦略"],
    excludes: ["対象、対象外、検証深度"],
  },
  {
    path: "skills/amadeus-ideation-mock-framing/SKILL.md",
    promotedPath: ".agents/skills/amadeus-ideation-mock-framing/SKILL.md",
    includes: ["`scope.md` の対象境界、成果物深度、検証戦略を読む。"],
    excludes: [],
  },
  {
    path: "skills/amadeus-ideation-traceability-finalization/SKILL.md",
    promotedPath: ".agents/skills/amadeus-ideation-traceability-finalization/SKILL.md",
    includes: [
      "`scope.md` の対象境界、実行制御、成果物深度、検証戦略",
      "`state.json` には、`scope.md` の実行スコープ、成果物深度、検証戦略を保存しない。",
    ],
    excludes: [],
  },
  {
    path: "skills/amadeus-ideation/templates/intents/ideation/traceability.md",
    promotedPath: ".agents/skills/amadeus-ideation/templates/intents/ideation/traceability.md",
    includes: ["対象境界", "実行制御", "成果物深度", "検証戦略"],
    excludes: ["| Scope |", "| 対象外 |"],
  },
  {
    path: "skills/amadeus-ideation/templates/intents/ideation/decisions/D001-complete-ideation.md",
    promotedPath: ".agents/skills/amadeus-ideation/templates/intents/ideation/decisions/D001-complete-ideation.md",
    includes: [
      "Inception へ進める前に、対象境界、実行スコープ、成果物深度、検証戦略、実現可能性、体制、初期モックを確認する。",
      "`state.json` には、実行スコープ、成果物深度、検証戦略を保存しない。",
    ],
    excludes: [],
  },
  {
    path: "skills/amadeus-inception-requirements-definition/SKILL.md",
    promotedPath: ".agents/skills/amadeus-inception-requirements-definition/SKILL.md",
    includes: ["要求候補、対象境界、実行制御、成果物深度、検証戦略、制約"],
    excludes: ["要求候補、対象外、制約"],
  },
];

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function run(command: string[]): string {
  return runInCwd(command, root);
}

function runInCwd(command: string[], cwd: string): string {
  const result = Bun.spawnSync(command, { cwd, stdout: "pipe", stderr: "pipe" });
  const stdout = new TextDecoder().decode(result.stdout);
  const stderr = new TextDecoder().decode(result.stderr);
  if (result.exitCode !== 0) {
    fail(["command failed: " + command.join(" "), "stdout:", stdout, "stderr:", stderr].join("\n"));
  }
  return stdout;
}

function runExpectFailure(command: string[], cwd: string, expected: string): void {
  const result = Bun.spawnSync(command, { cwd, stdout: "pipe", stderr: "pipe" });
  const stdout = new TextDecoder().decode(result.stdout);
  const stderr = new TextDecoder().decode(result.stderr);
  if (result.exitCode === 0) {
    fail(["command unexpectedly succeeded: " + command.join(" "), "stdout:", stdout, "stderr:", stderr].join("\n"));
  }
  const output = `${stdout}\n${stderr}`;
  if (!output.includes(expected)) {
    fail([
      `command failed without expected output: ${expected}`,
      "command: " + command.join(" "),
      "stdout:",
      stdout,
      "stderr:",
      stderr,
    ].join("\n"));
  }
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

function assertInceptionStageReference(): void {
  const path = join(root, "docs/amadeus/stages/inception.md");
  const text = readFileSync(path, "utf8");
  const stageHeadings = Array.from(text.matchAll(/^## Stage (2\.\d): (.+)$/gm)).map((match) => `${match[1]}: ${match[2]}`);
  const expected = [
    "2.0: Codebase Analysis",
    "2.1: Requirements Definition",
    "2.2: User Stories",
    "2.3: Use Cases",
    "2.4: Units Generation",
    "2.5: Traceability Finalization",
  ];
  if (stageHeadings.join("\n") !== expected.join("\n")) {
    fail(`docs/amadeus/stages/inception.md has unexpected stage headings:\n${stageHeadings.join("\n")}`);
  }
  for (const legacy of [
    "Interaction Modeling",
    "Execution Design",
    "amadeus-inception-interaction-modeling",
    "amadeus-inception-execution-design",
  ]) {
    assertTextExcludes(path, legacy);
  }
}

assertInceptionStageReference();

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

const mismatchRepo = mkdtempSync(join(tmpdir(), "amadeus-validator-promotion-mismatch"));
mkdirSync(join(mismatchRepo, "dev-scripts"), { recursive: true });
cpSync(join(root, "dev-scripts/generate-amadeus-examples.ts"), join(mismatchRepo, "dev-scripts/generate-amadeus-examples.ts"));
cpSync(join(root, "skills"), join(mismatchRepo, "skills"), { recursive: true });
mkdirSync(join(mismatchRepo, ".agents"), { recursive: true });
cpSync(join(root, ".agents/skills"), join(mismatchRepo, ".agents/skills"), { recursive: true });
const sourceValidator = join(mismatchRepo, "skills/amadeus-validator/validator/AmadeusValidator.ts");
writeFileSync(sourceValidator, `${readFileSync(sourceValidator, "utf8")}\n// validator source mismatch for eval\n`);
runExpectFailure(
  ["bun", "run", "dev-scripts/generate-amadeus-examples.ts", "--provider", "real", "--dry-run"],
  mismatchRepo,
  "source validator and .agents validator differ",
);

const provenanceRepo = mkdtempSync(join(tmpdir(), "amadeus-provenance-rebuild"));
mkdirSync(join(provenanceRepo, "dev-scripts"), { recursive: true });
cpSync(join(root, "dev-scripts/generate-amadeus-examples.ts"), join(provenanceRepo, "dev-scripts/generate-amadeus-examples.ts"));
cpSync(join(root, "skills"), join(provenanceRepo, "skills"), { recursive: true });
mkdirSync(join(provenanceRepo, ".agents"), { recursive: true });
cpSync(join(root, ".agents/skills"), join(provenanceRepo, ".agents/skills"), { recursive: true });
mkdirSync(join(provenanceRepo, "examples"), { recursive: true });
const provenanceManifest = JSON.parse(readFileSync(join(root, "examples/skill-provenance.json"), "utf8")) as {
  entries: Array<{ snapshot: string; skillFiles: Array<{ path: string; md5: string }> }>;
};
const constructionEntry = provenanceManifest.entries.find((entry) => entry.snapshot === "examples/04-construction-design-ready");
if (!constructionEntry) fail("missing construction provenance entry");
constructionEntry.skillFiles = [
  ...constructionEntry.skillFiles.filter((skillFile) => skillFile.path !== "skills/amadeus-construction-bolt-preparation/SKILL.md"),
  { path: "skills/amadeus-obsolete/SKILL.md", md5: "00000000000000000000000000000000" },
];
writeFileSync(join(provenanceRepo, "examples/skill-provenance.json"), `${JSON.stringify(provenanceManifest, null, 2)}\n`);
const rebuiltProvenanceOutput = runInCwd(
  ["bun", "run", "dev-scripts/generate-amadeus-examples.ts", "--provider", "real", "--dry-run", "--print-provenance"],
  provenanceRepo,
);
if (!rebuiltProvenanceOutput.includes('"path": "skills/amadeus-construction-bolt-preparation/SKILL.md"')) {
  fail("rebuilt provenance must include skill files from step definitions");
}
if (rebuiltProvenanceOutput.includes("skills/amadeus-obsolete/SKILL.md")) {
  fail("rebuilt provenance must remove skill files absent from step definitions");
}

console.log("amadeus template eval: ok");
