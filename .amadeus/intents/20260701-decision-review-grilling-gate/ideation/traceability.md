# 追跡

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| Intent | 20260701-decision-review-grilling-gate | [20260701-decision-review-grilling-gate.md](../../20260701-decision-review-grilling-gate.md) | Inception の要求分析で参照する。 |
| Issue | #257 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/257) | Requirement、Acceptance、Use Case、Unit、Bolt の根拠にする。 |
| 先行 Intent | 20260701-skill-contract-catalog | [state.json](../../20260701-skill-contract-catalog/state.json) | Skill Contract を decision review の入力証拠として使う背景にする。 |
| 対象境界 | decision tree 再評価と grilling 起動条件 | [scope.md](scope.md) | Inception の Requirement、Use Case、Unit、Bolt の対象と対象外の制約にする。 |
| 実行制御 | refactor、stage 省略なし | [scope.md](scope.md) | Inception から Construction へ進める前提にする。 |
| 成果物深度 | standard | [scope.md](scope.md) | 判断ノード、入力証拠、分岐、grilling 連携を分解する入力にする。 |
| 検証戦略 | standard | [scope.md](scope.md) | phase skill、Skill Contract、validator または evaluator の確認を PR 準備条件にする。 |
| Mock | 初期確認 | [initial-confirmation.puml](mocks/initial-confirmation.puml) | Inception で入力証拠、判断ノード、分岐、後続処理の確認例にする。 |
| 状態 | Ideation completed | [state.json](../state.json) | Inception へ進める前提にする。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260701-decision-review-grilling-gate | 20260701-skill-contract-catalog | Issue #257 は、phase skill 起動時の decision tree 再評価で Skill Contract と既存成果物を入力にするため。 | [intents.md](../../../intents.md) |
| Issue | #257 | #248 | 実行時問題報告の分類と後続 Issue 候補への切り出し条件を参照するため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/248) |
| Issue | #257 | #259 | decision review と feedback learning loop の責務を混ぜないため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/259) |
| Issue | #257 | #263 | Skill Contract を decision review の入力証拠として使うため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/263) |
| 外部システム | EXT001 GitHub | なし | Issue、PR、review comment、後続 Issue 候補を追跡の根拠に使うため。 | [external-systems.md](../../../steering/external-systems.md) |
| アクター | ACT001 Maintainer | なし | decision review の起動条件と質問要否を承認するため。 | [actors.md](../../../steering/actors.md) |

## 受け入れ条件への対応

| 受け入れ条件 | Ideation での扱い | Inception への引き渡し |
|---|---|---|
| 実行時の decision tree 再評価 | scope の SC-IN-001 に記録した。 | 入力証拠と判断ノードを要求へ落とす。 |
| 不明瞭ノードがあれば `amadeus-grilling` を起動する条件 | scope の SC-IN-002 と SC-IN-003 に記録した。 | grill_required の条件と質問項目を具体化する。 |
| 不明瞭ノードがない場合は質問せず進む条件 | scope の SC-IN-002 と mock に記録した。 | no_grill の条件を acceptance に落とす。 |
| 構造補修、成果物境界外判断、後続 Issue 候補の区別 | scope の SC-IN-002 と Inception 引き継ぎに記録した。 | repair_only と follow_up_issue_candidate の扱いを要求へ落とす。 |
| Ideation / Inception / Construction の共通規則 | scope の SC-IN-005 に記録した。 | 公開 phase skill の反映範囲を Unit または Bolt に分ける。 |

## 逆方向 feedback

Ideation で見つかった不足は、Inception 開始時の decision review で再確認する。

Inception 以降で decision review の入力証拠、分岐、grilling 連携、validator との責務分離が不足すると分かった場合は、後段成果物だけを補修せず、Ideation の該当成果物へ戻す。
