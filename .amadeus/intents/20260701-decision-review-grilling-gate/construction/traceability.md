# Construction 追跡

## Task Generation からの追跡

| Evidence | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| [tasks.md](bolts/B001-decision-review-internal-contract/tasks.md) | B001/T001, B001/T002 | `skills/amadeus-decision-review/SKILL.md`, `.agents/skills/amadeus-decision-review/SKILL.md` | [test-results.md](bolts/B001-decision-review-internal-contract/test-results.md) | [PR #275](bolts/B001-decision-review-internal-contract/pr.md) | verified |
| [tasks.md](bolts/B002-phase-skill-entry-integration/tasks.md) | B002/T001, B002/T002 | `skills/amadeus-ideation/SKILL.md`, `skills/amadeus-inception/SKILL.md`, `skills/amadeus-construction/SKILL.md`, `.agents/skills/amadeus-ideation/SKILL.md`, `.agents/skills/amadeus-inception/SKILL.md`, `.agents/skills/amadeus-construction/SKILL.md` | [test-results.md](bolts/B002-phase-skill-entry-integration/test-results.md) | [PR #275](bolts/B002-phase-skill-entry-integration/pr.md) | verified |
| [tasks.md](bolts/B003-verification-contract-alignment/tasks.md) | B003/T001, B003/T002, B003/T003 | `amadeus-contracts/catalog/skills.ts`, `skills/amadeus-validator/SKILL.md`, `.agents/skills/amadeus-validator/SKILL.md`, `dev-scripts/evals/amadeus-templates/check.ts` | [test-results.md](bolts/B003-verification-contract-alignment/test-results.md) | [PR #275](bolts/B003-verification-contract-alignment/pr.md) | verified |

## Construction からの追跡

| ボルト | タスク | 証拠 | 状態 |
|---|---|---|---|
| B001 | B001/T001, B001/T002 | [test-results.md](bolts/B001-decision-review-internal-contract/test-results.md), [PR #275](bolts/B001-decision-review-internal-contract/pr.md) | verified |
| B002 | B002/T001, B002/T002 | [test-results.md](bolts/B002-phase-skill-entry-integration/test-results.md), [PR #275](bolts/B002-phase-skill-entry-integration/pr.md) | verified |
| B003 | B003/T001, B003/T002, B003/T003 | [test-results.md](bolts/B003-verification-contract-alignment/test-results.md), [PR #275](bolts/B003-verification-contract-alignment/pr.md) | verified |

## Deployment Unit からの追跡

| Deployment Unit | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| `skills/amadeus-decision-review/SKILL.md` | B001/T001 | decision review 内部 skill 契約を追加 | [B001 test-results](bolts/B001-decision-review-internal-contract/test-results.md) | [PR #275](bolts/B001-decision-review-internal-contract/pr.md) | verified |
| `.agents/skills/amadeus-decision-review/SKILL.md` | B001/T002 | source skill と同じ契約へ同期 | [B001 test-results](bolts/B001-decision-review-internal-contract/test-results.md) | [PR #275](bolts/B001-decision-review-internal-contract/pr.md) | verified |
| `skills/amadeus-ideation/SKILL.md` | B002/T001 | 起動時 decision review 規則を追加 | [B002 test-results](bolts/B002-phase-skill-entry-integration/test-results.md) | [PR #275](bolts/B002-phase-skill-entry-integration/pr.md) | verified |
| `skills/amadeus-inception/SKILL.md` | B002/T001 | 起動時 decision review 規則を追加 | [B002 test-results](bolts/B002-phase-skill-entry-integration/test-results.md) | [PR #275](bolts/B002-phase-skill-entry-integration/pr.md) | verified |
| `skills/amadeus-construction/SKILL.md` | B002/T001 | 起動時 decision review 規則を追加 | [B002 test-results](bolts/B002-phase-skill-entry-integration/test-results.md) | [PR #275](bolts/B002-phase-skill-entry-integration/pr.md) | verified |
| `.agents/skills/amadeus-ideation/SKILL.md` | B002/T002 | source skill と同じ契約へ同期 | [B002 test-results](bolts/B002-phase-skill-entry-integration/test-results.md) | [PR #275](bolts/B002-phase-skill-entry-integration/pr.md) | verified |
| `.agents/skills/amadeus-inception/SKILL.md` | B002/T002 | source skill と同じ契約へ同期 | [B002 test-results](bolts/B002-phase-skill-entry-integration/test-results.md) | [PR #275](bolts/B002-phase-skill-entry-integration/pr.md) | verified |
| `.agents/skills/amadeus-construction/SKILL.md` | B002/T002 | source skill と同じ契約へ同期 | [B002 test-results](bolts/B002-phase-skill-entry-integration/test-results.md) | [PR #275](bolts/B002-phase-skill-entry-integration/pr.md) | verified |
| `amadeus-contracts/catalog/skills.ts` | B003/T001 | decision review skill 契約を追加 | [B003 test-results](bolts/B003-verification-contract-alignment/test-results.md) | [PR #275](bolts/B003-verification-contract-alignment/pr.md) | verified |
| `skills/amadeus-validator/SKILL.md` | B003/T002 | validator と decision review の境界を確認 | [B003 test-results](bolts/B003-verification-contract-alignment/test-results.md) | [PR #275](bolts/B003-verification-contract-alignment/pr.md) | verified |
| `.agents/skills/amadeus-validator/SKILL.md` | B003/T002 | source skill と同じ境界へ同期 | [B003 test-results](bolts/B003-verification-contract-alignment/test-results.md) | [PR #275](bolts/B003-verification-contract-alignment/pr.md) | verified |
| `dev-scripts/evals/amadeus-templates/check.ts` | B003/T003 | decision review 規則と検証境界の text contract を確認 | [B003 test-results](bolts/B003-verification-contract-alignment/test-results.md) | [PR #275](bolts/B003-verification-contract-alignment/pr.md) | verified |
