# Domain Entities

## 目的

Skill Contract catalog model で扱う概念を定義する。

Functional Design は詳細な Domain Model と Intent Contracts の管理元である。

## Domain Entity

| 識別子 | 名前 | 責務 | 関連 |
|---|---|---|---|
| DE001 | Skill Contract | skill 実行契約を表す catalog item。 | DE002, DE003, DE004 |
| DE002 | Contract Condition | 事前条件、不変条件、事後条件、grilling 条件、feedback 条件を表す。 | DE001 |
| DE003 | Contract Boundary | 読み取り境界と書き込み境界を表す。 | DE001 |
| DE004 | Delegation Rule | 親 skill と内部 skill の委譲関係、禁止対象、順序を表す。 | DE001 |
| DE005 | Consumer Reference | validator、evaluator、decision review、learning review が参照する用途を表す。 | DE001 |

## 関係

Skill Contract は、Contract Condition、Contract Boundary、Delegation Rule、Consumer Reference を持つ。
Contract Condition は skill 実行の開始条件、守る条件、完了条件を分ける。
Contract Boundary は、skill が読める成果物と更新できる成果物を分ける。
Consumer Reference は、生成物を参照する利用者と用途を示す。

## Domain Map と Context Map への反映候補

| 対象 | 種別 | 候補内容 | 承認後の扱い | 根拠 |
|---|---|---|---|---|
| なし | なし | 新しい Bounded Context やコンテキスト間依存は追加しない。 | Domain Map と Context Map は更新しない。 | U001 は BC001 内の catalog model を扱うため。 |

## 未確認事項

なし。
