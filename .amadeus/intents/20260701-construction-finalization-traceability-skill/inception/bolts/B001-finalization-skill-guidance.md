# B001: finalization skill guidance

## 概要

- Construction finalization skill guidance を更新する。

## 対象ユニット

- U001

## 設計

- [U001 Unit Design](../units/U001-finalization-skill-guidance/design.md)

## 完了条件

- `amadeus-construction` の検証説明から、完了済み Construction に `Construction からの追跡` 表が必要であることを読める。
- `amadeus-construction-traceability-finalization` の手順から、`Construction からの追跡` 表の作成または補修が必要であることを読める。
- 必須列 `ボルト`、`タスク`、`証拠`、`状態` が skill から読める。
- `Task Generation からの追跡` だけでは完了済み Construction の traceability 条件を満たさないことを読める。

## 依存

- なし

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `skills/amadeus-construction-traceability-finalization/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction-traceability-finalization/SKILL.md` | 未確認 | なし | 未確認 |

## 未確認事項

- 昇格手段と md5 記録は Construction で確定する。
