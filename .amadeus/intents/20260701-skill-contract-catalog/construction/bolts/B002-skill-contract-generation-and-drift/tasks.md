# Construction Tasks

- [x] T001: Skill Contract 生成物を `generatedContractFiles` に追加する。
  - 作業:
    - `amadeus-contracts/generated/skills.json` を生成対象に追加する。
    - 代表 skill の `references/skill-contract.md` を生成対象に追加する。
    - validator 用 `skill-contracts.ts` を生成対象に追加する。
  - 要求: R003, R004, R005
  - ユースケース: UC002, UC003
  - 依存: B001/T002
  - 設計根拠: ../../U002-skill-contract-generation-and-drift/functional-design/business-logic-model.md
  - 証拠: [test-results.md](test-results.md)

- [x] T002: Skill Contract 生成物のずれ検出を eval に追加する。
  - 作業:
    - `dev-scripts/evals/amadeus-contracts/check.ts` に Skill Contract 生成物の追跡確認を追加する。
    - 直接編集検出の対象に `skills.json` を含める。
    - `contracts:generate` で生成物を作成する。
  - 要求: R004
  - ユースケース: UC002
  - 依存: T001
  - 設計根拠: ../../U002-skill-contract-generation-and-drift/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)
