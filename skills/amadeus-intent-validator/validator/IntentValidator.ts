#!/usr/bin/env bun

import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";

type Result = "pass" | "fail" | "blocked" | "skipped";

type Row = {
  target: string;
  condition: string;
  result: Result;
  evidence: string;
};

type Table = {
  headers: string[];
  rows: Record<string, string>[];
};

const statusValues = new Set(["not_started", "in_progress", "waiting_approval", "needs_changes", "completed", "skipped"]);
const gateValues = new Set(["not_ready", "waiting_approval", "passed", "failed"]);
const intentDirectoryPattern = /^\d{8}-[a-z0-9]+(?:-[a-z0-9]+)*$/;

const indexSpecs: Record<string, { headings: string[]; listHeading: string; columns: string[]; idPattern: RegExp; targetColumn: string }> = {
  "user-stories.md": {
    headings: ["一覧", "依存関係"],
    listHeading: "一覧",
    columns: ["識別子", "アクター", "概要", "要求", "依存", "詳細"],
    idPattern: /^S\d{3}$/,
    targetColumn: "ユーザーストーリー",
  },
  "use-cases.md": {
    headings: ["一覧", "依存関係"],
    listHeading: "一覧",
    columns: ["識別子", "アクター", "外部システム", "ストーリー", "要求", "依存", "詳細"],
    idPattern: /^UC\d{3}$/,
    targetColumn: "ユースケース",
  },
  "units.md": {
    headings: ["一覧", "依存関係"],
    listHeading: "一覧",
    columns: ["識別子", "概要", "要求", "コンテキスト", "依存", "詳細"],
    idPattern: /^U\d{3}$/,
    targetColumn: "ユニット",
  },
  "bolts.md": {
    headings: ["一覧", "依存関係"],
    listHeading: "一覧",
    columns: ["識別子", "概要", "ユニット", "依存", "詳細"],
    idPattern: /^B\d{3}$/,
    targetColumn: "ボルト",
  },
  "decisions.md": {
    headings: ["一覧", "依存関係"],
    listHeading: "一覧",
    columns: ["識別子", "概要", "状態", "依存", "詳細"],
    idPattern: /^D\d{3}$/,
    targetColumn: "判断",
  },
};

class IntentValidator {
  private readonly root: string;
  private readonly intentId?: string;
  private readonly rows: Row[] = [];
  private readonly checkedFiles = new Set<string>();
  private readonly knownIds = new Map<string, Set<string>>();

  constructor(root: string, intentId?: string) {
    this.root = resolve(root);
    this.intentId = this.blank(intentId) ? undefined : intentId;
  }

  run(): string {
    try {
      this.checkWorkspace();
      if (!this.failed()) {
        this.checkFile(".amadeus/README.md", "必須ファイルが存在する");
        this.checkGlobalIndexes();
        if (this.intentId) {
          this.checkIntentIndexes(this.intentId);
        } else {
          this.pass(".amadeus/intents.md", "対象 Intent ディレクトリ名", "指定なし。全体成果物だけを検証");
        }
      }
    } catch (error) {
      this.blocked("実行環境", "検証対象を読める", (error as Error).message);
    }

    return this.report();
  }

  private checkWorkspace(): void {
    if (this.isDirectory(this.root)) {
      this.pass(this.root, "検証対象の作業ディレクトリが存在する", "存在を確認");
    } else {
      this.failRow(this.root, "検証対象の作業ディレクトリが存在する", "存在しない");
      return;
    }

    this.checkFile(".amadeus", "Amadeus の成果物ルートが存在する", true);
  }

  private checkGlobalIndexes(): void {
    this.checkIntents();
    this.checkSubdomains(".amadeus/domain/subdomains.md", ".amadeus/domain/bounded-contexts.md");
    this.checkBoundedContexts(".amadeus/domain/bounded-contexts.md", true);
  }

  private checkIntentIndexes(intentId: string): void {
    const base = `.amadeus/intents/${intentId}`;
    this.checkFile(`${base}/intent.md`, "Intent 基本ファイルが存在する");
    this.checkHeadings(`${base}/intent.md`, ["目的", "成功条件", "範囲"]);

    const statePath = `${base}/state.json`;
    this.checkFile(statePath, "Intent 状態ファイルが存在する");
    const state = this.intentState(statePath);
    if (!state) return;

    if (state.phase === "initialized") {
      this.checkInitializedStateJson(statePath, state);
      return;
    }

    if (state.phase === "ideation") {
      this.checkIdeationIntent(base, state);
      return;
    }

    if (state.phase === "inception") {
      this.checkInceptionIntent(base, state);
      return;
    }

    this.failRow(statePath, "`phase` が既知である", String(state.phase ?? ""));
  }

  private intentState(path: string): Record<string, any> | undefined {
    if (!this.isFile(this.absolute(path))) return undefined;
    try {
      const state = JSON.parse(this.read(path));
      this.pass(path, "state.json が JSON として解釈できる", "JSON を確認");
      return state;
    } catch (error) {
      this.failRow(path, "state.json が JSON として解釈できる", (error as Error).message);
      return undefined;
    }
  }

  private checkInitializedStateJson(path: string, state: Record<string, any>): void {
    this.checkJsonValue(path, "intent", state.intent, this.intentId ?? "");
    this.checkJsonValue(path, "phase", state.phase, "initialized");
    this.checkAllowed(path, "status", state.status, statusValues);

    const initialized = state.initialized;
    if (!this.isObject(initialized)) {
      this.failRow(path, "`initialized` がオブジェクトである", this.typeName(initialized));
      return;
    }
    this.pass(path, "`initialized` がオブジェクトである", "オブジェクトを確認");
    this.checkAllowed(path, "initialized.status", initialized.status, statusValues);
    this.checkStatePaths(path, initialized, "createdArtifacts", "Initialized 作成済み成果物が存在する", false, "initialized");
    this.checkJsonValue(path, "initialized.next", initialized.next, "ideation");
  }

  private checkIdeationIntent(base: string, state: Record<string, any>): void {
    const statePath = `${base}/state.json`;
    this.checkStateJson(statePath, state);

    this.checkFile(`${base}/scope.md`, "Ideation scope が存在する");
    this.checkHeadings(`${base}/scope.md`, ["対象", "対象外", "詳細度", "検証深度", "Inception への引き継ぎ"]);

    this.checkFile(`${base}/ideation.md`, "Ideation 分析が存在する");
    this.checkHeadings(`${base}/ideation.md`, ["実現可能性", "体制", "初期モック", "未確定事項", "学習候補"]);

    this.checkIdeationTraceability(`${base}/traceability.md`);

    this.checkFile(`${base}/decisions.md`, "Ideation 判断一覧が存在する");
    this.checkOptionalIndex(`${base}/decisions.md`, indexSpecs["decisions.md"]);
  }

  private checkStateJson(path: string, state: Record<string, any>): void {
    this.checkJsonValue(path, "intent", state.intent, this.intentId ?? "");
    this.checkJsonValue(path, "phase", state.phase, "ideation");
    this.checkAllowed(path, "status", state.status, statusValues);

    const ideation = state.ideation;
    if (!this.isObject(ideation)) {
      this.failRow(path, "`ideation` がオブジェクトである", this.typeName(ideation));
      return;
    }

    this.pass(path, "`ideation` がオブジェクトである", "オブジェクトを確認");
    this.checkAllowed(path, "ideation.status", ideation.status, statusValues);
    this.checkAllowed(path, "ideation.gate", ideation.gate, gateValues);
    this.checkStatePaths(path, ideation, "requiredArtifacts", "Ideation 必須成果物が存在する", false, "ideation");
    this.checkStatePaths(path, ideation, "requiredMocks", "Ideation 必須モックが存在する", true, "ideation");

    if (String(state.status ?? "").trim() === "completed") {
      this.checkJsonValue(path, "ideation.status", ideation.status, "completed");
      this.checkJsonValue(path, "ideation.gate", ideation.gate, "passed");
    }
  }

  private checkInceptionIntent(base: string, state: Record<string, any>): void {
    const statePath = `${base}/state.json`;
    this.checkInceptionStateJson(statePath, state);

    this.checkRequirements(`${base}/requirements.md`);
    this.checkAcceptance(`${base}/acceptance.md`, `${base}/requirements.md`);
    this.checkCodebaseAnalysis(base, state);
    this.checkSubdomains(`${base}/domain/subdomains.md`, `${base}/domain/bounded-contexts.md`);
    this.checkBoundedContexts(`${base}/domain/bounded-contexts.md`, false);

    for (const [filename, spec] of Object.entries(indexSpecs)) {
      const path = `${base}/${filename}`;
      if (this.isFile(this.absolute(path))) this.checkOptionalIndex(path, spec);
    }

    this.checkTraceability(`${base}/traceability.md`);
  }

  private checkInceptionStateJson(path: string, state: Record<string, any>): void {
    this.checkJsonValue(path, "intent", state.intent, this.intentId ?? "");
    this.checkJsonValue(path, "phase", state.phase, "inception");
    this.checkAllowed(path, "status", state.status, statusValues);

    const ideation = state.ideation;
    if (!this.isObject(ideation)) {
      this.failRow(path, "`ideation` がオブジェクトである", this.typeName(ideation));
      return;
    }
    this.pass(path, "`ideation` がオブジェクトである", "オブジェクトを確認");
    this.checkJsonValue(path, "ideation.status", ideation.status, "completed");
    this.checkJsonValue(path, "ideation.gate", ideation.gate, "passed");

    const inception = state.inception;
    if (!this.isObject(inception)) {
      this.failRow(path, "`inception` がオブジェクトである", this.typeName(inception));
      return;
    }
    this.pass(path, "`inception` がオブジェクトである", "オブジェクトを確認");
    this.checkAllowed(path, "inception.status", inception.status, statusValues);
    this.checkAllowed(path, "inception.gate", inception.gate, gateValues);
    this.checkStatePaths(path, inception, "requiredArtifacts", "Inception 必須成果物が存在する", false, "inception");
    this.checkStatePaths(path, inception, "requiredBoltArtifacts", "Inception 必須 Bolt 成果物が存在する", false, "inception");

    if (String(state.status ?? "").trim() === "completed") {
      this.checkJsonValue(path, "inception.status", inception.status, "completed");
      this.checkJsonValue(path, "inception.gate", inception.gate, "passed");
    }
  }

  private checkStatePaths(path: string, section: Record<string, any>, key: string, condition: string, puml: boolean, label: string): void {
    const values = section[key];
    if (!Array.isArray(values)) {
      this.failRow(path, `\`${label}.${key}\` が配列である`, this.typeName(values));
      return;
    }

    this.pass(path, `\`${label}.${key}\` が配列である`, `${values.length}件`);
    for (const value of values) this.checkStateRelativePath(path, value, condition, puml);
  }

  private checkStateRelativePath(path: string, value: unknown, condition: string, puml: boolean): void {
    const item = String(value ?? "").trim();
    if (item.length === 0 || item.startsWith("/") || item.split("/").includes("..")) {
      this.failRow(path, condition, `${item} は Intent ディレクトリ内の相対パスではない`);
      return;
    }
    if (puml && !item.endsWith(".puml")) {
      this.failRow(path, condition, `${item} は .puml ではない`);
      return;
    }

    const target = this.absolute(join(dirname(path), item));
    if (this.isFile(target)) {
      this.checkedFiles.add(this.relativePath(target));
      this.pass(path, condition, item);
    } else {
      this.failRow(path, condition, `${item} が存在しない`);
    }
  }

  private checkIntents(): void {
    const path = ".amadeus/intents.md";
    this.checkFile(path, "インテント一覧が存在する");
    this.checkHeadings(path, ["一覧", "依存関係"]);
    const table = this.checkTable(path, "一覧", ["識別子", "概要", "依存", "詳細"]);
    if (!table) return;

    const ids = this.collectIds(path, table, "識別子", intentDirectoryPattern);
    this.checkDependencyValues(path, table, "依存", ids);
    this.checkIntentDetailLinks(path, table, ids);

    const depTable = this.checkTable(path, "依存関係", ["インテント", "依存", "理由"]);
    if (!depTable) return;
    this.checkTableTargets(path, depTable, "インテント", ids, false);
    this.checkDependencyValues(path, depTable, "依存", ids);
    this.checkNotBlank(path, depTable, "理由");
  }

  private checkRequirements(path: string): void {
    this.checkFile(path, "要求一覧が存在する");
    this.checkHeadings(path, ["一覧", "依存関係", "受け入れ状態"]);
    const table = this.checkTable(path, "一覧", ["識別子", "概要", "状態", "依存", "詳細"]);
    if (!table) return;

    const ids = this.collectIds(path, table, "識別子", /^R\d{3}$/);
    this.checkDependencyValues(path, table, "依存", ids);
    this.checkDetailLinks(path, table, "詳細");
  }

  private checkAcceptance(path: string, requirementsPath: string): void {
    this.checkFile(path, "受け入れ状態が存在する");
    this.checkHeadings(path, ["要求状態", "状態ルール"]);
    const table = this.checkTable(path, "要求状態", ["要求", "状態", "証拠"]);
    if (!table) return;

    const requirementIds = this.idsFor(requirementsPath);
    this.checkTableTargets(path, table, "要求", requirementIds, false);
    this.checkNotBlank(path, table, "状態");
    this.checkNotBlank(path, table, "証拠");
  }

  private checkCodebaseAnalysis(base: string, state: Record<string, any>): void {
    const path = `${base}/codebase-analysis.md`;
    const required = new Set((state.inception?.requiredArtifacts ?? []).map((value: unknown) => String(value).trim())).has("codebase-analysis.md");
    if (required) {
      this.checkFile(path, "既存コード分析が必須成果物として存在する");
      this.checkHeadings(path, ["対象コード", "既存能力", "統合点", "ギャップ", "リスク", "Inception への入力"]);
    } else if (this.isFile(this.absolute(path))) {
      this.pass(path, "既存コード分析が存在する場合は検証対象である", "存在を確認");
      this.checkHeadings(path, ["対象コード", "既存能力", "統合点", "ギャップ", "リスク", "Inception への入力"]);
    } else {
      this.skipped(path, "既存コード分析は条件付き成果物である", "requiredArtifacts に未指定で、ファイルも存在しない");
    }
  }

  private checkIdeationTraceability(path: string): void {
    this.checkFile(path, "Ideation 追跡ファイルが存在する");
    this.checkHeadings(path, ["Ideation からの追跡", "依存関係からの追跡"]);
    this.checkTable(path, "Ideation からの追跡", ["Ideation 要素", "対象", "定義元", "後続への渡し方"]);
    this.checkTable(path, "依存関係からの追跡", ["種別", "対象", "依存", "理由", "定義元"]);
    this.checkRelativeLinks(path);
  }

  private checkTraceability(path: string): void {
    this.checkFile(path, "追跡ファイルが存在する");
    this.checkHeadings(path, [
      "要求からの追跡",
      "背景からの追跡",
      "ボルトからの追跡",
      "設計からの追跡",
      "既存コード分析からの追跡",
      "ユニットからの追跡",
      "ドメインモデルからの追跡",
      "依存関係からの追跡",
    ]);
    this.checkTable(path, "要求からの追跡", ["要求", "アクター", "ストーリー", "ユースケース", "ユニット", "ボルト", "タスク"]);
    this.checkTable(path, "依存関係からの追跡", ["種別", "対象", "依存", "理由", "定義元"]);
    this.checkRelativeLinks(path);
  }

  private checkOptionalIndex(path: string, spec: typeof indexSpecs[string]): void {
    this.checkHeadings(path, spec.headings);
    const table = this.checkTable(path, spec.listHeading, spec.columns);
    if (!table) return;

    const ids = this.collectIds(path, table, "識別子", spec.idPattern);
    this.checkDependencyValues(path, table, "依存", ids);
    this.checkDetailLinks(path, table, "詳細");
  }

  private checkSubdomains(path: string, boundedContextsPath: string): void {
    this.checkFile(path, "サブドメイン一覧が存在する");
    this.checkHeadings(path, ["一覧"]);
    const table = this.checkTable(path, "一覧", ["識別子", "名前", "種別", "役割", "コンテキスト"]);
    if (!table) return;

    this.collectIds(path, table, "識別子", /^SD\d{3}$/);
    const allowedTypes = new Set(["コア", "支援", "汎用", "未分類"]);
    const bcIds = this.idsFor(boundedContextsPath);
    for (const row of table.rows) {
      this.checkAllowed(path, "サブドメイン種別", row["種別"], allowedTypes);
      for (const contextId of this.splitValues(row["コンテキスト"])) {
        if (contextId === "なし" || bcIds.has(contextId)) {
          this.pass(path, "コンテキストが同じ階層の bounded-contexts.md に存在する", `${row["識別子"]}: ${contextId}`);
        } else {
          this.failRow(path, "コンテキストが同じ階層の bounded-contexts.md に存在する", `${row["識別子"]}: ${contextId}`);
        }
      }
    }
  }

  private checkBoundedContexts(path: string, global: boolean): void {
    this.checkFile(path, "境界づけられたコンテキスト一覧が存在する");
    const headings = global ? ["一覧", "外部境界", "コンテキスト間の依存", "パターン分類"] : ["コンテキスト", "外部境界", "コンテキスト間の依存"];
    const listHeading = global ? "一覧" : "コンテキスト";
    this.checkHeadings(path, headings);

    const table = this.checkTable(path, listHeading, ["識別子", "名前", "サブドメイン", "役割", "モデル", "契約"]);
    const ids = table ? this.collectIds(path, table, "識別子", /^BC\d{3}$/) : new Set<string>();
    if (table) {
      this.checkDetailLinks(path, table, "モデル");
      this.checkDetailLinks(path, table, "契約");
    }

    const boundaryTable = this.checkTable(path, "外部境界", ["コンテキスト", "名前", "役割", "根拠"]);
    if (boundaryTable) {
      for (const row of boundaryTable.rows) {
        const contextId = String(row["コンテキスト"] ?? "").trim();
        if (ids.has(contextId)) this.pass(path, "外部境界のコンテキストが既存 BC である", contextId);
        else this.failRow(path, "外部境界のコンテキストが既存 BC である", contextId);
        this.checkNotBlankValue(path, "名前", row["名前"]);
        this.checkNotBlankValue(path, "役割", row["役割"]);
        this.checkNotBlankValue(path, "根拠", row["根拠"]);
      }
    }
  }

  private checkFile(path: string, condition: string, directory = false): void {
    const target = this.absolute(path);
    const ok = directory ? this.isDirectory(target) : this.isFile(target);
    if (ok) {
      this.checkedFiles.add(this.relativePath(target));
      this.pass(path, condition, "存在を確認");
    } else {
      this.failRow(path, condition, "存在しない");
    }
  }

  private checkHeadings(path: string, headings: string[]): void {
    if (!this.isFile(this.absolute(path))) return;
    const text = this.read(path);
    for (const heading of headings) {
      if (new RegExp(`^##\\s+${this.escapeRegExp(heading)}\\s*$`, "m").test(text)) {
        this.pass(path, `\`${heading}\` 見出しがある`, "見出しを確認");
      } else {
        this.failRow(path, `\`${heading}\` 見出しがある`, "見出しがない");
      }
    }
  }

  private checkTable(path: string, heading: string, requiredColumns: string[]): Table | undefined {
    if (!this.isFile(this.absolute(path))) return undefined;
    const table = this.tableAfterHeading(path, heading);
    if (!table) {
      this.failRow(path, `\`${heading}\` の表がある`, "表がない");
      return undefined;
    }

    const missing = requiredColumns.filter((column) => !table.headers.includes(column));
    if (missing.length === 0) {
      this.pass(path, `\`${heading}\` の必須表列が揃っている`, requiredColumns.join(", "));
    } else {
      this.failRow(path, `\`${heading}\` の必須表列が揃っている`, `不足: ${missing.join(", ")}`);
    }
    return table;
  }

  private collectIds(path: string, table: Table, column: string, pattern?: RegExp): Set<string> {
    const ids = new Set<string>();
    for (const row of table.rows) {
      const id = String(row[column] ?? "").trim();
      if (id.length === 0) {
        this.failRow(path, `${column} が空欄でない`, "空欄");
        continue;
      }
      if (pattern && !pattern.test(id)) this.failRow(path, `${column} が識別子形式に合う`, id);
      else this.pass(path, `${column} が識別子形式に合う`, id);
      if (ids.has(id)) this.failRow(path, `${column} が重複しない`, id);
      else {
        this.pass(path, `${column} が重複しない`, id);
        ids.add(id);
      }
    }
    this.knownIds.set(path, ids);
    return ids;
  }

  private idsFor(path: string): Set<string> {
    const known = this.knownIds.get(path);
    if (known) return known;
    if (!this.isFile(this.absolute(path))) return new Set();
    const heading = path.endsWith("/domain/bounded-contexts.md") || path === ".amadeus/domain/bounded-contexts.md"
      ? (path.startsWith(".amadeus/intents/") ? "コンテキスト" : "一覧")
      : "一覧";
    const table = this.tableAfterHeading(path, heading);
    if (!table || !table.headers.includes("識別子")) return new Set();
    const ids = new Set(table.rows.map((row) => String(row["識別子"] ?? "").trim()).filter(Boolean));
    this.knownIds.set(path, ids);
    return ids;
  }

  private checkDependencyValues(path: string, table: Table, column: string, ids: Set<string>): void {
    if (!table.headers.includes(column)) return;
    for (const row of table.rows) {
      for (const dependency of this.splitValues(row[column])) {
        if (dependency === "なし" || ids.has(dependency)) this.pass(path, `\`${column}\` がなしまたは同じ一覧内の既存 ID である`, dependency);
        else this.failRow(path, `\`${column}\` がなしまたは同じ一覧内の既存 ID である`, dependency);
      }
    }
  }

  private checkTableTargets(path: string, table: Table, column: string, ids: Set<string>, allowNone: boolean): void {
    if (!table.headers.includes(column)) return;
    for (const row of table.rows) {
      for (const target of this.splitValues(row[column])) {
        if ((allowNone && target === "なし") || ids.has(target)) this.pass(path, `\`${column}\` が一覧内の既存 ID である`, target);
        else this.failRow(path, `\`${column}\` が一覧内の既存 ID である`, target);
      }
    }
  }

  private checkNotBlank(path: string, table: Table, column: string): void {
    if (!table.headers.includes(column)) return;
    for (const row of table.rows) this.checkNotBlankValue(path, column, row[column]);
  }

  private checkNotBlankValue(path: string, column: string, value: unknown): void {
    if (this.blank(value)) this.failRow(path, `\`${column}\` が空欄でない`, "空欄");
    else this.pass(path, `\`${column}\` が空欄でない`, String(value).trim());
  }

  private checkDetailLinks(path: string, table: Table, column: string): void {
    if (!table.headers.includes(column)) return;
    for (const row of table.rows) {
      const links = this.markdownLinks(String(row[column] ?? ""));
      if (links.length === 0) {
        this.failRow(path, `\`${column}\` が相対リンクを持つ`, String(row[column] ?? ""));
        continue;
      }
      for (const target of links) this.checkLink(path, target);
    }
  }

  private checkIntentDetailLinks(path: string, table: Table, ids: Set<string>): void {
    if (!table.headers.includes("詳細")) return;
    for (const row of table.rows) {
      const id = String(row["識別子"] ?? "").trim();
      const links = this.markdownLinks(String(row["詳細"] ?? ""));
      if (links.length === 0) {
        this.failRow(path, "`詳細` が相対リンクを持つ", String(row["詳細"] ?? ""));
        continue;
      }
      for (const target of links) {
        this.checkLink(path, target);
        const clean = this.cleanLinkTarget(target);
        const match = clean.match(/^intents\/([^/]+)\/intent\.md$/);
        if (!match) {
          this.failRow(path, "`詳細` が intents/<intent-id>-<slug>/intent.md を指す", target);
          continue;
        }
        const directory = match[1];
        if (directory === id) this.pass(path, "`詳細` の Intent ディレクトリ名が識別子と一致する", directory);
        else this.failRow(path, "`詳細` の Intent ディレクトリ名が識別子と一致する", `${directory} != ${id}`);
        if (ids.has(directory)) this.pass(path, "`詳細` の Intent ディレクトリ名が一覧内に存在する", directory);
        else this.failRow(path, "`詳細` の Intent ディレクトリ名が一覧内に存在する", directory);
      }
    }
  }

  private checkRelativeLinks(path: string): void {
    if (!this.isFile(this.absolute(path))) return;
    for (const target of this.markdownLinks(this.read(path))) this.checkLink(path, target);
  }

  private checkLink(path: string, target: string): void {
    if (this.externalLink(target)) return;
    const clean = this.cleanLinkTarget(target);
    if (clean.length === 0) return;
    const resolved = this.linkPath(path, target);
    if (existsSync(resolved)) {
      this.checkedFiles.add(this.relativePath(resolved));
      this.pass(path, "相対リンクの参照先が存在する", target);
    } else {
      this.failRow(path, "相対リンクの参照先が存在する", `${target} -> ${this.relativePath(resolved)}`);
    }
  }

  private tableAfterHeading(path: string, heading: string): Table | undefined {
    const lines = this.read(path).split(/\r?\n/);
    const headingIndex = lines.findIndex((line) => new RegExp(`^##\\s+${this.escapeRegExp(heading)}\\s*$`).test(line));
    if (headingIndex < 0) return undefined;

    let index = headingIndex + 1;
    while (index < lines.length && !lines[index].startsWith("|") && !lines[index].startsWith("## ")) index += 1;
    if (index >= lines.length || !lines[index].startsWith("|")) return undefined;

    const tableLines: string[] = [];
    while (index < lines.length && lines[index].startsWith("|")) {
      tableLines.push(lines[index]);
      index += 1;
    }
    if (tableLines.length < 2) return undefined;

    const headers = this.splitTableLine(tableLines[0]);
    const rows = tableLines.slice(2).map((line) => {
      const values = this.splitTableLine(line);
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    });
    return { headers, rows };
  }

  private splitTableLine(line: string): string[] {
    return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((value) => value.trim());
  }

  private splitValues(value: unknown): string[] {
    const text = String(value ?? "").trim();
    if (text.length === 0) return [""];
    return text.split(",").map((item) => item.trim()).filter(Boolean);
  }

  private markdownLinks(text: string): string[] {
    return [...text.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
  }

  private externalLink(target: string): boolean {
    return target.startsWith("#") || target.startsWith("mailto:") || /^https?:\/\//.test(target);
  }

  private checkJsonValue(path: string, key: string, actual: unknown, expected: string): void {
    const value = String(actual ?? "").trim();
    if (value === expected) this.pass(path, `\`${key}\` が ${expected} である`, value);
    else this.failRow(path, `\`${key}\` が ${expected} である`, value);
  }

  private checkAllowed(path: string, column: string, actual: unknown, allowed: Set<string>): void {
    const value = String(actual ?? "").trim();
    if (allowed.has(value)) this.pass(path, `\`${column}\` が許可値である`, value);
    else this.failRow(path, `\`${column}\` が許可値である`, value);
  }

  private read(path: string): string {
    const target = this.absolute(path);
    this.checkedFiles.add(this.relativePath(target));
    return readFileSync(target, "utf8");
  }

  private absolute(path: string): string {
    return isAbsolute(path) ? path : join(this.root, path);
  }

  private relativePath(path: string): string {
    return relative(this.root, resolve(path)) || ".";
  }

  private linkPath(path: string, target: string): string {
    return this.absolute(join(dirname(path), this.cleanLinkTarget(target)));
  }

  private cleanLinkTarget(target: string): string {
    return target.split("#", 2)[0].split(/\s+/, 2)[0] ?? "";
  }

  private isFile(path: string): boolean {
    return existsSync(path) && statSync(path).isFile();
  }

  private isDirectory(path: string): boolean {
    return existsSync(path) && statSync(path).isDirectory();
  }

  private pass(target: string, condition: string, evidence: string): void {
    this.rows.push({ target, condition, result: "pass", evidence });
  }

  private failRow(target: string, condition: string, evidence: string): void {
    this.rows.push({ target, condition, result: "fail", evidence });
  }

  private blocked(target: string, condition: string, evidence: string): void {
    this.rows.push({ target, condition, result: "blocked", evidence });
  }

  private skipped(target: string, condition: string, evidence: string): void {
    this.rows.push({ target, condition, result: "skipped", evidence });
  }

  private failed(): boolean {
    return this.rows.some((row) => row.result === "fail");
  }

  private blockedResult(): boolean {
    return this.rows.some((row) => row.result === "blocked");
  }

  private overallResult(): "pass" | "fail" | "blocked" {
    if (this.failed()) return "fail";
    if (this.blockedResult()) return "blocked";
    return "pass";
  }

  private report(): string {
    const failing = this.rows.filter((row) => row.result === "fail");
    const blocking = this.rows.filter((row) => row.result === "blocked");
    const passed = this.rows.filter((row) => row.result === "pass");
    const skippedRows = this.rows.filter((row) => row.result === "skipped");

    const lines: string[] = [];
    lines.push("# Intent Validator 結果", "", "## 判定", "", this.overallResult(), "", "## 検査サマリ", "");
    lines.push(...this.summaryTable(), "", "## 確認対象", "", ...this.checkedFilesReport(), "", "## 満たしている条件", "");
    const passedSummary = this.summarize(passed);
    lines.push(...(passedSummary.length > 0 ? passedSummary.map((item) => `- ${item}`) : ["- なし"]));
    lines.push("", "## 検査対象外", "");
    const skippedSummary = [...new Set(skippedRows.map((row) => `${row.target}: ${row.condition}。対象: ${row.evidence}`))];
    lines.push(...(skippedSummary.length > 0 ? skippedSummary.map((item) => `- ${item}`) : ["- なし"]));
    lines.push("", "## 不足または矛盾", "");
    if (failing.length === 0 && blocking.length === 0) {
      lines.push("- なし");
    } else {
      for (const row of [...failing, ...blocking]) lines.push(`- \`${row.target}\`: ${row.condition}。根拠: ${row.evidence}`);
    }
    lines.push("", "## 次に使う Amadeus skill", "", "- なし", "");
    lines.push("補足: `pass` は実行時参照に必要な最低限の構造条件を満たすという意味で、gate 通過や内容妥当性の承認ではない。");
    return lines.join("\n");
  }

  private summaryTable(): string[] {
    const categories = new Map<string, Row[]>();
    for (const row of this.rows.filter((row) => row.result !== "skipped")) {
      const category = this.categoryFor(row);
      categories.set(category, [...(categories.get(category) ?? []), row]);
    }
    const lines = ["| 検査カテゴリ | pass | fail | blocked |", "|---|---:|---:|---:|"];
    for (const [category, rows] of [...categories.entries()].sort(([a], [b]) => a.localeCompare(b, "ja"))) {
      lines.push(`| ${category} | ${rows.filter((row) => row.result === "pass").length} | ${rows.filter((row) => row.result === "fail").length} | ${rows.filter((row) => row.result === "blocked").length} |`);
    }
    return lines;
  }

  private summarize(rows: Row[]): string[] {
    const categories = new Map<string, Row[]>();
    for (const row of rows) {
      const category = this.categoryFor(row);
      categories.set(category, [...(categories.get(category) ?? []), row]);
    }
    return [...categories.entries()].sort(([a], [b]) => a.localeCompare(b, "ja")).map(([category, categoryRows]) => {
      const targets = new Set(categoryRows.map((row) => row.target));
      return `${category}: ${categoryRows.length}件 pass、対象 ${targets.size}件`;
    });
  }

  private checkedFilesReport(): string[] {
    if (this.checkedFiles.size === 0) return ["- なし"];
    const grouped = new Map<string, string[]>();
    for (const file of [...this.checkedFiles].sort()) {
      const category = this.checkedFileCategory(file);
      grouped.set(category, [...(grouped.get(category) ?? []), file]);
    }
    const ordered = [...grouped.entries()].sort(([a], [b]) => this.checkedFileCategoryOrder(a) - this.checkedFileCategoryOrder(b));
    const lines = ["| 対象カテゴリ | 件数 |", "|---|---:|"];
    for (const [category, files] of ordered) lines.push(`| ${category} | ${files.length} |`);
    for (const [category, files] of ordered) {
      lines.push("", `### ${category}`, "");
      for (const file of files) lines.push(`- \`${file}\``);
    }
    return lines;
  }

  private checkedFileCategory(file: string): string {
    if (file === ".amadeus") return "Amadeus ルート";
    if (/^\.amadeus\/[^/]+\.md$/.test(file)) return "全体成果物";
    if (file.startsWith(".amadeus/domain/")) return "全体ドメイン";
    if (/^\.amadeus\/intents\/[^/]+\/state\.json$/.test(file)) return "Intent 状態";
    if (/^\.amadeus\/intents\/[^/]+\/mocks\//.test(file)) return "Intent モック";
    if (/^\.amadeus\/intents\/[^/]+\/[^/]+\.md$/.test(file)) return "Intent 基本成果物";
    if (/^\.amadeus\/intents\/[^/]+\/domain\//.test(file)) return "Intent ドメイン";
    if (/^\.amadeus\/intents\/[^/]+\/bolts\//.test(file)) return "Bolt / Task";
    if (/^\.amadeus\/intents\/[^/]+\/requirements\//.test(file)) return "Requirement 詳細";
    if (/^\.amadeus\/intents\/[^/]+\/user-stories\//.test(file)) return "Story 詳細";
    if (/^\.amadeus\/intents\/[^/]+\/use-cases\//.test(file)) return "Use Case 詳細";
    if (/^\.amadeus\/intents\/[^/]+\/units\//.test(file)) return "Unit 詳細";
    if (/^\.amadeus\/intents\/[^/]+\/decisions\//.test(file)) return "Decision 詳細";
    return "その他";
  }

  private checkedFileCategoryOrder(category: string): number {
    return [
      "Amadeus ルート",
      "全体成果物",
      "全体ドメイン",
      "Intent 状態",
      "Intent 基本成果物",
      "Intent モック",
      "Intent ドメイン",
      "Requirement 詳細",
      "Story 詳細",
      "Use Case 詳細",
      "Unit 詳細",
      "Bolt / Task",
      "Decision 詳細",
      "その他",
    ].indexOf(category);
  }

  private categoryFor(row: Row): string {
    const condition = row.condition;
    const target = row.target;
    if (condition.includes("作業ディレクトリ") || condition.includes("成果物ルート")) return "実行環境";
    if (condition.includes("対象 Intent ディレクトリ名")) return "検証範囲";
    if (condition.includes("Initialized") || condition.includes("`initialized`")) return "Initialized";
    if (target.includes("/ideation.md") || target.includes("/scope.md") || condition.includes("Ideation") || condition.includes("Inception")) return "Ideation";
    if (target.endsWith("state.json") || condition.includes("state.json") || condition.includes("`phase`") || condition.includes("`status`")) return "状態";
    if (target.includes("/mocks/") || condition.includes("モック") || condition.includes(".puml")) return "モック";
    if (condition.includes("存在する") && !condition.includes("参照先")) return "ファイル存在";
    if (condition.includes("見出し")) return "見出し";
    if (condition.includes("表列") || condition.includes("表がある")) return "表列";
    if (condition.includes("識別子")) return "識別子";
    if (condition.includes("相対リンク") || condition.includes("を指す")) return "リンク参照";
    if (condition.includes("依存")) return "依存関係";
    if (condition.includes("一覧内の既存 ID")) return "Index ID参照";
    if (condition.includes("空欄")) return "空欄";
    if (target.includes("bounded-contexts.md") || target.includes("subdomains.md") || condition.includes("コンテキスト") || condition.includes("許可値")) return "ドメイン境界";
    return "その他";
  }

  private isObject(value: unknown): value is Record<string, any> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private typeName(value: unknown): string {
    if (Array.isArray(value)) return "Array";
    if (value === null) return "null";
    return typeof value;
  }

  private blank(value: unknown): boolean {
    return value === undefined || value === null || String(value).trim().length === 0;
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

const root = process.argv[2] ?? process.cwd();
const intentId = process.argv[3];
const result = new IntentValidator(root, intentId).run();
console.log(result);

const status = result.match(/^pass$|^fail$|^blocked$/m)?.[0];
if (status === "pass") process.exit(0);
if (status === "blocked") process.exit(2);
process.exit(1);
