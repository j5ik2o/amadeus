# Construction Tasks

- [x] T001: 変更種別表「skill 変更」の必須条件へ記録契約を追加する。
  - 作業:
    - `.amadeus/steering/policies.md` の変更種別表「skill 変更」の必須条件に、挙動差分の3観点（変わる判断、変わる成果物構造、影響する後続 phase）の記録を追加する。補足は自由記述と読み取れるようにする。
    - 同じ必須条件に、skill-forge による確認の実施と、PR 説明の固定見出し「skill-forge 確認」への記録（確認した観点、確認結果）を追加する。
  - 要求: R001, R002
  - ユースケース: UC001, UC002
  - 依存: なし
  - 設計根拠: ../../U001-skill-change-review-contract/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)

- [x] T002: 粒度制約と例外一般則を判断基準へ追加する。
  - 作業:
    - `.amadeus/steering/policies.md` の判断基準に、skill 変更 PR は skill 変更だけで構成する既定と、source skill と昇格先成果物の同期は skill 変更の一部として常に同一 PR に含めることを追加する。
    - 例外の判定基準として、分割するとどちらかの PR 単独で検証が fail する不可分な場合だけを許容することを追加する。
    - 例外時に理由と後続確認先を PR 説明へ記録する条件を、Git Branching Policy の例外記録と同じ型で追加する。
    - 記述は肯定形の判断基準を先に示す形にする。
  - 要求: R003
  - ユースケース: UC001, UC003
  - 依存: T001
  - 設計根拠: ../../U001-skill-change-review-contract/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)
