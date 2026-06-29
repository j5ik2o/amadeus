# ボルト

## 一覧

| 識別子 | 概要 | ユニット | 設計 | 依存 | 詳細 |
|---|---|---|---|---|---|
| B001 | 確認済み注文内容をもとに注文を作成する。 | U002 | [design.md](units/U002-order-creation/design.md) | B002 | [B001-order-creation.md](bolts/B001-order-creation.md) |
| B002 | 商品、販売可能在庫、購入者情報を含む注文内容を確認する。 | U001 | [design.md](units/U001-minimum-purchase-flow/design.md) | B003 | [B002-order-content-confirmation.md](bolts/B002-order-content-confirmation.md) |
| B003 | 顧客が購入対象の商品を選択する。 | U001 | [design.md](units/U001-minimum-purchase-flow/design.md) | なし | [B003-product-selection.md](bolts/B003-product-selection.md) |

## 依存関係

| ボルト | 依存 | 理由 |
|---|---|---|
| B001 | B002 | 注文作成は確認済み注文内容を前提にするため。 |
| B002 | B003 | 注文内容確認は選択済み商品を前提にするため。 |
| B003 | なし | 商品選択は最小購入フローの入口であるため。 |
