# Business Logic Model

## 目的

Intent 内で見つかった学習候補を、Steering knowledge、Domain Map、Context Map、後続作業、または非採用へ昇格する判断ロジックを定義する。

## 対象 Unit

U002 learning-promotion-contract。

## 業務ロジック

| 識別子 | ロジック | 入力 | 出力 | 根拠 |
|---|---|---|---|---|
| BL001 | Intent 横断で再利用できる知見かどうかを判定する。 | 学習候補、発生 Intent、根拠成果物 | 昇格対象かどうか | R003, UC002 |
| BL002 | 横断知見の置き先を Steering knowledge、Domain Map、Context Map に分ける。 | 学習候補、対象概念、境界、依存関係 | `steering_knowledge_candidate`、`domain_map_candidate`、`context_map_candidate` | R003, R004 |
| BL003 | `.amadeus/steering/knowledge.md`、`traceability.md`、`decisions.md`、`ideation/ideation.md` の `学習候補` の責務を分ける。 | 学習候補、採用判断、追跡情報 | 記録先 | R004, UC002 |
| BL004 | validator と evaluator の結果を、構造検出、品質評価、学習候補に分ける。 | 検証結果、評価結果、人間判断 | 分類済み証拠 | R005, UC003 |

## 入力

| 入力 | 説明 | 根拠 |
|---|---|---|
| 学習候補 | Intent の作業中に見つかった、他 Intent でも再利用できる可能性がある知見。 | R003 |
| 採用判断 | 学習候補を採用、保留、非採用にする判断。 | R004 |
| 構造検出結果 | validator が検出した構造上の充足、不足、矛盾。 | R005 |
| 品質評価結果 | evaluator が検出した文書品質または意味的品質の評価。 | R005 |

## 出力

| 出力 | 説明 | 利用先 |
|---|---|---|
| `steering_knowledge_candidate` | Intent 横断で再利用できる運用、制約、判断基準の候補。 | `.amadeus/steering/knowledge.md` |
| `domain_map_candidate` | 承認後に Domain Map の `adopted` または `retired` に反映する境界候補。 | `.amadeus/domain-map.md` |
| `context_map_candidate` | 承認後に Context Map の `adopted` または `retired` に反映する依存候補。 | `.amadeus/context-map.md` |
| `follow_up_issue_candidate` | skill、template、validator、eval、example、docs、運用へ影響する小さな課題候補。 | GitHub Issue 候補 |
| `follow_up_intent_candidate` | 独立した目的と成果物を持つ作業候補。 | Ideation 入力候補 |
| `no_learning_action` | 横断学習として採用しない分類。 | 作業報告 |

## 未確認事項

なし。
