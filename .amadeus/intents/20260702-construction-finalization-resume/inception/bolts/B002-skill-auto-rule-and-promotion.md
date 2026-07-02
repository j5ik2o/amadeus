# B002 skill 再開規則と昇格同期

## 概要

`amadeus-construction` の auto 判定表に再開規則の行を追加し、Decision Review の入力証拠に検出スクリプトの結果を加え、promote で昇格先を同期する。

## 対象ユニット

- U001

## 設計

- [U001 design](../units/U001-finalization-resume-contract/design.md)

## 完了条件

- auto 判定表に「対象 Bolt が実装済みかつ検証済みで、`pr.md` がなく `construction.gate` が `passed` でない（基準 branch 由来の checkout）→ finalization を選ぶ」行が追加されている。
- 追加行の条件が、既存の refine と repair の行と排他的に読める。
- Decision Review の入力証拠の列挙に、同梱スクリプトの検出結果が追加されている。
- 昇格は `dev-scripts/promote-skill.ts` を使い、source と昇格先が同期している。
- skill 変更 PR がレビュー支援契約（挙動差分要約、固定見出し「skill-forge 確認」、粒度制約）に従っている。検出スクリプトは skill の一部であり、本文と同一 PR に含める。

## 依存

- B001

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction/**` | 未確認 | なし | 未確認 |

## 未確認事項

- なし。
