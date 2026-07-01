# B002 development 反映と README 整合

## 概要

`development.md` の PR 準備条件から skill 変更時の追加条件を追跡できるようにし、README（英語、日本語）の skill-forge 記述と policies の整合を確認する。

## 対象ユニット

- U001

## 設計

- [U001 design](../units/U001-skill-change-review-contract/design.md)

## 完了条件

- `development.md` の PR 準備条件から、skill 変更時の追加条件（挙動差分要約、skill-forge 確認、粒度制約）へ追跡できる。
- `README.md` と `README.ja.md` の skill-forge 記述が、policies の必須条件と矛盾しない。
- README の記述を推奨のまま残すか必須へ書き換えるかの判断が、成果物または PR 説明に記録されている。
- 追加した記述が agent-instruction-rules の方針と矛盾しない。

## 依存

- B001

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `.amadeus/development.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `README.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `README.ja.md` | 未確認 | なし | 未確認 |

## 未確認事項

- なし。
