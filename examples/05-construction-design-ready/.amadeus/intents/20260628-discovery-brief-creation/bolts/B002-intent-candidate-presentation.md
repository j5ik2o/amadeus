# B002: Intent 候補提示

## 概要

- Intent 候補提示を Construction で具体化できるように、候補提示、候補判断、推奨次アクション、最初の候補確認を引き継ぐ。

## 対象ユニット

- U002: Intent 候補提示

## 設計

- [U002 Unit Design Brief](../units/U002-intent-candidate-presentation/design.md)

## 完了条件

- Intent 候補、候補判断、推奨次アクションを提示する設計入力がそろっている。
- multi_intent の場合に最初に Intent 化する候補を1件に絞る設計入力がそろっている。
- Intent 初期化の自動実行を対象外にする制約が残っている。

## 依存

- B001

## 未確認事項

- Intent 候補の並び順。
- 推奨理由の詳細な評価基準。
