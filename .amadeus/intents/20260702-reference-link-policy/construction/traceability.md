# Construction 追跡

## Task Generation からの追跡

| Evidence | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| [B001 tasks](bolts/B001-reference-link-rules/tasks.md) | B001/T001, B001/T002 | `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-logic-model.md`, `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-rules.md`, `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/domain-entities.md` | [B001 test-results](bolts/B001-reference-link-rules/test-results.md) | [PR #285](https://github.com/amadeus-dlc/amadeus/pull/285) | completed |
| [B002 tasks](bolts/B002-artifact-application-scope/tasks.md) | B002/T001, B002/T002, B002/T003 | `skills/amadeus-inception/templates/intents/inception/traceability.md`, `skills/amadeus-inception/templates/intents/inception/decisions.md`, `.amadeus/intents/20260701-self-development-cycle-stage-workspace/construction/traceability.md` | [B002 test-results](bolts/B002-artifact-application-scope/test-results.md) | [PR #285](https://github.com/amadeus-dlc/amadeus/pull/285) | completed |

## Construction からの追跡

| ボルト | タスク | 証拠 | 状態 |
|---|---|---|---|
| B001 | B001/T001, B001/T002 | [B001 test-results](bolts/B001-reference-link-rules/test-results.md)、[PR #285](https://github.com/amadeus-dlc/amadeus/pull/285)、`skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-logic-model.md`、`skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-rules.md`、`skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/domain-entities.md` | completed |
| B002 | B002/T001, B002/T002, B002/T003 | [B002 test-results](bolts/B002-artifact-application-scope/test-results.md)、[PR #285](https://github.com/amadeus-dlc/amadeus/pull/285)、`skills/amadeus-inception/templates/intents/inception/traceability.md`、`skills/amadeus-inception/templates/intents/inception/decisions.md`、[D003](decisions/D003-artifact-application-scope.md) | completed |

## Deployment Unit からの追跡

| Deployment Unit | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-logic-model.md` | B001/T001 | 参照表記の分類手順を追加 | [B001 test-results](bolts/B001-reference-link-rules/test-results.md) | [PR #285](https://github.com/amadeus-dlc/amadeus/pull/285) | completed |
| `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-rules.md` | B001/T002 | 参照リンク方針とリンク先規則を追加 | [B001 test-results](bolts/B001-reference-link-rules/test-results.md) | [PR #285](https://github.com/amadeus-dlc/amadeus/pull/285) | completed |
| `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/domain-entities.md` | B001/T001 | 参照リンク方針の Domain Entity を追加 | [B001 test-results](bolts/B001-reference-link-rules/test-results.md) | [PR #285](https://github.com/amadeus-dlc/amadeus/pull/285) | completed |
| `.agents/skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/**` | B001/T001, B001/T002 | source skill の変更を昇格 | [B001 test-results](bolts/B001-reference-link-rules/test-results.md) | [PR #285](https://github.com/amadeus-dlc/amadeus/pull/285) | completed |
| `skills/amadeus-inception/templates/intents/inception/traceability.md` | B002/T001 | 参照リンク化対象の適用範囲を追加 | [B002 test-results](bolts/B002-artifact-application-scope/test-results.md) | [PR #285](https://github.com/amadeus-dlc/amadeus/pull/285) | completed |
| `skills/amadeus-inception/templates/intents/inception/decisions.md` | B002/T001 | 判断一覧での参照リンク方針を追加 | [B002 test-results](bolts/B002-artifact-application-scope/test-results.md) | [PR #285](https://github.com/amadeus-dlc/amadeus/pull/285) | completed |
| `.agents/skills/amadeus-inception/templates/intents/inception/**` | B002/T001 | source skill の変更を昇格 | [B002 test-results](bolts/B002-artifact-application-scope/test-results.md) | [PR #285](https://github.com/amadeus-dlc/amadeus/pull/285) | completed |
| `.amadeus/intents/20260701-self-development-cycle-stage-workspace/construction/traceability.md` | B002/T002 | PR番号参照を GitHub Pull Request URL へリンク化 | [B002 test-results](bolts/B002-artifact-application-scope/test-results.md) | [PR #285](https://github.com/amadeus-dlc/amadeus/pull/285) | completed |
| `examples/**/.amadeus` | B002/T003 | B002 では直接変更せず、source skill と validator の契約が揃った後の再生成対象として扱う | [B002 test-results](bolts/B002-artifact-application-scope/test-results.md) | [PR #285](https://github.com/amadeus-dlc/amadeus/pull/285) | completed |
