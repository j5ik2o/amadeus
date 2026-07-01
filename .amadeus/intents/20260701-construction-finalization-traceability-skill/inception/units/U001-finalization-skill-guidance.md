# U001: finalization skill guidance

## ユニット

- Construction finalization skill の追跡表 guidance を扱う。

## 対象要求

- R001
- R002
- R003

## 価値境界

- 完了済み Construction の `traceability.md` に必要な表要件を、agent が skill から判断できる状態にする。
- `Construction からの追跡` と `Task Generation からの追跡` の役割差を説明する。
- validator の成果物契約は変更しない。

## 検証観点

- skill 説明に `Construction からの追跡` 表要件がある。
- 必須列 `ボルト`、`タスク`、`証拠`、`状態` が説明されている。
- `Task Generation からの追跡` だけでは完了済み Construction の条件を満たさないことが説明されている。

## 未確認事項

- 親 skill と内部 skill のどちらにどの粒度で重複なく書くかは Construction で確定する。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `skills/amadeus-construction-traceability-finalization/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction-traceability-finalization/SKILL.md` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U001-finalization-skill-guidance/design.md)
