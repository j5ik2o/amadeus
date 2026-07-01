# D002 Feedback Routing Classification

## 状態

accepted。

## 背景

既存の実行時問題報告は、現在作業、後続化、非採用に相当する粗い 3 分類だけである。
後段 phase で前段成果物の不足が見つかった場合、どの phase または stage に戻すかが明示されていない。

## 判断

後段発見は、`upstream_feedback_required`、`current_phase_update_required`、`steering_knowledge_candidate`、`domain_map_candidate`、`context_map_candidate`、`follow_up_issue_candidate`、`follow_up_intent_candidate`、`no_learning_action` に分類する。

## 根拠

- R001。
- R002。
- UC001。

## 影響

phase skill は、発見の分類、戻り先、根拠を報告する。
GitHub Issue は人間承認なしに作成しない。
