# Business Rules

## 目的

Skill Contract catalog の構造と制約を、実装と生成処理が同じ基準で扱えるようにする。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | Skill Contract の管理元は `amadeus-contracts/catalog/**` とする。 | R001, D001 | accepted |
| BR002 | 初期対象 skill は `amadeus-ideation`、`amadeus-inception`、`amadeus-construction`、`amadeus-grilling`、`amadeus-validator` に限定する。 | R002, D001 | accepted |
| BR003 | 契約要素は prerequisites、invariants、postconditions、read boundary、write boundary、delegation、grilling、feedback を表現できる構造にする。 | R002 | accepted |
| BR004 | 後方互換維持を目的にした旧 catalog 経路は追加しない。 | D004 | accepted |
| BR005 | consumer 用の意味は catalog に置き、生成物から参照できるようにする。 | R005 | accepted |

## 例外

| 条件 | 扱い | 根拠 |
|---|---|---|
| 代表 skill 以外に契約適用が必要になった。 | 後続 Issue または後続 Intent 候補として扱う。 | SC-OUT-001 |
| `SKILL.md` 全面再構成が必要になった。 | 今回の対象外として扱う。 | SC-OUT-002 |

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | 代表 skill の `SKILL.md` が存在する。 | R002 | accepted |
| PRE002 | 事前条件 | `amadeus-contracts/catalog/index.ts` と `types.ts` が公開口として存在する。 | R001 | accepted |
| INV001 | 不変条件 | Skill Contract は `SKILL.md` から手で複製した参照文書ではなく、TypeScript catalog から生成する。 | R001, R003, D003 | accepted |
| INV002 | 不変条件 | validator の `passed` は内容承認ではなく構造検出として扱う。 | R005 | accepted |
| POST001 | 事後条件 | 代表 skill 5件の契約が TypeScript 型で制約される。 | R001, R002 | accepted |

## 未確認事項

なし。
