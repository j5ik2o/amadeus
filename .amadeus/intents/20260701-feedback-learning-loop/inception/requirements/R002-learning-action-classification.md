# R002: 学習アクション分類

## 要求

- 後段で見つけた事項を、現在 Intent の前段修正、現在 phase 修正、後続 Issue、後続 Intent、不採用に分類できる。

## 受け入れ条件

- `upstream_feedback_required` は、現在 Intent の前段成果物へ戻す対象として説明されている。
- `current_phase_update_required` は、現在 phase 内の成果物で直す対象として説明されている。
- `follow_up_issue_candidate` は、現在 Intent の成功条件には不要だが Amadeus の skill、validator、eval、example、docs、運用に影響する対象として説明されている。
- `follow_up_intent_candidate` は、独立した lifecycle で扱うべき大きさの学習として説明されている。
- `no_learning_action` は、一時的な作業メモや採用しない観察として説明されている。

## 根拠

- Issue #259 の「学習の分類」。
- Issue #248 の実行時問題報告分類。
- `ideation/scope.md` の SC-IN-002 と SC-IN-003。

## 未確認事項

- 分類名を skill 契約にそのまま載せるか、日本語ラベルを併記するかは Construction で確定する。
