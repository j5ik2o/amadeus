# D001: Inception 所有境界

## 背景

Issue #309 は、merge 後の Construction finalization の再開と検出を、skill 契約と同梱スクリプトで成立させることを求める。

## 判断

Inception の所有境界を、`amadeus-construction` の skill 変更（auto 判定表、Decision Review 記述）と、同梱スクリプトおよびその eval に固定する。

merge イベントの監視、finalization の自動 merge、完了済み Intent の遡及修正、dev-scripts への配置は扱わない。

## 理由

Ideation の scope（SC-IN-001 から SC-IN-005、SC-OUT-001 から SC-OUT-005）が採用済みであり、追加の境界判断が不要なため。

## 影響

- 要求は R001 から R004 の4件に固定する。
- Construction は skill 変更 PR として、レビュー支援契約の適用対象になる。
