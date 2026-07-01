# Business Rules

## 目的

`amadeus-history-review` が過去分析だけを扱い、成果物更新や学習先分類へ責務を広げないための規則を定義する。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | `amadeus-history-review` は `.amadeus/` 成果物を読み取り専用で分析する。 | R001, UC001 | accepted |
| BR002 | 抽出結果は、再利用判断、未確認事項、繰り返し問題、前段 feedback 候補、昇格候補、後続 Issue 候補、後続 Intent 候補、不採用メモに分ける。 | R002 | accepted |
| BR003 | `amadeus-history-review` は学習先分類の最終判断をせず、必要に応じて `amadeus-learning-review` へ渡す。 | R002, R003 | accepted |
| BR004 | Domain Map と Context Map へ自動昇格しない。採用判断が必要な内容は後続の人間判断または phase skill へ渡す。 | R002 | accepted |
| BR005 | GitHub Issue、Intent Record、PR、成果物更新は作成しない。 | R001, R002 | accepted |

## 例外

| 条件 | 扱い | 根拠 |
|---|---|---|
| 読み取り対象が大きすぎる。 | 対象 Intent または期間で絞り込み、未確認事項へ残す。 | R001 |
| 分析結果から学習先判断が必要になった。 | `amadeus-learning-review` の入力にする。 | R003 |
| `dry-run` 表示が必要になった。 | `amadeus-discovery dry-run` の consumer 入力として渡す。 | R004 |

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | `.amadeus/` の steering layer または Intent layer が存在する。 | R001 | accepted |
| INV001 | 不変条件 | `amadeus-history-review` は成果物を更新しない。 | R001 | accepted |
| INV002 | 不変条件 | `amadeus-history-review` は GitHub Issue を作成しない。 | R002 | accepted |
| INV003 | 不変条件 | `amadeus-history-review` は Intent Record を作成しない。 | R002 | accepted |
| INV004 | 不変条件 | `amadeus-history-review` は Domain Map と Context Map へ自動昇格しない。 | R002 | accepted |
| POST001 | 事後条件 | 分析結果と根拠が返る。 | R001, R002 | accepted |

## 未確認事項

なし。
