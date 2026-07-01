# 判断

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | 対象境界、実行スコープ、成果物深度、検証戦略を採用し Ideation を完了する。 | 採用 | なし | [D001-complete-ideation.md](decisions/D001-complete-ideation.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Ideation gate を通す判断であり、対象境界と scope 制御値を Inception へ渡すため。 |

## 採用した判断

- Issue #277 は、Issue #259 の学習分類契約を内部 skill として具体化する Intent として扱う。
- 依存 Intent は Issue #259 の `20260701-feedback-learning-loop` とする。
- Issue #272 は関連 Issue として扱い、`dry-run` は過去分析と学習分類を所有しない責務境界を Inception へ渡す。
- `amadeus-history-review` は読み取り専用の過去分析を担当し、成果物更新、Issue 作成、Intent Record 作成、自動昇格を行わない前提にする。
- `amadeus-learning-review` は分析結果や検証結果を学習先へ分類する責務として扱う。
- Ideation では要求、Unit、Bolt、実装を作らず、対象、対象外、未確定事項、初期モック、追跡、判断を確定する。

## 置き換えられた判断

なし。

## 再確認条件

- Inception で `amadeus-history-review` と `amadeus-learning-review` を統合する判断になった場合。
- `amadeus-learning-review` を追加しない判断になった場合。
- `dry-run` 側で過去分析を直接所有する判断に変わる場合。
- 過去分析の出力形式に機械向け JSON が必要になる場合。
- Domain Map または Context Map への候補抽出が、自動昇格と誤解される場合。
