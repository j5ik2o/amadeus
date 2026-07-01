# Construction Tasks

- [x] T001: `amadeus-discovery` に dry-run consumer 境界を追加する。
  - 作業:
    - `skills/amadeus-discovery/SKILL.md` に Issue #272 の `dry-run` 境界を追記する。
    - `amadeus-history-review` と `amadeus-learning-review` の結果を入力にできることを説明する。
    - `amadeus-discovery` が過去分析と学習分類を所有しないことを説明する。
  - 要求: R004
  - ユースケース: UC003
  - 依存: B002/T001
  - 設計根拠: ../../U002-learning-review-consumer-contract/functional-design/business-logic-model.md
  - 証拠: test-results.md

- [x] T002: discovery skill を昇格し、text contract を更新する。
  - 作業:
    - `dev-scripts/promote-skill.ts amadeus-discovery --replace` で `.agents/skills/amadeus-discovery/SKILL.md` を同期する。
    - `dev-scripts/evals/amadeus-templates/check.ts` の discovery text contract に `history-review`、`learning-review`、`dry-run` 境界を追加する。
  - 要求: R004, R005
  - ユースケース: UC003
  - 依存: T001
  - 設計根拠: ../../U002-learning-review-consumer-contract/functional-design/business-rules.md
  - 証拠: test-results.md
