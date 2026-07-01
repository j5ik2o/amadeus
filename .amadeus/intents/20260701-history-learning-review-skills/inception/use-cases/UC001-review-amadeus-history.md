# UC001: `.amadeus/` の過去成果物を分析する

## システム境界

- Agent は `amadeus-history-review` を使い、`.amadeus/` の過去成果物を読む。
- `amadeus-history-review` は分析結果を返すが、成果物、Issue、Intent Record、Domain Map、Context Map、Steering knowledge を更新しない。

## 事前条件

- `.amadeus/` の steering layer と Intent layer が存在する。
- 読み取り対象の成果物が、存在する範囲で参照できる。

## 基本フロー

1. Agent は分析対象 workspace を解決する。
2. Agent は Discovery、Intent、grillings、decisions、traceability、学習候補、未確認事項、notes、test-results、pr を読む。
3. Agent は Steering knowledge、Domain Map、Context Map を読む。
4. `amadeus-history-review` は再利用判断、引き継ぐ未確認事項、繰り返し問題、前段 feedback 候補、昇格候補、後続候補、不採用メモを分けて返す。
5. Agent は分析結果を `amadeus-learning-review` または `dry-run` の入力候補として扱う。

## 代替フロー

- 対象成果物が存在しない場合、存在しない対象は読み飛ばし、分析結果に不足として記録する。
- 判断材料が足りない場合、`amadeus-history-review` は質問を実行せず、後続の `amadeus-learning-review` または phase skill に判断を渡す。

## 事後条件

- `.amadeus/` は更新されていない。
- 分析結果は、学習分類または `dry-run` の入力として説明できる。

## BCE候補

| 種別 | 候補 | 責務 |
|---|---|---|
| 境界 | history review | `.amadeus/` の過去成果物を読む入口。 |
| 制御 | history extraction | 成果物から再利用判断、未確認事項、繰り返し問題、後続候補を抽出する。 |
| エンティティ | history review result | 抽出項目、根拠、分類前の候補を保持する。 |

## 責務候補

| 候補 | 判断 | 保持 | 依頼 |
|---|---|---|---|
| `amadeus-history-review` | 読み取り対象と抽出項目を決める。 | 分析結果と根拠。 | 学習分類を `amadeus-learning-review` へ渡す。 |
