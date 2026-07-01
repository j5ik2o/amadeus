# S001: 過去分析と学習分類 skill のレビュー

## ストーリー

Maintainer として、過去分析と学習分類の責務を `dry-run` から分離した内部 skill として確認したい。
それにより、Issue #272 を進める前に、過去成果物の読み方、学習先分類、更新しない境界、同期検証を承認できる。

## 受け入れ条件

- `amadeus-history-review` が読み取り専用の過去分析 skill として説明されている。
- `amadeus-learning-review` が学習先分類 skill として説明されている、または追加しない理由が判断に残っている。
- `dry-run` は分析結果を入力にできるが、過去分析と学習分類を所有しないことが説明されている。
- source skill と昇格先成果物の同期と検証方法が追跡できる。

## 根拠

- [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277)
- [requirements.md](../requirements.md)
- [ideation/decisions.md](../../ideation/decisions.md)

## 未確認事項

- `amadeus-learning-review` を追加しない判断に変わる場合は、代替責務をどの skill が所有するかを確認する。
