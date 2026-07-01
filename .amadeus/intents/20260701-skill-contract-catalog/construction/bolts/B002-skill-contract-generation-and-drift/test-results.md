# テスト結果

## 検証結果

| 種別 | コマンドまたは確認 | 結果 | 証拠 |
|---|---|---|---|
| 生成 | `npm run contracts:generate` | pass | Skill Contract 生成物を作成した。 |
| lint | `npm run lint:check` | pass | public type file と ts complexity の規約を確認した。 |
| contract check | `npm run contracts:check` | pass | 生成物の欠落と差分がないことを確認した。 |
| eval | `npm run test:it:amadeus-contracts` | pass | `skills.json` と `references/skill-contract.md` の追跡、直接編集検出を確認した。 |
| 型検査 | `npm run typecheck` | pass | validator 用 TypeScript 生成物を含めて型整合を確認した。 |
| 構造検証 | `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260701-skill-contract-catalog` | pass | Construction 成果物の構造検証が成功した。 |
| 差分検査 | `npm run diff:check` | pass | whitespace error がないことを確認した。 |

## 安全性確認

| 観点 | 結果 | 根拠 |
|---|---|---|
| 生成対象 | pass | 生成対象は `generatedContractFiles` に集約した。 |
| 手編集防止 | pass | 参照文書に直接編集禁止を明記した。 |
| 破壊的操作 | pass | merge 操作や破壊的な git 操作は行っていない。 |

## CI確認

| 入口 | 結果 | 根拠 |
|---|---|---|
| ローカル | pass | contracts:generate、contracts:check、contract eval、typecheck、lint、Amadeus Validator、diff check が成功した。 |
| GitHub Actions | 未実行 | PR 作成後に確認する。 |

## 受け入れ証拠

| 要求 | タスク | 証拠 | 要約 |
|---|---|---|---|
| R003 | B002/T001 | `amadeus-contracts/generated/skills.json`、`skills/amadeus-*/references/skill-contract.md`、`skills/amadeus-validator/validator/generated/skill-contracts.ts` | Skill Contract 生成物を追加した。 |
| R004 | B002/T002 | `dev-scripts/evals/amadeus-contracts/check.ts` | Skill Contract 生成物の追跡と直接編集検出を追加した。 |
| R005 | B002/T001 | `skills/amadeus-validator/validator/generated/skill-contracts.ts` | validator 用参照入口を生成した。 |
