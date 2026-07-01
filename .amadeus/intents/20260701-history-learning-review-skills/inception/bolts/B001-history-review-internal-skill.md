# B001: history review internal skill

## 概要

- `amadeus-history-review` を読み取り専用の過去分析内部 skill として追加する。

## 対象ユニット

- U001

## 設計

- [U001 Unit Design](../units/U001-history-review-contract/design.md)

## 完了条件

- `skills/amadeus-history-review/SKILL.md` が追加されている。
- `.agents/skills/amadeus-history-review/SKILL.md` が promote-skill で追加されている。
- 読み取り対象、抽出項目、副作用の禁止、次の skill が説明されている。
- text contract または関連 eval が主要責務を検出できる。
- validator と必要な標準検証が pass している。

## 依存

- なし。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-history-review/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-history-review/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `dev-scripts/evals/amadeus-templates/check.ts` | 未確認 | なし | 未確認 |

## 未確認事項

- 出力形式を Markdown だけにするか、機械向け JSON を併用するかは Construction で確認する。
