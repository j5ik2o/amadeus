# Domain Entities

## 目的

過去分析で扱う概念を定義する。

Functional Design は詳細な Domain Model と Intent Contracts の管理元である。

## Domain Entity

| 識別子 | 名前 | 責務 | 関連 |
|---|---|---|---|
| DE001 | History Review Input | 読み取り対象の workspace、Intent、Issue、PR、CI 結果を表す。 | DE002 |
| DE002 | History Artifact | `.amadeus/` の steering layer と Intent layer の成果物を表す。 | DE001, DE003 |
| DE003 | History Finding | 再利用判断、未確認事項、繰り返し問題、後続候補などの抽出結果を表す。 | DE002, DE004 |
| DE004 | History Review Result | 複数の History Finding と根拠をまとめた後続 skill 入力を表す。 | DE003 |
| DE005 | No Side Effect Boundary | 更新、Issue 作成、Intent Record 作成、自動昇格を行わない境界を表す。 | DE004 |

## 関係

History Review Input は History Artifact を解決する。
History Artifact は History Finding の根拠になる。
History Review Result は History Finding と根拠をまとめ、`amadeus-learning-review` または `amadeus-discovery dry-run` の入力になる。
No Side Effect Boundary は `amadeus-history-review` の実行中に守る不変条件である。

## Domain Map と Context Map への反映候補

| 対象 | 種別 | 候補内容 | 承認後の扱い | 根拠 |
|---|---|---|---|---|
| なし | なし | 新しい Bounded Context やコンテキスト間依存は追加しない。 | Domain Map と Context Map は更新しない。 | U001 は BC001 内の自己開発運用を扱うため。 |

## 未確認事項

なし。
