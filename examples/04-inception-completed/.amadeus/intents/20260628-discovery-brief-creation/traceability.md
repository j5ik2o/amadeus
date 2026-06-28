# Inception Traceability

## 要求からの追跡

| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト | タスク |
|---|---|---|---|---|---|---|
| R001 | ACT001 | S001 | UC001 | U001 | B001 | B001/T001, B001/T002 |
| R002 | ACT001 | S002 | UC002 | U002 | B002 | B002/T001, B002/T002 |

## 背景からの追跡

| 背景 | 成果物 | 理由 |
|---|---|---|
| 大きなテーマを直接 Intent 化しない | R001, R002 | Discovery の責務境界を保つため |

## ボルトからの追跡

| ボルト | ユニット | 要求 | タスク |
|---|---|---|---|
| B001 | U001 | R001 | B001/T001, B001/T002 |
| B002 | U002 | R002 | B002/T001, B002/T002 |

## 設計からの追跡

| 設計 | ユニット | 要求 | ユースケース | ボルト | タスク |
|---|---|---|---|---|---|
| [U001 design](units/U001-discovery-brief-recording/design.md) | U001 | R001 | UC001 | B001 | B001/T001, B001/T002 |
| [U002 design](units/U002-intent-candidate-guidance/design.md) | U002 | R002 | UC002 | B002 | B002/T001, B002/T002 |

## 既存コード分析からの追跡

この Intent は例示用 greenfield として扱うため、既存コード分析は対象外です。

| 分析 | 要求 | ユースケース | ユニット | ボルト | 設計 | 入力 |
|---|---|---|---|---|---|---|

## ユニットからの追跡

| ユニット | 要求 | ユースケース | 設計 | ボルト |
|---|---|---|---|---|
| U001 | R001 | UC001 | [U001 design](units/U001-discovery-brief-recording/design.md) | B001 |
| U002 | R002 | UC002 | [U002 design](units/U002-intent-candidate-guidance/design.md) | B002 |

## ドメインモデルからの追跡

この Intent では domain model と contract は作りません。
Intent 配下の domain 成果物は、Unit と境界参照を確認するための構造 index だけです。

| 種別 | 対象 | 要求 | ユニット | 根拠 |
|---|---|---|---|---|

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| Requirement | R001 | なし | 入力記録の前提がないため | [requirements.md](requirements.md) |
| Requirement | R002 | R001 | 候補判断は入力記録を前提にするため | [requirements.md](requirements.md) |
| Story | S001 | なし | Brief 確認は単独で成立するため | [user-stories.md](user-stories.md) |
| Story | S002 | S001 | 候補選択は Brief 確認を前提にするため | [user-stories.md](user-stories.md) |
| Use Case | UC001 | なし | 入力記録の相互作用のため | [use-cases.md](use-cases.md) |
| Use Case | UC002 | UC001 | 候補確認は Brief 記録を前提にするため | [use-cases.md](use-cases.md) |
| Unit | U001 | なし | 基本記録の価値単位のため | [units.md](units.md) |
| Unit | U002 | U001 | 候補整理は基本記録を前提にするため | [units.md](units.md) |
| Bolt | B001 | なし | 基本記録の実施境界のため | [bolts.md](bolts.md) |
| Bolt | B002 | B001 | 候補整理は基本記録を前提にするため | [bolts.md](bolts.md) |
| Decision | D001 | なし | Inception の境界を固定するため | [decisions.md](decisions.md) |
