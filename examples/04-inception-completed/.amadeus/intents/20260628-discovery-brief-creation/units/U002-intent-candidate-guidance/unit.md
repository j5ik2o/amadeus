# U002 Intent 候補と推奨次アクションの整理

## ユニット

multi_intent の Intent 候補、候補状態、依存、推奨次アクションを整理する価値単位です。

## 対象要求

- R002

## 価値境界

この Unit は候補一覧と次アクションを扱います。
Discovery Brief の基本見出しは U001 に委譲します。

## 検証観点

- multi_intent で候補が2件以上ある。
- 未初期化時は recommended が1件だけである。
- initialized の候補が作成済み Intent へリンクしている。

## 未確認事項

- 複数候補の優先度を自動計算するかは未確認です。

## 関連成果物

- [design.md](design.md)
