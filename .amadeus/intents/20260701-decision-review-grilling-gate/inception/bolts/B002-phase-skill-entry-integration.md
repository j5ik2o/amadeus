# B002 Phase Skill Entry Integration

## 概要

公開 phase skill の起動時判断へ decision review 規則を反映する。

## 対象ユニット

- U002

## 設計

- [U002 design](../units/U002-phase-skill-adoption-verification/design.md)

## 完了条件

- `amadeus-ideation`、`amadeus-inception`、`amadeus-construction` が同じ decision review 規則を参照している。
- `guided`、`refine`、`repair` と decision review の関係が説明されている。
- source skill と昇格先 skill が同期している。

## 依存

- B001

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-ideation/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `skills/amadeus-inception/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `.agents/skills/amadeus-ideation/SKILL.md` | 未確認 | なし | 未確認 |
| IT005 | amadeus-dlc/amadeus | `.agents/skills/amadeus-inception/SKILL.md` | 未確認 | なし | 未確認 |
| IT006 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |

## 未確認事項

- Discovery、Event Storming、Steering への反映は初期対象外にする。
