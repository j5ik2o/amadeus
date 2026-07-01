# Construction Tasks

- [x] T001: 周辺 Construction 内部 skill の案内を確認して更新する。
  - 作業:
    - `skills/amadeus-construction-functional-design/SKILL.md` の `次の skill` 欄を確認し、親 skill 経由の案内へ更新する。
    - `skills/amadeus-construction-bolt-preparation/SKILL.md` の `次の skill` 欄を確認し、親 skill 経由の案内へ更新する。
    - `skills/amadeus-construction-traceability-finalization/SKILL.md` の検証不足時案内を確認し、親 skill 経由の案内へ更新する。
  - 要求: R003, R004, R005
  - ユースケース: UC004
  - 依存: なし
  - 設計根拠: ../../U001-construction-next-skill-guidance/functional-design/business-logic-model.md
  - 証拠: [test-results.md](test-results.md)

- [x] T002: 周辺 skill の昇格先成果物へ反映する。
  - 作業:
    - `dev-scripts/promote-skill.ts` を使って、対象 source skill の変更を `.agents/skills/**` へ反映する。
    - source skill と昇格先成果物の案内が整合していることを確認する。
  - 要求: R005
  - ユースケース: UC004
  - 依存: T001
  - 設計根拠: ../../U001-construction-next-skill-guidance/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)

- [x] T003: 整合確認の判断を記録する。
  - 作業:
    - B001、B002、B003 の更新範囲を Construction traceability と decisions に反映する。
    - `amadeus-construction-traceability-finalization` の `次の skill` 欄は直接内部 skill を案内していないため、更新不要であることを記録する。
  - 要求: R005
  - ユースケース: UC004
  - 依存: T002
  - 設計根拠: ../../U001-construction-next-skill-guidance/functional-design/domain-entities.md
  - 証拠: [test-results.md](test-results.md)
