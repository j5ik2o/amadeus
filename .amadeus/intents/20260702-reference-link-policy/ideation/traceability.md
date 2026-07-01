# 追跡

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| Intent | 20260702-reference-link-policy | [20260702-reference-link-policy.md](../../20260702-reference-link-policy.md) | Inception の要求分析で参照する。 |
| Issue | #243 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/243) | Requirement、Acceptance、Use Case、Unit、Bolt の根拠にする。 |
| Discovery | 20260702-reference-link-policy | [Discovery Brief](../../../discoveries/20260702-reference-link-policy.md) | Intent 化判断と対象境界の根拠にする。 |
| 先行 Intent | 20260701-self-development-cycle-stage-workspace | [state.json](../../20260701-self-development-cycle-stage-workspace/state.json) | 自己開発 cycle と workspace 対応記録を前提にする。 |
| 対象境界 | Amadeus 成果物の参照リンク化方針 | [scope.md](scope.md) | Inception の Requirement、Use Case、Unit、Bolt の対象と対象外の制約にする。 |
| 実行制御 | refactor、stage 省略なし | [scope.md](scope.md) | Inception から Construction へ進める前提にする。 |
| 成果物深度 | standard | [scope.md](scope.md) | 参照種別、リンク先、適用対象、validator 判定の整理粒度にする。 |
| 検証戦略 | standard | [scope.md](scope.md) | validator、必要な eval、typecheck、diff check を PR 準備条件にする。 |
| Mock | 初期確認 | [initial-confirmation.puml](mocks/initial-confirmation.puml) | Inception で参照種別ごとの方針確認例にする。 |
| 状態 | Ideation completed | [state.json](../state.json) | Inception へ進める前提にする。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260702-reference-link-policy | 20260701-self-development-cycle-stage-workspace | Issue #243 は、自己開発 cycle と workspace 対応記録で作成された Functional Design を観察例にし、参照リンク化方針を後続 Intent として扱うため。 | [intents.md](../../../intents.md) |
| Issue | #243 | なし | Issue #243 は、Amadeus 成果物に記載する ID、PR番号、Issue番号、ファイルパス、成果物名のリンク化方針を扱うため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/243) |
| Discovery | 20260702-reference-link-policy | なし | Discovery で single_intent と判定し、Intent Draft を作成済みであるため。 | [Discovery Brief](../../../discoveries/20260702-reference-link-policy.md) |
| 外部システム | EXT001 GitHub | なし | PR番号、Issue番号、GitHub 上のファイルパス、review、CI を参照リンク化の対象として扱うため。 | [external-systems.md](../../../steering/external-systems.md) |
| アクター | ACT001 Maintainer | なし | 参照リンク化方針と validator 判定を判断するため。 | [actors.md](../../../steering/actors.md) |
