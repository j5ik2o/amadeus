# 追跡

## 要求からの追跡

| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト |
|---|---|---|---|---|---|
| R001 | Amadeus 利用者 | S001 | UC001 | U001 | B001 |
| R002 | Amadeus 利用者 | S001 | UC002 | U002 | B002 |

## 背景からの追跡

| 目的 | アクター | 外部システム | 要求 |
|---|---|---|---|
| 大きな入力テーマを Discovery Brief として整理できるようにする | Amadeus 利用者 | なし | R001 |
| 最初に Intent 化する候補を1件に絞れるようにする | Amadeus 利用者 | なし | R002 |

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

## 既存コード分析からの追跡

この Intent は例示 workspace の Inception 成果物を作る。
既存コードに載せる実装変更ではないため、`codebase-analysis.md` は作成しない。

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
| サブドメイン | SD001 Amadeus 利用支援 | R001, R002 | UC001, UC002 | [../../domain/subdomains.md](../../domain/subdomains.md) |
| 境界づけられたコンテキスト | BC001 Discovery 支援 | R001, R002 | UC001, UC002 | [domain/bounded-contexts.md](domain/bounded-contexts.md) |

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | Inception での扱い |
|---|---|---|---|
| Intent | 20260628-discovery-brief-creation | [intent.md](intent.md) | R001 と R002 の上位目的として扱う。 |
| Scope | Discovery Brief 記録と Intent 候補提示 | [scope.md](scope.md) | Requirement、Story、Use Case、Unit、Bolt の対象範囲にする。 |
| 実現可能性 | Discovery Brief の既存例示を前提に成立する | [ideation.md](ideation.md) | 要求と受け入れ状態の根拠にする。 |
| 初期モック | Discovery Brief 確認カード | [mocks/initial-confirmation.puml](mocks/initial-confirmation.puml) | R002 と UC002 の確認観点にする。 |
| 状態 | Ideation completed | [state.json](state.json) | gate passed の前提として Inception へ引き継ぐ。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260628-discovery-brief-creation | なし | Discovery Brief の最初の候補として単独で成立するため。 | [../../intents.md](../../intents.md) |
| Discovery | 20260628-amadeus-theme-decomposition | なし | この Intent は Discovery Brief の最初の Intent 候補として作成済みであるため。 | [../../discoveries/20260628-amadeus-theme-decomposition/brief.md](../../discoveries/20260628-amadeus-theme-decomposition/brief.md) |
| 要求 | R001 | なし | Discovery Brief の記録が候補提示の前提になるため。 | [requirements.md](requirements.md) |
| 要求 | R002 | R001 | Intent 候補は Discovery Brief に記録された判断を根拠に提示するため。 | [requirements.md](requirements.md) |
| ユーザーストーリー | S001 | なし | Discovery Brief 確認から最初の候補選択までを一続きの価値として扱うため。 | [user-stories.md](user-stories.md) |
| ユースケース | UC001 | なし | Discovery Brief の記録が最初の相互作用であるため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC002 | UC001 | Intent 候補確認は記録済みの Discovery Brief を前提にするため。 | [use-cases.md](use-cases.md) |
| ユニット | U001 | なし | Discovery Brief 記録は単独の価値境界であるため。 | [units.md](units.md) |
| ユニット | U002 | U001 | Intent 候補提示は Discovery Brief 記録を入力にするため。 | [units.md](units.md) |
| ボルト | B001 | なし | Discovery Brief 記録を先に成立させる必要があるため。 | [bolts.md](bolts.md) |
| ボルト | B002 | B001 | Intent 候補提示は記録済みの Discovery Brief を入力にするため。 | [bolts.md](bolts.md) |
