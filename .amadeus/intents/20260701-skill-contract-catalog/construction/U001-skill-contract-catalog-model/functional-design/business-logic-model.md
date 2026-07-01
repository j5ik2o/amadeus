# Business Logic Model

## 目的

Skill 実行契約を `amadeus-contracts` の catalog として表現し、代表 skill の契約を同じ型で扱う業務ロジックを定義する。

## 対象 Unit

U001 skill-contract-catalog-model。

## 業務ロジック

| 識別子 | ロジック | 入力 | 出力 | 根拠 |
|---|---|---|---|---|
| BL001 | Skill Contract 型が扱う契約領域を定義する。 | Issue #263、R001、R002、代表 skill の `SKILL.md` | Skill Contract 型 | R001, UC001 |
| BL002 | 代表 skill 5件を catalog item として登録する。 | 初期対象 skill、契約要素 | Skill Contract catalog | R002, UC001 |
| BL003 | 契約要素を prerequisites、invariants、postconditions、read boundary、write boundary、delegation、grilling、feedback に分ける。 | `SKILL.md` の実行契約 | 型制約済みの契約項目 | R002, UC001 |
| BL004 | consumer が参照する用途を catalog に含める。 | validator、evaluator、decision review、learning review | consumer 参照情報 | R001, R005, UC003 |

## 入力

| 入力 | 説明 | 根拠 |
|---|---|---|
| Issue #263 | Skill Contract の対象、受け入れ条件、対象外を定義する。 | R001, R002 |
| 代表 skill の `SKILL.md` | 契約項目の具体的な参照元になる。 | R002 |
| 既存 contract catalog | 型公開と生成処理の既存パターンである。 | R001 |

## 出力

| 出力 | 説明 | 利用先 |
|---|---|---|
| Skill Contract 型 | skill 実行契約を TypeScript で制約する型。 | catalog、生成処理、typecheck |
| Skill Contract catalog | 代表 skill 5件の契約一覧。 | 生成処理、validator、review |
| consumer 参照情報 | 契約を参照する利用者と用途。 | validator、evaluator、decision review、learning review |

## 未確認事項

なし。
