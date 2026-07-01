# Construction Tasks

- [x] T001: 公開 phase skill に decision review 起動時規則を追加する。
  - 作業:
    - `skills/amadeus-ideation/SKILL.md`、`skills/amadeus-inception/SKILL.md`、`skills/amadeus-construction/SKILL.md` に共通の decision review 参照規則を追加する。
    - `guided`、`refine`、`repair` と decision review outcome の関係を明記する。
    - Discovery、Event Storming、Steering への初期一括適用を対象外として明記する。
  - 要求: R004
  - ユースケース: UC003
  - 依存: B001/T001
  - 設計根拠: ../../U002-phase-skill-adoption-verification/functional-design/business-logic-model.md
  - 証拠: [test-results.md](test-results.md), [PR #275](pr.md)

- [x] T002: 昇格先 phase skill を source skill と同期する。
  - 作業:
    - `.agents/skills/amadeus-ideation/SKILL.md`、`.agents/skills/amadeus-inception/SKILL.md`、`.agents/skills/amadeus-construction/SKILL.md` を source skill と同じ規則にそろえる。
    - source skill と昇格先 skill の差分が残らないことを確認する。
  - 要求: R004
  - ユースケース: UC003
  - 依存: T001
  - 設計根拠: ../../U002-phase-skill-adoption-verification/functional-design/domain-entities.md
  - 証拠: [test-results.md](test-results.md), [PR #275](pr.md)
