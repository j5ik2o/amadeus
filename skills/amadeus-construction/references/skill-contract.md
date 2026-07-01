# Skill Contract: amadeus-construction

この文書は `amadeus-contracts/catalog/**` から生成する。
直接編集せず、Catalog を更新してから `npm run contracts:generate` を実行する。

## Source Paths

- `skills/amadeus-construction/SKILL.md`
- `.agents/skills/amadeus-construction/SKILL.md`

## Prerequisites

- `PRE001`: 対象 Intent が Inception を完了し、state の Inception gate が passed である。
- `PRE002`: 対象 Bolt と対象 Unit を Inception 成果物または state から解決できる。

## Invariants

- `INV001`: 親 skill は成果物や実装を直接扱わず、内部 skill に委譲する。
- `INV002`: PR URL がない状態で pr.md を作らない。
- `INV003`: merge 操作は行わない。

## Postconditions

- `POST001`: Functional Design、Task、実装、検証、traceability、decisions、state が追跡できる。

## Read Boundary

### Allowed

- .amadeus/intents/<intent>/inception/**
- .amadeus/intents/<intent>/construction/**
- 対象実装コード
- 対象テストコード
- 関連 Issue/PR

### Prohibited

- 対象外 Intent の成果物を根拠にした実装変更

## Write Boundary

### Allowed

- .amadeus/intents/<intent>/construction/**
- .amadeus/intents/<intent>/state.json
- 対象 Task に対応する実装コード
- 対象 Task に対応するテストコード

### Prohibited

- Spec 成果物
- Bolt 側 design.md
- merge 操作

## Delegation

### Allowed

- `amadeus-construction-functional-design`: Functional Design を作成する。
- `amadeus-construction-bolt-preparation`: Task と notes を作成する。
- `amadeus-construction-implementation-execution`: Task に対応する実装を行う。
- `amadeus-construction-verification-hardening`: 検証と test-results を作成する。
- `amadeus-construction-traceability-finalization`: 追跡と状態を確定する。

### Order

- amadeus-construction-functional-design
- amadeus-construction-bolt-preparation
- amadeus-construction-implementation-execution
- amadeus-construction-verification-hardening
- amadeus-construction-traceability-finalization

### Prohibited

- amadeus-inception-requirements-definition

## Grilling Conditions

- `GR001`: Construction の対象 Bolt、検証入口、実装範囲が成果物から確定できない場合に一問ずつ確認する。

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
