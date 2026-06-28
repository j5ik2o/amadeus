# Use Cases

## 一覧

| 識別子 | アクター | 外部システム | ストーリー | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| UC001 | ACT001 | なし | S001 | R001 | なし | [UC001-record-theme-and-decision.md](use-cases/UC001-record-theme-and-decision.md) |
| UC002 | ACT001 | なし | S002 | R002 | UC001 | [UC002-review-intent-candidates.md](use-cases/UC002-review-intent-candidates.md) |

## 依存関係

| ユースケース | 依存 | 理由 |
|---|---|---|
| UC001 | なし | 入力テーマと判定を記録する基本相互作用のため |
| UC002 | UC001 | 候補確認は記録済みの Brief を前提にするため |
