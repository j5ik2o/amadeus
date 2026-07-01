# B002: 成果物適用範囲

## 概要

- template、example、traceability、decisions、既存成果物への参照リンク化方針の適用範囲を整理する。
- 内容変更と参照リンク化の境界を整理する。

## 対象ユニット

- U001

## 設計

- [U001 Unit Design](../units/U001-reference-link-contract/design.md)

## 完了条件

- source skill と昇格先成果物の更新対象を読める。
- example と既存 `.amadeus/` 成果物の扱いを読める。
- Functional Design の内容変更、Unit と Bolt の再分割、Domain Map と Context Map の採用判断変更を対象外として読める。

## 依存

- B001

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `examples/**/.amadeus` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.amadeus/intents/20260701-self-development-cycle-stage-workspace/**` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `skills/amadeus-inception/templates/intents/inception/**` | 未確認 | なし | 未確認 |

## 未確認事項

- 既存成果物の補修範囲は Construction で確定する。
