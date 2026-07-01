# Construction 追跡

## Task Generation からの追跡

| Evidence | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| [tasks.md](bolts/B001-feedback-routing-contract/tasks.md) | B001/T001, B001/T002 | `skills/amadeus-ideation/SKILL.md`, `skills/amadeus-inception/SKILL.md`, `skills/amadeus-construction/SKILL.md`, `.agents/skills/amadeus-ideation/SKILL.md`, `.agents/skills/amadeus-inception/SKILL.md`, `.agents/skills/amadeus-construction/SKILL.md`, `dev-scripts/evals/amadeus-templates/check.ts` | [test-results.md](bolts/B001-feedback-routing-contract/test-results.md) | [PR #265](bolts/B001-feedback-routing-contract/pr.md) | verified |
| [tasks.md](bolts/B002-learning-promotion-contract/tasks.md) | B002/T001, B002/T002 | `skills/amadeus-ideation/SKILL.md`, `skills/amadeus-inception/SKILL.md`, `skills/amadeus-construction/SKILL.md`, `skills/amadeus-validator/SKILL.md`, `.agents/skills/amadeus-ideation/SKILL.md`, `.agents/skills/amadeus-inception/SKILL.md`, `.agents/skills/amadeus-construction/SKILL.md`, `.agents/skills/amadeus-validator/SKILL.md`, `.amadeus/steering/knowledge.md`, `dev-scripts/evals/amadeus-templates/check.ts` | [test-results.md](bolts/B002-learning-promotion-contract/test-results.md) | [PR #265](bolts/B002-learning-promotion-contract/pr.md) | verified |

## Construction からの追跡

| ボルト | タスク | 証拠 | 状態 |
|---|---|---|---|
| B001 | B001/T001, B001/T002 | [test-results.md](bolts/B001-feedback-routing-contract/test-results.md)、[PR #265](bolts/B001-feedback-routing-contract/pr.md) | verified |
| B002 | B002/T001, B002/T002 | [test-results.md](bolts/B002-learning-promotion-contract/test-results.md)、[PR #265](bolts/B002-learning-promotion-contract/pr.md) | verified |

## Deployment Unit からの追跡

| Deployment Unit | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| `skills/amadeus-ideation/SKILL.md` | B001/T001, B002/T001 | 実行時問題報告に feedback routing と learning promotion 分類を追加 | [B001 test-results](bolts/B001-feedback-routing-contract/test-results.md), [B002 test-results](bolts/B002-learning-promotion-contract/test-results.md) | [PR #265](bolts/B001-feedback-routing-contract/pr.md), [PR #265](bolts/B002-learning-promotion-contract/pr.md) | verified |
| `skills/amadeus-inception/SKILL.md` | B001/T001, B002/T001 | 実行時問題報告に feedback routing と learning promotion 分類を追加 | [B001 test-results](bolts/B001-feedback-routing-contract/test-results.md), [B002 test-results](bolts/B002-learning-promotion-contract/test-results.md) | [PR #265](bolts/B001-feedback-routing-contract/pr.md), [PR #265](bolts/B002-learning-promotion-contract/pr.md) | verified |
| `skills/amadeus-construction/SKILL.md` | B001/T001, B002/T001 | 実行時問題報告に feedback routing と learning promotion 分類を追加 | [B001 test-results](bolts/B001-feedback-routing-contract/test-results.md), [B002 test-results](bolts/B002-learning-promotion-contract/test-results.md) | [PR #265](bolts/B001-feedback-routing-contract/pr.md), [PR #265](bolts/B002-learning-promotion-contract/pr.md) | verified |
| `skills/amadeus-validator/SKILL.md` | B002/T001 | 検証結果と学習候補の責務境界を追加 | [B002 test-results](bolts/B002-learning-promotion-contract/test-results.md) | [PR #265](bolts/B002-learning-promotion-contract/pr.md) | verified |
| `.agents/skills/amadeus-ideation/SKILL.md` | B001/T001, B002/T001 | source skill と同じ契約へ同期 | [B001 test-results](bolts/B001-feedback-routing-contract/test-results.md), [B002 test-results](bolts/B002-learning-promotion-contract/test-results.md) | [PR #265](bolts/B001-feedback-routing-contract/pr.md), [PR #265](bolts/B002-learning-promotion-contract/pr.md) | verified |
| `.agents/skills/amadeus-inception/SKILL.md` | B001/T001, B002/T001 | source skill と同じ契約へ同期 | [B001 test-results](bolts/B001-feedback-routing-contract/test-results.md), [B002 test-results](bolts/B002-learning-promotion-contract/test-results.md) | [PR #265](bolts/B001-feedback-routing-contract/pr.md), [PR #265](bolts/B002-learning-promotion-contract/pr.md) | verified |
| `.agents/skills/amadeus-construction/SKILL.md` | B001/T001, B002/T001 | source skill と同じ契約へ同期 | [B001 test-results](bolts/B001-feedback-routing-contract/test-results.md), [B002 test-results](bolts/B002-learning-promotion-contract/test-results.md) | [PR #265](bolts/B001-feedback-routing-contract/pr.md), [PR #265](bolts/B002-learning-promotion-contract/pr.md) | verified |
| `.agents/skills/amadeus-validator/SKILL.md` | B002/T001 | source skill と同じ契約へ同期 | [B002 test-results](bolts/B002-learning-promotion-contract/test-results.md) | [PR #265](bolts/B002-learning-promotion-contract/pr.md) | verified |
| `.amadeus/steering/knowledge.md` | B002/T001 | 後段発見と横断学習の共通知識を追加 | [B002 test-results](bolts/B002-learning-promotion-contract/test-results.md) | [PR #265](bolts/B002-learning-promotion-contract/pr.md) | verified |
| `dev-scripts/evals/amadeus-templates/check.ts` | B001/T002, B002/T002 | feedback routing、learning promotion、validator 境界の text contract を追加 | [B001 test-results](bolts/B001-feedback-routing-contract/test-results.md), [B002 test-results](bolts/B002-learning-promotion-contract/test-results.md) | [PR #265](bolts/B001-feedback-routing-contract/pr.md), [PR #265](bolts/B002-learning-promotion-contract/pr.md) | verified |
