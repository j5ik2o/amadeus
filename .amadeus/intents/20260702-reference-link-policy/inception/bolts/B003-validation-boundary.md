# B003: 検出境界

## 概要

- 未リンク参照と permalink 条件を、validator、eval、人間判断のどれで扱うか整理する。
- fail、warning、対象外の判断基準を整理する。

## 対象ユニット

- U002

## 設計

- [U002 Unit Design](../units/U002-validation-boundary/design.md)

## 完了条件

- validator で検出する対象と対象外を読める。
- eval または人間判断に残す条件を読める。
- GitHub permalink 条件の検出対象が GitHub ファイルパスまたはコード参照に限定されていることを読める。

## 依存

- B001
- B002

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-validator/validator/AmadeusValidator.ts` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-validator/validator/AmadeusValidator.ts` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `dev-scripts/evals/amadeus-validator/check.ts` | 未確認 | なし | 未確認 |

## 未確認事項

- validator と eval の分担は Construction で確定する。
