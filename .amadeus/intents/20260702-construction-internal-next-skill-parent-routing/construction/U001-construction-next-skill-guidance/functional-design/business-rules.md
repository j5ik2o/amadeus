# Business Rules

## 目的

Construction 内部 skill の次工程案内に必要な規則を定義する。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | 実装後の検証へ進む場合は、`amadeus-construction` を検証目的で呼ぶ。 | R001 | accepted |
| BR002 | 検証後のファイナライズへ進む場合は、`amadeus-construction` をファイナライズ目的で呼ぶ。 | R002 | accepted |
| BR003 | 内部 skill を直接呼ぶのは、親 skill から明示的に委譲されている場合だけである。 | R003 | accepted |
| BR004 | 実装完了だけでは Construction 完了ではなく、検証と traceability finalization が必要である。 | R004 | accepted |
| BR005 | source skill と昇格先成果物は同じ次工程案内を説明する。 | R005 | accepted |

## 例外

親 skill から内部 skill へ明示的に委譲されている場合は、次の内部 skill を直接呼ぶ案内を残してよい。

ただし、直接呼び出しの条件は `次の skill` 欄で明示する。

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | Inception gate が passed である。 | state.json | accepted |
| POST001 | 事後条件 | 実装後の検証目的を `amadeus-construction-implementation-execution` から読める。 | R001 | accepted |
| POST002 | 事後条件 | 検証後のファイナライズ目的を `amadeus-construction-verification-hardening` から読める。 | R002 | accepted |
| INV001 | 不変条件 | Construction の stage 構造と内部 skill の責務を変えない。 | D001 | accepted |
| INV002 | 不変条件 | source skill と昇格先成果物の反映は既存の昇格手順に従う。 | steering/policies.md | accepted |

## 未確認事項

- B003 で周辺 skill の同種案内を確認する。
