# Skill Contract: amadeus-grilling

この文書は `amadeus-contracts/catalog/**` から生成する。
直接編集せず、Catalog を更新してから `npm run contracts:generate` を実行する。

## Source Paths

- `skills/amadeus-grilling/SKILL.md`
- `.agents/skills/amadeus-grilling/SKILL.md`

## Prerequisites

- `PRE001`: 確認したい論点と、反映先候補の成果物が特定されている。

## Invariants

- `INV001`: 質問は一度に並べず、一問ずつ行う。
- `INV002`: 回答があるまで成果物を確定しない。

## Postconditions

- `POST001`: 質問、推奨回答、ユーザー回答、確定判断、反映先を記録できる。

## Read Boundary

### Allowed

- .amadeus/intents/**
- .amadeus/steering/**
- 対象 skill が渡した前提

### Prohibited

- 質問対象と無関係な成果物

## Write Boundary

### Allowed

- 親 skill が許可した grillings.md と Gxxx-*.md

### Prohibited

- 親 skill が許可していない成果物
- 実装コード
- merge 操作

## Delegation

### Allowed

- なし

### Order

- なし

### Prohibited

- 対象 skill の責務外成果物を作る skill

## Grilling Conditions

- `GR001`: 自分自身は質問実行の skill であり、対象 skill から渡された論点だけを扱う。

## Feedback Conditions

- `FB001`: 回答で新しい範囲外作業が見つかった場合は、親 skill に戻して分類する。

## Consumer References

| consumer | purpose | inputs |
|---|---|---|
| `validator` | 生成物の存在、構造、参照入口を検出する。 | `generatedReferencePaths`, `prerequisites`, `invariants`, `postconditions`, `readBoundary`, `writeBoundary` |
| `evaluator` | Skill Contract と実行結果の品質評価入力にする。 | `invariants`, `postconditions`, `feedbackConditions` |
| `decision-review` | 意思決定の再確認に必要な契約条件を参照する。 | `prerequisites`, `invariants`, `postconditions`, `readBoundary`, `writeBoundary` |
| `learning-review` | 後段発見と学習候補の分類に必要な条件を参照する。 | `feedbackConditions`, `postconditions`, `consumerReferences` |
