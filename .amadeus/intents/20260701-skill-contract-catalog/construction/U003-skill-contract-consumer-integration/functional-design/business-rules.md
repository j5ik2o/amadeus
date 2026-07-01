# Business Rules

## 目的

consumer が Skill Contract を同じ入力として参照し、validator と evaluator の責務を混ぜないようにする。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | validator は Skill Contract 生成物の構造と参照入口を扱う。 | R005 | accepted |
| BR002 | evaluator は Skill Contract と実行結果の品質評価入力を扱う。 | R005 | accepted |
| BR003 | decision review は prerequisites、invariants、postconditions、read/write boundary を参照できる。 | R005 | accepted |
| BR004 | learning review は feedback conditions と follow-up 候補を参照できる。 | R005 | accepted |
| BR005 | validator の `passed` は内容承認ではなく構造検出として扱う。 | R005, D001 | accepted |

## 例外

| 条件 | 扱い | 根拠 |
|---|---|---|
| #257 または #259 の実装側が追加項目を必要とする。 | 後続 Issue または Skill Contract 拡張候補として扱う。 | D004 |
| evaluator の本格採点が必要になる。 | 今回の対象外として扱う。 | D001 |

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | Skill Contract 生成物が最新である。 | R005 | accepted |
| INV001 | 不変条件 | validator は内容承認を行わない。 | R005 | accepted |
| INV002 | 不変条件 | #257 と #259 の全実装はこの Unit に含めない。 | D001, D004 | accepted |
| POST001 | 事後条件 | consumer が Skill Contract を入力として参照できる。 | R005 | accepted |

## 未確認事項

なし。
