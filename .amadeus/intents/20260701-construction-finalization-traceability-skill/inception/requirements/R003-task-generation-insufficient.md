# R003: Task Generation 追跡だけでは不足することの明記

## 要求

- Construction finalization skill は、`Task Generation からの追跡` だけでは完了済み Construction の traceability 条件を満たさないことを説明する。

## 受け入れ条件

- `Task Generation からの追跡` は Task 生成と Task への追跡を扱う表であることが分かる。
- `Construction からの追跡` は完了済み Construction の証拠追跡を扱う表であることが分かる。
- finalization では両方を混同せず、完了状態に応じて `Construction からの追跡` 表を補う必要があることが分かる。

## 根拠

- [Issue #245](https://github.com/amadeus-dlc/amadeus/issues/245)
- [PR #244](https://github.com/amadeus-dlc/amadeus/pull/244)
- [codebase-analysis.md](../codebase-analysis.md)

## 未確認事項

- template の既存 `Task Generation からの追跡` と新しい完了時表を同じ template で扱うかは Construction で確認する。
