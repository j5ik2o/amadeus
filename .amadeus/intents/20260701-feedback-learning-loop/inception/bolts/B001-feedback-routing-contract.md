# B001: feedback routing contract

## 概要

- 前段 feedback routing 契約を phase skill に定義する。

## 対象ユニット

- U001

## 設計

- [U001 Unit Design](../units/U001-feedback-routing-contract/design.md)

## 完了条件

- 後段 phase が前段成果物へ戻る条件が説明されている。
- 前段成果物へ戻す場合に使う phase skill または内部 stage skill の判断軸が説明されている。
- 現在 phase 内の補修、後続 Issue 候補、後続 Intent 候補、不採用との違いが説明されている。
- Issue #257 の decision review は質問起動条件、この Bolt は分類先として責務を分けている。
- source skill と昇格先 skill の必要範囲が同期されている。
- 関連 eval または検証で、契約の存在と主要分類を確認できる。

## 依存

- なし

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-ideation/SKILL.md`, `skills/amadeus-inception/SKILL.md`, `skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-ideation/SKILL.md`, `.agents/skills/amadeus-inception/SKILL.md`, `.agents/skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `dev-scripts/evals/llm-templates/check.ts`, `dev-scripts/evals/amadeus-templates/check.ts` | 未確認 | なし | 未確認 |

## 未確認事項

- `amadeus-construction` の内部 stage skill へどこまで共通契約を直接書くかは、Construction で差分規模を見て確定する。
