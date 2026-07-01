# Business Logic Model

## 目的

validator、evaluator、decision review、learning review が Skill Contract を入力として参照する業務ロジックを定義する。

## 対象 Unit

U003 skill-contract-consumer-integration。

## 業務ロジック

| 識別子 | ロジック | 入力 | 出力 | 根拠 |
|---|---|---|---|---|
| BL001 | validator が Skill Contract の生成 TypeScript を参照できるようにする。 | `skill-contracts.ts` | validator 参照入口 | R005, UC003 |
| BL002 | evaluator が Skill Contract を品質評価入力として扱える項目を catalog に持つ。 | consumer 参照情報 | evaluator 入力候補 | R005 |
| BL003 | decision review が判断再確認に必要な契約条件を参照できるようにする。 | prerequisites、invariants、postconditions、boundary | decision review 入力 | R005 |
| BL004 | learning review が feedback 条件と follow-up 候補を参照できるようにする。 | feedback conditions、postconditions | learning review 入力 | R005 |
| BL005 | validator の構造検出と evaluator の品質評価を分ける。 | 検証結果、契約項目 | 責務境界 | R005 |

## 入力

| 入力 | 説明 | 根拠 |
|---|---|---|
| Skill Contract catalog | consumer が参照する契約項目を持つ。 | R005 |
| Skill Contract 生成物 | validator と review が参照する生成結果。 | R003, R005 |
| Issue #257 と Issue #259 | decision review と learning review の接続先。 | R005 |

## 出力

| 出力 | 説明 | 利用先 |
|---|---|---|
| validator 参照入口 | 生成 TypeScript を import できる入口。 | validator |
| review 入力契約 | decision review と learning review が参照する契約項目。 | #257、#259 |
| 責務境界 | 構造検出と品質評価の違い。 | validator、evaluator、Maintainer |

## 未確認事項

なし。
