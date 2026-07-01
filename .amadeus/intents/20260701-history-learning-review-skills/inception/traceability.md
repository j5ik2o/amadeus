# 追跡

## 要求からの追跡

| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト |
|---|---|---|---|---|---|
| R001 | ACT001, ACT002 | S001 | UC001 | U001 | B001 |
| R002 | ACT001, ACT002 | S001 | UC001 | U001 | B001 |
| R003 | ACT001, ACT002 | S001 | UC002 | U002 | B002 |
| R004 | ACT001, ACT002 | S001 | UC003 | U002 | B003 |
| R005 | ACT001, ACT002 | S001 | UC003 | U002 | B003 |

## 対象境界からの追跡

| 対象境界 | 要求 | ユーザーストーリー | ユースケース | ユニット | ボルト | 扱い |
|---|---|---|---|---|---|---|
| SC-IN-001 | R001, R002 | S001 | UC001 | U001 | B001 | `amadeus-history-review` の内部 skill 追加として扱う。 |
| SC-IN-002 | R001 | S001 | UC001 | U001 | B001 | 副作用を持たない読み取り専用境界として扱う。 |
| SC-IN-003 | R003 | S001 | UC002 | U002 | B002 | `amadeus-learning-review` の分類責務として扱う。 |
| SC-IN-004 | R003 | S001 | UC002 | U002 | B002 | Issue #259 の分類との整合条件として扱う。 |
| SC-IN-005 | R004 | S001 | UC003 | U002 | B003 | `dry-run` consumer 境界として扱う。 |
| SC-IN-006 | R005 | S001 | UC003 | U002 | B003 | source skill、昇格先成果物、eval、validator の検証条件として扱う。 |

## 背景からの追跡

| 目的 | アクター | 外部システム | 要求 |
|---|---|---|---|
| `.amadeus/` の過去成果物を横断分析する内部 skill を追加する。 | ACT001, ACT002 | なし | R001, R002 |
| 分析結果を学習先へ分類する内部 skill を追加する。 | ACT001, ACT002 | EXT001 GitHub | R003 |
| Issue #272 の `dry-run` が分析結果を入力にできる前提を作る。 | ACT001, ACT002 | EXT001 GitHub | R004, R005 |

## ボルトからの追跡

| ボルト | ユニット | 要求 |
|---|---|---|
| B001 | U001 | R001, R002 |
| B002 | U002 | R003 |
| B003 | U002 | R004, R005 |

## 設計からの追跡

| 設計 | ユニット | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| [design.md](units/U001-history-review-contract/design.md) | U001 | R001, R002 | UC001 | B001 |
| [design.md](units/U002-learning-review-consumer-contract/design.md) | U002 | R003, R004, R005 | UC002, UC003 | B002, B003 |

## 既存コード分析からの追跡

| 分析 | 要求 | ユースケース | ユニット | ボルト | 設計 | 入力 |
|---|---|---|---|---|---|---|
| [codebase-analysis.md](codebase-analysis.md) | R001, R002 | UC001 | U001 | B001 | [design.md](units/U001-history-review-contract/design.md) | `amadeus-decision-review` の内部 skill 形式、`amadeus-discovery` の既存成果物確認、text contract を入力にする。 |
| [codebase-analysis.md](codebase-analysis.md) | R003, R004, R005 | UC002, UC003 | U002 | B002, B003 | [design.md](units/U002-learning-review-consumer-contract/design.md) | Issue #259 の分類契約、Skill Contract の `learning-review` consumer、promote-skill、eval を入力にする。 |

## ユニットからの追跡

| ユニット | コンテキスト | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| U001 | BC001 | R001, R002 | UC001 | B001 |
| U002 | BC001 | R003, R004, R005 | UC002, UC003 | B002, B003 |

## ドメインモデルからの追跡

| 種別 | 対象 | 要求 | ユースケース | 定義元 |
|---|---|---|---|---|
| Bounded Context | BC001 自己開発運用 | R001, R002, R003, R004, R005 | UC001, UC002, UC003 | [domain-map.md](../../../domain-map.md) |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260701-history-learning-review-skills | 20260701-feedback-learning-loop | Issue #277 は、Issue #259 の学習分類契約を内部 skill として具体化するため。 | [intents.md](../../../intents.md) |
| Issue | #277 | #259 | Issue #259 では内部 skill 候補を初期完了条件に含めなかったため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/259) |
| Issue | #277 | #272 | Issue #272 の `dry-run` が過去分析結果を入力にできる前提を作るため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/272) |
| 要求 | R002 | R001 | 抽出結果は読み取り専用分析の上に成立するため。 | [requirements.md](requirements.md) |
| 要求 | R003 | R002 | 学習分類は過去分析結果を入力にするため。 | [requirements.md](requirements.md) |
| 要求 | R004 | R002, R003 | `dry-run` は過去分析結果と学習分類結果を入力にするため。 | [requirements.md](requirements.md) |
| 要求 | R005 | R001, R003 | 追加する内部 skill と分類契約を同期検証するため。 | [requirements.md](requirements.md) |
| ユースケース | UC002 | UC001 | 学習分類は過去分析結果を入力にするため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC003 | UC002 | consumer 境界と検証は学習分類の後に扱うため。 | [use-cases.md](use-cases.md) |
| ユニット | U002 | U001 | 学習分類と consumer 境界は過去分析結果を入力にするため。 | [units.md](units.md) |
| ボルト | B002 | B001 | `amadeus-learning-review` は `amadeus-history-review` の結果を入力にするため。 | [bolts.md](bolts.md) |
| ボルト | B003 | B002 | `dry-run` consumer 境界と検証は学習分類の後に扱うため。 | [bolts.md](bolts.md) |
