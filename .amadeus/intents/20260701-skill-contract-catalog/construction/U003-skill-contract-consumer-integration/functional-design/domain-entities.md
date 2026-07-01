# Domain Entities

## 目的

Skill Contract consumer integration で扱う概念を定義する。

Functional Design は詳細な Domain Model と Intent Contracts の管理元である。

## Domain Entity

| 識別子 | 名前 | 責務 | 関連 |
|---|---|---|---|
| DE001 | Skill Contract Consumer | Skill Contract を入力として参照する利用者を表す。 | DE002, DE003 |
| DE002 | Validator Reference | validator が参照する構造検出入口を表す。 | DE001 |
| DE003 | Review Reference | decision review と learning review が参照する契約入力を表す。 | DE001 |
| DE004 | Evaluation Boundary | validator の構造検出と evaluator の品質評価を分ける境界を表す。 | DE001 |

## 関係

Skill Contract Consumer は、Validator Reference または Review Reference を通じて契約項目を参照する。
Evaluation Boundary は、validator が構造検出を扱い、evaluator が品質評価を扱うことを分ける。
Review Reference は、decision review と learning review の参照項目を分ける。

## Domain Map と Context Map への反映候補

| 対象 | 種別 | 候補内容 | 承認後の扱い | 根拠 |
|---|---|---|---|---|
| なし | なし | 新しい Bounded Context やコンテキスト間依存は追加しない。 | Domain Map と Context Map は更新しない。 | U003 は BC001 内の consumer 参照入口を扱うため。 |

## 未確認事項

なし。
