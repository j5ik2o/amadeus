# B002: Intent 候補提示

## 概要

- Discovery Brief を根拠に、Intent 候補、候補判断、依存順序、最初に進める候補を提示できる状態にする。
- 候補提示は Intent 初期化を自動実行しない。

## 対象ユニット

- U002

## 設計

- [U002 Unit Design](../units/U002-intent-candidate-presentation/design.md)

## 完了条件

- Intent 候補が提示される。
- 候補ごとの課題、成功状態、除外範囲、依存が確認できる。
- 候補判断が確認できる。
- `multi_intent` の場合に最初に Intent 化する候補が1件だけ示される。
- Intent 初期化が自動実行されない。

## 依存

- B001

## 未確認事項

- 候補選択後に Intent 初期化へ移る導線は Construction 以降で確認する。
