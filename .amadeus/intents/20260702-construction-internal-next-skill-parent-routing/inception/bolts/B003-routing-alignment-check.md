# B003: 次工程案内の整合確認

## 概要

source skill、昇格先成果物、周辺 Construction 内部 skill の `次の skill` 欄を確認し、親 skill 経由の継続目的と直接委譲条件が矛盾していないことを確かめる。

## 対象ユニット

- U001

## 設計

- [design.md](../units/U001-construction-next-skill-guidance/design.md)

## 完了条件

- B001 と B002 の source skill と昇格先成果物が整合している。
- `amadeus-construction-bolt-preparation`、`amadeus-construction-functional-design`、`amadeus-construction-traceability-finalization` の `次の skill` 欄を確認している。
- 周辺 skill に更新が必要な場合は、この Bolt の対象として更新または判断記録へ残している。
- validator、typecheck、diff check など、必要な検証入口を実行して結果を記録している。

## 依存

- B001
- B002

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction-bolt-preparation/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `skills/amadeus-construction-functional-design/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `skills/amadeus-construction-traceability-finalization/SKILL.md` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction-bolt-preparation/SKILL.md` | 未確認 | なし | 未確認 |
| IT005 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction-functional-design/SKILL.md` | 未確認 | なし | 未確認 |
| IT006 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction-traceability-finalization/SKILL.md` | 未確認 | なし | 未確認 |

## 未確認事項

- 周辺 skill の更新範囲は、実際の文面確認後に Construction で確定する。
