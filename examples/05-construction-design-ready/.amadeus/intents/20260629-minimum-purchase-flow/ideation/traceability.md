# 追跡

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| Intent | 20260629-minimum-purchase-flow | [20260629-minimum-purchase-flow.md](../../20260629-minimum-purchase-flow.md) | Inception の要求分析で参照する。 |
| Scope | 商品選択、販売可能在庫の確認、購入者情報の記録、注文内容確認、注文作成 | [scope.md](scope.md) | Inception の要求候補にする。 |
| 対象外 | 会員登録、ログイン、顧客台帳、購入履歴管理、決済詳細、売上確定、在庫引当、入荷、棚卸し、出荷 | [scope.md](scope.md) | Inception の対象外制約にする。 |
| 初期モック | 注文内容確認画面 | [initial-confirmation.puml](mocks/initial-confirmation.puml) | Inception の要求候補と相互作用整理で具体例として参照する。 |
| 状態 | Ideation completed | [state.json](../state.json) | Inception へ進める前提として参照する。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260629-minimum-purchase-flow | なし | 商品選択から注文作成までの最小購入フローとして単独で成立するため。 | [intents.md](../../../intents.md) |
| 外部システム | 決済代行 | なし | 決済詳細は対象外であり、外部システム連携は未確認として扱うため。 | [external-systems.md](../../../steering/external-systems.md) |
| 外部システム | 配送事業者 | なし | 出荷は対象外であり、外部システム連携は未確認として扱うため。 | [external-systems.md](../../../steering/external-systems.md) |
