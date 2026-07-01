# Construction Tasks

- [x] T001: development.md の PR 準備条件から skill 変更時の追加条件を追跡できるようにする。
  - 作業:
    - `.amadeus/development.md` の PR 準備条件に、skill 変更では挙動差分要約、skill-forge 確認の記録、粒度制約の確認が必須条件に含まれることを追跡できる記述を追加する。
    - 定義の詳細は `steering/policies.md` の変更種別表を参照する形にする。
  - 要求: R004
  - ユースケース: UC002
  - 依存: B001/T001, B001/T002
  - 設計根拠: ../../U001-skill-change-review-contract/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)

- [x] T002: README（英語、日本語）の skill-forge 記述を必須へ書き換える。
  - 作業:
    - `README.md` の skill-forge 記述を、skill 変更 PR では skill-forge 確認と結果の記録が必須（must）であることが分かる記述へ書き換える。
    - `README.ja.md` の対応記述も同じ内容へ書き換える。
    - 必須条件の詳細の定義元が steering policies であることを読み取れるようにする。
  - 要求: R004
  - ユースケース: UC002
  - 依存: B001/T001
  - 設計根拠: ../../U001-skill-change-review-contract/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)
