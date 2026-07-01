# Construction 追跡

## Task Generation からの追跡

| Evidence | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| [tasks.md](bolts/B001-stage-policy-record/tasks.md) | B001/T001, B001/T002 | `.amadeus/glossary.md`, `.amadeus/steering/policies.md` | [test-results.md](bolts/B001-stage-policy-record/test-results.md) | [PR #241](https://github.com/amadeus-dlc/amadeus/pull/241) | verified |
| [tasks.md](bolts/B002-workspace-provenance-record/tasks.md) | B002/T001, B002/T002 | `.amadeus/development.md`, `.amadeus/steering/policies.md` | [test-results.md](bolts/B002-workspace-provenance-record/test-results.md) | [PR #241](https://github.com/amadeus-dlc/amadeus/pull/241) | verified |

## Construction からの追跡

| ボルト | タスク | 証拠 | 状態 |
|---|---|---|---|
| B001 | B001/T001, B001/T002 | [test-results.md](bolts/B001-stage-policy-record/test-results.md), [PR #241](https://github.com/amadeus-dlc/amadeus/pull/241) | verified |
| B002 | B002/T001, B002/T002 | [test-results.md](bolts/B002-workspace-provenance-record/test-results.md), [PR #241](https://github.com/amadeus-dlc/amadeus/pull/241) | verified |

## Deployment Unit からの追跡

| Deployment Unit | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| `.amadeus/glossary.md` | B001/T001 | stage0 採用条件と stage0 採用判断を追加 | [B001 test-results](bolts/B001-stage-policy-record/test-results.md) | [PR #241](https://github.com/amadeus-dlc/amadeus/pull/241) | verified |
| `.amadeus/steering/policies.md` | B001/T002, B002/T002 | stage0 採用判断と provenance 最低記録項目を補強 | [B001 test-results](bolts/B001-stage-policy-record/test-results.md), [B002 test-results](bolts/B002-workspace-provenance-record/test-results.md) | [PR #241](https://github.com/amadeus-dlc/amadeus/pull/241) | verified |
| `.amadeus/development.md` | B002/T001, B002/T002 | stage と workspace 対応記録を追加 | [B002 test-results](bolts/B002-workspace-provenance-record/test-results.md) | [PR #241](https://github.com/amadeus-dlc/amadeus/pull/241) | verified |
