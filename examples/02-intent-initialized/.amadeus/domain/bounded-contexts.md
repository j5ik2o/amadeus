# 境界づけられたコンテキスト

## 一覧

| 識別子 | 名前 | サブドメイン | 役割 | モデル | 契約 |
|---|---|---|---|---|---|
| BC001 | 商品管理 | SD001 | 商品情報を管理し、販売管理から参照できる状態にする。 | [モデル](bounded-contexts/BC001-product-management/models.md) | [契約](bounded-contexts/BC001-product-management/contracts.md) |
| BC002 | 顧客管理 | SD002 | 購入者または顧客に関する情報を管理する。 | [モデル](bounded-contexts/BC002-customer-management/models.md) | [契約](bounded-contexts/BC002-customer-management/contracts.md) |
| BC003 | 入荷管理 | SD003 | 商品が販売可能になる前の入荷を管理する。 | [モデル](bounded-contexts/BC003-receiving-management/models.md) | [契約](bounded-contexts/BC003-receiving-management/contracts.md) |
| BC004 | 販売管理 | SD004 | 商品選択から注文作成までの販売活動を扱う。 | [モデル](bounded-contexts/BC004-sales-management/models.md) | [契約](bounded-contexts/BC004-sales-management/contracts.md) |
| BC005 | 出荷管理 | SD005 | 注文後の商品発送を管理する。 | [モデル](bounded-contexts/BC005-shipping-management/models.md) | [契約](bounded-contexts/BC005-shipping-management/contracts.md) |

## 外部境界

| コンテキスト | 名前 | 役割 | 根拠 |
|---|---|---|---|

外部境界は未確認である。

## コンテキスト間の依存

| Downstream | Upstream | 依存内容 | 組織パターン | 統合パターン | 状態 |
|---|---|---|---|---|---|

コンテキスト間の依存は未確認である。

## パターン分類

組織パターン:

- パートナーシップ
- 別々の道
- 順応者
- 顧客／供給者

統合パターン:

- 共有カーネル
- 巨大な泥団子
- 公開ホストサービス（OHS）
- 公表された言語（PL）
- 腐敗防止層（ACL）
