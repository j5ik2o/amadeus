# ボルト

## 一覧

| 識別子 | 概要 | ユニット | 設計 | 依存 | 詳細 |
|---|---|---|---|---|---|
| B001 | `amadeus-history-review` 内部 skill を追加する。 | U001 | [design.md](units/U001-history-review-contract/design.md) | なし | [B001-history-review-internal-skill.md](bolts/B001-history-review-internal-skill.md) |
| B002 | `amadeus-learning-review` 内部 skill を追加する。 | U002 | [design.md](units/U002-learning-review-consumer-contract/design.md) | B001 | [B002-learning-review-internal-skill.md](bolts/B002-learning-review-internal-skill.md) |
| B003 | `dry-run` consumer 境界と検証契約を整える。 | U002 | [design.md](units/U002-learning-review-consumer-contract/design.md) | B002 | [B003-dry-run-consumer-verification.md](bolts/B003-dry-run-consumer-verification.md) |

## 依存関係

| ボルト | 依存 | 理由 |
|---|---|---|
| B001 | なし | 過去分析結果が学習分類の入力になるため。 |
| B002 | B001 | `amadeus-learning-review` は `amadeus-history-review` の結果を入力にするため。 |
| B003 | B002 | `dry-run` consumer 境界と検証は、過去分析と学習分類の責務が定義されてから扱うため。 |
