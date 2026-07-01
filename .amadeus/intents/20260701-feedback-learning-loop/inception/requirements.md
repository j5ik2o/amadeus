# 要求

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| R001 | 後段 phase で前段成果物の不整合、不足、古い判断を見つけた場合に、前段成果物へ戻す条件を判断できる。 | 採用済み | なし | [R001-upstream-feedback-routing.md](requirements/R001-upstream-feedback-routing.md) |
| R002 | 後段で見つけた事項を、現在 Intent の前段修正、現在 phase 修正、後続 Issue、後続 Intent、不採用に分類できる。 | 採用済み | R001 | [R002-learning-action-classification.md](requirements/R002-learning-action-classification.md) |
| R003 | 完了済み Intent から抽出した再利用可能な学習を、Steering knowledge、Domain Map、Context Map へ昇格する条件を判断できる。 | 採用済み | R002 | [R003-cross-intent-promotion.md](requirements/R003-cross-intent-promotion.md) |
| R004 | `学習候補`、`traceability.md`、`decisions.md`、`.amadeus/steering/knowledge.md` の責務を重複なく説明できる。 | 採用済み | R002, R003 | [R004-artifact-responsibility-boundary.md](requirements/R004-artifact-responsibility-boundary.md) |
| R005 | validator と evaluator の結果を、構造検出、品質評価、学習候補に分類し、Issue #257 の decision review と責務を分けられる。 | 採用済み | R001, R002, R003, R004 | [R005-evidence-and-decision-review-boundary.md](requirements/R005-evidence-and-decision-review-boundary.md) |

## 依存関係

| 要求 | 依存 | 理由 |
|---|---|---|
| R001 | なし | 前段へ戻す条件が、他の分類の前提であるため。 |
| R002 | R001 | 現在 Intent の前段修正と現在 phase 修正の区別には、前段へ戻す条件が必要であるため。 |
| R003 | R002 | Steering knowledge、Domain Map、Context Map への昇格は、現在 Intent で直す対象ではないと分類できることを前提にするため。 |
| R004 | R002, R003 | 成果物責務の分離は、現在 Intent 内の分類と Intent 横断の昇格先分類を前提にするため。 |
| R005 | R001, R002, R003, R004 | validator、evaluator、decision review の境界は、feedback 先、学習先、成果物責務の分類を前提にするため。 |

## 受け入れ状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 採用済み | 未登録 |
| R002 | 採用済み | 未登録 |
| R003 | 採用済み | 未登録 |
| R004 | 採用済み | 未登録 |
| R005 | 採用済み | 未登録 |
