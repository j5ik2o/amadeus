# Construction Tasks

- [x] T001: Skill Contract 型を追加する。
  - 作業:
    - `amadeus-contracts/catalog/skill-contract.ts` を追加する。
    - prerequisites、invariants、postconditions、read boundary、write boundary、delegation、grilling、feedback、consumer reference を表現できる型を定義する。
    - `amadeus-contracts/catalog/types.ts` と `amadeus-contracts/catalog/index.ts` から型を公開する。
  - 要求: R001, R002, R005
  - ユースケース: UC001, UC003
  - 依存: なし
  - 設計根拠: ../../U001-skill-contract-catalog-model/functional-design/business-logic-model.md
  - 証拠: [test-results.md](test-results.md)

- [x] T002: 代表 skill の Skill Contract catalog を追加する。
  - 作業:
    - `amadeus-contracts/catalog/skills.ts` を追加する。
    - `amadeus-ideation`、`amadeus-inception`、`amadeus-construction`、`amadeus-grilling`、`amadeus-validator` の契約を定義する。
    - `amadeus-contracts/catalog/index.ts` から catalog を公開する。
  - 要求: R001, R002, R005
  - ユースケース: UC001, UC003
  - 依存: T001
  - 設計根拠: ../../U001-skill-contract-catalog-model/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)
