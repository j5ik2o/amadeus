# 境界づけられたコンテキスト

## 範囲

この文書は、`20260628-discovery-brief-creation` インテントで Unit を切る時に参照する境界づけられたコンテキストを扱う。

全体の境界づけられたコンテキストは、[../../../domain/bounded-contexts.md](../../../domain/bounded-contexts.md) を参照する。

## コンテキスト

| 識別子 | 名前 | サブドメイン | 役割 | モデル | 契約 |
|---|---|---|---|---|---|
| BC001 | Discovery 支援 | SD001 | 入力テーマを Discovery Brief と Intent 候補確認へ変換する解決モデルを扱う。 | [models.md](bounded-contexts/BC001-discovery-support/models.md) | [contracts.md](bounded-contexts/BC001-discovery-support/contracts.md) |

## コンテキスト間の依存

| Downstream | Upstream | 依存内容 | 組織パターン | 統合パターン | 状態 |
|---|---|---|---|---|---|

コンテキスト間の依存は未確認である。

## 外部境界

| コンテキスト | 名前 | 役割 | 根拠 |
|---|---|---|---|

外部境界は未確認である。

## Unit 分割への入力

| Unit | コンテキスト | 境界 | 分割理由 |
|---|---|---|---|
| U001 | BC001 | Discovery Brief 記録 | 入力テーマと判断を記録する価値境界として分けるため。 |
| U002 | BC001 | Intent 候補提示 | 候補提示と最初の候補確認を、記録とは別の価値境界として分けるため。 |

## 境界外

- Intent 初期化の自動実行。
- Requirement、Use Case、Unit、Bolt、Task を Discovery Brief 内で定義すること。
- 実装方針や Construction の証拠化。

## 未確認事項

- 詳細な DDD Module、集約、契約条件は Construction 以降の具体化で確認する。
