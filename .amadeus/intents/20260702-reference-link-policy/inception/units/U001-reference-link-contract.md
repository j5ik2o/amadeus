# U001: 参照リンク化方針契約

## ユニット

- Amadeus 成果物の参照リンク化対象、リンク先規則、適用成果物範囲を扱う。

## 対象要求

- R001
- R002
- R003

## 価値境界

- Maintainer、Agent、Reviewer が、ID、PR番号、Issue番号、ファイルパス、成果物名から根拠へ移動できる範囲を扱う。
- validator と eval で検出する境界は U002 に渡す。

## 検証観点

- 参照リンク化対象が成果物から読める。
- workspace 内成果物、GitHub ファイルパス、PR番号、Issue番号のリンク先規則が読める。
- template、example、既存成果物への適用範囲と対象外が読める。

## 未確認事項

- Business Rule と Intent Contracts の同一ファイル内アンカーを必須にする範囲は Construction で確定する。
- 既存成果物を一括補修する範囲は Construction で確定する。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction/templates/intents/construction/**` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction/templates/intents/construction/**` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `.amadeus/intents/20260701-self-development-cycle-stage-workspace/**` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U001-reference-link-contract/design.md)
