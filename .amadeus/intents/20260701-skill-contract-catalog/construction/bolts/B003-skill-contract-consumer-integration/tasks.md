# Construction Tasks

- [x] T001: consumer 参照入口を Skill Contract 生成物に含める。
  - 作業:
    - validator、evaluator、decision review、learning review の consumer 参照情報を catalog に含める。
    - Markdown 生成物に consumer 参照入口を出力する。
    - validator 用 `skill-contracts.ts` で consumer 参照情報を参照できるようにする。
  - 要求: R005
  - ユースケース: UC003
  - 依存: B001/T002, B002/T001
  - 設計根拠: ../../U003-skill-contract-consumer-integration/functional-design/business-logic-model.md
  - 証拠: [test-results.md](test-results.md)

- [x] T002: validator と evaluator の責務境界を生成物で確認できるようにする。
  - 作業:
    - Skill Contract 生成物に validator は構造検出、evaluator は品質評価入力であることを出力する。
    - #257 と #259 の review が参照する契約項目を生成物へ出力する。
    - contract eval で consumer 参照情報の存在を確認する。
  - 要求: R005
  - ユースケース: UC003
  - 依存: T001
  - 設計根拠: ../../U003-skill-contract-consumer-integration/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)
