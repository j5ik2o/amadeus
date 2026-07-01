# Construction Tasks

- [x] T001: Inception template に参照リンク適用範囲を追加する
  - 作業:
    - `skills/amadeus-inception/templates/intents/inception/traceability.md` に参照リンク化対象の適用範囲を追加する。
    - `skills/amadeus-inception/templates/intents/inception/decisions.md` に判断一覧での参照リンク方針を追加する。
    - `bun run dev-scripts/promote-skill.ts amadeus-inception --replace` で source skill の変更を `.agents/skills/amadeus-inception` へ反映する。
  - 要求: R003
  - ユースケース: UC002
  - 依存: B001/T001, B001/T002
  - 設計根拠: ../../U001-reference-link-contract/functional-design/business-logic-model.md
  - 証拠: [test-results.md](test-results.md)、[PR #285](https://github.com/amadeus-dlc/amadeus/pull/285)、`skills/amadeus-inception/templates/intents/inception/traceability.md`

- [x] T002: 既存成果物の PR 番号参照をリンク化する
  - 作業:
    - `.amadeus/intents/20260701-self-development-cycle-stage-workspace/**` の PR番号参照を、内容意味を変えずに GitHub Pull Request URL へリンク化する。
    - 既存成果物の補修範囲を、参照リンク化に限る。
  - 要求: R003
  - ユースケース: UC002
  - 依存: B001/T002
  - 設計根拠: ../../U001-reference-link-contract/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)、[PR #285](https://github.com/amadeus-dlc/amadeus/pull/285)、`.amadeus/intents/20260701-self-development-cycle-stage-workspace/construction/traceability.md`

- [x] T003: example snapshot の扱いを記録する
  - 作業:
    - example snapshot は手作業で部分補修せず、source skill と validator の契約が揃った後の再生成対象として扱う判断を記録する。
    - B002 では example snapshot の内容を直接変更しない。
  - 要求: R003
  - ユースケース: UC002
  - 依存: T001
  - 設計根拠: ../../U001-reference-link-contract/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)、[PR #285](https://github.com/amadeus-dlc/amadeus/pull/285)、[D003](../../decisions/D003-artifact-application-scope.md)
