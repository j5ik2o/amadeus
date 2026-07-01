# 要求

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| R001 | phase skill 起動時に、既存成果物と現在参照できる証拠から decision tree を再評価できる。 | 採用済み | なし | [R001-decision-tree-evidence-review.md](requirements/R001-decision-tree-evidence-review.md) |
| R002 | decision review の結果を、質問、通常処理、構造補修、後続 Issue 候補の分岐へ分類できる。 | 採用済み | R001 | [R002-decision-review-outcome-classification.md](requirements/R002-decision-review-outcome-classification.md) |
| R003 | `amadeus-grilling` に渡す一問、確認理由、推奨回答、推奨理由、反映先候補を定義できる。 | 採用済み | R002 | [R003-grilling-handoff-contract.md](requirements/R003-grilling-handoff-contract.md) |
| R004 | Ideation、Inception、Construction の公開 phase skill が同じ decision review 規則を参照できる。 | 採用済み | R001, R002, R003 | [R004-phase-skill-shared-adoption.md](requirements/R004-phase-skill-shared-adoption.md) |
| R005 | validator、evaluator、Skill Contract と decision review の責務境界を説明できる。 | 採用済み | R001, R002 | [R005-validation-and-contract-boundary.md](requirements/R005-validation-and-contract-boundary.md) |

## 依存関係

| 要求 | 依存 | 理由 |
|---|---|---|
| R001 | なし | 入力証拠と判断ノードの再評価が、すべての分岐判断の前提であるため。 |
| R002 | R001 | 分岐分類は、再評価された判断ノードを入力にするため。 |
| R003 | R002 | grilling handoff は、分岐分類で `grill_required` になった場合だけ必要になるため。 |
| R004 | R001, R002, R003 | 公開 phase skill の共通規則は、再評価、分岐、grilling handoff を前提にするため。 |
| R005 | R001, R002 | validator、evaluator、Skill Contract との境界は、入力証拠と分岐結果の扱いを前提にするため。 |

## 受け入れ状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 採用済み | 未登録 |
| R002 | 採用済み | 未登録 |
| R003 | 採用済み | 未登録 |
| R004 | 採用済み | 未登録 |
| R005 | 採用済み | 未登録 |

## Requirements Review Gate

| 観点 | 状態 | 根拠 |
|---|---|---|
| Ideation scope との対応 | passed | SC-IN-001 から SC-IN-006 までを R001 から R005 に対応付けた。 |
| 対象外の維持 | passed | phase 成果物構造の再設計、Grilling Decision Trail の配置変更、既存 Intent 一括移行を要求に含めていない。 |
| 依存関係 | passed | decision tree 再評価、分岐分類、grilling handoff、phase skill 反映、検証境界の順に依存を整理した。 |

## 未確認事項

- なし。
