# Business Logic Model

## 目的

後段 phase、validator、evaluator で見つかった発見を、上流成果物への feedback、現在 phase の修正、後続化、または非採用へ分類する業務ロジックを定義する。

## 対象 Unit

U001 feedback-routing-contract。

## 業務ロジック

| 識別子 | ロジック | 入力 | 出力 | 根拠 |
|---|---|---|---|---|
| BL001 | 発見が現在 Intent の成功条件を満たすために必須かを判定する。 | 後段発見、対象 Intent、要求、Use Case、Unit、Bolt、Task、Functional Design | 現在 Intent 内で扱うかどうか | R001, R002, UC001 |
| BL002 | 発見が前段成果物の不足または矛盾を示す場合、戻り先 phase と stage を決める。 | 発見、追跡情報、対象成果物 | `upstream_feedback_required` と戻り先 | R001, UC001 |
| BL003 | 発見が現在 phase の成果物または実装だけで解消できる場合、現在 phase 修正として扱う。 | 発見、現在 phase、対象成果物 | `current_phase_update_required` | R002, UC001 |
| BL004 | 現在 Intent の成功条件には不要だが別作業が必要な発見を、後続 Issue または後続 Intent に分ける。 | 発見、影響範囲、実施単位 | `follow_up_issue_candidate` または `follow_up_intent_candidate` | R002, UC001 |
| BL005 | Issue #257 の decision review と、今回の学習 loop の分類責務を分離する。 | 発見、decision、再確認要否 | decision review または feedback routing | R005, UC003 |

## 入力

| 入力 | 説明 | 根拠 |
|---|---|---|
| 後段発見 | 後段 phase、validator、evaluator、PR コメント、実行中の観察で見つかった問題または懸念。 | R001, R005 |
| 追跡情報 | `traceability.md`、`decisions.md`、要求、Use Case、Unit、Bolt、Task、Functional Design の関係。 | R001, R002 |
| 現在 Intent の成功条件 | 対象 Intent の scope、requirements、acceptance、Bolt 完了条件。 | R002 |

## 出力

| 出力 | 説明 | 利用先 |
|---|---|---|
| `upstream_feedback_required` | 上流 phase または上流 stage の成果物を修正する必要がある分類。 | `amadeus-ideation`、`amadeus-inception`、各内部 stage skill |
| `current_phase_update_required` | 現在 phase の成果物または実装で修正する分類。 | 現在実行中の phase skill |
| `follow_up_issue_candidate` | 現在 Intent 外の小さな保守課題候補。 | GitHub Issue 候補 |
| `follow_up_intent_candidate` | 新しい Intent として扱う規模または目的を持つ候補。 | Ideation 入力候補 |
| `no_learning_action` | 現在の判断に影響しない、またはすでに解消したため採用しない分類。 | 作業報告 |

## 未確認事項

なし。
