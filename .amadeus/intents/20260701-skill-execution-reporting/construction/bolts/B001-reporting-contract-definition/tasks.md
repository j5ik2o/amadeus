# Construction Tasks

- [x] T001: 公開 skill に報告先分類を追加する。
  - 作業:
    - `amadeus-ideation`、`amadeus-inception`、`amadeus-construction` に `実行時問題報告` 節を追加する。
    - 現在の Intent 対象、後続 Issue 候補、報告不要の分類基準を明記する。
    - 現在の Intent と無関係な改善を成果物へ混ぜない方針を明記する。
  - 要求: R001, R003
  - ユースケース: UC001, UC002
  - 依存: なし
  - 設計根拠: ../../U001-reporting-contract/functional-design/business-logic-model.md
  - 証拠: [test-results.md](test-results.md)

- [x] T002: 最低報告項目と検証境界を追加する。
  - 作業:
    - 問題または懸念の要約、発見 skill、対象、影響範囲、推奨分類、根拠、検出候補を最低報告項目として明記する。
    - 秘密情報や不要な個人情報を含めない制約を明記する。
    - validator の `pass` を内容承認として扱わない制約を明記する。
  - 要求: R002, R003
  - ユースケース: UC001
  - 依存: T001
  - 設計根拠: ../../U001-reporting-contract/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)
