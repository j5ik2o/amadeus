# D003: dry-run consumer boundary

## 背景

Issue #272 は `amadeus-discovery dry-run` の候補表示を扱う。
ただし Issue #272 の前提として、過去分析と学習分類の入力境界が必要である。

## 判断

この Intent では `amadeus-discovery` に consumer 境界だけを追記し、`dry-run` 本体の実行モードや候補表示は Issue #272 に残す。

## 理由

Issue #277 の目的は、過去分析と学習分類の内部 skill 候補を成立させることである。
`dry-run` 本体まで実装すると、Issue #272 の成功条件と混ざる。

## 影響

`amadeus-discovery` は `amadeus-history-review` と `amadeus-learning-review` の結果を入力にできる。
一方で、過去分析と学習分類そのものは所有しない。
