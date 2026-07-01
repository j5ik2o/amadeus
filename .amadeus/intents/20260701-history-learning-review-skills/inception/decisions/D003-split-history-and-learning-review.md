# D003: history review と learning review の分割

## 背景

Issue #277 は、`.amadeus/` の過去成果物を横断分析する `amadeus-history-review` と、分析結果を学習先へ分類する `amadeus-learning-review` を候補としている。

過去分析と学習分類を同じ skill にまとめると、読み取り対象の整理と学習先分類の判断が混ざりやすい。

## 判断

Inception では、`amadeus-history-review` と `amadeus-learning-review` を分けて扱う。

`amadeus-history-review` は読み取り対象、抽出項目、根拠、分析結果を所有する。

`amadeus-learning-review` は分析結果、validator 結果、evaluator 結果、Issue、PR、CI 結果を学習先へ分類する。

## 理由

この分割により、読み取り専用の分析と、分類判断や戻り先選択を独立して検証できる。

また、Issue #272 の `dry-run` は `amadeus-history-review` または `amadeus-learning-review` の結果を入力として使えるため、`dry-run` 自体へ横断分析を詰め込まずに済む。

## 影響

Construction で `amadeus-learning-review` を追加しない判断に変わる場合は、同等責務をどこに置くかを `decisions.md` に追記する。

`amadeus-history-review` は、成果物更新、Issue 作成、Intent Record 作成、自動昇格を行わない。
