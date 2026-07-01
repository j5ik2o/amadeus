# Construction Tasks

- [x] T001: `amadeus-history-review` の source skill を追加する。
  - 作業:
    - `skills/amadeus-history-review/SKILL.md` を追加する。
    - 読み取り対象、抽出結果、境界、検証境界、次の skill を説明する。
    - 成果物更新、GitHub Issue 作成、Intent Record 作成、Domain Map と Context Map への自動昇格を行わないことを明記する。
  - 要求: R001, R002
  - ユースケース: UC001
  - 依存: なし
  - 設計根拠: ../../U001-history-review-contract/functional-design/business-logic-model.md
  - 証拠: test-results.md

- [x] T002: `amadeus-history-review` を昇格し、text contract を追加する。
  - 作業:
    - `dev-scripts/promote-skill.ts` で `.agents/skills/amadeus-history-review/SKILL.md` を追加する。
    - `dev-scripts/evals/amadeus-templates/check.ts` に主要責務境界の text contract を追加する。
  - 要求: R005
  - ユースケース: UC003
  - 依存: T001
  - 設計根拠: ../../U001-history-review-contract/functional-design/business-rules.md
  - 証拠: test-results.md
