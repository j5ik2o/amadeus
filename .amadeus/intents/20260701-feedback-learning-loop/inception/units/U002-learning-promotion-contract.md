# U002: learning promotion contract

## ユニット

- Intent 横断学習の昇格先と、成果物責務の分離を扱う。

## 対象要求

- R003
- R004
- R005

## 価値境界

- この Unit は、完了済み Intent や後段発見から得た再利用可能な知識を、Steering knowledge、Domain Map、Context Map、後続 Issue、後続 Intent、不採用へ分類する。
- この Unit は、Domain Map と Context Map へ候補を直接載せず、承認済み stage 成果物から昇格した現在像だけを扱う。
- この Unit は、validator と evaluator の結果を学習候補化する条件を扱う。

## 検証観点

- Steering knowledge、Domain Map、Context Map の昇格条件が分かれている。
- `学習候補`、`traceability.md`、`decisions.md`、`.amadeus/steering/knowledge.md` の責務が分かれている。
- validator と evaluator の結果が、構造検出、品質評価、学習候補に分類されている。
- Issue #257 の decision review と分類責務が混ざっていない。

## 未確認事項

- `steering/knowledge/` 配下に専用成果物を追加するかは Construction で確定する。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-ideation/SKILL.md`, `skills/amadeus-inception/SKILL.md`, `skills/amadeus-construction/SKILL.md`, `skills/amadeus-validator/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-ideation/SKILL.md`, `.agents/skills/amadeus-inception/SKILL.md`, `.agents/skills/amadeus-construction/SKILL.md`, `.agents/skills/amadeus-validator/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `.amadeus/steering/knowledge.md`, `.amadeus/steering/knowledge/` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `dev-scripts/evals/llm-templates/check.ts`, `dev-scripts/evals/amadeus-templates/check.ts`, `dev-scripts/evals/amadeus-validator/check.ts` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U002-learning-promotion-contract/design.md)
