# B002: verification hardening の検証後案内

## 概要

`amadeus-construction-verification-hardening` の `次の skill` 欄を、検証後は `amadeus-construction` をファイナライズ目的で呼ぶ案内へ更新する。

## 対象ユニット

- U001

## 設計

- [design.md](../units/U001-construction-next-skill-guidance/design.md)

## 完了条件

- 追跡と状態確定へ進む場合は、`amadeus-construction` をファイナライズ目的で呼ぶことを読める。
- 親 skill が `amadeus-construction-traceability-finalization` に委譲することを読める。
- `amadeus-construction-traceability-finalization` を直接呼ぶのは、親 skill からファイナライズプロセスを明示的に委譲されている場合だけであることを読める。
- `test-results.md` 作成だけでは Construction 完了ではなく、追跡と状態確定が必要であることを読める。

## 依存

- B001

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction-verification-hardening/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction-verification-hardening/SKILL.md` | 未確認 | なし | 未確認 |

## 未確認事項

- `amadeus-construction-traceability-finalization` 側の補足要否は B003 で確認する。
