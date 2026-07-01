# Business Rules

## 目的

代表 skill への反映、昇格、eval 整合の規則を定義する。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | 初回の代表 skill は `amadeus-ideation`、`amadeus-inception`、`amadeus-construction` にする。 | R004 | accepted |
| BR002 | source skill から昇格先 skill へ反映する場合は、`dev-scripts/promote-skill.ts --replace` を使う。 | R004 | accepted |
| BR003 | `amadeus-templates` eval は、source skill と昇格先 skill の両方で報告契約を確認する。 | R004 | accepted |
| BR004 | `amadeus-discovery` と `amadeus-validator` は初回反映対象外にし、必要なら後続 Issue 候補として報告する。 | D003, D004 | accepted |

## 例外

関連 eval で直接確認できない対象がある場合は、Construction の decisions または traceability に対象外理由を残す。

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | U001 の報告契約が source skill に定義されている。 | B001 | accepted |
| POST001 | 事後条件 | 昇格先 skill が source skill と同じ報告契約を持つ。 | R004 | accepted |
| POST002 | 事後条件 | 関連 eval が報告契約を検出できる。 | R004 | accepted |
| INV001 | 不変条件 | 昇格先 skill を手動同期しない。 | R004 | accepted |

## 未確認事項

なし。
