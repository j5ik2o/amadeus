# Construction Tasks

- [x] T001: `amadeus-learning-review` の source skill を追加する。
  - 作業:
    - `skills/amadeus-learning-review/SKILL.md` を追加する。
    - 学習分類、戻り先、`amadeus-grilling` 連携、phase skill 連携を説明する。
    - validator の `pass` を内容承認として扱わないことを明記する。
  - 要求: R003
  - ユースケース: UC002
  - 依存: B001/T001
  - 設計根拠: ../../U002-learning-review-consumer-contract/functional-design/business-logic-model.md
  - 証拠: test-results.md

- [x] T002: `amadeus-learning-review` を昇格し、text contract を追加する。
  - 作業:
    - `dev-scripts/promote-skill.ts` で `.agents/skills/amadeus-learning-review/SKILL.md` を追加する。
    - `dev-scripts/evals/amadeus-templates/check.ts` に Issue #259 と整合する分類契約を追加する。
  - 要求: R003, R005
  - ユースケース: UC002, UC003
  - 依存: T001
  - 設計根拠: ../../U002-learning-review-consumer-contract/functional-design/business-rules.md
  - 証拠: test-results.md
