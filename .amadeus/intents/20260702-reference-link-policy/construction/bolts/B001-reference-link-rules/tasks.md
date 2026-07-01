# Construction Tasks

- [x] T001: Functional Design template に参照リンク対象を追加する
  - 作業:
    - `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-logic-model.md` に参照表記の分類手順を追加する。
    - `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/domain-entities.md` に参照リンク化対象を扱う Domain Entity を追加する。
  - 要求: R001
  - ユースケース: UC001
  - 依存: なし
  - 設計根拠: ../../U001-reference-link-contract/functional-design/domain-entities.md
  - 証拠: [test-results.md](test-results.md)、`skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/domain-entities.md`

- [x] T002: Functional Design template にリンク先規則を追加する
  - 作業:
    - `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-rules.md` に workspace 内成果物、GitHub permalink、PR番号、Issue番号のリンク先規則を追加する。
    - `bun run dev-scripts/promote-skill.ts amadeus-construction --replace` で source skill の変更を `.agents/skills/amadeus-construction` へ反映する。
  - 要求: R002
  - ユースケース: UC001
  - 依存: T001
  - 設計根拠: ../../U001-reference-link-contract/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)、`skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-rules.md`
