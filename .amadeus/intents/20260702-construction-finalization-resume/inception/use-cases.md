# ユースケース

## 一覧

| 識別子 | アクター | 外部システム | ストーリー | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| UC001 | ACT002 Agent | なし | なし | R001, R002, R004 | なし | [UC001-detect-unfinalized-intents.md](use-cases/UC001-detect-unfinalized-intents.md) |
| UC002 | ACT002 Agent | なし | なし | R001, R002, R003 | UC001 | [UC002-resume-finalization-after-merge.md](use-cases/UC002-resume-finalization-after-merge.md) |

## 依存関係

| ユースケース | 依存 | 理由 |
|---|---|---|
| UC001 | なし | 未 finalize の検出は、再開の入力になるため。 |
| UC002 | UC001 | 再開規則は、検出結果を入力証拠として使うため。 |
