# Business Rules

## 目的

Skill Contract 生成物を手書きせず、catalog との差分を検出できるようにする。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | `references/skill-contract.md` は catalog から生成し、手書きしない。 | R003, D003 | accepted |
| BR002 | `contracts:generate` は Skill Contract 生成物を `generatedContractFiles` に含める。 | R003, R004 | accepted |
| BR003 | `contracts:check` は Skill Contract 生成物の欠落と差分を検出する。 | R004 | accepted |
| BR004 | validator 用 `skill-contracts.ts` は `skills/**` と `.agents/skills/**` の必要な場所に生成する。 | R003, R005 | accepted |
| BR005 | eval は Skill Contract 生成物が追跡対象であることと、直接編集を検出できることを確認する。 | R004 | accepted |

## 例外

| 条件 | 扱い | 根拠 |
|---|---|---|
| 手書きの参照文書が必要に見える。 | catalog に項目を追加し、生成物として反映する。 | D003 |
| 全 skill への一括生成が必要になった。 | 後続 Issue または後続 Intent 候補として扱う。 | SC-OUT-001 |

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | Skill Contract catalog が存在する。 | R003 | accepted |
| INV001 | 不変条件 | 生成物は `generatedContractFiles` に集約する。 | R004 | accepted |
| INV002 | 不変条件 | 生成物に直接編集禁止を明記する。 | R003, D003 | accepted |
| POST001 | 事後条件 | `contracts:check` が Skill Contract 生成物のずれを検出できる。 | R004 | accepted |

## 未確認事項

なし。
