# 追跡

## 要求からの追跡

| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト |
|---|---|---|---|---|---|
| R001 | ACT002 Agent | S001 | UC001 | U001 | B001 |
| R002 | ACT002 Agent, ACT001 Maintainer | S001 | UC001, UC002 | U001 | B001 |
| R003 | ACT002 Agent, ACT001 Maintainer | S001 | UC002 | U001 | B001 |
| R004 | ACT002 Agent, ACT003 Validator, ACT004 Evaluator | S001 | UC003 | U002 | B002 |
| R005 | ACT002 Agent, ACT003 Validator, ACT004 Evaluator | S001 | UC001, UC003 | U002 | B003 |

## 対象境界からの追跡

| 対象境界 | 要求 | ユーザーストーリー | ユースケース | ユニット | ボルト | 扱い |
|---|---|---|---|---|---|---|
| SC-IN-001 | R001 | S001 | UC001 | U001 | B001 | decision tree 再評価を Inception の対象として扱う。 |
| SC-IN-002 | R002 | S001 | UC001, UC002 | U001 | B001 | 不明瞭ノードの分岐分類を Inception の対象として扱う。 |
| SC-IN-003 | R003 | S001 | UC002 | U001 | B001 | grilling handoff 契約を Inception の対象として扱う。 |
| SC-IN-004 | R005 | S001 | UC001, UC003 | U002 | B003 | validator と decision review の責務境界を Inception の対象として扱う。 |
| SC-IN-005 | R004 | S001 | UC003 | U002 | B002 | 公開 phase skill の共通規則参照を Inception の対象として扱う。 |
| SC-IN-006 | R001, R005 | S001 | UC001, UC003 | U001, U002 | B001, B003 | Skill Contract と既存成果物を入力証拠として扱う。 |

## 背景からの追跡

| 背景 | 追跡先 | 根拠 |
|---|---|---|
| Issue #257 | R001, R002, R003, R004, R005 | decision review と grilling gate の必要性を示す入力であるため。 |
| 既存 Ideation の scope | SC-IN-001 から SC-IN-006 | Inception の要求境界を Ideation の採用境界から引き継ぐため。 |
| 既存 Skill Contract catalog | R001, R005 | decision review の入力証拠と検証境界を扱うため。 |
| 既存 phase skill | R004 | Ideation、Inception、Construction へ同じ判断規則を反映するため。 |

## ボルトからの追跡

| ボルト | ユニット | 要求 | 受け入れ状態 | Construction での主な成果 |
|---|---|---|---|---|
| B001 | U001 | R001, R002, R003 | A001, A002, A003 | `amadeus-decision-review` の内部 skill 契約候補と handoff 契約を定義する。 |
| B002 | U002 | R004 | A004 | 公開 phase skill の起動時判断へ共通規則を反映する。 |
| B003 | U001, U002 | R005 | A005 | Skill Contract、validator、evaluator、eval の責務境界を確認する。 |

## 設計からの追跡

| 設計 | ユニット | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| [design.md](units/U001-decision-review-gate-contract/design.md) | U001 | R001, R002, R003 | UC001, UC002 | B001, B003 |
| [design.md](units/U002-phase-skill-adoption-verification/design.md) | U002 | R004, R005 | UC001, UC003 | B002, B003 |

## 既存コード分析からの追跡

| 分析 | 要求 | ユースケース | ユニット | ボルト | 設計 | 入力 |
|---|---|---|---|---|---|---|
| [codebase-analysis.md](codebase-analysis.md) | R001 | UC001 | U001 | B001 | [design.md](units/U001-decision-review-gate-contract/design.md) | phase skill 起動時の共通 decision tree 再評価がない。 |
| [codebase-analysis.md](codebase-analysis.md) | R002 | UC001, UC002 | U001 | B001 | [design.md](units/U001-decision-review-gate-contract/design.md) | 不明瞭ノードの分類が標準化されていない。 |
| [codebase-analysis.md](codebase-analysis.md) | R003 | UC002 | U001 | B001 | [design.md](units/U001-decision-review-gate-contract/design.md) | `amadeus-grilling` への handoff 契約がない。 |
| [codebase-analysis.md](codebase-analysis.md) | R004 | UC003 | U002 | B002 | [design.md](units/U002-phase-skill-adoption-verification/design.md) | phase skill へ共通規則を反映する実行順序がない。 |
| [codebase-analysis.md](codebase-analysis.md) | R005 | UC001, UC003 | U002 | B003 | [design.md](units/U002-phase-skill-adoption-verification/design.md) | validator、evaluator、Skill Contract との境界が明文化されていない。 |

## ユニットからの追跡

| ユニット | コンテキスト | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| U001 | BC001 | R001, R002, R003 | UC001, UC002 | B001, B003 |
| U002 | BC001 | R004, R005 | UC001, UC003 | B002, B003 |

## ドメインモデルからの追跡

| 種別 | 対象 | 要求 | ユースケース | 定義元 |
|---|---|---|---|---|
| サブドメイン | SD001 自己開発運用 | R001, R002, R003, R004, R005 | UC001, UC002, UC003 | [domain-map.md](../../../domain-map.md) |
| 境界づけられたコンテキスト | BC001 自己開発運用 | R001, R002, R003, R004, R005 | UC001, UC002, UC003 | [domain-map.md](../../../domain-map.md) |

Inception では詳細な Domain Model を作らない。
Domain Map と Context Map は、採用済みの Bounded Context と依存関係の参照元として使う。

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| 要求 | R001 | なし | 入力証拠と判断ノードの再評価が、すべての分岐判断の前提であるため。 | [requirements.md](requirements.md) |
| 要求 | R002 | R001 | 分岐分類は、再評価された判断ノードを入力にするため。 | [requirements.md](requirements.md) |
| 要求 | R003 | R002 | grilling handoff は、分岐分類で `grill_required` になった場合だけ必要になるため。 | [requirements.md](requirements.md) |
| 要求 | R004 | R001, R002, R003 | 公開 phase skill の共通規則は、再評価、分岐、grilling handoff を前提にするため。 | [requirements.md](requirements.md) |
| 要求 | R005 | R001, R002 | validator、evaluator、Skill Contract との境界は、入力証拠と分岐結果の扱いを前提にするため。 | [requirements.md](requirements.md) |
| ユーザーストーリー | S001 | なし | Maintainer が decision review gate をレビューできる価値を表すため。 | [user-stories.md](user-stories.md) |
| ユースケース | UC001 | なし | decision tree 再評価が後続分岐の前提であるため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC002 | UC001 | grilling handoff と route は、再評価結果を入力にするため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC003 | UC001, UC002 | phase skill 反映は、再評価と分岐契約を前提にするため。 | [use-cases.md](use-cases.md) |
| ユニット | U001 | なし | decision review の判断ゲート契約が全体の前提であるため。 | [units.md](units.md) |
| ユニット | U002 | U001 | 公開 phase skill 反映と検証境界は、判断ゲート契約を前提にするため。 | [units.md](units.md) |
| ボルト | B001 | なし | decision review の内部契約が後続反映の前提であるため。 | [bolts.md](bolts.md) |
| ボルト | B002 | B001 | 公開 phase skill 反映は、内部契約を入力にするため。 | [bolts.md](bolts.md) |
| ボルト | B003 | B001, B002 | 検証境界の確認は、内部契約と phase skill 反映の両方を前提にするため。 | [bolts.md](bolts.md) |
| 判断 | D001 | なし | Inception の所有境界を固定するため。 | [decisions.md](decisions.md) |
| 判断 | D002 | D001 | BC001 を採用して Unit のコンテキストを確定するため。 | [decisions.md](decisions.md) |
| 判断 | D003 | D001, D002 | decision review の共有単位を固定するため。 | [decisions.md](decisions.md) |
| 判断 | D004 | D001, D002, D003 | Unit と Bolt の粒度を固定するため。 | [decisions.md](decisions.md) |
| Context Map | BC001 | なし | 採用済みまたは廃止済みのコンテキスト間依存は存在しないため。 | [context-map.md](../../../context-map.md) |

## Inception Gate

| 観点 | 状態 | 根拠 |
|---|---|---|
| 要求追跡 | passed | R001 から R005 までを use case、unit、bolt に対応付けた。 |
| 対象境界追跡 | passed | SC-IN-001 から SC-IN-006 までを要求と bolt に対応付けた。 |
| ドメイン参照 | passed | Unit の context は Domain Map の adopted Bounded Context である BC001 を参照する。 |
| 依存関係 | passed | Unit と Bolt の依存を明示し、Context Map に未登録依存がないことを確認した。 |
