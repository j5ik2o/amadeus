# D001 Complete Ideation

## 状態

accepted。

## 背景

Issue #277 は、`.amadeus/` の過去成果物を横断分析する `amadeus-history-review` と、分析結果を学習先へ分類する `amadeus-learning-review` の追加を求めている。

Issue #259 は後段 feedback と Intent 横断の学習ループを定義したが、内部 skill 本体の新設は初期完了条件に含めなかった。
そのため、Issue #272 の `amadeus-discovery dry-run` を進める前に、過去分析と学習分類の責務を前提補修として切り出す必要がある。

## 判断

`.amadeus/` 過去分析と学習分類の内部 skill の Ideation を完了し、Inception へ進める。

この Intent では、`amadeus-history-review` と `amadeus-learning-review` を内部 skill 候補として扱う。
Inception では、2つの内部 skill を分けるか統合するか、入力、出力、副作用の禁止、`dry-run` との境界、検証観点を具体化する。

## 根拠

- [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277)
- [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259)
- [Issue #272](https://github.com/amadeus-dlc/amadeus/issues/272)
- [scope.md](../scope.md)
- [ideation.md](../ideation.md)
- [initial-confirmation.puml](../mocks/initial-confirmation.puml)

## 影響

Inception では、過去分析 skill、学習分類 skill、`dry-run` との境界、同期方針、検証観点を要求、受け入れ状態、ユースケース、Unit、Bolt へ分解する。

Construction では、必要に応じて source skill、昇格先成果物、eval または text contract、validator を更新する。

## 再確認条件

- `amadeus-history-review` と `amadeus-learning-review` を統合する判断に変わる場合。
- `amadeus-learning-review` を追加しない判断に変わる場合。
- Issue #272 の `dry-run` が過去分析を直接所有する判断に変わる場合。
- 過去分析結果を自動で成果物へ反映する要件が追加される場合。
- Domain Map または Context Map への候補抽出が、自動昇格と誤解される場合。
