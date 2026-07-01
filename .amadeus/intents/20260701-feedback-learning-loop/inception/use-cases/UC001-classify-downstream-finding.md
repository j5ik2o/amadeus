# UC001: 後段発見を分類する

## システム境界

- ACT002 Agent が後段 phase または validator/evaluator 結果から発見を得る。
- Amadeus DLC は、発見を前段 feedback、現在 phase 修正、後続 Issue、後続 Intent、不採用へ分類する。

## 事前条件

- 対象 Intent の phase 成果物と traceability が参照できる。
- 発見元の phase、stage、成果物、検証結果のいずれかが分かる。

## 基本フロー

1. Agent は、後段 phase で見つかった不整合、不足、古い判断、検証結果を発見として記録する。
2. Agent は、発見が現在 Intent の前段成果物へ戻すべきものか確認する。
3. 前段成果物へ戻すべき場合、Agent は `upstream_feedback_required` として分類する。
4. 現在 phase 内で直せる場合、Agent は `current_phase_update_required` として分類する。
5. 現在 Intent の成功条件に不要だが Amadeus に影響する場合、Agent は `follow_up_issue_candidate` として分類する。
6. 独立した lifecycle が必要な場合、Agent は `follow_up_intent_candidate` として分類する。
7. 採用しない場合、Agent は `no_learning_action` として理由を残す。

## 代替フロー

- 判断に人間確認が必要な場合は、Agent が `amadeus-grilling` に一問だけ渡す。
- 構造補修だけで解ける場合は、対象 phase の repair として扱う。

## 事後条件

- 発見は、現在 Intent 修正、現在 phase 修正、後続 Issue、後続 Intent、不採用のいずれかに分類されている。
- 前段へ戻す場合は、対象 phase skill または内部 stage skill が分かる。

## BCE候補

| 種別 | 候補 | 責務 |
|---|---|---|
| 境界 | 後段発見分類 | 発見元と分類先を受け取る。 |
| 制御 | feedback routing | 前段へ戻すか、現在 phase で直すか、後続化するかを判定する。 |
| エンティティ | learning action | 分類結果、根拠、反映先、未確認事項を保持する。 |

## 責務候補

| 候補 | 判断 | 保持 | 依頼 |
|---|---|---|---|
| phase skill | 前段または現在 phase の成果物更新を所有する。 | 対象成果物と判断根拠。 | 必要に応じて内部 stage skill へ渡す。 |
| amadeus-grilling | 人間判断が必要な分類だけ質問する。 | 質問、推奨回答、回答、確定判断。 | 回答後に対象 phase skill へ戻す。 |
