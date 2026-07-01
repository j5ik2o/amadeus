# U002 Phase Skill Adoption Verification

## ユニット

公開 phase skill への共通規則反映と、Skill Contract、validator、evaluator との境界を扱う。

## 対象要求

- R004
- R005

## 価値境界

この Unit は、Ideation、Inception、Construction の公開 phase skill が同じ decision review 規則を参照できるようにする。

Discovery、Event Storming、Steering への初期一括適用は所有しない。

## 検証観点

- 公開 phase skill の起動時判断が同じ規則を参照している。
- `guided`、`refine`、`repair` と decision review の関係が説明されている。
- Skill Contract、validator、evaluator の責務境界が説明されている。

## 未確認事項

- evaluator の具体的な評価実装を初期 Construction に含めるかは Construction で再確認する。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-ideation/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `skills/amadeus-inception/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `.agents/skills/amadeus-ideation/SKILL.md` | 未確認 | なし | 未確認 |
| IT005 | amadeus-dlc/amadeus | `.agents/skills/amadeus-inception/SKILL.md` | 未確認 | なし | 未確認 |
| IT006 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |
| IT007 | amadeus-dlc/amadeus | `dev-scripts/evals/amadeus-templates/check.ts` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U002-phase-skill-adoption-verification/design.md)
