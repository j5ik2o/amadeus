# R001: Construction 完了時の追跡表要件

## 要求

- Construction finalization skill は、完了済み Construction の `construction/traceability.md` に `Construction からの追跡` 表が必要であることを説明する。

## 受け入れ条件

- `amadeus-construction` または `amadeus-construction-traceability-finalization` から、完了済み Construction に `Construction からの追跡` 表が必要であることを読める。
- `Construction からの追跡` 表が、validator の既存契約を満たすための成果物要件として扱われている。
- `construction/traceability.md` の最終化手順で、表の作成または補修が漏れない。

## 根拠

- [Issue #245](https://github.com/amadeus-dlc/amadeus/issues/245)
- [PR #244](https://github.com/amadeus-dlc/amadeus/pull/244)
- [codebase-analysis.md](../codebase-analysis.md)

## 未確認事項

- 表要件を親 skill と内部 skill のどちらにどの粒度で書くかは Construction で確定する。
