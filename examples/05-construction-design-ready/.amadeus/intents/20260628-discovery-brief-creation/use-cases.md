# ユースケース

## 一覧

| 識別子 | アクター | 外部システム | ストーリー | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| UC001 | ACT001 | なし | S001 | R001 | なし | [UC001-record-input-theme-and-judgement.md](use-cases/UC001-record-input-theme-and-judgement.md) |
| UC002 | ACT001 | なし | S001 | R002 | UC001 | [UC002-confirm-intent-candidates.md](use-cases/UC002-confirm-intent-candidates.md) |

## 依存関係

| ユースケース | 依存 | 理由 |
|---|---|---|
| UC001 | なし | 入力テーマと判断の記録は候補確認の前提であるため。 |
| UC002 | UC001 | Intent 候補の確認は、記録済みの入力テーマと判断を根拠に行うため。 |
