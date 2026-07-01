# Business Logic Model

## 目的

`.amadeus/` の過去成果物を読み取り専用で分析し、後続の学習分類や Discovery dry-run の入力にできる分析結果を返す業務ロジックを定義する。

## 対象 Unit

U001 history-review-contract。

## 業務ロジック

| 識別子 | ロジック | 入力 | 出力 | 根拠 |
|---|---|---|---|---|
| BL001 | `.amadeus/` steering layer と Intent layer の読み取り対象を解決する。 | workspace path、対象 Intent、Issue または PR、`.amadeus/` 成果物 | 読み取り対象一覧 | R001, UC001 |
| BL002 | 過去成果物から再利用判断、未確認事項、繰り返し問題、後続候補を抽出する。 | 読み取り対象一覧、Issue #259、Issue #277 | history review result | R002, UC001 |
| BL003 | 分析結果ごとに根拠ファイルと参照箇所を残す。 | history review result、`.amadeus/` 成果物 | 根拠付き分析結果 | R001, R002 |
| BL004 | 分析結果を `amadeus-learning-review` または `amadeus-discovery dry-run` の入力として渡せる形でまとめる。 | 根拠付き分析結果 | 後続 skill 入力 | R002, UC001 |

## 入力

| 入力 | 説明 | 根拠 |
|---|---|---|
| `.amadeus/README.md`、`.amadeus/steering.md`、`.amadeus/intents.md` | steering layer と Intent layer の入口を確認する。 | R001 |
| `.amadeus/intents/**/ideation/**`、`.amadeus/intents/**/inception/**`、`.amadeus/intents/**/construction/**` | 過去の判断、要求、Bolt、Task、検証結果を分析する。 | R001, R002 |
| Issue、PR、CI 結果 | 過去成果物だけでは分からない実行時の背景を補助入力にする。 | R002 |

## 出力

| 出力 | 説明 | 利用先 |
|---|---|---|
| history review result | 再利用判断、未確認事項、繰り返し問題、後続候補を含む分析結果。 | `amadeus-learning-review`、`amadeus-discovery dry-run` |
| evidence list | 分析結果の根拠となる成果物、Issue、PR、CI 結果。 | phase skill、人間判断 |
| no side effect boundary | 更新、Issue 作成、Intent Record 作成、自動昇格を行わない境界。 | eval、review |

## 未確認事項

なし。
