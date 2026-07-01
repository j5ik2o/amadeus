# Business Logic Model

## 目的

過去分析結果、validator 結果、evaluator 結果、Issue、PR、CI 結果を学習先へ分類し、phase skill、`amadeus-grilling`、後続 Issue、後続 Intent、Discovery dry-run へ渡す業務ロジックを定義する。

## 対象 Unit

U002 learning-review-consumer-contract。

## 業務ロジック

| 識別子 | ロジック | 入力 | 出力 | 根拠 |
|---|---|---|---|---|
| BL001 | `amadeus-history-review` の分析結果と検証結果を学習分類入力として受け取る。 | history review result、validator 結果、evaluator 結果、Issue、PR、CI 結果 | learning review input | R003, UC002 |
| BL002 | 入力証拠を学習分類へ振り分ける。 | learning review input、Issue #259 の分類契約 | learning classification | R003, UC002 |
| BL003 | 分類ごとに戻り先、質問要否、後続候補を説明する。 | learning classification | routing result | R003, UC002 |
| BL004 | `amadeus-discovery dry-run` が分析結果を入力にできる consumer 境界を説明する。 | history review result、learning classification | dry-run consumer boundary | R004, UC003 |
| BL005 | source skill、昇格先成果物、eval 契約の同期を検証証拠として扱う。 | source skill、promoted skill、text contract | skill sync evidence | R005, UC003 |

## 入力

| 入力 | 説明 | 根拠 |
|---|---|---|
| history review result | 過去成果物の分析結果。 | R003 |
| validator 結果、evaluator 結果 | 構造検出と品質評価の結果。 | R003 |
| Issue、PR、CI 結果 | 実行時に発見された問題やレビュー結果。 | R003 |
| Skill Contract | phase skill へ戻す条件や境界を確認する。 | R003, R005 |

## 出力

| 出力 | 説明 | 利用先 |
|---|---|---|
| learning classification | `current_phase_update_required` などの分類結果。 | phase skill、人間判断 |
| routing result | 戻り先、質問候補、後続 Issue 候補、後続 Intent 候補。 | `amadeus-grilling`、phase skill |
| dry-run consumer boundary | `amadeus-discovery dry-run` が入力として扱える範囲。 | `amadeus-discovery` |
| skill sync evidence | source skill、昇格先成果物、eval 契約の同期証拠。 | Construction 検証 |

## 未確認事項

なし。
