# B002: learning review internal skill

## 概要

- `amadeus-learning-review` を学習先分類の内部 skill として追加する。

## 対象ユニット

- U002

## 設計

- [U002 Unit Design](../units/U002-learning-review-consumer-contract/design.md)

## 完了条件

- `skills/amadeus-learning-review/SKILL.md` が追加されている、または追加しない理由が `decisions.md` に記録されている。
- `.agents/skills/amadeus-learning-review/SKILL.md` が必要な場合は promote-skill で追加されている。
- 学習分類、戻り先、`amadeus-grilling` 連携、phase skill 連携が説明されている。
- Issue #259 の分類と矛盾しない。
- validator の `pass` を内容承認として扱わないことが説明されている。

## 依存

- B001

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-learning-review/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-learning-review/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `dev-scripts/evals/amadeus-templates/check.ts` | 未確認 | なし | 未確認 |

## 未確認事項

- `amadeus-learning-review` を独立 skill にせず、別 skill に統合する判断になる場合は、理由と代替責務を `decisions.md` に残す。
