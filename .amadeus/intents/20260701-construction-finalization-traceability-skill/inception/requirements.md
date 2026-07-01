# 要求

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| R001 | Construction 完了時に `Construction からの追跡` 表が必要であることを skill から判断できる。 | 採用済み | なし | [R001-construction-trace-table.md](requirements/R001-construction-trace-table.md) |
| R002 | `Construction からの追跡` 表の必須列が `ボルト`、`タスク`、`証拠`、`状態` であることを skill から判断できる。 | 採用済み | R001 | [R002-trace-table-columns.md](requirements/R002-trace-table-columns.md) |
| R003 | `Task Generation からの追跡` だけでは完了済み Construction の traceability 条件を満たさないことを skill から判断できる。 | 採用済み | R001, R002 | [R003-task-generation-insufficient.md](requirements/R003-task-generation-insufficient.md) |
| R004 | source skill と昇格先成果物が、同じ Construction finalization traceability 契約を説明している。 | 採用済み | R001, R002, R003 | [R004-source-and-promoted-skill-alignment.md](requirements/R004-source-and-promoted-skill-alignment.md) |

## 依存関係

| 要求 | 依存 | 理由 |
|---|---|---|
| R001 | なし | 完了時表要件が他の要求の前提であるため。 |
| R002 | R001 | 必須列は `Construction からの追跡` 表を前提にするため。 |
| R003 | R001, R002 | `Task Generation からの追跡` との違いは、完了時表と必須列の理解を前提にするため。 |
| R004 | R001, R002, R003 | source skill と昇格先成果物の整合は、採用する契約内容を前提にするため。 |

## 受け入れ状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 採用済み | 未登録 |
| R002 | 採用済み | 未登録 |
| R003 | 採用済み | 未登録 |
| R004 | 採用済み | 未登録 |
