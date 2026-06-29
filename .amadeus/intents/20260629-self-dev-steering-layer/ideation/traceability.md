# 追跡

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| Intent | 20260629-self-dev-steering-layer | [20260629-self-dev-steering-layer.md](../../20260629-self-dev-steering-layer.md) | Inception の要求分析で参照する。 |
| Issue | #108 | [GitHub Issue](https://github.com/j5ik2o/amadeus/issues/108) | Inception の背景と受け入れ条件の根拠にする。 |
| Scope | 初回導入範囲 | [scope.md](scope.md) | Inception の対象と対象外の制約にする。 |
| Development | 開発手順 | [development.md](../../../development.md) | 後続 Intent の作業順序と PR 準備条件の根拠にする。 |
| Feasibility | 実現可能 | [ideation.md](ideation.md) | Inception で Requirement と Acceptance を作る根拠にする。 |
| Mock | 初期確認 | [initial-confirmation.puml](mocks/initial-confirmation.puml) | Inception で自己開発の流れを説明する入力にする。 |
| 状態 | Ideation completed | [state.json](../state.json) | Inception へ進められる状態として扱う。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260629-self-dev-steering-layer | なし | 初回導入 Intent であり、既存 Intent に依存しないため。 | [intents.md](../../../intents.md) |
| 外部システム | EXT001 GitHub | なし | Issue と PR を接続するため。 | [external-systems.md](../../../steering/external-systems.md) |
| アクター | ACT001 Maintainer | なし | stage0 採用判断と merge 判断を行うため。 | [actors.md](../../../steering/actors.md) |
