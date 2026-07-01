# Construction 追跡

## Task Generation からの追跡

| Evidence | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| [tasks.md](bolts/B001-skill-contract-catalog-model/tasks.md) | B001/T001, B001/T002 | `amadeus-contracts/catalog/skill-contract.ts`, `amadeus-contracts/catalog/skills.ts`, `amadeus-contracts/catalog/index.ts`, `amadeus-contracts/catalog/types.ts` | [test-results.md](bolts/B001-skill-contract-catalog-model/test-results.md) | [PR #269](bolts/B001-skill-contract-catalog-model/pr.md) | verified |
| [tasks.md](bolts/B002-skill-contract-generation-and-drift/tasks.md) | B002/T001, B002/T002 | `dev-scripts/amadeus-contracts.ts`, `dev-scripts/evals/amadeus-contracts/check.ts`, `amadeus-contracts/generated/skills.json`, `skills/amadeus-*/references/skill-contract.md`, `.agents/skills/amadeus-*/references/skill-contract.md`, `skills/amadeus-validator/validator/generated/skill-contracts.ts`, `.agents/skills/amadeus-validator/validator/generated/skill-contracts.ts` | [test-results.md](bolts/B002-skill-contract-generation-and-drift/test-results.md) | [PR #269](bolts/B002-skill-contract-generation-and-drift/pr.md) | verified |
| [tasks.md](bolts/B003-skill-contract-consumer-integration/tasks.md) | B003/T001, B003/T002 | `amadeus-contracts/catalog/skills.ts`, `dev-scripts/amadeus-contracts.ts`, `skills/amadeus-*/references/skill-contract.md`, `skills/amadeus-validator/validator/generated/skill-contracts.ts` | [test-results.md](bolts/B003-skill-contract-consumer-integration/test-results.md) | [PR #269](bolts/B003-skill-contract-consumer-integration/pr.md) | verified |

## Construction からの追跡

| ボルト | タスク | 証拠 | 状態 |
|---|---|---|---|
| B001 | B001/T001, B001/T002 | [test-results.md](bolts/B001-skill-contract-catalog-model/test-results.md)、[PR #269](bolts/B001-skill-contract-catalog-model/pr.md) | verified |
| B002 | B002/T001, B002/T002 | [test-results.md](bolts/B002-skill-contract-generation-and-drift/test-results.md)、[PR #269](bolts/B002-skill-contract-generation-and-drift/pr.md) | verified |
| B003 | B003/T001, B003/T002 | [test-results.md](bolts/B003-skill-contract-consumer-integration/test-results.md)、[PR #269](bolts/B003-skill-contract-consumer-integration/pr.md) | verified |

## Deployment Unit からの追跡

| Deployment Unit | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| `amadeus-contracts/catalog/skill-contract.ts` | B001/T001 | Skill Contract 型を追加 | [B001 test-results](bolts/B001-skill-contract-catalog-model/test-results.md) | [PR #269](bolts/B001-skill-contract-catalog-model/pr.md) | verified |
| `amadeus-contracts/catalog/skills.ts` | B001/T002, B003/T001 | 代表 skill 5件の contract と consumer 参照情報を追加 | [B001 test-results](bolts/B001-skill-contract-catalog-model/test-results.md), [B003 test-results](bolts/B003-skill-contract-consumer-integration/test-results.md) | [PR #269](bolts/B001-skill-contract-catalog-model/pr.md), [PR #269](bolts/B003-skill-contract-consumer-integration/pr.md) | verified |
| `dev-scripts/amadeus-contracts.ts` | B002/T001, B003/T001 | Skill Contract の JSON、Markdown、validator 用 TypeScript 生成を追加 | [B002 test-results](bolts/B002-skill-contract-generation-and-drift/test-results.md), [B003 test-results](bolts/B003-skill-contract-consumer-integration/test-results.md) | [PR #269](bolts/B002-skill-contract-generation-and-drift/pr.md), [PR #269](bolts/B003-skill-contract-consumer-integration/pr.md) | verified |
| `dev-scripts/evals/amadeus-contracts/check.ts` | B002/T002, B003/T002 | Skill Contract 生成物の追跡、直接編集検出、consumer 参照確認を追加 | [B002 test-results](bolts/B002-skill-contract-generation-and-drift/test-results.md), [B003 test-results](bolts/B003-skill-contract-consumer-integration/test-results.md) | [PR #269](bolts/B002-skill-contract-generation-and-drift/pr.md), [PR #269](bolts/B003-skill-contract-consumer-integration/pr.md) | verified |
| `amadeus-contracts/generated/skills.json` | B002/T001, B003/T001 | Skill Contract catalog の JSON 生成物を追加 | [B002 test-results](bolts/B002-skill-contract-generation-and-drift/test-results.md), [B003 test-results](bolts/B003-skill-contract-consumer-integration/test-results.md) | [PR #269](bolts/B002-skill-contract-generation-and-drift/pr.md), [PR #269](bolts/B003-skill-contract-consumer-integration/pr.md) | verified |
| `skills/amadeus-*/references/skill-contract.md` | B002/T001, B003/T001, B003/T002 | 代表 skill の Skill Contract 参照文書を生成 | [B002 test-results](bolts/B002-skill-contract-generation-and-drift/test-results.md), [B003 test-results](bolts/B003-skill-contract-consumer-integration/test-results.md) | [PR #269](bolts/B002-skill-contract-generation-and-drift/pr.md), [PR #269](bolts/B003-skill-contract-consumer-integration/pr.md) | verified |
| `.agents/skills/amadeus-*/references/skill-contract.md` | B002/T001, B003/T001, B003/T002 | 開発用 skill の Skill Contract 参照文書を生成 | [B002 test-results](bolts/B002-skill-contract-generation-and-drift/test-results.md), [B003 test-results](bolts/B003-skill-contract-consumer-integration/test-results.md) | [PR #269](bolts/B002-skill-contract-generation-and-drift/pr.md), [PR #269](bolts/B003-skill-contract-consumer-integration/pr.md) | verified |
| `skills/amadeus-validator/validator/generated/skill-contracts.ts` | B002/T001, B003/T001 | validator 用 Skill Contract 生成物を追加 | [B002 test-results](bolts/B002-skill-contract-generation-and-drift/test-results.md), [B003 test-results](bolts/B003-skill-contract-consumer-integration/test-results.md) | [PR #269](bolts/B002-skill-contract-generation-and-drift/pr.md), [PR #269](bolts/B003-skill-contract-consumer-integration/pr.md) | verified |
| `.agents/skills/amadeus-validator/validator/generated/skill-contracts.ts` | B002/T001, B003/T001 | 開発用 validator の Skill Contract 生成物を追加 | [B002 test-results](bolts/B002-skill-contract-generation-and-drift/test-results.md), [B003 test-results](bolts/B003-skill-contract-consumer-integration/test-results.md) | [PR #269](bolts/B002-skill-contract-generation-and-drift/pr.md), [PR #269](bolts/B003-skill-contract-consumer-integration/pr.md) | verified |
