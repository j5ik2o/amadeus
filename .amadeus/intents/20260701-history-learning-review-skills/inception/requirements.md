# 要求

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| R001 | `.amadeus/` 過去成果物を読み取り専用で横断分析できる。 | 採用済み | なし | [R001-history-review-readonly-analysis.md](requirements/R001-history-review-readonly-analysis.md) |
| R002 | 過去分析結果として再利用判断、未確認事項、繰り返し問題、後続候補を抽出できる。 | 採用済み | R001 | [R002-history-review-extraction.md](requirements/R002-history-review-extraction.md) |
| R003 | 過去分析結果、検証結果、Issue、PR、CI 結果を学習先へ分類できる。 | 採用済み | R002 | [R003-learning-review-classification.md](requirements/R003-learning-review-classification.md) |
| R004 | `amadeus-discovery dry-run` が分析結果を入力にできるが、過去分析と学習分類を所有しない。 | 採用済み | R002, R003 | [R004-dry-run-consumer-boundary.md](requirements/R004-dry-run-consumer-boundary.md) |
| R005 | source skill、昇格先成果物、eval または text contract の同期と検証を追跡できる。 | 採用済み | R001, R003 | [R005-skill-sync-verification.md](requirements/R005-skill-sync-verification.md) |

## 依存関係

| 要求 | 依存 | 理由 |
|---|---|---|
| R001 | なし | 過去分析 skill の読み取り専用境界が最初の前提になるため。 |
| R002 | R001 | 抽出結果は、読み取り対象と副作用禁止が定義されてから扱えるため。 |
| R003 | R002 | 学習分類は、過去分析結果を入力にするため。 |
| R004 | R002, R003 | `dry-run` は過去分析結果と学習分類結果を入力として参照するため。 |
| R005 | R001, R003 | 追加する内部 skill と分類契約を source skill と昇格先成果物で同期する必要があるため。 |

## 受け入れ状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 充足済み | [B001 test-results](../construction/bolts/B001-history-review-internal-skill/test-results.md) |
| R002 | 充足済み | [B001 test-results](../construction/bolts/B001-history-review-internal-skill/test-results.md) |
| R003 | 充足済み | [B002 test-results](../construction/bolts/B002-learning-review-internal-skill/test-results.md) |
| R004 | 充足済み | [B003 test-results](../construction/bolts/B003-dry-run-consumer-verification/test-results.md) |
| R005 | 充足済み | [Construction 追跡](../construction/traceability.md) |
