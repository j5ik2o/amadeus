# Construction Tasks

- [x] T001: phase skill の実行時問題報告へ feedback routing 分類を追加する。
  - 作業:
    - `skills/amadeus-ideation/SKILL.md`、`skills/amadeus-inception/SKILL.md`、`skills/amadeus-construction/SKILL.md` の `実行時問題報告` を拡張する。
    - `.agents/skills/amadeus-ideation/SKILL.md`、`.agents/skills/amadeus-inception/SKILL.md`、`.agents/skills/amadeus-construction/SKILL.md` を同じ契約にそろえる。
    - `upstream_feedback_required`、`current_phase_update_required`、`follow_up_issue_candidate`、`follow_up_intent_candidate`、`no_learning_action` の分類と戻り先を明記する。
    - Issue #257 の decision review と #259 の feedback routing の責務境界を明記する。
  - 要求: R001, R002, R005
  - ユースケース: UC001, UC003
  - 依存: なし
  - 設計根拠: ../../U001-feedback-routing-contract/functional-design/business-logic-model.md
  - 証拠: [test-results.md](test-results.md)

- [x] T002: feedback routing 契約を eval の text contract に追加する。
  - 作業:
    - `dev-scripts/evals/amadeus-templates/check.ts` で公開 phase skill と昇格済み skill が新分類を含むことを確認する。
    - validator の `pass` と evaluator の品質評価を内容承認にしない境界を期待値へ含める。
  - 要求: R001, R002, R005
  - ユースケース: UC001, UC003
  - 依存: T001
  - 設計根拠: ../../U001-feedback-routing-contract/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)
