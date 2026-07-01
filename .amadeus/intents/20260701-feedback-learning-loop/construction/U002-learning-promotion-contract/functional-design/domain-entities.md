# Domain Entities

## 目的

Intent 横断学習の昇格判断と成果物責務を表す概念を定義する。

Functional Design は詳細な Domain Model と Intent Contracts の管理元である。

## Domain Entity

| 識別子 | 名前 | 責務 | 関連 |
|---|---|---|---|
| DE001 | 学習候補 | Intent 横断で再利用できる可能性がある知見を表す。 | DE002, DE003 |
| DE002 | 昇格判断 | 学習候補を採用、保留、非採用、後続化へ分ける判断を表す。 | DE001 |
| DE003 | 成果物責務 | `ideation/ideation.md`、`traceability.md`、`decisions.md`、Steering knowledge、Domain Map、Context Map の役割境界を表す。 | DE001, DE002 |
| DE004 | 構造検出 | validator が実行時に参照できる構造条件を検出した結果を表す。 | DE001 |
| DE005 | 品質評価 | evaluator が文書品質または意味的品質を評価した結果を表す。 | DE001 |

## 関係

学習候補は、昇格判断によって Steering knowledge、Domain Map、Context Map、後続作業、または非採用へ分かれる。
成果物責務は、候補、証拠、判断、現在の索引を混ぜないための境界である。
構造検出と品質評価は、学習候補の根拠になり得るが、採用判断そのものではない。

## Domain Map と Context Map への反映候補

| 対象 | 種別 | 候補内容 | 承認後の扱い | 根拠 |
|---|---|---|---|---|
| なし | なし | 新しい Bounded Context やコンテキスト間依存は追加しない。 | Domain Map と Context Map は更新しない。 | U002 は BC001 内の学習昇格契約を扱うため。 |

## 未確認事項

なし。
