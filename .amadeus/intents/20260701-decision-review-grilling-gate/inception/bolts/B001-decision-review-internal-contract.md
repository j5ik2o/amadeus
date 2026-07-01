# B001 Decision Review Internal Contract

## 概要

decision review の内部 skill 契約を定義する。

## 対象ユニット

- U001

## 設計

- [U001 design](../units/U001-decision-review-gate-contract/design.md)

## 完了条件

- `amadeus-decision-review` を内部 skill として扱う契約が定義されている。
- 入力証拠、判断ノード、outcome、grilling handoff が説明されている。
- decision review 自体は質問しないことが明記されている。

## 依存

- なし。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-decision-review/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-decision-review/SKILL.md` | 未確認 | なし | 未確認 |

## 未確認事項

- 内部 skill として新設せず公開 phase skill の共通節だけで扱う場合は、Construction でこの Bolt の実装対象を見直す。
