# ユースケース

## 一覧

| 識別子 | アクター | 外部システム | ストーリー | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| UC001 | ACT002 Agent | なし | S001 | R001, R002 | なし | [UC001-review-amadeus-history.md](use-cases/UC001-review-amadeus-history.md) |
| UC002 | ACT002 Agent | EXT001 GitHub | S001 | R003 | UC001 | [UC002-classify-learning-action.md](use-cases/UC002-classify-learning-action.md) |
| UC003 | ACT002 Agent | EXT001 GitHub | S001 | R004, R005 | UC002 | [UC003-consume-review-results.md](use-cases/UC003-consume-review-results.md) |

## 依存関係

| ユースケース | 依存 | 理由 |
|---|---|---|
| UC001 | なし | 過去分析結果が学習分類の入力になるため。 |
| UC002 | UC001 | 学習分類は過去分析結果を入力にするため。 |
| UC003 | UC002 | `dry-run` の入力境界と検証方針は、学習分類の責務が定義されてから扱うため。 |
