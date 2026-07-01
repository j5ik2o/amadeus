# Construction Tasks

- [x] T001: learning promotion と成果物責務の契約を skill に追加する。
  - 作業:
    - phase skill の `実行時問題報告` に `steering_knowledge_candidate`、`domain_map_candidate`、`context_map_candidate` を追加する。
    - `ideation/ideation.md` の `学習候補`、phase `traceability.md`、phase `decisions.md`、`.amadeus/steering/knowledge.md`、Domain Map、Context Map の責務境界を明記する。
    - `skills/amadeus-validator/SKILL.md` と `.agents/skills/amadeus-validator/SKILL.md` に、validator の結果が構造検出であることを明記する。
    - `.amadeus/steering/knowledge.md` に、横断学習昇格の扱いを記録する。
  - 要求: R003, R004, R005
  - ユースケース: UC002, UC003
  - 依存: B001/T001
  - 設計根拠: ../../U002-learning-promotion-contract/functional-design/business-logic-model.md
  - 証拠: [test-results.md](test-results.md)

- [x] T002: learning promotion 契約を eval の text contract に追加する。
  - 作業:
    - `dev-scripts/evals/amadeus-templates/check.ts` で Steering knowledge、Domain Map、Context Map、validator、evaluator の境界を確認する。
    - Domain Map と Context Map が候補を扱わないことを期待値として維持する。
  - 要求: R003, R004, R005
  - ユースケース: UC002, UC003
  - 依存: T001
  - 設計根拠: ../../U002-learning-promotion-contract/functional-design/business-rules.md
  - 証拠: [test-results.md](test-results.md)
