# B002: template and example alignment

## 概要

- traceability template、example、source skill と昇格先成果物の整合を確認する。

## 対象ユニット

- U002

## 設計

- [U002 Unit Design](../units/U002-traceability-template-alignment/design.md)

## 完了条件

- source skill と昇格先成果物の該当説明が整合している。
- traceability template の更新要否が判断されている。
- example の更新要否が判断されている。
- 更新しない対象がある場合は、対象外理由が traceability または decisions から追跡できる。
- 対象 Intent の validator、`npm run typecheck`、`npm run diff:check` が pass している。

## 依存

- B001

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction/templates/intents/construction/traceability.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction/templates/intents/construction/traceability.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `dev-scripts/evals/amadeus-templates/check.ts` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `examples/**/construction/traceability.md` | 未確認 | なし | 未確認 |

## 未確認事項

- template と example を実際に更新するかは、B001 の結果と eval 影響を見て確定する。
