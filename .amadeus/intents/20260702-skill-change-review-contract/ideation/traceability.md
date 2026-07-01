# 追跡

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| Intent | 20260702-skill-change-review-contract | [20260702-skill-change-review-contract.md](../../20260702-skill-change-review-contract.md) | Inception の要求分析で参照する。 |
| Issue | #298 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/298) | Requirement、Acceptance、Use Case の根拠にする。 |
| 関連 policy | Git Branching Policy | [git-branching.md](../../../steering/policies/git-branching.md) | 例外記録の型（理由と後続確認先の記録）を引き継ぐ参照にする。 |
| 対象境界 | skill 変更 PR のレビュー支援契約 | [scope.md](scope.md) | Inception の Requirement、Use Case の対象と対象外の制約にする。 |
| 実行制御 | refactor、stage 省略なし | [scope.md](scope.md) | Inception から Construction へ進める前提にする。 |
| 成果物深度 | standard | [scope.md](scope.md) | 変更種別表、PR 準備条件、例外運用を分解する入力にする。 |
| 検証戦略 | standard | [scope.md](scope.md) | policies、development、README、Git Branching Policy の整合確認を PR 準備条件にする。 |
| Mock | 初期確認 | [initial-confirmation.puml](mocks/initial-confirmation.puml) | Inception で skill 変更 PR のレビュー支援確認の流れを具体化する例にする。 |
| 状態 | Ideation completed | [state.json](../state.json) | Inception へ進める前提にする。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260702-skill-change-review-contract | なし | Issue #298 は既存の steering policies の必須条件を強化する独立した文書変更であるため。 | [intents.md](../../../intents.md) |
| Issue | #298 | なし | 2026-07-02 の grilling session で確定した判断を根拠にするため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/298) |
| 外部システム | EXT001 GitHub | なし | Issue、PR 説明、レビュー記録を契約の記録先に使うため。 | [external-systems.md](../../../steering/external-systems.md) |
| アクター | ACT001 Maintainer | なし | 必須条件の強度、例外運用の妥当性、stage0 採用判断を承認するため。 | [actors.md](../../../steering/actors.md) |

## 受け入れ条件への対応

| 受け入れ条件 | Ideation での扱い | Inception への引き渡し |
|---|---|---|
| 変更種別「skill 変更」の必須条件に、挙動差分要約と skill-forge 確認が反映されている。 | scope の SC-IN-001 と SC-IN-002 に記録した。 | policies の更新要求と受け入れ状態に分解する。 |
| 粒度制約と、その例外の記録先が文書化されている。 | scope の SC-IN-003 と SC-IN-004 に記録した。 | 例外条件と記録先を acceptance に落とす。 |
| agent-instruction-rules の方針と矛盾しない記述になっている。 | scope の Inception への引き継ぎに記録した。 | 受け入れ状態の確認観点にする。 |

## 逆方向 feedback

Ideation で見つかった不足は、Inception 開始時の decision review で再確認する。

Inception 以降で必須条件の強度や例外運用の型がずれると分かった場合は、後段成果物だけを補修せず、Ideation の該当成果物へ戻す。
