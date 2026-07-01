---
name: amadeus-learning-review
description: >-
  Amadeus の内部 skill。`amadeus-history-review` の分析結果、validator 結果、evaluator 結果、
  Issue、PR、CI 結果を入力にし、現在 phase 更新、前段 feedback、steering knowledge、
  Domain Map、Context Map、後続 Issue、後続 Intent、対応不要へ分類する。質問や成果物更新は実行せず、
  必要に応じて `amadeus-grilling` または phase skill への handoff を返す。
---

# amadeus-learning-review

## 目的

過去分析結果や検証結果を、Amadeus DLC の学習先へ分類する。

この skill は分類ゲートである。
成果物を更新せず、GitHub Issue を作成せず、Domain Map と Context Map へ自動昇格しない。
質問が必要な場合は `amadeus-grilling` への handoff を返す。

## 入力

- `amadeus-history-review` の分析結果。
- validator 結果。
- evaluator 結果。
- GitHub Issue。
- PR とレビューコメント。
- CI 結果。
- 対象 Intent または対象成果物。
- Skill Contract。
- 呼び出し元 phase skill。

入力が不足する場合は、`amadeus-grilling` への handoff 候補を返す。
不足を理由に成果物を推測で更新しない。

## 分類結果

| 分類 | 用途 | 戻り先 |
|---|---|---|
| `current_phase_update_required` | 現在 phase 内で解消でき、現在 Intent の成功条件に必要である。 | 呼び出し元 phase skill |
| `upstream_feedback_required` | 現在 Intent の成功条件を妨げる前段成果物の不足や矛盾である。 | 前段 phase skill または補修方針 |
| `steering_knowledge_candidate` | steering layer に残す可能性がある知識である。 | 人間判断または steering 更新候補 |
| `domain_map_candidate` | 共有境界として採用検討が必要である。 | 人間判断または domain modeling |
| `context_map_candidate` | コンテキスト間依存として採用検討が必要である。 | 人間判断または domain modeling |
| `follow_up_issue_candidate` | 現在 Intent の成功条件外だが、小さく追跡できる課題である。 | 人間承認後の GitHub Issue |
| `follow_up_intent_candidate` | 独立した Intent として扱う大きさの課題である。 | 人間承認後の Intent 候補 |
| `no_learning_action` | 学習先へ反映する必要がない。 | なし |

Domain Map と Context Map は候補を扱わず、承認済みの `adopted` と `retired` の現在の索引だけを扱う。
そのため、`domain_map_candidate` と `context_map_candidate` は候補として報告し、Domain Map と Context Map へ自動昇格しない。

## 判断順序

1. 現在 Intent の成功条件を妨げているか確認する。
2. 現在 phase 内で解消できるか確認する。
3. 前段成果物の不足や矛盾か確認する。
4. steering layer、Domain Map、Context Map へ採用検討すべき知識か確認する。
5. 後続 Issue または後続 Intent として分けるべきか確認する。
6. どれにも当てはまらない場合は `no_learning_action` にする。

## Grilling Handoff

人間判断が必要な場合だけ、次を呼び出し元 phase skill へ返す。

- 一問。
- 確認理由。
- 推奨回答。
- 推奨理由。
- 反映先候補。
- 分類候補。
- 根拠となる入力証拠。

`amadeus-learning-review` は質問を表示しない。
呼び出し元 phase skill が `amadeus-grilling` の質問作法に従って一問だけ質問する。

## Phase Skill 連携

`current_phase_update_required` は呼び出し元 phase skill で扱う。
`upstream_feedback_required` は前段 phase の成果物不足または矛盾として扱う。
`follow_up_issue_candidate` と `follow_up_intent_candidate` は、人間が承認した場合だけ後続作業にする。

GitHub Issue を作成するのは、人間が Issue 化を承認した場合だけである。
Intent Record を作成するのは、人間が Intent 化を承認した場合だけである。

## 境界

所有するもの:

- 入力証拠の学習分類。
- 分類根拠の整理。
- 戻り先候補の提示。
- `amadeus-grilling` への handoff 項目の選定。

所有しないもの:

- `amadeus-history-review` の過去分析本体。
- 成果物更新。
- GitHub Issue 作成。
- Intent Record 作成。
- PR 作成。
- Domain Map と Context Map への自動昇格。
- `amadeus-grilling` の質問実行。
- `amadeus-discovery dry-run` の候補表示本体。

## 検証境界

validator の `pass` は、実行時に参照できる最低限の構造条件を満たすという意味であり、内容承認ではない。
evaluator の結果は品質評価であり、採用先は phase skill または人間判断で分類する。
Skill Contract は入力証拠と境界情報であり、学習分類の結果そのものではない。

## 禁止事項

- 成果物を更新しない。
- GitHub Issue を作成しない。
- Intent Record を作成しない。
- Domain Map と Context Map へ自動昇格しない。
- 質問を実行しない。
- 現在 Intent の成功条件外の課題を、現在成果物へ混ぜない。
