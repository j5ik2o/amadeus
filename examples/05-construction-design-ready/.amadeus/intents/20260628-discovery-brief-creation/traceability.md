# 追跡

## 要求からの追跡

| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト |
|---|---|---|---|---|---|
| R001 | ACT001 | S001 | UC001 | U001 | B001 |
| R002 | ACT001 | S001 | UC002 | U002 | B002 |

## 背景からの追跡

| 目的 | アクター | 外部システム | 要求 |
|---|---|---|---|
| OBJ001 | ACT001 | なし | R001, R002 |

## ボルトからの追跡

| ボルト | ユニット | 要求 |
|---|---|---|
| B001 | U001 | R001 |
| B002 | U002 | R002 |

## 設計からの追跡

| 設計 | ユニット | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| [design.md](units/U001-discovery-brief-recording/design.md) | U001 | R001 | UC001 | B001 |
| [design.md](units/U002-intent-candidate-presentation/design.md) | U002 | R002 | UC002 | B002 |

## Construction Design からの追跡

| Construction Design | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| [B001 design.md](bolts/B001-discovery-brief-recording/design.md) | B001/T001, B001/T002, B001/T003, B001/T004 | 未登録 | 未登録 | 未登録 | generated |

## 既存コード分析からの追跡

この Intent は、例示 workspace の Inception 成果物を定義する範囲であり、既存コードへ統合する brownfield 作業ではない。
そのため `codebase-analysis.md` は作らず、既存コード分析からの追跡は対象外にする。

| 分析 | 要求 | ユースケース | ユニット | ボルト | 設計 | 入力 |
|---|---|---|---|---|---|---|

## ユニットからの追跡

| ユニット | コンテキスト | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| U001 | BC001 | R001 | UC001 | B001 |
| U002 | BC001 | R002 | UC002 | B002 |

## ドメインモデルからの追跡

| 種別 | 対象 | 要求 | ユースケース | 定義元 |
|---|---|---|---|---|
| 境界 | Discovery Brief 確認境界 | R001 | UC001 | [bounded-contexts.md](domain/bounded-contexts.md) |
| 境界 | Intent 候補確認境界 | R002 | UC002 | [bounded-contexts.md](domain/bounded-contexts.md) |
| DDD Module | DM001 Discovery Brief | R001, R002 | UC001, UC002 | [DM001-discovery-brief.md](domain/bounded-contexts/BC001-discovery-support/models/DM001-discovery-brief.md) |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260628-discovery-brief-creation | なし | Discovery Brief の最初の候補として単独で成立するため。 | [intents.md](../../intents.md) |
| Discovery | 20260628-amadeus-theme-decomposition | なし | multi_intent の判定と最初に進める候補を定義しているため。 | [20260628-amadeus-theme-decomposition.md](../../discoveries/20260628-amadeus-theme-decomposition.md) |
| 要求 | R001 | なし | Discovery Brief 記録は後続判断の入口であるため。 | [requirements.md](requirements.md) |
| 要求 | R002 | R001 | Intent 候補は Discovery Brief を根拠に提示するため。 | [requirements.md](requirements.md) |
| ユーザーストーリー | S001 | なし | 利用者価値は Discovery Brief の確認と最初の候補選択を一連で扱うため。 | [user-stories.md](user-stories.md) |
| ユースケース | UC001 | なし | 入力テーマと判断の記録は候補確認の前提であるため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC002 | UC001 | Intent 候補の確認は記録済みの Discovery Brief を根拠に行うため。 | [use-cases.md](use-cases.md) |
| ユニット | U001 | なし | Discovery Brief 記録は独立した価値単位であるため。 | [units.md](units.md) |
| ユニット | U002 | U001 | Intent 候補提示は Discovery Brief 記録を前提にするため。 | [units.md](units.md) |
| ボルト | B001 | なし | Discovery Brief 記録を Construction Design へ渡す実施境界であるため。 | [bolts.md](bolts.md) |
| ボルト | B002 | B001 | Intent 候補提示は B001 の記録成果を前提にするため。 | [bolts.md](bolts.md) |
| 判断 | D001 | なし | Ideation の完了判断であるため。 | [decisions.md](decisions.md) |
| 判断 | D002 | D001 | Inception へ進める前提として Ideation 完了が必要であるため。 | [decisions.md](decisions.md) |
| 判断 | D003 | D002 | Inception 境界の確定後に gate 通過を判断するため。 | [decisions.md](decisions.md) |
