# 追跡

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| Intent | 20260628-discovery-brief-creation | [20260628-discovery-brief-creation.md](../20260628-discovery-brief-creation.md) | Inception の要求分析で参照する。 |
| Scope | Discovery Brief 作成 | [scope.md](scope.md) | Inception の対象と対象外の制約にする。 |
| 実現可能性 | Discovery Brief と Intent 候補の記録 | [ideation.md](ideation.md) | 技術、運用、セキュリティ、依存の確認状態として引き継ぐ。 |
| 初期モック | Discovery Brief 確認カード | [initial-confirmation.puml](mocks/initial-confirmation.puml) | 要求候補の具体例として引き継ぐ。 |
| 状態 | Ideation completed | [state.json](state.json) | gate passed の Intent として Inception へ進める。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260628-discovery-brief-creation | なし | Discovery Brief の最初の候補として単独で成立するため。 | [intents.md](../../intents.md) |
| Discovery | 20260628-amadeus-theme-decomposition | なし | multi_intent と判定し、最初に Intent 化する候補を示しているため。 | [20260628-amadeus-theme-decomposition.md](../../discoveries/20260628-amadeus-theme-decomposition.md) |

## Inception への引き継ぎ

| 引き継ぎ対象 | 種別 | 根拠 | 備考 |
|---|---|---|---|
| Discovery Brief 記録 | 要求候補 | [scope.md](scope.md) | 入力テーマ、確認した前提、判定、判定理由、Intent 候補、候補判断、推奨次アクションを扱う。 |
| Intent 候補提示 | 要求候補 | [ideation.md](ideation.md) | multi_intent の場合に、最初に Intent 化する候補を1件に絞る。 |
| Discovery の責務境界 | 制約 | [scope.md](scope.md) | Requirement、Use Case、Unit、Bolt、Task は Discovery では作らない。 |
