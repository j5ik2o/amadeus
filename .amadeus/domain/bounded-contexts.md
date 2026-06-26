# 境界づけられたコンテキスト

## 一覧

| 識別子 | 名前 | サブドメイン | 役割 | モデル | 契約 |
|---|---|---|---|---|---|
| BC001 | 認証アクセス | SD001 | 利用者が本人であることを確認し、アカウントに紐づく認証情報と再設定トークンの整合性を守る。 | [models.md](bounded-contexts/BC001-authentication-access/models.md) | [contracts.md](bounded-contexts/BC001-authentication-access/contracts.md) |

## コンテキスト間の依存

Upstream は、下流コンテキストが参照、利用、または順応する側の境界づけられたコンテキストである。
Downstream は、上流コンテキストが提供するモデル、契約、公開インターフェイスに依存する側の境界づけられたコンテキストである。

| Downstream | Upstream | 依存内容 | 組織パターン | 統合パターン | 状態 |
|---|---|---|---|---|---|
| BC001 | なし | 現時点では、他の境界づけられたコンテキストへの依存を持たない。 | 該当なし | 該当なし | BC001 だけが定義されており、分類対象のコンテキスト間関係がないため |

## パターン分類

組織パターンは、境界づけられたコンテキストを担うチーム同士の関係を示す。
統合パターンは、境界づけられたコンテキスト同士のモデルやインターフェイスの連携方法を示す。

| 分類 | パターン | 意味 |
|---|---|---|
| 組織 | パートナーシップ | 複数チームが相互調整しながら、関係するコンテキストを共同で進める。 |
| 組織 | 別々の道 | コンテキスト間の連携を持たず、それぞれ独立して進める。 |
| 組織 | 順応者 | Downstream が Upstream のモデルや判断に合わせる。 |
| 組織 | 顧客／供給者 | Downstream が顧客、Upstream が供給者として、提供内容や優先度を調整する。 |
| 統合 | 共有カーネル | 複数コンテキストが、合意した小さな共通モデルを共有する。 |
| 統合 | 巨大な泥団子 | 境界が崩れ、モデルや責務が分離されていない状態を示す。 |
| 統合 | 公開ホストサービス（OHS） | Upstream が公開されたサービスとして連携入口を提供する。 |
| 統合 | 公表された言語（PL） | Upstream と Downstream が、公開されたメッセージやスキーマを共通言語として使う。 |
| 統合 | 腐敗防止層（ACL） | Downstream が Upstream のモデルの影響を直接受けないように変換層を置く。 |

## インテント別参照

| インテント | サブドメイン | コンテキスト | 境界 | モデル | 契約 |
|---|---|---|---|---|---|
| 20260626-password-reset | [subdomains.md](../intents/20260626-password-reset/domain/subdomains.md) | [bounded-contexts.md](../intents/20260626-password-reset/domain/bounded-contexts.md) | BC001 | [models.md](../intents/20260626-password-reset/domain/bounded-contexts/BC001-authentication-access/models.md) | [contracts.md](../intents/20260626-password-reset/domain/bounded-contexts/BC001-authentication-access/contracts.md) |
