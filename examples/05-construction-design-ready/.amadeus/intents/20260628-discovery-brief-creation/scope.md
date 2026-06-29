# スコープ

## 対象

- ユーザーが大きな開発テーマを渡したとき、AI が Discovery Brief として入力テーマ、確認した前提、判定、判定理由、Intent 候補、候補判断、推奨次アクションを記録できる体験を対象にする。
- 判定が multi_intent の場合に、最初に Intent 化する候補を1件に絞れる体験を対象にする。
- 後続の Ideation と Inception が参照できる粒度で、Discovery の責務境界を保つことを対象にする。

## 対象外

- Intent 初期化の自動実行は対象外にする。
- Requirement、Use Case、Unit、Bolt、Task の定義は対象外にする。
- 実装方針や Construction の証拠化は対象外にする。
- domain 成果物の追加や境界づけられたコンテキストの確定は対象外にする。

## 詳細度

- Discovery Brief に記録すべき項目と、Intent 候補を1件に絞る判断材料が分かる粒度に留める。
- Inception では、Discovery Brief 記録と Intent 候補提示を要求候補として扱える粒度にする。
- Requirement、Use Case、Unit、Bolt、Task に相当する粒度へは進めない。

## 検証深度

- Discovery Brief 確認カードで、記録項目、multi_intent 判定、最初に Intent 化する候補、推奨次アクションを確認できることを検証する。
- 外部システム連携、実装方式、CI、Construction の証拠は検証しない。
- 未確認事項は、後続の Inception で要求候補として扱う。

## Inception への引き継ぎ

- Discovery Brief 記録を要求候補として引き継ぐ。
- Intent 候補提示を要求候補として引き継ぐ。
- multi_intent の場合に最初の Intent 候補を1件に絞る判断を要求候補として引き継ぐ。
- Discovery では Requirement、Use Case、Unit、Bolt、Task を作らないという責務境界を制約として引き継ぐ。
