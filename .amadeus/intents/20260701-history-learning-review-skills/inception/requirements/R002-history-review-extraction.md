# R002: 過去分析結果の抽出

## 要求

- `amadeus-history-review` は、完了済み Intent から再利用できる判断を抽出できる。
- `amadeus-history-review` は、未完了 Intent から引き継ぐべき未確認事項を抽出できる。
- `amadeus-history-review` は、複数 Intent で繰り返し出る問題、前段成果物への feedback 候補、Steering knowledge 候補、Domain Map 候補、Context Map 候補、後続 Issue 候補、後続 Intent 候補、不採用の一時メモを分けて返せる。

## 受け入れ条件

- 抽出項目が skill 本文で列挙されている。
- 抽出結果が学習分類や `dry-run` の入力として渡せる粒度で説明されている。
- Domain Map と Context Map へ候補を直接載せず、候補として返すだけであることが説明されている。

## 根拠

- [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277)
- [ideation.md](../../ideation/ideation.md)
- [initial-confirmation.puml](../../ideation/mocks/initial-confirmation.puml)

## 未確認事項

- 抽出結果の保存形式を人間向け Markdown だけにするか、機械向け JSON を併用するかは Construction で確認する。
