# U002: traceability template alignment

## ユニット

- traceability template、example、source skill と昇格先成果物の整合確認を扱う。

## 対象要求

- R004

## 価値境界

- source skill と昇格先成果物が同じ契約を説明していることを確認する。
- template または example の `construction/traceability.md` を更新対象に含めるか判断する。
- 更新しない対象がある場合は、理由を追跡できる状態にする。

## 検証観点

- source skill と昇格先成果物の該当箇所が整合している。
- template または example の更新要否が判断されている。
- validator の成果物契約を変更していない。

## 未確認事項

- template と example を実際に更新するかは Construction で確認する。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction/templates/intents/construction/traceability.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-construction/templates/intents/construction/traceability.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `dev-scripts/evals/amadeus-templates/check.ts` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `examples/**/construction/traceability.md` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U002-traceability-template-alignment/design.md)
