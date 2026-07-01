# U002: 検出境界

## ユニット

- 未リンク参照と GitHub permalink 条件を validator、eval、人間判断のどれで扱うかを扱う。

## 対象要求

- R004

## 価値境界

- Maintainer と Reviewer が、検出すべき未リンク参照と、人間判断に残す参照表記を分けられる範囲を扱う。
- 参照リンク化対象と適用成果物範囲は U001 に依存する。

## 検証観点

- fail、warning、対象外の判断基準が読める。
- コードブロック、例示、既にリンク済みの表記、参照先が一意でない表記の誤検出を避ける方針が読める。
- validator と eval の分担が読める。

## 未確認事項

- validator と eval の分担は Construction で確定する。
- GitHub permalink 条件をどこまで機械検出するかは Construction で確定する。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-validator/validator/AmadeusValidator.ts` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-validator/validator/AmadeusValidator.ts` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `dev-scripts/evals/amadeus-validator/check.ts` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U002-validation-boundary/design.md)
