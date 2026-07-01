# U001: Construction 内部 skill 次工程案内

## ユニット

Construction 内部 skill の `次の skill` 欄を、親 skill 経由の継続として読み取れる案内へ整理する。

## 対象要求

- R001
- R002
- R003
- R004
- R005

## 価値境界

- Agent が実装後と検証後の次工程を取り違えないことを扱う。
- Maintainer が公開入口契約、source skill、昇格先成果物の整合を確認できることを扱う。
- Construction の stage 構造や内部 skill の責務変更は扱わない。

## 検証観点

- `amadeus-construction-implementation-execution` から、親 skill 経由の検証目的を読める。
- `amadeus-construction-verification-hardening` から、親 skill 経由のファイナライズ目的を読める。
- 内部 skill 直接利用条件を読める。
- source skill と昇格先成果物の対象説明が整合している。
- 周辺の Construction 内部 skill の `次の skill` 欄を確認している。

## 未確認事項

- 周辺 skill の `次の skill` 欄を更新対象に含めるかは Construction で確定する。
- 文面検証のための決定論的テストを追加する必要があるかは Construction で確認する。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction-implementation-execution/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `skills/amadeus-construction-verification-hardening/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction-implementation-execution/SKILL.md` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction-verification-hardening/SKILL.md` | 未確認 | なし | 未確認 |
| IT005 | amadeus-dlc/amadeus | `skills/amadeus-construction-bolt-preparation/SKILL.md` | 未確認 | なし | 未確認 |
| IT006 | amadeus-dlc/amadeus | `skills/amadeus-construction-functional-design/SKILL.md` | 未確認 | なし | 未確認 |
| IT007 | amadeus-dlc/amadeus | `skills/amadeus-construction-traceability-finalization/SKILL.md` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U001-construction-next-skill-guidance/design.md)
