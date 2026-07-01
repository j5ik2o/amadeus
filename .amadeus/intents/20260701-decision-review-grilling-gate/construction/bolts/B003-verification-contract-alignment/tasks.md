# Construction Tasks

- [x] T001: Skill Contract と decision review の接続を確認する。
  - 作業:
    - `amadeus-contracts/catalog/skills.ts` の `decision-review` consumer 参照を確認する。
    - 必要な場合だけ、decision review の入力証拠として扱う説明を補う。
  - 要求: R005
  - ユースケース: UC001, UC003
  - 依存: B001/T001, B002/T001
  - 設計根拠: ../../U002-phase-skill-adoption-verification/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md), [PR #275](pr.md)

- [x] T002: validator と evaluator の責務境界を skill に明記する。
  - 作業:
    - `skills/amadeus-validator/SKILL.md` と `.agents/skills/amadeus-validator/SKILL.md` が、validator の `pass` を内容承認として扱わないことを説明しているか確認する。
    - 必要な場合だけ、decision review との境界説明を補う。
  - 要求: R005
  - ユースケース: UC003
  - 依存: T001
  - 設計根拠: ../../U002-phase-skill-adoption-verification/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md), [PR #275](pr.md)

- [x] T003: eval の確認項目を decision review 境界へ合わせる。
  - 作業:
    - `dev-scripts/evals/amadeus-templates/check.ts` または既存の contract eval で、decision review 規則と検証境界を確認できるか調べる。
    - 必要な場合だけ、公開 phase skill と昇格先 skill の text contract を追加する。
  - 要求: R005
  - ユースケース: UC003
  - 依存: T002
  - 設計根拠: ../../U002-phase-skill-adoption-verification/functional-design/domain-entities.md
  - 証拠: [test-results.md](test-results.md), [PR #275](pr.md)
