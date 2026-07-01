# B001: implementation execution の実装後案内

## 概要

`amadeus-construction-implementation-execution` の `次の skill` 欄を、実装後は `amadeus-construction` を検証目的で呼ぶ案内へ更新する。

## 対象ユニット

- U001

## 設計

- [design.md](../units/U001-construction-next-skill-guidance/design.md)

## 完了条件

- 実装後の検証へ進む場合は、`amadeus-construction` を検証目的で呼ぶことを読める。
- 親 skill が `amadeus-construction-verification-hardening` に委譲することを読める。
- `amadeus-construction-verification-hardening` を直接呼ぶのは、親 skill から検証プロセスを明示的に委譲されている場合だけであることを読める。
- 実装実行 skill の成果物境界を変えていない。

## 依存

- なし

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction-implementation-execution/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction-implementation-execution/SKILL.md` | 未確認 | なし | 未確認 |

## 未確認事項

- 昇格先成果物は `dev-scripts/promote-skill.ts` で反映するか、Construction で確認する。
