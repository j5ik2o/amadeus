# BC001: Discovery 支援

## 目的

Discovery 支援は、入力テーマを Discovery Brief と Intent 候補確認へ変換する解決モデルを扱う。

## 責務

- 入力テーマと確認した前提を Discovery Brief として記録する。
- 判定、判定理由、推奨次アクションを候補確認へ渡す。
- Intent 初期化以降の成果物定義を Discovery Brief の責務から外す。

## 外部境界

- Intent 初期化の自動実行は境界外である。
- Requirement、Use Case、Unit、Bolt、Task の定義は境界外である。

## 関連成果物

- [models.md](BC001-discovery-support/models.md)
- [contracts.md](BC001-discovery-support/contracts.md)
