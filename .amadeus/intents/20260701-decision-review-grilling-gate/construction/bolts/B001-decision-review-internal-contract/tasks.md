# Construction Tasks

- [x] T001: `amadeus-decision-review` の source skill を追加する。
  - 作業:
    - `skills/amadeus-decision-review/SKILL.md` を作成する。
    - decision review の入力証拠、判断ノード、outcome、grilling handoff を定義する。
    - decision review 自体は質問を実行しないことを明記する。
  - 要求: R001, R002, R003
  - ユースケース: UC001, UC002
  - 依存: なし
  - 設計根拠: ../../U001-decision-review-gate-contract/functional-design/business-logic-model.md
  - 証拠: [test-results.md](test-results.md), [PR #275](pr.md)

- [x] T002: `amadeus-decision-review` を昇格先 skill へ同期する。
  - 作業:
    - `.agents/skills/amadeus-decision-review/SKILL.md` を source skill と同じ契約で作成する。
    - source skill と昇格先 skill の説明、目的、入力、出力、禁止事項をそろえる。
  - 要求: R001, R002, R003
  - ユースケース: UC001, UC002
  - 依存: T001
  - 設計根拠: ../../U001-decision-review-gate-contract/functional-design/domain-entities.md
  - 証拠: [test-results.md](test-results.md), [PR #275](pr.md)
