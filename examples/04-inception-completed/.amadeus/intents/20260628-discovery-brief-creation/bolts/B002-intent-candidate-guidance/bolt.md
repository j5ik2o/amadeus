# B002 Intent 候補と推奨次アクションを整える

## 概要

multi_intent の Intent 候補、候補状態、依存、推奨次アクションを扱います。

## 対象ユニット

- U002: Intent 候補と推奨次アクションの整理

## 設計

- [U002 Unit Design Brief](../../units/U002-intent-candidate-guidance/design.md)

## 完了条件

- Intent 候補が2件以上ある。
- recommended または initialized の候補が次アクションに接続している。

## 依存

- B001

## 未確認事項

- 候補優先度の自動提案は未確認です。
