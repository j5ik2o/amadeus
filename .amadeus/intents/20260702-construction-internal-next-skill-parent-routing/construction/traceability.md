# Construction 追跡

## Task Generation からの追跡

| Evidence | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| [tasks.md](bolts/B001-implementation-next-skill-guidance/tasks.md) | B001/T001, B001/T002 | `skills/amadeus-construction-implementation-execution/SKILL.md`, `.agents/skills/amadeus-construction-implementation-execution/SKILL.md` | [test-results.md](bolts/B001-implementation-next-skill-guidance/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |
| [tasks.md](bolts/B002-verification-next-skill-guidance/tasks.md) | B002/T001, B002/T002 | `skills/amadeus-construction-verification-hardening/SKILL.md`, `.agents/skills/amadeus-construction-verification-hardening/SKILL.md` | [test-results.md](bolts/B002-verification-next-skill-guidance/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |
| [tasks.md](bolts/B003-routing-alignment-check/tasks.md) | B003/T001, B003/T002, B003/T003 | `skills/amadeus-construction-functional-design/SKILL.md`, `skills/amadeus-construction-bolt-preparation/SKILL.md`, `skills/amadeus-construction-traceability-finalization/SKILL.md`, `.agents/skills/**` | [test-results.md](bolts/B003-routing-alignment-check/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |

## Construction からの追跡

| ボルト | タスク | 証拠 | 状態 |
|---|---|---|---|
| B001 | B001/T001, B001/T002 | [test-results.md](bolts/B001-implementation-next-skill-guidance/test-results.md) | verified |
| B002 | B002/T001, B002/T002 | [test-results.md](bolts/B002-verification-next-skill-guidance/test-results.md) | verified |
| B003 | B003/T001, B003/T002, B003/T003 | [test-results.md](bolts/B003-routing-alignment-check/test-results.md) | verified |

## Deployment Unit からの追跡

| Deployment Unit | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| `skills/amadeus-construction-implementation-execution/SKILL.md` | B001/T001 | 実装後の親 skill 経由検証案内を追加 | [test-results.md](bolts/B001-implementation-next-skill-guidance/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |
| `.agents/skills/amadeus-construction-implementation-execution/SKILL.md` | B001/T002 | 昇格先成果物へ同じ案内を反映 | [test-results.md](bolts/B001-implementation-next-skill-guidance/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |
| `skills/amadeus-construction-verification-hardening/SKILL.md` | B002/T001 | 検証後の親 skill 経由ファイナライズ案内を追加 | [test-results.md](bolts/B002-verification-next-skill-guidance/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |
| `.agents/skills/amadeus-construction-verification-hardening/SKILL.md` | B002/T002 | 昇格先成果物へ同じ案内を反映 | [test-results.md](bolts/B002-verification-next-skill-guidance/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |
| `skills/amadeus-construction-functional-design/SKILL.md` | B003/T001 | Bolt Preparation を親 skill 経由で案内 | [test-results.md](bolts/B003-routing-alignment-check/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |
| `.agents/skills/amadeus-construction-functional-design/SKILL.md` | B003/T002 | 昇格先成果物へ同じ案内を反映 | [test-results.md](bolts/B003-routing-alignment-check/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |
| `skills/amadeus-construction-bolt-preparation/SKILL.md` | B003/T001 | 実装実行を親 skill 経由で案内 | [test-results.md](bolts/B003-routing-alignment-check/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |
| `.agents/skills/amadeus-construction-bolt-preparation/SKILL.md` | B003/T002 | 昇格先成果物へ同じ案内を反映 | [test-results.md](bolts/B003-routing-alignment-check/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |
| `skills/amadeus-construction-traceability-finalization/SKILL.md` | B003/T001 | 検証不足時の戻り案内を親 skill 経由へ変更 | [test-results.md](bolts/B003-routing-alignment-check/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |
| `.agents/skills/amadeus-construction-traceability-finalization/SKILL.md` | B003/T002 | 昇格先成果物へ同じ案内を反映 | [test-results.md](bolts/B003-routing-alignment-check/test-results.md) | [PR #282](https://github.com/amadeus-dlc/amadeus/pull/282) | verified |
