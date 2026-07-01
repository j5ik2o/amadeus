# Construction Tasks

- [x] T001: verification hardening の source skill 案内を更新する。
  - 作業:
    - `skills/amadeus-construction-verification-hardening/SKILL.md` の `次の skill` 欄を更新する。
    - 検証後の追跡と状態確定へ進む場合は `amadeus-construction` をファイナライズ目的で呼ぶことを明記する。
    - 親 skill が `amadeus-construction-traceability-finalization` に委譲することを明記する。
    - `amadeus-construction-traceability-finalization` を直接呼ぶ条件を、親 skill からファイナライズプロセスを明示的に委譲されている場合だけにする。
  - 要求: R002, R003, R004
  - ユースケース: UC003
  - 依存: なし
  - 設計根拠: ../../U001-construction-next-skill-guidance/functional-design/business-logic-model.md
  - 証拠: [test-results.md](test-results.md)

- [x] T002: verification hardening の昇格先成果物へ反映する。
  - 作業:
    - `dev-scripts/promote-skill.ts` を使って、`skills/amadeus-construction-verification-hardening` の変更を `.agents/skills/amadeus-construction-verification-hardening` へ反映する。
    - source skill と昇格先成果物の `次の skill` 欄が整合していることを確認する。
  - 要求: R005
  - ユースケース: UC003
  - 依存: T001
  - 設計根拠: ../../U001-construction-next-skill-guidance/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)
