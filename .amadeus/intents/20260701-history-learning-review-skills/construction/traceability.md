# Construction 追跡

## Task Generation からの追跡

| Evidence | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| [tasks.md](bolts/B001-history-review-internal-skill/tasks.md) | B001/T001, B001/T002 | `skills/amadeus-history-review/SKILL.md`, `.agents/skills/amadeus-history-review/SKILL.md`, `dev-scripts/evals/amadeus-templates/check.ts` | [test-results.md](bolts/B001-history-review-internal-skill/test-results.md) | 未作成 | verified |
| [tasks.md](bolts/B002-learning-review-internal-skill/tasks.md) | B002/T001, B002/T002 | `skills/amadeus-learning-review/SKILL.md`, `.agents/skills/amadeus-learning-review/SKILL.md`, `dev-scripts/evals/amadeus-templates/check.ts` | [test-results.md](bolts/B002-learning-review-internal-skill/test-results.md) | 未作成 | verified |
| [tasks.md](bolts/B003-dry-run-consumer-verification/tasks.md) | B003/T001, B003/T002 | `skills/amadeus-discovery/SKILL.md`, `.agents/skills/amadeus-discovery/SKILL.md`, `dev-scripts/evals/amadeus-templates/check.ts` | [test-results.md](bolts/B003-dry-run-consumer-verification/test-results.md) | 未作成 | verified |

## Construction からの追跡

| ボルト | タスク | 証拠 | 状態 |
|---|---|---|---|
| B001 | B001/T001, B001/T002 | [test-results.md](bolts/B001-history-review-internal-skill/test-results.md) | verified |
| B002 | B002/T001, B002/T002 | [test-results.md](bolts/B002-learning-review-internal-skill/test-results.md) | verified |
| B003 | B003/T001, B003/T002 | [test-results.md](bolts/B003-dry-run-consumer-verification/test-results.md) | verified |

## Deployment Unit からの追跡

| Deployment Unit | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| `skills/amadeus-history-review/SKILL.md` | B001/T001 | history review 内部 skill を追加 | [B001 test-results](bolts/B001-history-review-internal-skill/test-results.md) | 未作成 | verified |
| `.agents/skills/amadeus-history-review/SKILL.md` | B001/T002 | source skill から昇格 | [B001 test-results](bolts/B001-history-review-internal-skill/test-results.md) | 未作成 | verified |
| `skills/amadeus-learning-review/SKILL.md` | B002/T001 | learning review 内部 skill を追加 | [B002 test-results](bolts/B002-learning-review-internal-skill/test-results.md) | 未作成 | verified |
| `.agents/skills/amadeus-learning-review/SKILL.md` | B002/T002 | source skill から昇格 | [B002 test-results](bolts/B002-learning-review-internal-skill/test-results.md) | 未作成 | verified |
| `skills/amadeus-discovery/SKILL.md` | B003/T001 | Issue #272 の dry-run consumer 境界を追加 | [B003 test-results](bolts/B003-dry-run-consumer-verification/test-results.md) | 未作成 | verified |
| `.agents/skills/amadeus-discovery/SKILL.md` | B003/T002 | source skill から昇格 | [B003 test-results](bolts/B003-dry-run-consumer-verification/test-results.md) | 未作成 | verified |
| `dev-scripts/evals/amadeus-templates/check.ts` | B001/T002, B002/T002, B003/T002 | history review、learning review、dry-run consumer 境界の text contract を追加 | [B001 test-results](bolts/B001-history-review-internal-skill/test-results.md), [B002 test-results](bolts/B002-learning-review-internal-skill/test-results.md), [B003 test-results](bolts/B003-dry-run-consumer-verification/test-results.md) | 未作成 | verified |
