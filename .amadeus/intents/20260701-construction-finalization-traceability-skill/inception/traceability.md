# 追跡

## 要求からの追跡

| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト |
|---|---|---|---|---|---|
| R001 | ACT002 Agent | S001 | UC001, UC002 | U001 | B001 |
| R002 | ACT002 Agent | S001 | UC001, UC002 | U001 | B001 |
| R003 | ACT002 Agent | S001 | UC001, UC002 | U001 | B001 |
| R004 | ACT001 Maintainer | S001 | UC002, UC003 | U002 | B002 |

## 対象境界からの追跡

| 対象境界 | 要求 | ユーザーストーリー | ユースケース | ユニット | ボルト | 扱い |
|---|---|---|---|---|---|---|
| SC-IN-001 | R001 | S001 | UC001, UC002 | U001 | B001 | 完了済み Construction の追跡表要件として扱う。 |
| SC-IN-002 | R002 | S001 | UC001, UC002 | U001 | B001 | `Construction からの追跡` 表の必須列として扱う。 |
| SC-IN-003 | R003 | S001 | UC001, UC002 | U001 | B001 | Task Generation 表との違いとして扱う。 |
| SC-IN-004 | R004 | S001 | UC002, UC003 | U002 | B002 | source skill、昇格先成果物、template、example の整合確認として扱う。 |

## 背景からの追跡

| 目的 | アクター | 外部システム | 要求 |
|---|---|---|---|
| Construction finalization skill に完了時の追跡表要件を明記する。 | ACT001 Maintainer, ACT002 Agent, ACT003 Reviewer | EXT001 GitHub | R001, R002, R003, R004 |
| PR #244 で見つかった skill 説明と validator 要件のずれを解消する。 | ACT001 Maintainer, ACT002 Agent | EXT001 GitHub | R001, R002, R003, R004 |

## ボルトからの追跡

| ボルト | ユニット | 要求 |
|---|---|---|
| B001 | U001 | R001, R002, R003 |
| B002 | U002 | R004 |

## 設計からの追跡

| 設計 | ユニット | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| [design.md](units/U001-finalization-skill-guidance/design.md) | U001 | R001, R002, R003 | UC001, UC002 | B001 |
| [design.md](units/U002-traceability-template-alignment/design.md) | U002 | R004 | UC002, UC003 | B002 |

## 既存コード分析からの追跡

| 分析 | 要求 | ユースケース | ユニット | ボルト | 設計 | 入力 |
|---|---|---|---|---|---|---|
| [codebase-analysis.md](codebase-analysis.md) | R001, R002, R003 | UC001, UC002 | U001 | B001 | [design.md](units/U001-finalization-skill-guidance/design.md) | 完了済み Construction の追跡表要件、必須列、Task Generation 表との違い。 |
| [codebase-analysis.md](codebase-analysis.md) | R004 | UC002, UC003 | U002 | B002 | [design.md](units/U002-traceability-template-alignment/design.md) | source skill、昇格先成果物、template、example、eval の整合確認。 |

## ユニットからの追跡

| ユニット | コンテキスト | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| U001 | BC001 | R001, R002, R003 | UC001, UC002 | B001 |
| U002 | BC001 | R004 | UC002, UC003 | B002 |

## ドメインモデルからの追跡

| 種別 | 対象 | 要求 | ユースケース | 定義元 |
|---|---|---|---|---|
| サブドメイン | SD001 自己開発運用 | R001, R002, R003, R004 | UC001, UC002, UC003 | [domain-map.md](../../../domain-map.md) |
| 境界づけられたコンテキスト | BC001 自己開発運用 | R001, R002, R003, R004 | UC001, UC002, UC003 | [domain-map.md](../../../domain-map.md) |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260701-construction-finalization-traceability-skill | 20260701-self-development-cycle-stage-workspace | Issue #245 は、Issue #233 の Construction 最終化で見つかった skill 説明と validator 要件のずれを扱うため。 | [intents.md](../../../intents.md) |
| 要求 | R001 | なし | 完了時表要件が他の要求の前提であるため。 | [requirements.md](requirements.md) |
| 要求 | R002 | R001 | 必須列は `Construction からの追跡` 表を前提にするため。 | [requirements.md](requirements.md) |
| 要求 | R003 | R001, R002 | Task Generation 表との違いは、完了時表と必須列を前提にするため。 | [requirements.md](requirements.md) |
| 要求 | R004 | R001, R002, R003 | source skill と昇格先成果物の整合は、採用する契約内容を前提にするため。 | [requirements.md](requirements.md) |
| ユーザーストーリー | S001 | なし | Maintainer の契約整合レビュー価値を表すため。 | [user-stories.md](user-stories.md) |
| ユースケース | UC001 | なし | traceability 契約特定が他の相互作用の前提であるため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC002 | UC001 | finalization guidance は、特定した契約内容を前提に更新するため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC003 | UC001, UC002 | review は契約特定と guidance 更新の結果を前提にするため。 | [use-cases.md](use-cases.md) |
| ユニット | U001 | なし | finalization guidance は整合確認の前提であるため。 | [units.md](units.md) |
| ユニット | U002 | U001 | template と example の確認は採用済み guidance を前提にするため。 | [units.md](units.md) |
| ボルト | B001 | なし | guidance 更新は template と example の整合確認の前提であるため。 | [bolts.md](bolts.md) |
| ボルト | B002 | B001 | template と example は採用済み guidance を基準に確認するため。 | [bolts.md](bolts.md) |
| 判断 | D001 | なし | Inception の所有境界を固定するため。 | [decisions.md](decisions.md) |
| 判断 | D002 | D001 | BC001 を採用済みコンテキストとして参照するため。 | [decisions.md](decisions.md) |
| 判断 | D003 | D001, D002 | Unit と Bolt の粒度を固定するため。 | [decisions.md](decisions.md) |
