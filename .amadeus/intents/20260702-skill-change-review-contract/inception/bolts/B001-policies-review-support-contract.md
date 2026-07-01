# B001 policies レビュー支援契約本文

## 概要

`steering/policies.md` に、skill 変更のレビュー支援契約の本文を定義する。

変更種別表「skill 変更」の必須条件へ挙動差分要約と skill-forge 確認の記録を追加し、粒度制約と例外一般則を判断基準として定義する。

## 対象ユニット

- U001

## 設計

- [U001 design](../units/U001-skill-change-review-contract/design.md)

## 完了条件

- 変更種別表「skill 変更」の必須条件に、挙動差分要約（固定の3観点と自由記述の補足）の記録が含まれる。
- 必須条件に、skill-forge 確認の実施と、PR 説明の固定見出し「skill-forge 確認」への記録（確認した観点、確認結果）が含まれる。
- skill 変更 PR は skill 変更だけで構成することが既定として定義されている。
- source skill と昇格先成果物の同期は skill 変更の一部であり、常に同一 PR に含めることが読み取れる。
- 例外の判定基準として、分割するとどちらかの PR 単独で検証が fail する不可分な場合だけを許容することが定義されている。
- 例外時に理由と後続確認先を PR 説明へ記録する条件が、Git Branching Policy の例外記録と同じ型で定義されている。
- 記述が肯定形の判断基準を先に示している。

## 依存

なし。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `.amadeus/steering/policies.md` | 未確認 | なし | 未確認 |

## 未確認事項

- 必須条件セルの最終文言と、粒度制約を判断基準と禁止事項のどちらに置くかは Functional Design で確定する。
