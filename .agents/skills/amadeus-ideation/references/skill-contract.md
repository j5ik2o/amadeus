# Skill Contract: amadeus-ideation

この文書は `amadeus-contracts/catalog/**` から生成する。
直接編集せず、Catalog を更新してから `npm run contracts:generate` を実行する。

## Source Paths

- `skills/amadeus-ideation/SKILL.md`
- `.agents/skills/amadeus-ideation/SKILL.md`

## Prerequisites

- `PRE001`: 入力テーマ、Discovery Brief、または既存 Intent から Ideation 対象を特定できる。
- `PRE002`: 必要な steering layer と既存 Intent の参照先を読める。

## Invariants

- `INV001`: Ideation では Inception 以降の詳細成果物や実装を先回りして作らない。
- `INV002`: merge 操作は行わない。

## Postconditions

- `POST001`: scope、ideation、mock、traceability、decisions、state の Ideation 成果物が追跡できる。
- `POST002`: Inception へ渡す未確認事項と対象外を記録する。

## Read Boundary

### Allowed

- .amadeus/intents/**
- .amadeus/steering/**
- .amadeus/domain-map.md
- .amadeus/context-map.md
- 関連 Issue

### Prohibited

- 秘密情報
- 対象外 workspace の成果物

## Write Boundary

### Allowed

- .amadeus/intents/<intent>/ideation/**
- .amadeus/intents/<intent>/state.json

### Prohibited

- 実装コード
- Inception 成果物
- Construction 成果物
- merge 操作

## Delegation

### Allowed

- `amadeus-ideation-intent-capture`: Intent Record を作成または補修する。
- `amadeus-ideation-scope-framing`: scope を整理する。
- `amadeus-ideation-feasibility-shaping`: 実現可能性を整理する。
- `amadeus-ideation-mock-framing`: 初期 mock を整理する。
- `amadeus-ideation-traceability-finalization`: 追跡と状態を確定する。

### Order

- amadeus-ideation-intent-capture
- amadeus-ideation-scope-framing
- amadeus-ideation-feasibility-shaping
- amadeus-ideation-mock-framing
- amadeus-ideation-traceability-finalization

### Prohibited

- amadeus-construction

## Grilling Conditions

- `GR001`: scope、成果物深度、検証戦略の不足が既存成果物から解消できない場合に一問ずつ確認する。

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
