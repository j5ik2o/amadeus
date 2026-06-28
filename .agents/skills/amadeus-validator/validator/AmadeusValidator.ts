#!/usr/bin/env bun

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";

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
const discoveryDirectoryPattern = /^\d{8}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const discoveryStatusValues = new Set(["in_progress", "completed"]);
const discoveryGateValues = new Set(["not_ready", "passed"]);
const discoveryDecisionValues = new Set([
  "single_intent",
  "multi_intent",
  "existing_intent_update",
  "research_only",
  "no_intent",
  "undecided",
]);
const discoveryCandidateStatusValues = new Set(["recommended", "waiting", "initialized", "discarded"]);
const eventStormingDirectoryPattern = /^ES\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const eventStormingStatusValues = new Set(["draft", "reviewing", "ready", "superseded"]);
const eventStormingLevelValues = new Set(["big-picture", "process-modeling", "system-design"]);
const eventStormingScopeValues = new Set(["pre-intent", "intent-scoped"]);
const eventStormingNextSkillValues = new Set([
  "amadeus-discovery",
  "amadeus-intent-init",
  "amadeus-inception",
  "amadeus-domain-modeling",
]);
const eventStormingTypeIdPrefixes = new Map([
  ["Actor", "ACT"],
  ["Command", "CMD"],
  ["Domain Event", "DEV"],
  ["Policy", "POL"],
  ["External System", "EXT"],
  ["Read Model", "RM"],
  ["Aggregate Candidate", "AGC"],
  ["Bounded Context Candidate", "BCC"],
]);
const eventStormingFlowTypes = new Set(["Actor", "Command", "Domain Event", "Policy", "External System", "Read Model"]);
const eventStormingBoardTypes = new Set([
  "Actor",
  "Command",
  "Domain Event",
  "Policy",
  "External System",
  "Read Model",
  "Aggregate Candidate",
  "Bounded Context Candidate",
]);
const eventStormingHotspotStatusValues = new Set(["open", "resolved", "accepted"]);
const eventStormingHandoffKinds = new Set(["Aggregate Candidate", "Bounded Context Candidate"]);
const grillingSessionFilePattern = /^G\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const grillingSessionStatusValues = new Set(["active", "completed", "superseded"]);
const grillingDecisionStatusValues = new Set(["active", "superseded"]);
const constructionTasksValues = new Set(["not_generated", "generated", "blocked"]);
const unitDesignHeadings = [
  "概要",
  "設計戦略",
  "責務境界",
  "構成候補",
  "データと契約候補",
  "検証観点",
  "Bolt 分割方針",
  "Construction への引き継ぎ",
];
const constructionDesignHeadings = [
  "概要",
  "Domain Design",
  "Logical Design",
  "実装設計",
  "検証設計",
  "設計変更記録",
];
const constructionDesignGateValues = new Set(["not_started", "draft", "ready", "passed", "failed"]);
const multiUnitBoltReasonHeading = "複数 Unit を扱う理由";

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
    columns: ["識別子", "概要", "ユニット", "設計", "依存", "詳細"],
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

class AmadeusValidator {
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
    this.checkDiscoveries();
    this.checkEventStormingSessions(".amadeus/event-storming", "pre-intent");
    this.checkIntents();
    this.checkSubdomains(".amadeus/domain/subdomains.md", ".amadeus/domain/bounded-contexts.md");
    this.checkBoundedContexts(".amadeus/domain/bounded-contexts.md", true);
    this.checkGrillings(".amadeus/domain");
  }

  private checkDiscoveries(): void {
    const path = ".amadeus/discoveries.md";
    this.checkFile(path, "Discovery 一覧が存在する");
    this.checkHeadings(path, ["一覧"]);
    const table = this.checkTable(path, "一覧", ["識別子", "テーマ", "状態", "判定", "推奨次アクション", "詳細"]);
    if (!table) return;

    const ids = this.collectIds(path, table, "識別子", discoveryDirectoryPattern);
    this.checkNotBlank(path, table, "テーマ");
    this.checkNotBlank(path, table, "推奨次アクション");
    this.checkDetailLinks(path, table, "詳細");
    this.checkDiscoveryDetailLinks(path, table, ids);

    for (const row of table.rows) {
      const id = String(row["識別子"] ?? "").trim();
      if (!ids.has(id)) continue;
      this.checkDiscovery(id, row);
    }

    const discoveriesRoot = this.absolute(".amadeus/discoveries");
    if (!this.isDirectory(discoveriesRoot)) return;
    const glob = new Bun.Glob("*/state.json");
    const indexed = new Set(ids);
    for (const statePath of glob.scanSync({ cwd: discoveriesRoot })) {
      const id = statePath.split("/", 1)[0];
      if (indexed.has(id)) this.pass(path, "Discovery ディレクトリが一覧に登録されている", id);
      else this.failRow(path, "Discovery ディレクトリが一覧に登録されている", id);
    }
  }

  private checkDiscoveryDetailLinks(path: string, table: Table, ids: Set<string>): void {
    if (!table.headers.includes("詳細")) return;
    for (const row of table.rows) {
      const id = String(row["識別子"] ?? "").trim();
      const links = this.markdownLinks(String(row["詳細"] ?? ""));
      if (links.length === 0) continue;
      for (const target of links) {
        const clean = this.cleanLinkTarget(target);
        const match = clean.match(/^discoveries\/([^/]+)\/brief\.md$/);
        if (!match) {
          this.failRow(path, "`詳細` が discoveries/<discovery-id>/brief.md を指す", target);
          continue;
        }
        const directory = match[1];
        if (directory === id) this.pass(path, "`詳細` の Discovery ディレクトリ名が識別子と一致する", directory);
        else this.failRow(path, "`詳細` の Discovery ディレクトリ名が識別子と一致する", `${directory} != ${id}`);
        if (ids.has(directory)) this.pass(path, "`詳細` の Discovery ディレクトリ名が一覧内に存在する", directory);
        else this.failRow(path, "`詳細` の Discovery ディレクトリ名が一覧内に存在する", directory);
      }
    }
  }

  private checkEventStormingSessions(rootPath: string, expectedScope: "pre-intent" | "intent-scoped", intentId?: string): void {
    const root = this.absolute(rootPath);
    if (!this.isDirectory(root)) {
      this.skipped(rootPath, "Event Storming 成果物は任意である", "ディレクトリなし");
      return;
    }

    const directories = readdirSync(root)
      .filter((entry) => this.isDirectory(join(root, entry)))
      .sort();
    for (const id of directories) {
      const base = `${rootPath}/${id}`;
      if (eventStormingDirectoryPattern.test(id)) {
        this.pass(base, "Event Storming ディレクトリ名が ESnnn-<slug> 形式である", id);
      } else {
        this.failRow(base, "Event Storming ディレクトリ名が ESnnn-<slug> 形式である", id);
      }
      this.checkEventStormingSession(base, id, expectedScope, intentId);
    }

    if (directories.length > 0) this.pass(rootPath, "Event Storming セッションが検証対象である", `${directories.length}件`);
    else this.skipped(rootPath, "Event Storming 成果物は任意である", "セッションディレクトリなし");
  }

  private checkEventStormingSession(base: string, id: string, expectedScope: "pre-intent" | "intent-scoped", intentId?: string): void {
    this.checkGrillings(base);

    const statePath = `${base}/state.json`;
    this.checkFile(statePath, "Event Storming 状態ファイルが存在する");
    const state = this.intentState(statePath);
    if (!state) return;

    this.checkJsonValue(statePath, "schemaVersion", state.schemaVersion, "1");
    this.checkJsonValue(statePath, "id", state.id, id);
    this.checkJsonValue(statePath, "phase", state.phase, "event-storming");
    this.checkAllowed(statePath, "status", state.status, eventStormingStatusValues);
    this.checkAllowed(statePath, "currentLevel", state.currentLevel, eventStormingLevelValues);
    this.checkAllowed(statePath, "scope", state.scope, eventStormingScopeValues);
    this.checkJsonValue(statePath, "scope", state.scope, expectedScope);
    this.checkAllowed(statePath, "nextRecommendedSkill", state.nextRecommendedSkill, eventStormingNextSkillValues);
    this.checkEventStormingCompletedLevels(statePath, state);
    this.checkEventStormingNextRecommendedSkill(statePath, state);

    if (expectedScope === "intent-scoped") {
      this.checkJsonValue(statePath, "relatedIntent", state.relatedIntent, intentId ?? "");
    } else {
      this.checkJsonValue(statePath, "relatedIntent", state.relatedIntent, "");
    }

    const level = String(state.currentLevel ?? "").trim();
    const requiresProcessModeling = this.eventStormingRequiresProcessModeling(level, state);
    const requiresSystemDesign = this.eventStormingRequiresSystemDesign(level, state);
    const allowUnknownReferences = String(state.status ?? "").trim() !== "ready";
    const bigPictureReady = this.eventStormingLevelReady(state, "big-picture");
    const processModelingReady = this.eventStormingLevelReady(state, "process-modeling");
    const systemDesignReady = this.eventStormingLevelReady(state, "system-design");
    this.checkEventStormingSummary(`${base}/summary.md`, systemDesignReady);
    const eventIds = this.checkEventStormingEvents(`${base}/events.md`, bigPictureReady);
    const boardIds = this.checkEventStormingBoard(`${base}/board.md`, eventIds, allowUnknownReferences);

    let flowIds = new Set<string>();
    if (requiresProcessModeling) {
      flowIds = this.checkEventStormingFlow(`${base}/flow.md`, eventIds, allowUnknownReferences);
      if (processModelingReady) this.checkEventStormingProcessBoard(`${base}/board.md`, flowIds);
    }
    this.checkEventStormingHotspots(`${base}/hotspots.md`, new Set([...boardIds, ...flowIds]), allowUnknownReferences);
    if (requiresSystemDesign) {
      const aggregateIds = this.checkEventStormingAggregateCandidates(`${base}/aggregate-candidates.md`, eventIds, systemDesignReady, allowUnknownReferences);
      const boundedContextIds = this.checkEventStormingBoundedContextCandidates(
        `${base}/bounded-context-candidates.md`,
        eventIds,
        aggregateIds,
        systemDesignReady,
        allowUnknownReferences,
      );
      this.checkEventStormingSystemDesignBoard(`${base}/board.md`, aggregateIds, boundedContextIds);
      if (systemDesignReady) this.checkEventStormingSystemDesignHandoff(`${base}/summary.md`, aggregateIds, boundedContextIds);
    }
  }

  private checkEventStormingCompletedLevels(path: string, state: Record<string, any>): void {
    const values = state.completedLevels;
    if (!Array.isArray(values)) {
      this.failRow(path, "`completedLevels` が配列である", this.typeName(values));
      return;
    }
    this.pass(path, "`completedLevels` が配列である", `${values.length}件`);
    const levels = values.map((value: unknown) => String(value ?? "").trim());
    const seen = new Set<string>();
    for (const level of levels) {
      this.checkAllowed(path, "completedLevels", level, eventStormingLevelValues);
      if (seen.has(level)) this.failRow(path, "`completedLevels` が重複しない", level);
      else {
        this.pass(path, "`completedLevels` が重複しない", level);
        seen.add(level);
      }
    }
    if (seen.has("process-modeling") && seen.has("big-picture")) {
      this.pass(path, "`process-modeling` 完了は `big-picture` 完了を前提にする", "big-picture");
    } else if (seen.has("process-modeling")) {
      this.failRow(path, "`process-modeling` 完了は `big-picture` 完了を前提にする", "big-picture がない");
    }
    if (seen.has("system-design") && seen.has("process-modeling")) {
      this.pass(path, "`system-design` 完了は `process-modeling` 完了を前提にする", "process-modeling");
    } else if (seen.has("system-design")) {
      this.failRow(path, "`system-design` 完了は `process-modeling` 完了を前提にする", "process-modeling がない");
    }
  }

  private checkEventStormingNextRecommendedSkill(path: string, state: Record<string, any>): void {
    const scope = String(state.scope ?? "").trim();
    const level = this.eventStormingEffectiveLevel(state);
    const next = String(state.nextRecommendedSkill ?? "").trim();
    const allowed = this.eventStormingNextSkillsFor(scope, level);
    if (allowed.has(next)) {
      this.pass(path, "`nextRecommendedSkill` が scope と level に対応する", `${scope}/${level}: ${next}`);
    } else {
      this.failRow(path, "`nextRecommendedSkill` が scope と level に対応する", `${scope}/${level}: ${next}`);
    }
  }

  private eventStormingNextSkillsFor(scope: string, level: string): Set<string> {
    if (scope === "pre-intent" && level === "big-picture") return new Set(["amadeus-discovery"]);
    if (scope === "pre-intent" && level === "process-modeling") return new Set(["amadeus-discovery", "amadeus-intent-init"]);
    if (scope === "pre-intent" && level === "system-design") return new Set(["amadeus-domain-modeling"]);
    if (scope === "intent-scoped" && (level === "big-picture" || level === "process-modeling")) return new Set(["amadeus-inception"]);
    if (scope === "intent-scoped" && level === "system-design") return new Set(["amadeus-domain-modeling"]);
    return new Set();
  }

  private eventStormingEffectiveLevel(state: Record<string, any>): string {
    const currentLevel = String(state.currentLevel ?? "").trim();
    const completedLevels = new Set(this.eventStormingCompletedLevels(state));
    if (currentLevel === "system-design" || completedLevels.has("system-design")) return "system-design";
    if (currentLevel === "process-modeling" || completedLevels.has("process-modeling")) return "process-modeling";
    return currentLevel;
  }

  private eventStormingRequiresProcessModeling(level: string, state: Record<string, any>): boolean {
    return level === "process-modeling" ||
      level === "system-design" ||
      this.eventStormingCompletedLevels(state).some((value) => value === "process-modeling" || value === "system-design");
  }

  private eventStormingRequiresSystemDesign(level: string, state: Record<string, any>): boolean {
    return level === "system-design" || this.eventStormingCompletedLevels(state).includes("system-design");
  }

  private eventStormingCompletedLevels(state: Record<string, any>): string[] {
    return Array.isArray(state.completedLevels) ? state.completedLevels.map((value: unknown) => String(value ?? "").trim()) : [];
  }

  private eventStormingLevelReady(state: Record<string, any>, level: string): boolean {
    if (String(state.status ?? "").trim() !== "ready") return false;
    return String(state.currentLevel ?? "").trim() === level || this.eventStormingCompletedLevels(state).includes(level);
  }

  private checkEventStormingSummary(path: string, systemDesignReady: boolean): void {
    this.checkFile(path, "Event Storming summary.md が存在する");
    const headings = ["Purpose", "Scope", "Related Discovery", "Related Intent", "Level Status", "Next Skill", "Supersession"];
    this.checkHeadings(path, headings);
    this.checkHeadingBodies(path, headings);
    this.checkTable(path, "Level Status", ["Level", "Status", "Evidence"]);
    if (systemDesignReady) this.checkHeadings(path, ["Handoff To Domain Modeling"]);
  }

  private checkEventStormingEvents(path: string, bigPictureReady: boolean): Set<string> {
    this.checkFile(path, "Event Storming events.md が存在する");
    this.checkHeadings(path, ["一覧"]);
    this.checkHeadingBodies(path, ["一覧"]);
    const table = this.checkTable(path, "一覧", ["ID", "Domain Event", "Description", "Source", "Excluded Similar Events"]);
    if (!table) return new Set();
    if (bigPictureReady) this.checkTableHasRows(path, table, "big-picture ready の Domain Event が1件以上ある");
    const ids = this.collectIds(path, table, "ID", /^DEV\d{3}$/);
    this.checkNotBlank(path, table, "Domain Event");
    this.checkNotBlank(path, table, "Description");
    this.checkNotBlank(path, table, "Source");
    return ids;
  }

  private checkEventStormingFlow(path: string, eventIds: Set<string>, allowUnknownReferences: boolean): Set<string> {
    this.checkFile(path, "Event Storming flow.md が存在する");
    this.checkHeadings(path, ["Flow"]);
    this.checkHeadingBodies(path, ["Flow"]);
    const table = this.checkTable(path, "Flow", ["ID", "Type", "Label", "Trigger", "Produces", "Related", "Note"]);
    if (!table) return new Set();
    this.checkEventStormingElementIds(path, table, "ID");
    this.checkEventStormingTypes(path, table, "Type", eventStormingFlowTypes);
    this.checkEventStormingTypeIdPrefixes(path, table);
    this.checkNotBlank(path, table, "Label");
    this.checkEventStormingFlowContainsEvents(path, table, eventIds);
    this.checkEventStormingReferences(path, table, ["Trigger", "Produces", "Related"], eventIds, allowUnknownReferences);
    return this.idsFor(path);
  }

  private checkEventStormingBoard(path: string, eventIds: Set<string>, allowUnknownReferences: boolean): Set<string> {
    this.checkFile(path, "Event Storming board.md が存在する");
    this.checkHeadings(path, ["Board"]);
    this.checkHeadingBodies(path, ["Board"]);
    const table = this.checkTable(path, "Board", ["Order", "Type", "ID", "Label", "Related", "Note"]);
    if (!table) return new Set();
    this.checkEventStormingElementIds(path, table, "ID");
    this.checkEventStormingTypes(path, table, "Type", eventStormingBoardTypes);
    this.checkEventStormingTypeIdPrefixes(path, table);
    this.checkEventStormingBoardOrder(path, table);
    this.checkNotBlank(path, table, "Label");
    const boardEventIds = new Set(table.rows.filter((row) => String(row["Type"] ?? "").trim() === "Domain Event").map((row) => String(row["ID"] ?? "").trim()));
    for (const eventId of eventIds) {
      if (boardEventIds.has(eventId)) this.pass(path, "`board.md` が Domain Event を含む", eventId);
      else this.failRow(path, "`board.md` が Domain Event を含む", eventId);
    }
    this.checkEventStormingReferences(path, table, ["Related"], eventIds, allowUnknownReferences);
    return this.idsFor(path);
  }

  private checkEventStormingAggregateCandidates(
    path: string,
    eventIds: Set<string>,
    systemDesignReady: boolean,
    allowUnknownReferences: boolean,
  ): Set<string> {
    this.checkFile(path, "Event Storming aggregate-candidates.md が存在する");
    this.checkHeadings(path, ["一覧"]);
    this.checkHeadingBodies(path, ["一覧"]);
    const table = this.checkTable(path, "一覧", ["ID", "Candidate", "Rationale", "Related Domain Events", "Consistency Clues", "Open Questions"]);
    if (!table) return new Set();
    if (systemDesignReady) this.checkTableHasRows(path, table, "system-design ready の Aggregate Candidate が1件以上ある");
    const ids = this.collectIds(path, table, "ID", /^AGC\d{3}$/);
    this.checkNotBlank(path, table, "Candidate");
    this.checkNotBlank(path, table, "Rationale");
    this.checkEventStormingExplicitReferences(path, table, "Related Domain Events", eventIds, "Domain Event", allowUnknownReferences);
    return ids;
  }

  private checkEventStormingBoundedContextCandidates(
    path: string,
    eventIds: Set<string>,
    aggregateIds: Set<string>,
    systemDesignReady: boolean,
    allowUnknownReferences: boolean,
  ): Set<string> {
    this.checkFile(path, "Event Storming bounded-context-candidates.md が存在する");
    this.checkHeadings(path, ["一覧"]);
    this.checkHeadingBodies(path, ["一覧"]);
    const table = this.checkTable(path, "一覧", [
      "ID",
      "Candidate",
      "Rationale",
      "Related Domain Events",
      "Related Aggregate Candidates",
      "Open Questions",
    ]);
    if (!table) return new Set();
    if (systemDesignReady) this.checkTableHasRows(path, table, "system-design ready の Bounded Context Candidate が1件以上ある");
    const ids = this.collectIds(path, table, "ID", /^BCC\d{3}$/);
    this.checkNotBlank(path, table, "Candidate");
    this.checkNotBlank(path, table, "Rationale");
    this.checkEventStormingExplicitReferences(path, table, "Related Domain Events", eventIds, "Domain Event", allowUnknownReferences);
    this.checkEventStormingExplicitReferences(path, table, "Related Aggregate Candidates", aggregateIds, "Aggregate Candidate", allowUnknownReferences);
    return ids;
  }

  private checkEventStormingProcessBoard(path: string, flowIds: Set<string>): void {
    const boardIds = this.idsFor(path);
    for (const flowId of flowIds) {
      if (boardIds.has(flowId)) this.pass(path, "`board.md` が process-modeling の要素を含む", flowId);
      else this.failRow(path, "`board.md` が process-modeling の要素を含む", flowId);
    }
  }

  private checkEventStormingSystemDesignBoard(path: string, aggregateIds: Set<string>, boundedContextIds: Set<string>): void {
    const table = this.tableAfterHeading(path, "Board");
    if (!table) return;
    const boardAggregateIds = new Set(
      table.rows.filter((row) => String(row["Type"] ?? "").trim() === "Aggregate Candidate").map((row) => String(row["ID"] ?? "").trim()),
    );
    for (const aggregateId of aggregateIds) {
      if (boardAggregateIds.has(aggregateId)) this.pass(path, "`board.md` が system-design の Aggregate Candidate を含む", aggregateId);
      else this.failRow(path, "`board.md` が system-design の Aggregate Candidate を含む", aggregateId);
    }
    const boardBoundedContextIds = new Set(
      table.rows.filter((row) => String(row["Type"] ?? "").trim() === "Bounded Context Candidate").map((row) => String(row["ID"] ?? "").trim()),
    );
    for (const boundedContextId of boundedContextIds) {
      if (boardBoundedContextIds.has(boundedContextId)) {
        this.pass(path, "`board.md` が system-design の Bounded Context Candidate を含む", boundedContextId);
      } else {
        this.failRow(path, "`board.md` が system-design の Bounded Context Candidate を含む", boundedContextId);
      }
    }
  }

  private checkEventStormingSystemDesignHandoff(path: string, aggregateIds: Set<string>, boundedContextIds: Set<string>): void {
    this.checkHeadings(path, ["Handoff To Domain Modeling"]);
    this.checkHeadingBodies(path, ["Handoff To Domain Modeling"]);
    const table = this.checkTable(path, "Handoff To Domain Modeling", ["Candidate", "Kind", "Evidence", "Open Questions"]);
    if (!table) return;
    this.checkTableHasRows(path, table, "system-design ready の Handoff が1件以上ある");
    for (const row of table.rows) {
      const kind = String(row["Kind"] ?? "").trim();
      const candidate = String(row["Candidate"] ?? "").trim();
      this.checkAllowed(path, "Kind", kind, eventStormingHandoffKinds);
      const ids = kind === "Aggregate Candidate" ? aggregateIds : kind === "Bounded Context Candidate" ? boundedContextIds : new Set<string>();
      if (ids.has(candidate)) this.pass(path, "`Candidate` が system-design 候補 ID である", candidate);
      else this.failRow(path, "`Candidate` が system-design 候補 ID である", candidate);
    }
  }

  private checkEventStormingHotspots(path: string, elementIds: Set<string>, allowUnknownReferences: boolean): void {
    this.checkFile(path, "Event Storming hotspots.md が存在する");
    this.checkHeadings(path, ["一覧"]);
    this.checkHeadingBodies(path, ["一覧"]);
    const table = this.checkTable(path, "一覧", ["ID", "Type", "Summary", "Source", "Status", "Related", "Next Action"]);
    if (!table) return;
    this.collectIds(path, table, "ID", /^HOT\d{3}$/);
    this.checkNotBlank(path, table, "Type");
    this.checkNotBlank(path, table, "Summary");
    this.checkNotBlank(path, table, "Source");
    this.checkNotBlank(path, table, "Next Action");
    this.checkEventStormingExplicitReferences(path, table, "Related", elementIds, "Event Storming 要素", allowUnknownReferences);
    for (const row of table.rows) this.checkAllowed(path, "Status", row["Status"], eventStormingHotspotStatusValues);
  }

  private checkEventStormingElementIds(path: string, table: Table, column: string): void {
    const ids = new Set<string>();
    for (const row of table.rows) {
      const id = String(row[column] ?? "").trim();
      if (this.eventStormingElementIdPattern(id)) this.pass(path, `${column} が Event Storming 要素 ID 形式に合う`, id);
      else this.failRow(path, `${column} が Event Storming 要素 ID 形式に合う`, id);
      if (ids.has(id)) this.failRow(path, `${column} が重複しない`, id);
      else {
        this.pass(path, `${column} が重複しない`, id);
        ids.add(id);
      }
    }
    this.knownIds.set(path, ids);
  }

  private eventStormingElementIdPattern(id: string): boolean {
    return /^(DEV|CMD|ACT|POL|EXT|RM|AGC|BCC)\d{3}$/.test(id);
  }

  private checkEventStormingTypes(path: string, table: Table, column: string, allowed: Set<string>): void {
    for (const row of table.rows) this.checkAllowed(path, column, row[column], allowed);
  }

  private checkEventStormingTypeIdPrefixes(path: string, table: Table): void {
    if (!table.headers.includes("Type") || !table.headers.includes("ID")) return;
    for (const row of table.rows) {
      const type = String(row["Type"] ?? "").trim();
      const id = String(row["ID"] ?? "").trim();
      const prefix = eventStormingTypeIdPrefixes.get(type);
      if (!prefix) continue;
      if (id.startsWith(prefix)) this.pass(path, "`Type` と `ID` 接頭辞が対応する", `${type}: ${id}`);
      else this.failRow(path, "`Type` と `ID` 接頭辞が対応する", `${type}: ${id}`);
    }
  }

  private checkTableHasRows(path: string, table: Table, description: string): void {
    if (table.rows.length > 0) this.pass(path, description, `${table.rows.length}件`);
    else this.failRow(path, description, "0件");
  }

  private checkEventStormingFlowContainsEvents(path: string, table: Table, eventIds: Set<string>): void {
    const flowEventIds = new Set(
      table.rows.filter((row) => String(row["Type"] ?? "").trim() === "Domain Event").map((row) => String(row["ID"] ?? "").trim()),
    );
    for (const eventId of eventIds) {
      if (flowEventIds.has(eventId)) this.pass(path, "`flow.md` が Domain Event を含む", eventId);
      else this.failRow(path, "`flow.md` が Domain Event を含む", eventId);
    }
  }

  private checkEventStormingBoardOrder(path: string, table: Table): void {
    if (!table.headers.includes("Order")) return;
    const orders = new Set<number>();
    for (const row of table.rows) {
      const value = String(row["Order"] ?? "").trim();
      const order = Number(value);
      if (Number.isInteger(order) && order > 0) {
        this.pass(path, "`Order` が正の整数である", value);
      } else {
        this.failRow(path, "`Order` が正の整数である", value);
        continue;
      }
      if (orders.has(order)) this.failRow(path, "`Order` が重複しない", value);
      else {
        this.pass(path, "`Order` が重複しない", value);
        orders.add(order);
      }
    }
  }

  private checkEventStormingReferences(path: string, table: Table, columns: string[], eventIds: Set<string>, allowUnknownReferences: boolean): void {
    const localIds = this.idsFor(path);
    const ids = new Set([...localIds, ...eventIds]);
    for (const column of columns) {
      if (!table.headers.includes(column)) continue;
      this.checkEventStormingExplicitReferences(path, table, column, ids, "Event Storming 要素", allowUnknownReferences);
    }
  }

  private checkEventStormingExplicitReferences(
    path: string,
    table: Table,
    column: string,
    ids: Set<string>,
    label: string,
    allowUnknownReferences = false,
  ): void {
    if (!table.headers.includes(column)) return;
    const condition = allowUnknownReferences
      ? `\`${column}\` が ${label} ID、なし、または未確認である`
      : `\`${column}\` が ${label} ID またはなしである`;
    for (const row of table.rows) {
      for (const reference of this.splitValues(row[column])) {
        if (reference === "" || reference === "なし" || (allowUnknownReferences && reference === "未確認")) {
          this.pass(path, condition, reference);
        } else if (ids.has(reference)) {
          this.pass(path, condition, reference);
        } else {
          this.failRow(path, condition, reference);
        }
      }
    }
  }

  private checkDiscovery(id: string, row: Record<string, string>): void {
    const base = `.amadeus/discoveries/${id}`;
    this.checkGrillings(base);

    const briefPath = `${base}/brief.md`;
    const statePath = `${base}/state.json`;
    this.checkFile(briefPath, "Discovery Brief が存在する");
    this.checkHeadings(briefPath, [
      "入力テーマ",
      "確認した前提",
      "判定",
      "判定理由",
      "Intent Draft",
      "Intent 候補",
      "候補判断",
      "既存 Intent との関係",
      "推奨次アクション",
    ]);

    this.checkFile(statePath, "Discovery 状態ファイルが存在する");
    const state = this.intentState(statePath);
    if (!state) return;

    this.checkJsonValue(statePath, "schemaVersion", state.schemaVersion, "1");
    this.checkJsonValue(statePath, "phase", state.phase, "discovery");
    this.checkAllowed(statePath, "status", state.status, discoveryStatusValues);
    this.checkAllowed(statePath, "gate", state.gate, discoveryGateValues);
    this.checkAllowed(statePath, "decision", state.decision, discoveryDecisionValues);
    this.checkJsonValue(".amadeus/discoveries.md", "Discovery 行の状態", row["状態"], String(state.status ?? ""));
    this.checkJsonValue(".amadeus/discoveries.md", "Discovery 行の判定", row["判定"], String(state.decision ?? ""));

    const briefDecision = this.discoveryBriefDecision(briefPath);
    if (briefDecision === String(state.decision ?? "").trim()) {
      this.pass(briefPath, "state.json.decision と brief.md の判定が一致する", briefDecision);
    } else {
      this.failRow(briefPath, "state.json.decision と brief.md の判定が一致する", `${briefDecision} != ${String(state.decision ?? "").trim()}`);
    }

    if (String(state.gate ?? "").trim() === "passed") this.checkDiscoveryPassedGate(briefPath, state);
  }

  private discoveryBriefDecision(path: string): string {
    const body = this.sectionBody(path, "判定") ?? "";
    return body.split(/\r?\n/).map((line) => line.trim()).find((line) => line.length > 0) ?? "";
  }

  private checkDiscoveryPassedGate(path: string, state: Record<string, any>): void {
    for (const heading of ["入力テーマ", "確認した前提", "判定理由", "推奨次アクション"]) {
      const body = this.sectionBody(path, heading);
      if (body && body.trim().length > 0) this.pass(path, `Discovery gate passed で \`${heading}\` が空欄でない`, "本文を確認");
      else this.failRow(path, `Discovery gate passed で \`${heading}\` が空欄でない`, "本文がない");
    }

    const decision = String(state.decision ?? "").trim();
    if (decision === "undecided") {
      this.failRow(path, "Discovery gate passed では decision が undecided ではない", decision);
      return;
    }
    this.pass(path, "Discovery gate passed では decision が undecided ではない", decision);

    if (decision === "single_intent") {
      const table = this.checkTable(path, "Intent Draft", ["項目", "内容"]);
      if (table && table.rows.length > 0) this.pass(path, "single_intent の Intent Draft がある", `${table.rows.length}件`);
      else this.failRow(path, "single_intent の Intent Draft がある", "行がない");
      return;
    }

    if (decision === "multi_intent") {
      this.checkMultiIntentDiscovery(path);
      return;
    }

    if (decision === "existing_intent_update") {
      this.checkExistingIntentUpdateDiscovery(path);
      return;
    }

    if (decision === "research_only") {
      const body = this.sectionBody(path, "確認した前提") ?? "";
      if (body.trim().length > 0) this.pass(path, "research_only の調査論点が記録されている", "確認した前提を確認");
      else this.failRow(path, "research_only の調査論点が記録されている", "記録なし");
      return;
    }

    if (decision === "no_intent") {
      const body = this.sectionBody(path, "判定理由") ?? "";
      if (body.trim().length > 0) this.pass(path, "no_intent の Intent にしない理由が記録されている", "判定理由を確認");
      else this.failRow(path, "no_intent の Intent にしない理由が記録されている", "記録なし");
    }
  }

  private checkMultiIntentDiscovery(path: string): void {
    const table = this.checkTable(path, "Intent 候補", ["候補", "状態", "Intent", "課題", "成功状態", "除外範囲", "依存"]);
    if (!table) return;
    if (table.rows.length >= 2) this.pass(path, "multi_intent の Intent 候補が2件以上ある", `${table.rows.length}件`);
    else this.failRow(path, "multi_intent の Intent 候補が2件以上ある", `${table.rows.length}件`);

    let initialized = 0;
    let recommended = 0;
    for (const row of table.rows) {
      this.checkAllowed(path, "Intent 候補の状態", row["状態"], discoveryCandidateStatusValues);
      if (String(row["状態"] ?? "").trim() === "initialized") {
        initialized += 1;
        this.checkInitializedDiscoveryCandidate(path, row["Intent"]);
      }
      if (String(row["状態"] ?? "").trim() === "recommended") recommended += 1;
      for (const column of ["候補", "課題", "成功状態", "除外範囲", "依存"]) this.checkNotBlankValue(path, column, row[column]);
    }

    if (initialized === 0 && recommended === 1) {
      this.pass(path, "未初期化の multi_intent は recommended が1件だけである", `${recommended}件`);
    } else if (initialized === 0) {
      this.failRow(path, "未初期化の multi_intent は recommended が1件だけである", `${recommended}件`);
    } else if (recommended === 0 || recommended === 1) {
      this.pass(path, "初期化済み候補がある multi_intent は recommended が0件または1件である", `${recommended}件`);
    } else {
      this.failRow(path, "初期化済み候補がある multi_intent は recommended が0件または1件である", `${recommended}件`);
    }
  }

  private checkInitializedDiscoveryCandidate(path: string, value: unknown): void {
    const links = this.markdownLinks(String(value ?? ""));
    if (links.length === 0) {
      this.failRow(path, "initialized の Intent 候補が存在する Intent へリンクしている", String(value ?? ""));
      return;
    }
    for (const target of links) {
      const clean = this.cleanLinkTarget(target);
      if (clean.match(/^\.\.\/\.\.\/intents\/[^/]+\/intent\.md$/)) this.checkLink(path, target);
      else this.failRow(path, "initialized の Intent 候補が存在する Intent へリンクしている", target);
    }
  }

  private checkExistingIntentUpdateDiscovery(path: string): void {
    const body = this.sectionBody(path, "既存 Intent との関係") ?? "";
    const intentLinks = this.markdownLinks(body).filter((link) => this.cleanLinkTarget(link).match(/^\.\.\/\.\.\/intents\/[^/]+\/intent\.md$/));
    if (intentLinks.length === 1) {
      this.pass(path, "existing_intent_update の対象既存 Intent が1件だけある", intentLinks[0]);
      this.checkLink(path, intentLinks[0]);
    } else {
      this.failRow(path, "existing_intent_update の対象既存 Intent が1件だけある", `${intentLinks.length}件`);
    }
  }

  private checkIntentIndexes(intentId: string): void {
    const base = `.amadeus/intents/${intentId}`;
    this.checkGrillings(base);

    this.checkFile(`${base}/intent.md`, "Intent 基本ファイルが存在する");
    this.checkHeadings(`${base}/intent.md`, ["目的", "成功条件", "範囲"]);
    this.checkEventStormingSessions(`${base}/event-storming`, "intent-scoped", intentId);

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

    if (state.phase === "construction") {
      this.checkConstructionIntent(base, state);
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
    const requireDomainBoundary = String(state.inception?.gate ?? "").trim() === "passed";
    this.checkSubdomains(`${base}/domain/subdomains.md`, `${base}/domain/bounded-contexts.md`, requireDomainBoundary);
    this.checkBoundedContexts(`${base}/domain/bounded-contexts.md`, false, requireDomainBoundary);

    for (const [filename, spec] of Object.entries(indexSpecs)) {
      const path = `${base}/${filename}`;
      if (this.isFile(this.absolute(path))) this.checkOptionalIndex(path, spec);
    }
    this.checkUnitContextReferences(base, requireDomainBoundary);

    this.checkUnitDesignArtifacts(base, state);
    this.checkBoltDesignReferences(base);
    this.checkNoInceptionBoltDesignBriefArtifacts(base, state);
    this.checkInceptionBoltArtifacts(base, state);
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

  private checkConstructionIntent(base: string, state: Record<string, any>): void {
    const statePath = `${base}/state.json`;
    this.checkConstructionStateJson(statePath, state);

    this.checkRequirements(`${base}/requirements.md`);
    this.checkAcceptance(`${base}/acceptance.md`, `${base}/requirements.md`);
    this.checkCodebaseAnalysis(base, state);
    this.checkSubdomains(`${base}/domain/subdomains.md`, `${base}/domain/bounded-contexts.md`, true);
    this.checkBoundedContexts(`${base}/domain/bounded-contexts.md`, false, true);

    for (const [filename, spec] of Object.entries(indexSpecs)) {
      const path = `${base}/${filename}`;
      if (this.isFile(this.absolute(path))) this.checkOptionalIndex(path, spec);
    }
    this.checkUnitContextReferences(base, true);

    this.checkUnitDesignArtifacts(base, state);
    this.checkBoltDesignReferences(base);
    this.checkNoInceptionBoltDesignBriefArtifacts(base, state);
    this.checkTraceability(`${base}/traceability.md`);
    this.checkConstructionDesignTraceability(`${base}/traceability.md`, state);
    this.checkConstructionTraceability(`${base}/traceability.md`, state);
    this.checkConstructionBoltArtifacts(base, state);
  }

  private checkConstructionStateJson(path: string, state: Record<string, any>): void {
    this.checkJsonValue(path, "intent", state.intent, this.intentId ?? "");
    this.checkJsonValue(path, "phase", state.phase, "construction");
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
    this.checkJsonValue(path, "inception.status", inception.status, "completed");
    this.checkJsonValue(path, "inception.gate", inception.gate, "passed");

    const construction = state.construction;
    if (!this.isObject(construction)) {
      this.failRow(path, "`construction` がオブジェクトである", this.typeName(construction));
      return;
    }
    this.pass(path, "`construction` がオブジェクトである", "オブジェクトを確認");
    this.checkAllowed(path, "construction.status", construction.status, statusValues);
    this.checkAllowed(path, "construction.gate", construction.gate, gateValues);
    this.checkStatePaths(path, construction, "requiredArtifacts", "Construction 必須成果物が存在する", false, "construction");
    this.checkStatePaths(path, construction, "requiredBoltArtifacts", "Construction 必須 Bolt 成果物が存在する", false, "construction");
    this.checkTargetBolts(path, construction);
    this.checkConstructionBoltDesignGates(path, construction);
    this.checkTargetBoltRequiredArtifacts(path, construction);

    if (String(state.status ?? "").trim() === "completed") {
      this.checkJsonValue(path, "construction.status", construction.status, "completed");
      this.checkJsonValue(path, "construction.gate", construction.gate, "passed");
    }
  }

  private checkTargetBolts(path: string, construction: Record<string, any>): void {
    const values = construction.targetBolts;
    if (!Array.isArray(values)) {
      this.failRow(path, "`construction.targetBolts` が配列である", this.typeName(values));
      return;
    }

    this.pass(path, "`construction.targetBolts` が配列である", `${values.length}件`);
    const base = dirname(path);
    const boltIds = this.idsFor(`${base}/bolts.md`);
    for (const value of values) {
      const boltId = String(value ?? "").trim();
      if (boltIds.has(boltId)) this.pass(path, "`construction.targetBolts` が既存 Bolt を参照する", boltId);
      else this.failRow(path, "`construction.targetBolts` が既存 Bolt を参照する", boltId);
    }
  }

  private checkTargetBoltRequiredArtifacts(path: string, construction: Record<string, any>): void {
    const targetBolts = construction.targetBolts;
    const requiredBoltArtifacts = construction.requiredBoltArtifacts;
    if (!Array.isArray(targetBolts) || !Array.isArray(requiredBoltArtifacts)) return;

    const base = dirname(path);
    const required = new Set(requiredBoltArtifacts.map((value: unknown) => String(value ?? "").trim()));
    const boltDirectories = this.boltDirectories(base);
    const tasksStatuses = new Map<string, string>();
    if (Array.isArray(construction.bolts)) {
      for (const item of construction.bolts) {
        if (!this.isObject(item) || !this.isObject(item.tasks)) continue;
        const id = String(item.id ?? "").trim();
        if (id.length === 0) continue;
        tasksStatuses.set(id, String(item.tasks.status ?? "").trim());
      }
    }
    const requiresTestResults =
      String(construction.status ?? "").trim() === "completed" || String(construction.gate ?? "").trim() === "passed";
    for (const value of targetBolts) {
      const boltId = String(value ?? "").trim();
      const boltDir = boltDirectories.get(boltId);
      if (!boltDir) continue;
      const artifactPaths = [`${boltDir}/bolt.md`, `${boltDir}/design.md`, `${boltDir}/notes.md`];
      const taskPath = this.relativeToIntent(base, `${boltDir}/tasks.md`);
      const tasksStatus = tasksStatuses.get(boltId);
      if (tasksStatus === "generated") artifactPaths.push(`${boltDir}/tasks.md`);
      else if (tasksStatus === "not_generated" || tasksStatus === "blocked") {
        if (required.has(taskPath)) {
          this.failRow(path, "`tasks.status` 未生成時は requiredBoltArtifacts に tasks.md を含めない", `${boltId}: ${taskPath}`);
        } else {
          this.pass(path, "`tasks.status` 未生成時は requiredBoltArtifacts に tasks.md を含めない", `${boltId}: ${taskPath}`);
        }
      }
      if (requiresTestResults) artifactPaths.push(`${boltDir}/test-results.md`);
      for (const artifactPath of artifactPaths) {
        const relativePath = this.relativeToIntent(base, artifactPath);
        const condition = artifactPath.endsWith("/test-results.md")
          ? "Construction 完了時の必須 Bolt 成果物が test-results.md を含む"
          : "Construction 必須 Bolt 成果物が targetBolt の証拠成果物を含む";
        if (required.has(relativePath)) this.pass(path, condition, `${boltId}: ${relativePath}`);
        else this.failRow(path, condition, `${boltId}: ${relativePath}`);
      }
    }
  }

  private checkConstructionBoltDesignGates(path: string, construction: Record<string, any>): void {
    const targetBolts = construction.targetBolts;
    if (!Array.isArray(targetBolts)) return;

    const values = construction.bolts;
    if (!Array.isArray(values)) {
      this.failRow(path, "`construction.bolts` が配列である", this.typeName(values));
      return;
    }
    this.pass(path, "`construction.bolts` が配列である", `${values.length}件`);

    const base = dirname(path);
    const boltDirectories = this.boltDirectories(base);
    const byId = new Map<string, Record<string, any>>();
    for (const item of values) {
      if (!this.isObject(item)) {
        this.failRow(path, "`construction.bolts[]` がオブジェクトである", this.typeName(item));
        continue;
      }
      const id = String(item.id ?? "").trim();
      if (id.length === 0) {
        this.failRow(path, "`construction.bolts[].id` が空欄でない", "空欄");
        continue;
      }
      byId.set(id, item);
    }

    for (const value of targetBolts) {
      const boltId = String(value ?? "").trim();
      const item = byId.get(boltId);
      if (!item) {
        this.failRow(path, "`construction.bolts` が targetBolt の designGate を持つ", boltId);
        continue;
      }
      this.pass(path, "`construction.bolts` が targetBolt の designGate を持つ", boltId);

      const designGate = item.designGate;
      if (!this.isObject(designGate)) {
        this.failRow(path, "`construction.bolts[].designGate` がオブジェクトである", `${boltId}: ${this.typeName(designGate)}`);
        continue;
      }
      this.pass(path, "`construction.bolts[].designGate` がオブジェクトである", boltId);
      this.checkAllowed(path, "construction.bolts[].designGate.status", designGate.status, constructionDesignGateValues);
      this.checkNotBlankValue(path, "construction.bolts[].designGate.reviewedBy", designGate.reviewedBy);
      this.checkNotBlankValue(path, "construction.bolts[].designGate.updatedAt", designGate.updatedAt);

      const boltDir = boltDirectories.get(boltId);
      const expectedEvidence = boltDir ? this.relativeToIntent(base, `${boltDir}/design.md`) : "";
      const evidence = String(designGate.evidence ?? "").trim();
      if (expectedEvidence.length > 0 && evidence === expectedEvidence) {
        this.pass(path, "`construction.bolts[].designGate.evidence` が Construction Design を指す", `${boltId}: ${evidence}`);
      } else {
        this.failRow(path, "`construction.bolts[].designGate.evidence` が Construction Design を指す", `${boltId}: ${evidence || "空欄"}`);
      }
      if (evidence.length > 0) this.checkStateRelativePath(path, evidence, "Design Gate evidence が存在する", false);

      const tasks = item.tasks;
      if (!this.isObject(tasks)) {
        this.failRow(path, "`construction.bolts[].tasks` がオブジェクトである", `${boltId}: ${this.typeName(tasks)}`);
        continue;
      }
      this.pass(path, "`construction.bolts[].tasks` がオブジェクトである", boltId);
      const tasksStatus = String(tasks.status ?? "").trim();
      this.checkAllowed(path, "construction.bolts[].tasks.status", tasksStatus, constructionTasksValues);
      this.checkNotBlankValue(path, "construction.bolts[].tasks.reviewedBy", tasks.reviewedBy);
      this.checkNotBlankValue(path, "construction.bolts[].tasks.updatedAt", tasks.updatedAt);

      const expectedTaskEvidence = boltDir ? this.relativeToIntent(base, `${boltDir}/tasks.md`) : "";
      const taskEvidence = String(tasks.evidence ?? "").trim();
      if (tasksStatus === "generated" && expectedTaskEvidence.length > 0 && taskEvidence === expectedTaskEvidence) {
        this.pass(path, "`construction.bolts[].tasks.evidence` が tasks.md を指す", `${boltId}: ${taskEvidence}`);
        this.checkStateRelativePath(path, taskEvidence, "Tasks evidence が存在する", false);
      } else if (tasksStatus === "generated") {
        this.failRow(path, "`construction.bolts[].tasks.evidence` が tasks.md を指す", `${boltId}: ${taskEvidence || "空欄"}`);
      } else if (taskEvidence.length === 0) {
        this.pass(path, "`tasks.status` 未生成時の evidence が空欄である", boltId);
      } else {
        this.failRow(path, "`tasks.status` 未生成時の evidence が空欄である", `${boltId}: ${taskEvidence}`);
      }
      if (tasksStatus === "blocked" && String(designGate.status ?? "").trim() === "ready") {
        this.failRow(path, "`tasks.status: blocked` は designGate.status: ready と併用しない", boltId);
      }
    }
  }

  private checkInceptionBoltArtifacts(base: string, state: Record<string, any>): void {
    const values = state.inception?.requiredBoltArtifacts;
    const isInceptionPhase = String(state.phase ?? "").trim() === "inception";
    const checkedTaskPaths = new Set<string>();
    if (Array.isArray(values)) {
      for (const value of values) {
        const relativePath = String(value ?? "").trim();
        if (relativePath.endsWith("/tasks.md")) {
          const path = `${base}/${relativePath}`;
          checkedTaskPaths.add(path);
          if (isInceptionPhase) this.failRow(path, "Inception は Bolt 配下の tasks.md を持たない", "Task は Construction で生成する");
          else this.checkTasks(path);
        }
      }
    }

    const boltsRoot = this.absolute(`${base}/bolts`);
    if (!this.isDirectory(boltsRoot)) return;
    for (const entry of readdirSync(boltsRoot)) {
      const path = `${base}/bolts/${entry}/tasks.md`;
      if (checkedTaskPaths.has(path) || !this.isFile(this.absolute(path))) continue;
      if (isInceptionPhase) this.failRow(path, "Inception は Bolt 配下の tasks.md を持たない", "Task は Construction で生成する");
      else this.checkTasks(path);
    }
  }

  private checkConstructionBoltArtifacts(base: string, state: Record<string, any>): void {
    const values = state.construction?.requiredBoltArtifacts;
    const requiredBoltArtifacts = Array.isArray(values) ? values : [];
    const requiredConstructionDesigns = new Set(
      requiredBoltArtifacts.map((value: unknown) => String(value ?? "").trim()).filter((value: string) => value.endsWith("/design.md")),
    );
    const checkedPrPaths = new Set<string>();

    for (const value of requiredBoltArtifacts) {
      const relativePath = String(value ?? "").trim();
      const path = `${base}/${relativePath}`;
      if (relativePath.endsWith("/notes.md")) {
        this.checkFile(path, "Construction ノートが存在する");
        this.checkHeadings(path, ["実行方針", "対象タスク", "未確認事項"]);
      } else if (relativePath.endsWith("/design.md")) {
        this.checkConstructionDesign(path);
      } else if (relativePath.endsWith("/test-results.md")) {
        this.checkFile(path, "Construction テスト結果が存在する");
        this.checkHeadings(path, ["検証結果", "安全性確認", "CI確認", "受け入れ証拠"]);
        this.checkTable(path, "受け入れ証拠", ["要求", "タスク", "証拠", "要約"]);
      } else if (relativePath.endsWith("/tasks.md")) {
        this.checkTasks(path);
      } else if (relativePath.endsWith("/pr.md")) {
        this.checkPrRecord(path);
        checkedPrPaths.add(path);
      }
    }

    const boltsRoot = this.absolute(`${base}/bolts`);
    if (this.isDirectory(boltsRoot)) {
      const glob = new Bun.Glob("*/design.md");
      for (const design of glob.scanSync({ cwd: boltsRoot })) {
        const relativePath = `bolts/${design}`;
        if (requiredConstructionDesigns.has(relativePath)) continue;
        this.failRow(`${base}/${relativePath}`, "Construction Design は requiredBoltArtifacts に含まれる", relativePath);
      }
    }

    this.checkExistingPrRecords(base, checkedPrPaths);
  }

  private checkConstructionDesign(path: string): void {
    this.checkFile(path, "Construction Design が存在する");
    this.checkHeadings(path, constructionDesignHeadings);
    this.checkHeadingBodies(path, constructionDesignHeadings);
    if (!this.isFile(this.absolute(path))) return;

    const intentBase = dirname(dirname(dirname(path)));
    const boltIds = this.idsFor(`${intentBase}/bolts.md`);
    const boltDirectories = this.boltDirectories(intentBase);
    for (const heading of ["Domain Design", "Logical Design", "実装設計", "検証設計"]) {
      const body = this.sectionBody(path, heading) ?? "";
      const references = this.taskReferencesInText(body);
      if (references.length === 0) {
        this.pass(path, `\`${heading}\` の Task 参照は任意である`, "参照なし");
      } else {
        const table: Table = { headers: ["Task"], rows: references.map((reference) => ({ Task: reference })) };
        this.checkTaskReferences(path, table, "Task", boltIds, boltDirectories, "Construction Design");
      }
    }
  }

  private checkPrRecord(path: string): void {
    this.checkFile(path, "PR 記録が存在する");
    this.checkHeadings(path, ["Pull Request", "対象", "確認状況"]);
    this.checkPrUrl(path);
  }

  private checkExistingPrRecords(base: string, checkedPrPaths: Set<string>): void {
    const boltsRoot = this.absolute(`${base}/bolts`);
    if (!this.isDirectory(boltsRoot)) return;
    const glob = new Bun.Glob("*/pr.md");
    for (const pr of glob.scanSync({ cwd: boltsRoot })) {
      const path = `${base}/bolts/${pr}`;
      if (checkedPrPaths.has(path)) continue;
      this.checkPrRecord(path);
    }
  }

  private checkPrUrl(path: string): void {
    if (!this.isFile(this.absolute(path))) return;
    const body = this.sectionBody(path, "Pull Request") ?? "";
    const match = body.match(/https?:\/\/\S+/);
    if (match) this.pass(path, "PR 記録が URL を持つ", match[0]);
    else this.failRow(path, "PR 記録が URL を持つ", "URL なし");
  }

  private checkTasks(path: string): void {
    this.checkFile(path, "Task 一覧が存在する");
    if (!this.isFile(this.absolute(path))) return;
    const text = this.read(path);
    const taskMatches = [...text.matchAll(/^- \[[ xX]\] (T\d{3}):[\s\S]*?(?=^- \[[ xX]\] T\d{3}:|(?![\s\S]))/gm)];
    if (taskMatches.length === 0) {
      this.failRow(path, "Task が識別子付きチェックリストである", "Task がない");
      return;
    }
    const base = dirname(dirname(dirname(path)));
    const taskIds = new Set(taskMatches.map((match) => match[1]));
    for (const match of taskMatches) {
      const taskId = match[1];
      const block = match[0];
      this.pass(path, "Task が識別子付きチェックリストである", taskId);
      for (const label of ["作業", "要求", "ユースケース", "依存", "設計根拠", "証拠"]) {
        if (new RegExp(`^\\s+- ${label}:`, "m").test(block)) this.pass(path, `Task が \`${label}\` を持つ`, taskId);
        else this.failRow(path, `Task が \`${label}\` を持つ`, taskId);
      }
      this.checkTaskLabelReferences(path, block, taskId, "要求", this.idsFor(`${base}/requirements.md`), false);
      this.checkTaskLabelReferences(path, block, taskId, "ユースケース", this.idsFor(`${base}/use-cases.md`), true);
      this.checkTaskDependencies(path, block, taskId, taskIds, this.idsFor(`${base}/bolts.md`), this.boltDirectories(base));
    }
  }

  private checkTaskLabelReferences(path: string, block: string, taskId: string, label: string, ids: Set<string>, allowNone: boolean): void {
    for (const value of this.taskLabelValues(block, label)) {
      if (allowNone && value === "なし") {
        this.pass(path, `Task の \`${label}\` が既存 ID またはなしである`, `${taskId}: ${value}`);
      } else if (ids.has(value)) {
        this.pass(path, `Task の \`${label}\` が既存 ID またはなしである`, `${taskId}: ${value}`);
      } else {
        this.failRow(path, `Task の \`${label}\` が既存 ID またはなしである`, `${taskId}: ${value}`);
      }
    }
  }

  private checkTaskDependencies(path: string, block: string, taskId: string, taskIds: Set<string>, boltIds: Set<string>, boltDirectories: Map<string, string>): void {
    const condition = "Task の `依存` が既存 ID またはなしである";
    for (const value of this.taskLabelValues(block, "依存")) {
      if (value === "なし" || taskIds.has(value)) {
        this.pass(path, condition, `${taskId}: ${value}`);
        continue;
      }
      const match = value.match(/^(B\d{3})\/(T\d{3})$/);
      if (!match) {
        this.failRow(path, condition, `${taskId}: ${value}`);
        continue;
      }
      const [, boltId, dependencyTaskId] = match;
      const boltDir = boltDirectories.get(boltId);
      if (boltIds.has(boltId) && boltDir && this.taskIdsFor(`${boltDir}/tasks.md`).has(dependencyTaskId)) {
        this.pass(path, condition, `${taskId}: ${value}`);
      } else {
        this.failRow(path, condition, `${taskId}: ${value}`);
      }
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
    const requirementTraceTable = this.checkTable(path, "要求からの追跡", ["要求", "アクター", "ストーリー", "ユースケース", "ユニット", "ボルト"]);
    if (requirementTraceTable) this.checkNoInceptionTaskColumn(path, "要求からの追跡", requirementTraceTable);
    const designTraceTable = this.checkTable(path, "設計からの追跡", ["設計", "ユニット", "要求", "ユースケース", "ボルト"]);
    if (designTraceTable) this.checkDesignTraceability(path, designTraceTable);
    const codebaseTraceTable = this.checkTable(path, "既存コード分析からの追跡", ["分析", "要求", "ユースケース", "ユニット", "ボルト", "設計", "入力"]);
    if (codebaseTraceTable) this.checkCodebaseAnalysisTraceability(path, codebaseTraceTable);
    this.checkTable(path, "依存関係からの追跡", ["種別", "対象", "依存", "理由", "定義元"]);
    this.checkRelativeLinks(path);
  }

  private checkDesignTraceability(path: string, table: Table): void {
    const base = dirname(path);
    this.checkNoInceptionTaskColumn(path, "設計からの追跡", table);
    this.checkTableTargets(path, table, "要求", this.idsFor(`${base}/requirements.md`), false);
    this.checkTableTargets(path, table, "ユースケース", this.idsFor(`${base}/use-cases.md`), false);
    const unitIds = this.idsFor(`${base}/units.md`);
    this.checkTableTargets(path, table, "ユニット", unitIds, false);
    const boltIds = this.idsFor(`${base}/bolts.md`);
    this.checkTableTargets(path, table, "ボルト", boltIds, false);
    const unitDirectories = this.unitDirectories(base, unitIds);
    const designByUnit = new Map([...unitDirectories.entries()].map(([unitId, unitDir]) => [unitId, `${unitDir}/design.md`]));
    for (const row of table.rows) {
      this.checkDesignLinksForUnits(path, row["設計"], this.splitValues(row["ユニット"]), designByUnit);
    }
  }

  private checkNoInceptionTaskColumn(path: string, heading: string, table: Table): void {
    if (table.headers.includes("タスク")) this.failRow(path, `Inception の \`${heading}\` は \`タスク\` 列を持たない`, "Task は Construction で生成する");
    else this.pass(path, `Inception の \`${heading}\` は \`タスク\` 列を持たない`, "列なし");
  }

  private checkCodebaseAnalysisTraceability(path: string, table: Table): void {
    const base = dirname(path);
    this.checkTableTargets(path, table, "要求", this.idsFor(`${base}/requirements.md`), false);
    this.checkTableTargets(path, table, "ユースケース", this.idsFor(`${base}/use-cases.md`), false);
    const unitIds = this.idsFor(`${base}/units.md`);
    this.checkTableTargets(path, table, "ユニット", unitIds, false);
    this.checkTableTargets(path, table, "ボルト", this.idsFor(`${base}/bolts.md`), false);

    const unitDirectories = this.unitDirectories(base, unitIds);
    const designByUnit = new Map([...unitDirectories.entries()].map(([unitId, unitDir]) => [unitId, `${unitDir}/design.md`]));
    for (const row of table.rows) {
      this.checkCodebaseAnalysisLink(path, row["分析"]);
      this.checkDesignLinksForUnits(path, row["設計"], this.splitValues(row["ユニット"]), designByUnit);
    }
  }

  private checkCodebaseAnalysisLink(path: string, value: unknown): void {
    const expected = "codebase-analysis.md";
    const links = this.markdownLinks(String(value ?? ""));
    if (links.some((link) => this.cleanLinkTarget(link) === expected)) {
      this.pass(path, "`分析` が対象 Intent の codebase-analysis.md を指す", expected);
    } else {
      this.failRow(path, "`分析` が対象 Intent の codebase-analysis.md を指す", links.join(", ") || "リンクなし");
    }
  }

  private checkConstructionTraceability(path: string, state: Record<string, any>): void {
    const construction = state.construction;
    const status = String(construction?.status ?? "").trim();
    const gate = String(construction?.gate ?? "").trim();
    if (status !== "completed" && gate !== "passed") return;

    const table = this.checkTable(path, "Construction からの追跡", ["ボルト", "タスク", "証拠", "状態"]);
    if (!table) return;
    if (table.rows.length === 0) {
      this.failRow(path, "`Construction からの追跡` が証拠追跡行を持つ", "行がない");
      return;
    }
    this.pass(path, "`Construction からの追跡` が証拠追跡行を持つ", `${table.rows.length}件`);
    const base = dirname(path);
    const boltIds = this.idsFor(`${base}/bolts.md`);
    this.checkTableTargets(path, table, "ボルト", boltIds, false);
    this.checkTaskReferences(path, table, "タスク", boltIds, this.boltDirectories(base), "Construction 追跡");
    this.checkNotBlank(path, table, "状態");
    this.checkDetailLinks(path, table, "証拠");
  }

  private checkConstructionDesignTraceability(path: string, state: Record<string, any>): void {
    const construction = state.construction;
    if (!this.hasReadyConstructionDesignGate(construction)) return;

    const table = this.checkTable(path, "Construction Design からの追跡", ["Construction Design", "Task", "実装", "検証", "PR", "状態"]);
    if (!table) return;
    if (table.rows.length === 0) {
      this.failRow(path, "`Construction Design からの追跡` が設計追跡行を持つ", "行がない");
      return;
    }
    this.pass(path, "`Construction Design からの追跡` が設計追跡行を持つ", `${table.rows.length}件`);

    const base = dirname(path);
    const boltIds = this.idsFor(`${base}/bolts.md`);
    const boltDirectories = this.boltDirectories(base);
    this.checkTaskReferences(path, table, "Task", boltIds, boltDirectories, "Construction Design 追跡");
    this.checkDetailLinks(path, table, "Construction Design");
    this.checkNotBlank(path, table, "実装");
    this.checkNotBlank(path, table, "検証");
    this.checkNotBlank(path, table, "PR");
    this.checkNotBlank(path, table, "状態");

    if (this.isObject(construction) && Array.isArray(construction.bolts)) {
      const targetBolts = new Set(
        Array.isArray(construction.targetBolts) ? construction.targetBolts.map((value: unknown) => String(value ?? "").trim()) : [],
      );
      for (const item of construction.bolts) {
        if (!this.isObject(item) || !this.isObject(item.designGate)) continue;
        const boltId = String(item.id ?? "").trim();
        if (!targetBolts.has(boltId)) continue;
        const status = String(item.designGate.status ?? "").trim();
        if (status !== "ready" && status !== "passed") continue;

        const evidence = String(item.designGate.evidence ?? "").trim();
        const row = table.rows.find((candidate) =>
          this.markdownLinks(String(candidate["Construction Design"] ?? "")).some((link) => this.cleanLinkTarget(link) === evidence),
        );
        if (!row) {
          this.failRow(path, "`Construction Design からの追跡` が Design Gate evidence を持つ", `${boltId}: ${evidence || "空欄"}`);
          continue;
        }
        this.pass(path, "`Construction Design からの追跡` が Design Gate evidence を持つ", `${boltId}: ${evidence}`);

        const taskReferences = this.splitValues(row["Task"]);
        const wrongBoltReferences = taskReferences.filter((reference) => !reference.startsWith(`${boltId}/`));
        if (wrongBoltReferences.length === 0) {
          this.pass(path, "`Construction Design からの追跡` が対象 Bolt の Task を指す", boltId);
        } else {
          this.failRow(path, "`Construction Design からの追跡` が対象 Bolt の Task を指す", wrongBoltReferences.join(", "));
        }

        const boltDir = boltDirectories.get(boltId);
        const expectedTaskReferences = boltDir
          ? [...this.taskIdsFor(`${boltDir}/tasks.md`)].map((taskId) => `${boltId}/${taskId}`)
          : [];
        const missing = expectedTaskReferences.filter((reference) => !taskReferences.includes(reference));
        if (missing.length === 0) this.pass(path, "`Construction Design からの追跡` が対象 Bolt の全 Task を指す", boltId);
        else this.failRow(path, "`Construction Design からの追跡` が対象 Bolt の全 Task を指す", missing.join(", "));
      }
    }

    const constructionCompleted =
      String(construction?.status ?? "").trim() === "completed" || String(construction?.gate ?? "").trim() === "passed";
    if (constructionCompleted) {
      for (const row of table.rows) {
        for (const column of ["実装", "検証"]) {
          if (String(row[column] ?? "").trim() === "未実施") {
            this.failRow(path, "Construction 完了時の設計追跡が未実施を残さない", `${column}: 未実施`);
          }
        }
      }
    }
  }

  private hasReadyConstructionDesignGate(construction: unknown): boolean {
    if (!this.isObject(construction) || !Array.isArray(construction.bolts)) return false;
    const targetBolts = new Set(
      Array.isArray(construction.targetBolts) ? construction.targetBolts.map((value: unknown) => String(value ?? "").trim()) : [],
    );
    return construction.bolts.some((item: unknown) => {
      if (!this.isObject(item) || !this.isObject(item.designGate)) return false;
      if (!targetBolts.has(String(item.id ?? "").trim())) return false;
      const status = String(item.designGate.status ?? "").trim();
      return status === "ready" || status === "passed";
    });
  }

  private checkTaskReferences(path: string, table: Table, column: string, boltIds: Set<string>, boltDirectories: Map<string, string>, context: string): void {
    if (!table.headers.includes(column)) return;
    for (const row of table.rows) {
      for (const reference of this.splitValues(row[column])) {
        const match = reference.match(/^(B\d{3})\/(T\d{3})$/);
        if (!match) {
          this.failRow(path, `${context}の \`${column}\` が Bolt/Task 参照である`, reference);
          continue;
        }
        const [, boltId, taskId] = match;
        if (boltIds.has(boltId)) this.pass(path, `${context}の \`${column}\` が既存 Bolt を指す`, reference);
        else this.failRow(path, `${context}の \`${column}\` が既存 Bolt を指す`, reference);

        const boltDir = boltDirectories.get(boltId);
        if (!boltDir) {
          this.failRow(path, `${context}の \`${column}\` が既存 Task を指す`, reference);
          continue;
        }
        const taskIds = this.taskIdsFor(`${boltDir}/tasks.md`);
        if (taskIds.has(taskId)) this.pass(path, `${context}の \`${column}\` が既存 Task を指す`, reference);
        else this.failRow(path, `${context}の \`${column}\` が既存 Task を指す`, reference);
      }
    }
  }

  private checkUnitDesignArtifacts(base: string, state: Record<string, any>): void {
    const checkInceptionRequiredArtifacts = String(state.phase ?? "").trim() === "inception";
    const required = new Set((state.inception?.requiredArtifacts ?? []).map((value: unknown) => String(value).trim()));
    const unitsPath = `${base}/units.md`;
    const unitIds = this.idsFor(unitsPath);
    const unitDirectories = this.unitDirectories(base, unitIds);

    for (const [unitId, unitDir] of unitDirectories.entries()) {
      const unitPath = `${unitDir}/unit.md`;
      const designPath = `${unitDir}/design.md`;
      this.checkFile(unitPath, "Unit 詳細が unit.md として存在する");
      this.checkHeadings(unitPath, ["関連成果物"]);
      this.checkUnitRelatedDesignLink(unitPath, designPath);
      this.checkFile(designPath, "Unit Design Brief が存在する");
      this.checkHeadings(designPath, unitDesignHeadings);
      this.checkHeadingBodies(designPath, unitDesignHeadings);

      if (checkInceptionRequiredArtifacts) {
        const relativeUnitPath = this.relativeToIntent(base, unitPath);
        const relativeDesignPath = this.relativeToIntent(base, designPath);
        if (required.has(relativeUnitPath)) this.pass(`${base}/state.json`, "Inception 必須成果物に Unit 詳細が含まれる", relativeUnitPath);
        else this.failRow(`${base}/state.json`, "Inception 必須成果物に Unit 詳細が含まれる", relativeUnitPath);
        if (required.has(relativeDesignPath)) this.pass(`${base}/state.json`, "Inception 必須成果物に Unit Design Brief が含まれる", relativeDesignPath);
        else this.failRow(`${base}/state.json`, "Inception 必須成果物に Unit Design Brief が含まれる", relativeDesignPath);
      }
    }
  }

  private checkUnitRelatedDesignLink(unitPath: string, designPath: string): void {
    if (!this.isFile(this.absolute(unitPath))) return;
    const tableOrText = this.sectionBody(unitPath, "関連成果物");
    if (!tableOrText) {
      this.failRow(unitPath, "`関連成果物` が design.md へのリンクを持つ", "本文がない");
      return;
    }
    const expected = this.relativeLink(unitPath, designPath);
    const links = this.markdownLinks(tableOrText);
    if (links.some((link) => this.cleanLinkTarget(link) === expected)) {
      this.pass(unitPath, "`関連成果物` が design.md へのリンクを持つ", expected);
    } else {
      this.failRow(unitPath, "`関連成果物` が design.md へのリンクを持つ", links.join(", ") || "リンクなし");
    }
  }

  private checkBoltDesignReferences(base: string): void {
    const unitsPath = `${base}/units.md`;
    const unitIds = this.idsFor(unitsPath);
    const unitDirectories = this.unitDirectories(base, unitIds);
    const designByUnit = new Map([...unitDirectories.entries()].map(([unitId, unitDir]) => [unitId, `${unitDir}/design.md`]));

    const boltsPath = `${base}/bolts.md`;
    if (!this.isFile(this.absolute(boltsPath))) {
      this.failRow(boltsPath, "bolts.md が存在する", "存在しない");
      return;
    }
    const table = this.tableAfterHeading(boltsPath, "一覧");
    if (!table) return;
    if (!table.headers.includes("設計")) {
      this.failRow(boltsPath, "`一覧` の必須表列が揃っている", "不足: 設計");
      return;
    }

    for (const row of table.rows) {
      const boltId = String(row["識別子"] ?? "").trim();
      const unitValues = this.splitValues(row["ユニット"]);
      const distinctUnitValues = [...new Set(unitValues)];
      if (distinctUnitValues.length === unitValues.length) {
        this.pass(boltsPath, "Bolt の `ユニット` が重複しない", boltId);
      } else {
        this.failRow(boltsPath, "Bolt の `ユニット` が重複しない", `${boltId}: ${unitValues.join(", ")}`);
      }
      for (const unitId of unitValues) {
        if (unitIds.has(unitId)) this.pass(boltsPath, "Bolt の `ユニット` が既存 Unit を参照する", `${boltId}: ${unitId}`);
        else this.failRow(boltsPath, "Bolt の `ユニット` が既存 Unit を参照する", `${boltId}: ${unitId}`);
      }
      this.checkDesignLinksForUnits(boltsPath, row["設計"], distinctUnitValues, designByUnit);

      const detailLinks = this.markdownLinks(String(row["詳細"] ?? ""));
      for (const target of detailLinks) {
        const boltPath = this.cleanLinkTarget(target);
        if (boltPath.endsWith("/bolt.md")) {
          this.checkBoltDetailDesignReference(join(dirname(boltsPath), boltPath), boltId, distinctUnitValues, designByUnit);
        }
      }
    }
  }

  private checkBoltDetailDesignReference(path: string, boltId: string, unitValues: string[], designByUnit: Map<string, string>): void {
    this.checkHeadings(path, ["対象ユニット", "設計"]);
    const targetUnits = this.bulletsAfterHeading(path, "対象ユニット");
    const designBody = this.sectionBody(path, "設計") ?? "";
    if (targetUnits.length === 0) {
      this.failRow(path, "`対象ユニット` が空でない", `${boltId}: 箇条書きなし`);
    }
    const units = targetUnits.map((item) => item.split(/[：:]/, 1)[0].trim());
    for (const unitId of unitValues) {
      if (units.includes(unitId)) this.pass(path, "`対象ユニット` が bolts.md のユニットを含む", `${boltId}: ${unitId}`);
      else this.failRow(path, "`対象ユニット` が bolts.md のユニットを含む", `${boltId}: ${unitId}`);
    }
    this.checkDesignLinksForUnits(path, designBody, unitValues, designByUnit);
    this.checkMultiUnitBoltReason(path, boltId, unitValues);
  }

  private checkMultiUnitBoltReason(path: string, boltId: string, unitValues: string[]): void {
    if (unitValues.length <= 1) return;
    const body = this.sectionBody(path, multiUnitBoltReasonHeading);
    if (body && body.trim().length > 0) {
      this.pass(path, "複数 Unit を同じ Bolt で扱う理由を記録する", boltId);
    } else {
      this.failRow(path, "複数 Unit を同じ Bolt で扱う理由を記録する", `${boltId}: \`${multiUnitBoltReasonHeading}\` 見出しまたは本文がない`);
    }
  }

  private checkDesignLinksForUnits(path: string, value: unknown, unitValues: string[], designByUnit: Map<string, string>): void {
    const links = this.markdownLinks(String(value ?? ""));
    for (const unitId of unitValues) {
      const designPath = designByUnit.get(unitId);
      if (!designPath) {
        this.failRow(path, "`設計` が対象 Unit の Unit Design Brief を指す", `${unitId}: Unit 詳細ディレクトリがない`);
        continue;
      }
      const expected = this.relativeLink(path, designPath);
      if (links.some((link) => this.cleanLinkTarget(link) === expected)) {
        this.pass(path, "`設計` が対象 Unit の Unit Design Brief を指す", `${unitId}: ${expected}`);
      } else {
        this.failRow(path, "`設計` が対象 Unit の Unit Design Brief を指す", `${unitId}: ${links.join(", ") || "リンクなし"}`);
      }
    }
  }

  private checkNoInceptionBoltDesignBriefArtifacts(base: string, state: Record<string, any>): void {
    const inceptionBoltArtifacts = (state.inception?.requiredBoltArtifacts ?? []).map((value: unknown) => String(value).trim());
    for (const artifact of inceptionBoltArtifacts) {
      if (artifact.match(/^bolts\/[^/]+\/design\.md$/)) {
        this.failRow(`${base}/state.json`, "Inception 必須 Bolt 成果物に旧 Bolt Design Brief を含めない", artifact);
      }
    }

    if (String(state.phase ?? "").trim() === "construction") return;

    const boltsRoot = this.absolute(`${base}/bolts`);
    if (!this.isDirectory(boltsRoot)) return;
    const glob = new Bun.Glob("*/design.md");
    for (const design of glob.scanSync({ cwd: boltsRoot })) {
      this.failRow(`${base}/bolts/${design}`, "Inception 段階では Bolt 配下に旧 Bolt Design Brief を置かない", "旧 Bolt Design Brief");
    }
  }

  private checkOptionalIndex(path: string, spec: typeof indexSpecs[string]): void {
    this.checkHeadings(path, spec.headings);
    const table = this.checkTable(path, spec.listHeading, spec.columns);
    if (!table) return;

    const ids = this.collectIds(path, table, "識別子", spec.idPattern);
    this.checkDependencyValues(path, table, "依存", ids);
    this.checkDetailLinks(path, table, "詳細");
  }

  private checkUnitContextReferences(base: string, requireContext: boolean): void {
    const unitsPath = `${base}/units.md`;
    const table = this.tableAfterHeading(unitsPath, "一覧");
    if (!table || !table.headers.includes("コンテキスト")) return;

    const contextIds = this.idsFor(`${base}/domain/bounded-contexts.md`);
    for (const row of table.rows) {
      const unitId = String(row["識別子"] ?? "").trim();
      for (const contextId of this.splitValues(row["コンテキスト"])) {
        if (contextId === "未確認" && !requireContext) {
          this.pass(unitsPath, "Unit のコンテキストが同じ Intent の BC を参照する", `${unitId}: ${contextId}`);
        } else if (contextIds.has(contextId)) {
          this.pass(unitsPath, "Unit のコンテキストが同じ Intent の BC を参照する", `${unitId}: ${contextId}`);
        } else {
          this.failRow(unitsPath, "Unit のコンテキストが同じ Intent の BC を参照する", `${unitId}: ${contextId}`);
        }
      }
    }
  }

  private checkGrillings(base: string): void {
    const indexPath = `${base}/grillings.md`;
    const sessionsPath = `${base}/grillings`;
    const hasIndex = this.isFile(this.absolute(indexPath));
    const hasSessions = this.isDirectory(this.absolute(sessionsPath));

    if (!hasIndex && !hasSessions) {
      this.skipped(base, "grilling decision trail は任意である", "grillings なし");
      return;
    }

    if (hasIndex && hasSessions) {
      this.pass(base, "`grillings.md` と `grillings/` が揃っている", "両方あり");
    } else {
      this.failRow(base, "`grillings.md` と `grillings/` が揃っている", hasIndex ? "grillings/ がない" : "grillings.md がない");
      return;
    }

    this.checkFile(indexPath, "grillings 索引が存在する");
    this.checkFile(sessionsPath, "grilling session ディレクトリが存在する", true);
    this.checkHeadings(indexPath, ["一覧"]);
    const table = this.checkTable(indexPath, "一覧", ["ID", "主題", "対象", "状態", "主な確定判断", "反映先", "詳細"]);
    if (table) {
      const ids = this.collectIds(indexPath, table, "ID", /^G\d{3}$/);
      this.checkNotBlank(indexPath, table, "主題");
      this.checkNotBlank(indexPath, table, "対象");
      this.checkNotBlank(indexPath, table, "主な確定判断");
      this.checkNotBlank(indexPath, table, "反映先");
      this.checkDetailLinks(indexPath, table, "詳細");
      for (const row of table.rows) {
        this.checkAllowed(indexPath, "状態", row["状態"], grillingSessionStatusValues);
        const id = String(row["ID"] ?? "").trim();
        const detailLinks = this.markdownLinks(String(row["詳細"] ?? "")).map((link) => this.cleanLinkTarget(link));
        const expectedPrefix = `grillings/${id}-`;
        if (id.length > 0 && ids.has(id) && detailLinks.some((link) => link.startsWith(expectedPrefix) && link.endsWith(".md"))) {
          this.pass(indexPath, "`詳細` が対応する grilling session を指す", id);
        } else {
          this.failRow(indexPath, "`詳細` が対応する grilling session を指す", `${id}: ${detailLinks.join(", ") || "リンクなし"}`);
        }
      }
    }

    const entries = readdirSync(this.absolute(sessionsPath)).sort();
    const sessionFiles = entries.filter((entry) => this.isFile(this.absolute(`${sessionsPath}/${entry}`)));
    if (sessionFiles.length > 0) this.pass(sessionsPath, "grilling session ファイルが1件以上ある", `${sessionFiles.length}件`);
    else this.failRow(sessionsPath, "grilling session ファイルが1件以上ある", "0件");

    for (const entry of sessionFiles) {
      const path = `${sessionsPath}/${entry}`;
      if (grillingSessionFilePattern.test(entry)) {
        this.pass(path, "grilling session ファイル名が Gnnn-<topic>.md 形式である", entry);
      } else {
        this.failRow(path, "grilling session ファイル名が Gnnn-<topic>.md 形式である", entry);
      }
      this.checkGrillingSession(path);
    }
  }

  private checkGrillingSession(path: string): void {
    this.checkHeadings(path, ["概要", "確定判断", "質問記録"]);

    const expectedId = basename(path).match(/^(G\d{3})-/)?.[1];
    const title = this.read(path).split(/\r?\n/, 1)[0] ?? "";
    if (!expectedId || title.includes(expectedId)) this.pass(path, "grilling session 見出しがファイル ID を含む", title || "見出しなし");
    else this.failRow(path, "grilling session 見出しがファイル ID を含む", title);

    const sessionState = this.labeledBulletValue(path, "概要", "状態");
    if (sessionState) this.checkAllowed(path, "状態", sessionState, grillingSessionStatusValues);
    else this.failRow(path, "grilling session の `状態` が空欄でない", "空欄");

    const sessionTarget = this.labeledBulletValue(path, "概要", "反映先");
    if (this.blank(sessionTarget)) this.failRow(path, "grilling session の `反映先` が空欄でない", "空欄");
    else this.pass(path, "grilling session の `反映先` が空欄でない", String(sessionTarget).trim());

    const table = this.checkTable(path, "確定判断", ["ID", "判断", "状態", "反映先", "置き換え先"]);
    const decisionIds = table ? this.collectIds(path, table, "ID", /^GD\d{3}$/) : new Set<string>();
    if (table) {
      this.checkNotBlank(path, table, "判断");
      for (const row of table.rows) {
        const decisionId = String(row["ID"] ?? "").trim();
        const target = String(row["反映先"] ?? "").trim();
        if (target.length > 0) this.pass(path, "grilling 判断の `反映先` が空欄でない", `${decisionId}: ${target}`);
        else this.failRow(path, "grilling 判断の `反映先` が空欄でない", decisionId);

        const state = String(row["状態"] ?? "").trim();
        this.checkAllowed(path, "状態", state, grillingDecisionStatusValues);
        const replacedBy = String(row["置き換え先"] ?? "").trim();
        if (state === "superseded") {
          if (replacedBy.length > 0 && replacedBy !== "該当なし") {
            this.pass(path, "superseded の grilling 判断が置き換え先を持つ", `${decisionId}: ${replacedBy}`);
          } else {
            this.failRow(path, "superseded の grilling 判断が置き換え先を持つ", decisionId);
          }
        }
      }
    }

    this.checkGrillingQuestions(path, decisionIds);
  }

  private checkGrillingQuestions(path: string, decisionIds: Set<string>): void {
    const body = this.sectionBody(path, "質問記録");
    if (!body || body.trim().length === 0) {
      this.failRow(path, "grilling session が質問記録を持つ", "本文なし");
      return;
    }

    const questionMatches = [...body.matchAll(/^###\s+(Q\d{3})\s*$/gm)];
    if (questionMatches.length > 0) this.pass(path, "grilling session が質問記録を持つ", `${questionMatches.length}件`);
    else this.failRow(path, "grilling session が質問記録を持つ", "Qnnn 見出しなし");

    for (const [index, match] of questionMatches.entries()) {
      const questionId = match[1];
      const start = match.index ?? 0;
      const end = questionMatches[index + 1]?.index ?? body.length;
      const block = body.slice(start, end);
      const references = [...block.matchAll(/^\s*-\s+確定判断:\s*(.*?)\s*$/gm)].flatMap((referenceMatch) => this.splitValues(referenceMatch[1]));
      if (references.length > 0) {
        this.pass(path, "質問記録が確定判断 ID を参照する", `${questionId}: ${references.join(", ")}`);
      } else {
        this.failRow(path, "質問記録が確定判断 ID を参照する", `${questionId}: 参照なし`);
      }

      for (const reference of references) {
        if (decisionIds.has(reference)) this.pass(path, "質問記録の確定判断 ID が確定判断に存在する", `${questionId}: ${reference}`);
        else this.failRow(path, "質問記録の確定判断 ID が確定判断に存在する", `${questionId}: ${reference}`);
      }
    }
  }

  private checkSubdomains(path: string, boundedContextsPath: string, requireContext = false): void {
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
        if (contextId === "なし" && !requireContext) {
          this.pass(path, "コンテキストが同じ階層の bounded-contexts.md に存在する", `${row["識別子"]}: ${contextId}`);
        } else if (bcIds.has(contextId)) {
          this.pass(path, "サブドメインのコンテキストが解決領域の BC を参照する", `${row["識別子"]}: ${contextId}`);
        } else {
          this.failRow(path, "サブドメインのコンテキストが解決領域の BC を参照する", `${row["識別子"]}: ${contextId}`);
        }
      }
    }
  }

  private checkBoundedContexts(path: string, global: boolean, requireRows = false): void {
    this.checkFile(path, "境界づけられたコンテキスト一覧が存在する");
    const headings = global ? ["一覧", "外部境界", "コンテキスト間の依存", "パターン分類"] : ["コンテキスト", "外部境界", "コンテキスト間の依存"];
    const listHeading = global ? "一覧" : "コンテキスト";
    this.checkHeadings(path, headings);

    const table = this.checkTable(path, listHeading, ["識別子", "名前", "サブドメイン", "役割", "モデル", "契約"]);
    const ids = table ? this.collectIds(path, table, "識別子", /^BC\d{3}$/) : new Set<string>();
    if (table) {
      if (requireRows) {
        if (table.rows.length > 0) this.pass(path, "境界づけられたコンテキストが1件以上存在する", `${table.rows.length}件`);
        else this.failRow(path, "境界づけられたコンテキストが1件以上存在する", "行がない");
      }
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

  private checkHeadingBodies(path: string, headings: string[]): void {
    if (!this.isFile(this.absolute(path))) return;
    for (const heading of headings) {
      const body = this.sectionBody(path, heading);
      if (body && body.trim().length > 0) this.pass(path, `\`${heading}\` 見出しに本文がある`, "本文を確認");
      else this.failRow(path, `\`${heading}\` 見出しに本文がある`, "本文がない");
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

  private taskReferencesInText(text: string): string[] {
    return [...new Set([...text.matchAll(/\bB\d{3}\/T\d{3}\b/g)].map((match) => match[0]))];
  }

  private taskIdsFor(path: string): Set<string> {
    if (!this.isFile(this.absolute(path))) return new Set();
    const text = this.read(path);
    return new Set([...text.matchAll(/^- \[[ xX]\] (T\d{3}):/gm)].map((match) => match[1]));
  }

  private taskLabelValues(block: string, label: string): string[] {
    const match = block.match(new RegExp(`^\\s+- ${this.escapeRegExp(label)}:\\s*(.*?)\\s*$`, "m"));
    if (!match) return [];
    return this.splitValues(match[1]);
  }

  private bulletsAfterHeading(path: string, heading: string): string[] {
    const body = this.sectionBody(path, heading);
    if (!body) return [];
    return body.split(/\r?\n/)
      .map((line) => line.match(/^\s*-\s+(.+?)\s*$/)?.[1]?.trim())
      .filter((value): value is string => Boolean(value));
  }

  private labeledBulletValue(path: string, heading: string, label: string): string | undefined {
    const body = this.sectionBody(path, heading);
    if (!body) return undefined;
    const match = body.match(new RegExp(`^\\s*-\\s+${this.escapeRegExp(label)}:\\s*(.*?)\\s*$`, "m"));
    return match?.[1]?.trim();
  }

  private sectionBody(path: string, heading: string): string | undefined {
    if (!this.isFile(this.absolute(path))) return undefined;
    const lines = this.read(path).split(/\r?\n/);
    const headingIndex = lines.findIndex((line) => new RegExp(`^##\\s+${this.escapeRegExp(heading)}\\s*$`).test(line));
    if (headingIndex < 0) return undefined;
    const bodyLines: string[] = [];
    for (let index = headingIndex + 1; index < lines.length; index += 1) {
      if (/^##\s+/.test(lines[index])) break;
      bodyLines.push(lines[index]);
    }
    return bodyLines.join("\n");
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

  private relativeLink(fromPath: string, toPath: string): string {
    return relative(dirname(fromPath), toPath).replaceAll("\\", "/");
  }

  private relativeToIntent(base: string, path: string): string {
    return relative(base, path).replaceAll("\\", "/");
  }

  private unitDirectories(base: string, unitIds: Set<string>): Map<string, string> {
    const results = new Map<string, string>();
    const unitsPath = `${base}/units.md`;
    if (!this.isFile(this.absolute(unitsPath))) return results;
    const table = this.tableAfterHeading(unitsPath, "一覧");
    if (!table) return results;
    if (!table.headers.includes("詳細")) return results;

    for (const row of table.rows) {
      const unitId = String(row["識別子"] ?? "").trim();
      if (!unitIds.has(unitId)) continue;
      const links = this.markdownLinks(String(row["詳細"] ?? "")).map((link) => this.cleanLinkTarget(link));
      const unitLink = links.find((link) => link.endsWith("/unit.md"));
      const match = unitLink?.match(/^units\/([^/]+)\/unit\.md$/);
      if (match && match[1].startsWith(`${unitId}-`)) {
        this.pass(unitsPath, "`詳細` が units/<unit-id>-<slug>/unit.md を指す", `${unitId}: ${unitLink}`);
        results.set(unitId, `${base}/units/${match[1]}`);
      } else {
        this.failRow(unitsPath, "`詳細` が units/<unit-id>-<slug>/unit.md を指す", `${unitId}: ${links.join(", ") || "リンクなし"}`);
      }
    }
    for (const unitId of unitIds) {
      if (!results.has(unitId)) this.failRow(`${base}/units.md`, "`詳細` が units/<unit-id>-<slug>/unit.md を指す", unitId);
    }
    return results;
  }

  private boltDirectories(base: string): Map<string, string> {
    const results = new Map<string, string>();
    const boltsPath = `${base}/bolts.md`;
    if (!this.isFile(this.absolute(boltsPath))) return results;
    const table = this.tableAfterHeading(boltsPath, "一覧");
    if (!table || !table.headers.includes("詳細")) return results;

    for (const row of table.rows) {
      const boltId = String(row["識別子"] ?? "").trim();
      const links = this.markdownLinks(String(row["詳細"] ?? "")).map((link) => this.cleanLinkTarget(link));
      const boltLink = links.find((link) => link.endsWith("/bolt.md"));
      const match = boltLink?.match(/^bolts\/([^/]+)\/bolt\.md$/);
      if (match && match[1].startsWith(`${boltId}-`)) {
        this.pass(boltsPath, "`詳細` が bolts/<bolt-id>-<slug>/bolt.md を指す", `${boltId}: ${boltLink}`);
        results.set(boltId, `${base}/bolts/${match[1]}`);
      } else {
        this.failRow(boltsPath, "`詳細` が bolts/<bolt-id>-<slug>/bolt.md を指す", `${boltId}: ${links.join(", ") || "リンクなし"}`);
      }
    }
    return results;
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
    lines.push("# Amadeus Validator 結果", "", "## 判定", "", this.overallResult(), "", "## 検査サマリ", "");
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
    if (file.includes("/grillings/") || file.endsWith("/grillings.md")) return "Grilling Decision Trail";
    if (file.startsWith(".amadeus/discoveries/")) return "Discovery";
    if (file.startsWith(".amadeus/event-storming/")) return "Event Storming";
    if (/^\.amadeus\/[^/]+\.md$/.test(file)) return "全体成果物";
    if (file.startsWith(".amadeus/domain/")) return "全体ドメイン";
    if (/^\.amadeus\/intents\/[^/]+\/state\.json$/.test(file)) return "Intent 状態";
    if (/^\.amadeus\/intents\/[^/]+\/event-storming\//.test(file)) return "Event Storming";
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
      "Grilling Decision Trail",
      "Discovery",
      "Event Storming",
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
    if (target.includes("/grillings") || condition.includes("grilling")) return "Grilling Decision Trail";
    if (condition.includes("作業ディレクトリ") || condition.includes("成果物ルート")) return "実行環境";
    if (target.includes("/event-storming/") || condition.includes("Event Storming") || condition.includes("Domain Event")) return "Event Storming";
    if (target.includes(".amadeus/discoveries") || condition.includes("Discovery") || condition.includes("Intent 候補")) return "Discovery";
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
const result = new AmadeusValidator(root, intentId).run();
console.log(result);

const status = result.match(/^pass$|^fail$|^blocked$/m)?.[0];
if (status === "pass") process.exit(0);
if (status === "blocked") process.exit(2);
process.exit(1);
