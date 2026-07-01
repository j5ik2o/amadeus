# ユースケース

## 一覧

| 識別子 | アクター | 外部システム | ストーリー | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| UC001 | ACT002 Agent | EXT001 GitHub | S001 | R001, R002, R003 | なし | [UC001-create-skill-change-pr.md](use-cases/UC001-create-skill-change-pr.md) |
| UC002 | ACT003 Reviewer | EXT001 GitHub | S001 | R001, R002, R003, R004 | UC001 | [UC002-review-skill-change-pr.md](use-cases/UC002-review-skill-change-pr.md) |
| UC003 | ACT001 Maintainer | EXT001 GitHub | S002 | R003 | UC001 | [UC003-approve-granularity-exception.md](use-cases/UC003-approve-granularity-exception.md) |

## 依存関係

| ユースケース | 依存 | 理由 |
|---|---|---|
| UC001 | なし | 記録の作成はレビューと承認の前提になるため。 |
| UC002 | UC001 | レビューは、記録された PR 説明を入力にするため。 |
| UC003 | UC001 | 例外承認は、例外の理由と後続確認先の記録を入力にするため。 |
