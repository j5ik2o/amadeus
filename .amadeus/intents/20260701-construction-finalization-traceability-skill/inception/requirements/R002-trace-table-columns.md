# R002: 追跡表の必須列

## 要求

- Construction finalization skill は、`Construction からの追跡` 表の必須列が `ボルト`、`タスク`、`証拠`、`状態` であることを説明する。

## 受け入れ条件

- skill 説明から、必須列が `ボルト`、`タスク`、`証拠`、`状態` であることを読める。
- 表の列名が validator の既存要件と一致している。
- 必須列を満たさない表では、完了済み Construction の traceability 条件を満たさないことが分かる。

## 根拠

- [Issue #245](https://github.com/amadeus-dlc/amadeus/issues/245)
- `dev-scripts/evals/amadeus-validator/check.ts`
- [codebase-analysis.md](../codebase-analysis.md)

## 未確認事項

- 必須列の例を template に含めるかは Construction で確認する。
