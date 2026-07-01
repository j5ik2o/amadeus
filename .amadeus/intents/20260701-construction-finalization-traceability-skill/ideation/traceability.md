# 追跡

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| Intent | 20260701-construction-finalization-traceability-skill | [20260701-construction-finalization-traceability-skill.md](../../20260701-construction-finalization-traceability-skill.md) | Inception の要求分析で参照する。 |
| Issue | #245 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/245) | Requirement、Acceptance、Use Case、Unit、Bolt の根拠にする。 |
| 先行 Intent | 20260701-self-development-cycle-stage-workspace | [state.json](../../20260701-self-development-cycle-stage-workspace/state.json) | PR #244 で見つかった skill 説明と validator 要件のずれを根拠にする。 |
| 対象境界 | Construction finalization skill の追跡表要件 | [scope.md](scope.md) | Inception の Requirement、Use Case、Unit、Bolt の対象と対象外の制約にする。 |
| 実行制御 | refactor、stage 省略なし | [scope.md](scope.md) | Inception から Construction へ進める前提にする。 |
| 成果物深度 | standard | [scope.md](scope.md) | skill 説明、validator 要件、template または example 確認を分解する入力にする。 |
| 検証戦略 | standard | [scope.md](scope.md) | validator、typecheck、diff check を PR 準備条件にする。 |
| Mock | 初期確認 | [initial-confirmation.puml](mocks/initial-confirmation.puml) | Inception で追跡表要件の確認例にする。 |
| 状態 | Ideation completed | [state.json](../state.json) | Inception へ進める前提にする。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260701-construction-finalization-traceability-skill | 20260701-self-development-cycle-stage-workspace | Issue #245 は、Issue #233 の Construction 最終化で見つかった skill 説明と validator 要件のずれを扱うため。 | [intents.md](../../../intents.md) |
| Issue | #245 | #233, PR #244 | Issue #245 は PR #244 の最終化中に見つかった差分を起票したものであるため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/245) |
| 外部システム | EXT001 GitHub | なし | Issue、PR、CI、review comment を追跡の根拠に使うため。 | [external-systems.md](../../../steering/external-systems.md) |
| アクター | ACT001 Maintainer | なし | skill 説明と validator 要件の一致を判断するため。 | [actors.md](../../../steering/actors.md) |
