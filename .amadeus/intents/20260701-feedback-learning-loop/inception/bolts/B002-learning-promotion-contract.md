# B002: learning promotion contract

## 概要

- Intent 横断 learning promotion 契約と成果物責務を定義する。

## 対象ユニット

- U002

## 設計

- [U002 Unit Design](../units/U002-learning-promotion-contract/design.md)

## 完了条件

- Steering knowledge、Domain Map、Context Map、後続 Issue、後続 Intent、不採用への分類条件が説明されている。
- `学習候補`、`traceability.md`、`decisions.md`、`.amadeus/steering/knowledge.md` の責務差が説明されている。
- validator と evaluator の結果を、構造検出、品質評価、学習候補に分類する条件が説明されている。
- Domain Map と Context Map には候補を載せない制約が維持されている。
- source skill、昇格先 skill、steering knowledge、必要な eval が矛盾しない。

## 依存

- B001

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-ideation/SKILL.md`, `skills/amadeus-inception/SKILL.md`, `skills/amadeus-construction/SKILL.md`, `skills/amadeus-validator/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-ideation/SKILL.md`, `.agents/skills/amadeus-inception/SKILL.md`, `.agents/skills/amadeus-construction/SKILL.md`, `.agents/skills/amadeus-validator/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `.amadeus/steering/knowledge.md`, `.amadeus/steering/knowledge/` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `dev-scripts/evals/llm-templates/check.ts`, `dev-scripts/evals/amadeus-templates/check.ts`, `dev-scripts/evals/amadeus-validator/check.ts` | 未確認 | なし | 未確認 |

## 未確認事項

- `steering/knowledge/` 配下に専用成果物を追加するかは、Construction で確定する。
- `amadeus-learning-review` または `amadeus-feedback-review` の新設は、この Bolt の初期完了条件には含めず、重複が大きい場合の後続 Issue 候補にする。
