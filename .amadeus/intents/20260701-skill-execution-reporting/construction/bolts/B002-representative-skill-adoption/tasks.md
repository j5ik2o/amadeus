# Construction Tasks

- [x] T001: source skill を昇格先 skill へ反映する。
  - 作業:
    - `dev-scripts/promote-skill.ts amadeus-ideation --replace` を実行する。
    - `dev-scripts/promote-skill.ts amadeus-inception --replace` を実行する。
    - `dev-scripts/promote-skill.ts amadeus-construction --replace` を実行する。
    - `.agents/skills` の代表 skill が source skill と同じ報告契約を持つことを確認する。
  - 要求: R004
  - ユースケース: UC003
  - 依存: B001/T001, B001/T002
  - 設計根拠: ../../U002-skill-adoption-verification/functional-design/business-logic-model.md
  - 証拠: [test-results.md](test-results.md)

- [x] T002: amadeus templates eval の契約を更新する。
  - 作業:
    - `dev-scripts/evals/amadeus-templates/check.ts` に `amadeus-ideation` の text contract を追加する。
    - `amadeus-inception` と `amadeus-construction` の text contract に報告契約の期待文言を追加する。
    - source skill と昇格先 skill の両方で同じ報告契約を確認できるようにする。
  - 要求: R004
  - ユースケース: UC003
  - 依存: T001
  - 設計根拠: ../../U002-skill-adoption-verification/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)
