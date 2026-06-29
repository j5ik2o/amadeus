# ユースケース

## 一覧

| 識別子 | アクター | 外部システム | ストーリー | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| UC001 | 顧客 | なし | S001 | R001 | なし | [UC001-select-product.md](use-cases/UC001-select-product.md) |
| UC002 | 顧客 | 在庫管理 | S001 | R002, R003 | UC001 | [UC002-confirm-order-content.md](use-cases/UC002-confirm-order-content.md) |
| UC003 | 顧客 | なし | S001 | R004 | UC002 | [UC003-create-order.md](use-cases/UC003-create-order.md) |

## 依存関係

| ユースケース | 依存 | 理由 |
|---|---|---|
| UC001 | なし | 商品選択は後続の注文内容確認と注文作成の入口であるため。 |
| UC002 | UC001 | 注文内容確認は選択された商品を前提にするため。 |
| UC003 | UC002 | 注文作成は確認済みの注文内容を前提にするため。 |
