# B001: 参照リンク化規則

## 概要

- 参照リンク化対象の ID と成果物名を整理する。
- workspace 内成果物、GitHub ファイルパス、PR番号、Issue番号のリンク先規則を整理する。

## 対象ユニット

- U001

## 設計

- [U001 Unit Design](../units/U001-reference-link-contract/design.md)

## 完了条件

- 参照リンク化対象と対象外を読める。
- workspace 内成果物と GitHub URL の使い分けを読める。
- PR番号と Issue番号のリンク先規則を読める。

## 依存

- なし

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction/templates/intents/construction/**` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction/templates/intents/construction/**` | 未確認 | なし | 未確認 |

## 未確認事項

- 同一ファイル内アンカーを必須にする範囲は Construction で確定する。
