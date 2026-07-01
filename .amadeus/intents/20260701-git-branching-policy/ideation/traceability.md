# 追跡

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| Intent | 20260701-git-branching-policy | [20260701-git-branching-policy.md](../../20260701-git-branching-policy.md) | Inception の要求分析で参照する。 |
| Issue | #254 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/254) | Requirement、Acceptance、Use Case、Unit、Bolt の根拠にする。 |
| 先行 Intent | 20260701-self-development-cycle-stage-workspace | [state.json](../../20260701-self-development-cycle-stage-workspace/state.json) | stage と workspace 対応記録を branch 戦略の前提にする。 |
| 対象境界 | Git ブランチ戦略 steering policy 定義 | [scope.md](scope.md) | Inception の Requirement、Use Case、Unit、Bolt の対象と対象外の制約にする。 |
| 実行制御 | infra、stage 省略なし | [scope.md](scope.md) | Inception から Construction へ進める前提にする。 |
| 成果物深度 | standard | [scope.md](scope.md) | branch 作成、PR、merge 後処理、複数 worktree の判断を分解する入力にする。 |
| 検証戦略 | standard | [scope.md](scope.md) | validator、必要な eval、typecheck、diff check を PR 準備条件にする。 |
| Mock | 初期確認 | [initial-confirmation.puml](mocks/initial-confirmation.puml) | Inception で branch 戦略の判断フロー確認例にする。 |
| 状態 | Ideation completed | [state.json](../state.json) | Inception へ進める前提にする。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260701-git-branching-policy | 20260701-self-development-cycle-stage-workspace | Issue #254 は、複数 Intent と複数 worktree の作業判断を steering policy として扱うため、stage と workspace の対応記録を前提にする。 | [intents.md](../../../intents.md) |
| Issue | #254 | なし | Issue #254 は、Amadeus 自己開発で Git branch、PR、merge、worktree の扱いが複数 Intent にまたがることを背景にするため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/254) |
| 外部システム | EXT001 GitHub | なし | Issue、PR、branch、review comment、merge 後処理を追跡の根拠に使うため。 | [external-systems.md](../../../steering/external-systems.md) |
| アクター | ACT001 Maintainer | なし | branch 戦略、merge 委譲、例外扱い、policy 採用を判断するため。 | [actors.md](../../../steering/actors.md) |
