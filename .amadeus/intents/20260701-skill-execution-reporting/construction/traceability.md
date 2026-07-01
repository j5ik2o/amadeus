# Construction 追跡

## Task Generation からの追跡

| Evidence | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| [tasks.md](bolts/B001-reporting-contract-definition/tasks.md) | B001/T001, B001/T002 | `skills/amadeus-ideation/SKILL.md`, `skills/amadeus-inception/SKILL.md`, `skills/amadeus-construction/SKILL.md` | [test-results.md](bolts/B001-reporting-contract-definition/test-results.md) | 未作成 | satisfied |
| [tasks.md](bolts/B002-representative-skill-adoption/tasks.md) | B002/T001, B002/T002 | `.agents/skills/amadeus-ideation/SKILL.md`, `.agents/skills/amadeus-inception/SKILL.md`, `.agents/skills/amadeus-construction/SKILL.md`, `dev-scripts/evals/amadeus-templates/check.ts` | [test-results.md](bolts/B002-representative-skill-adoption/test-results.md) | 未作成 | satisfied |

## Construction からの追跡

| ボルト | タスク | 証拠 | 状態 |
|---|---|---|---|
| B001 | B001/T001, B001/T002 | [test-results.md](bolts/B001-reporting-contract-definition/test-results.md) | satisfied |
| B002 | B002/T001, B002/T002 | [test-results.md](bolts/B002-representative-skill-adoption/test-results.md) | satisfied |

## Deployment Unit からの追跡

| Deployment Unit | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| `skills/amadeus-ideation/SKILL.md` | B001/T001, B001/T002 | `実行時問題報告` 節を追加 | [B001 test-results](bolts/B001-reporting-contract-definition/test-results.md) | 未作成 | satisfied |
| `skills/amadeus-inception/SKILL.md` | B001/T001, B001/T002 | `実行時問題報告` 節を追加 | [B001 test-results](bolts/B001-reporting-contract-definition/test-results.md) | 未作成 | satisfied |
| `skills/amadeus-construction/SKILL.md` | B001/T001, B001/T002 | `実行時問題報告` 節を追加 | [B001 test-results](bolts/B001-reporting-contract-definition/test-results.md) | 未作成 | satisfied |
| `.agents/skills/amadeus-ideation/SKILL.md` | B002/T001 | source skill から昇格 | [B002 test-results](bolts/B002-representative-skill-adoption/test-results.md) | 未作成 | satisfied |
| `.agents/skills/amadeus-inception/SKILL.md` | B002/T001 | source skill から昇格 | [B002 test-results](bolts/B002-representative-skill-adoption/test-results.md) | 未作成 | satisfied |
| `.agents/skills/amadeus-construction/SKILL.md` | B002/T001 | source skill から昇格 | [B002 test-results](bolts/B002-representative-skill-adoption/test-results.md) | 未作成 | satisfied |
| `dev-scripts/evals/amadeus-templates/check.ts` | B002/T002 | 報告契約の text contract を追加 | [B002 test-results](bolts/B002-representative-skill-adoption/test-results.md) | 未作成 | satisfied |
