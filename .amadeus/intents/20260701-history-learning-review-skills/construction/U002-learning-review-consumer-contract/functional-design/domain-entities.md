# Domain Entities

## 目的

学習分類と consumer 境界で扱う概念を定義する。

Functional Design は詳細な Domain Model と Intent Contracts の管理元である。

## Domain Entity

| 識別子 | 名前 | 責務 | 関連 |
|---|---|---|---|
| DE001 | Learning Review Input | 過去分析結果、検証結果、Issue、PR、CI 結果を表す。 | DE002 |
| DE002 | Learning Classification | 入力証拠の学習先分類を表す。 | DE001, DE003 |
| DE003 | Routing Result | phase skill、`amadeus-grilling`、後続 Issue、後続 Intent への戻り先を表す。 | DE002 |
| DE004 | Dry-run Consumer Boundary | `amadeus-discovery dry-run` が分析結果を入力として扱う境界を表す。 | DE001, DE002 |
| DE005 | Skill Sync Evidence | source skill、昇格先成果物、text contract の同期証拠を表す。 | DE002 |

## 関係

Learning Review Input は Learning Classification の材料になる。
Learning Classification は Routing Result を持つ。
Dry-run Consumer Boundary は history review result と learning classification を入力として参照できるが、分析と分類を所有しない。
Skill Sync Evidence は Construction 検証の証拠になる。

## Domain Map と Context Map への反映候補

| 対象 | 種別 | 候補内容 | 承認後の扱い | 根拠 |
|---|---|---|---|---|
| なし | なし | 新しい Bounded Context やコンテキスト間依存は追加しない。 | Domain Map と Context Map は更新しない。 | U002 は BC001 内の自己開発運用を扱うため。 |

## 未確認事項

なし。
