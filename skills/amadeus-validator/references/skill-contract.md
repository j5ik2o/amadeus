# Skill Contract: amadeus-validator

この文書は `amadeus-contracts/catalog/**` から生成する。
直接編集せず、Catalog を更新してから `npm run contracts:generate` を実行する。

## Source Paths

- `skills/amadeus-validator/SKILL.md`
- `.agents/skills/amadeus-validator/SKILL.md`

## Prerequisites

- `PRE001`: 検証対象 workspace または Intent を指定できる。

## Invariants

- `INV001`: validator の pass は実行時参照に必要な最低限の構造条件を満たす意味であり、内容承認ではない。
- `INV002`: Domain Map と Context Map に候補を載せない。

## Postconditions

- `POST001`: 検査カテゴリごとの pass、warning、fail、blocked と不足または矛盾を報告する。

## Read Boundary

### Allowed

- .amadeus/**
- skills/amadeus-validator/validator/generated/**
- 検証対象の関連成果物

### Prohibited

- 秘密情報
- 検証対象外 workspace

## Write Boundary

### Allowed

- なし

### Prohibited

- 検証対象成果物
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

- `GR001`: validator は質問を起動せず、不足または矛盾を報告する。

## Feedback Conditions

- `FB001`: 構造検出で見つかった不足は、対象 phase skill または人間判断へ戻す。

## Consumer References

| consumer | purpose | inputs |
|---|---|---|
| `validator` | 生成物の存在、構造、参照入口を検出する。 | `generatedReferencePaths`, `prerequisites`, `invariants`, `postconditions`, `readBoundary`, `writeBoundary` |
| `evaluator` | Skill Contract と実行結果の品質評価入力にする。 | `invariants`, `postconditions`, `feedbackConditions` |
| `decision-review` | 意思決定の再確認に必要な契約条件を参照する。 | `prerequisites`, `invariants`, `postconditions`, `readBoundary`, `writeBoundary` |
| `learning-review` | 後段発見と学習候補の分類に必要な条件を参照する。 | `feedbackConditions`, `postconditions`, `consumerReferences` |
