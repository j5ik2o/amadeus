# R003: 学習先分類

## 要求

- `amadeus-learning-review` は、`amadeus-history-review` の結果、validator 結果、evaluator 結果、Issue、PR、CI 結果を入力にできる。
- `amadeus-learning-review` は、学習先を `current_phase_update_required`、`upstream_feedback_required`、`steering_knowledge_candidate`、`domain_map_candidate`、`context_map_candidate`、`follow_up_issue_candidate`、`follow_up_intent_candidate`、`no_learning_action` のいずれかに分類できる。
- 質問が必要な場合は `amadeus-grilling` へ渡し、成果物更新が必要な場合は対象 phase skill または内部 stage skill へ渡す。

## 受け入れ条件

- 分類結果が Issue #259 の分類と矛盾しない。
- validator の `pass` を内容承認として扱わないことが説明されている。
- Domain Map と Context Map の候補は自動昇格せず、人間判断または phase skill へ渡すことが説明されている。

## 根拠

- [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277)
- [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259)
- [20260701-feedback-learning-loop](../../../20260701-feedback-learning-loop.md)

## 未確認事項

- CI 結果を入力にする場合の最小項目は Construction で確認する。
