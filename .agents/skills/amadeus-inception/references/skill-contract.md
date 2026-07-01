# Skill Contract: amadeus-inception

この文書は `amadeus-contracts/catalog/**` から生成する。
直接編集せず、Catalog を更新してから `npm run contracts:generate` を実行する。

## Source Paths

- `skills/amadeus-inception/SKILL.md`
- `.agents/skills/amadeus-inception/SKILL.md`

## Prerequisites

- `PRE001`: 対象 Intent が Ideation を完了し、state の Ideation gate が passed である。

## Invariants

- `INV001`: Inception では実装、Task、詳細な Domain Model、Intent Contracts を作らない。
- `INV002`: Unit のコンテキストは Domain Map の adopted Bounded Context を参照する。

## Postconditions

- `POST001`: requirements、acceptance、use-cases、units、bolts、traceability、decisions、state を追跡できる。

## Read Boundary

### Allowed

- .amadeus/intents/<intent>/ideation/**
- .amadeus/steering/**
- .amadeus/domain-map.md
- .amadeus/context-map.md
- 関連 Issue

### Prohibited

- Construction の実装差分を根拠にした要求改変

## Write Boundary

### Allowed

- .amadeus/intents/<intent>/inception/**
- .amadeus/intents/<intent>/state.json

### Prohibited

- 実装コード
- Construction 成果物
- merge 操作

## Delegation

### Allowed

- `amadeus-inception-codebase-analysis`: 既存コード分析を行う。
- `amadeus-inception-requirements-definition`: 要求と受け入れを定義する。
- `amadeus-inception-user-stories`: 必要な User Story を定義する。
- `amadeus-inception-use-cases`: Use Case を定義する。
- `amadeus-inception-units-generation`: Unit と Bolt を生成する。
- `amadeus-inception-traceability-finalization`: 追跡と状態を確定する。

### Order

- amadeus-inception-codebase-analysis
- amadeus-inception-requirements-definition
- amadeus-inception-user-stories
- amadeus-inception-use-cases
- amadeus-inception-units-generation
- amadeus-inception-traceability-finalization

### Prohibited

- amadeus-construction-implementation-execution

## Grilling Conditions

- `GR001`: 要求、Use Case、Unit、Bolt の判断不足が既存成果物から解消できない場合に一問ずつ確認する。

## Feedback Conditions

- `FB001`: 現在 Intent の成功条件を妨げる前段成果物の不足や矛盾は upstream_feedback_required として扱う。
- `FB002`: 現在 phase 内で解消できる事項は current_phase_update_required として扱う。
- `FB003`: 現在 Intent の成功条件に不要な改善は follow_up_issue_candidate または follow_up_intent_candidate として扱う。

## Consumer References

| consumer | purpose | inputs |
|---|---|---|
| `validator` | 生成物の存在、構造、参照入口を検出する。 | `generatedReferencePaths`, `prerequisites`, `invariants`, `postconditions`, `readBoundary`, `writeBoundary` |
| `evaluator` | Skill Contract と実行結果の品質評価入力にする。 | `invariants`, `postconditions`, `feedbackConditions` |
| `decision-review` | 意思決定の再確認に必要な契約条件を参照する。 | `prerequisites`, `invariants`, `postconditions`, `readBoundary`, `writeBoundary` |
| `learning-review` | 後段発見と学習候補の分類に必要な条件を参照する。 | `feedbackConditions`, `postconditions`, `consumerReferences` |
