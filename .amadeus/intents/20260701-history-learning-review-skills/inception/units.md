# ユニット

## 一覧

| 識別子 | 概要 | 要求 | コンテキスト | 依存 | 詳細 |
|---|---|---|---|---|---|
| U001 | `amadeus-history-review` の読み取り専用分析契約を定義する。 | R001, R002 | BC001 | なし | [U001-history-review-contract.md](units/U001-history-review-contract.md) |
| U002 | `amadeus-learning-review` と `dry-run` consumer 境界、同期検証を定義する。 | R003, R004, R005 | BC001 | U001 | [U002-learning-review-consumer-contract.md](units/U002-learning-review-consumer-contract.md) |

Unit の `コンテキスト` は Domain Map の `adopted` Bounded Context、または Inception で採用判断する境界候補を記録する。
この Intent では、既存の `BC001 自己開発運用` を参照する。

## 依存関係

| ユニット | 依存 | 理由 |
|---|---|---|
| U001 | なし | 過去分析結果が後続分類の入力になるため。 |
| U002 | U001 | 学習分類と `dry-run` 境界は、過去分析結果を入力にするため。 |
