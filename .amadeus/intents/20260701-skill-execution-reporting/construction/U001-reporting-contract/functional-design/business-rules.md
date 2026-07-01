# Business Rules

## 目的

skill 実行時問題報告の分類と最低項目を規則として定義する。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | skill 実行中の問題や懸念は、現在の Intent 対象、後続 Issue 候補、報告不要のいずれかに分類する。 | R001 | accepted |
| BR002 | 現在の Intent 対象に含めるのは、現在の成果物階層へ直接追跡でき、成功条件に必要な場合だけである。 | R001 | accepted |
| BR003 | 後続 Issue 候補は現在の Intent 成果物へ混ぜず、作業報告で提示する。 | R001, R003 | accepted |
| BR004 | GitHub Issue 作成は、人間が Issue 化を承認した場合だけ実行する。 | R003 | accepted |
| BR005 | 報告には、要約、発見 skill、対象、影響範囲、推奨分類、根拠、validator または evaluator で検出すべきかを含める。 | R002 | accepted |
| BR006 | 報告内容に秘密情報や不要な個人情報を含めない。 | R002 | accepted |
| BR007 | validator の `pass` は内容承認として扱わない。 | R001, R002 | accepted |

## 例外

軽い感想、一時的な作業メモ、すでに解消した局所的な気づき、現在の判断に影響しない観察は報告不要として扱う。

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | Inception gate が passed である。 | state.json | accepted |
| POST001 | 事後条件 | 公開 skill から報告先分類、最低項目、人間承認付き Issue 候補化を読める。 | R001, R002, R003 | accepted |
| INV001 | 不変条件 | 現在の Intent と無関係な改善を現在の Intent 成果物へ混ぜない。 | R001 | accepted |
| INV002 | 不変条件 | validator の `pass` を内容承認として扱わない。 | R001, R002 | accepted |

## 未確認事項

なし。
