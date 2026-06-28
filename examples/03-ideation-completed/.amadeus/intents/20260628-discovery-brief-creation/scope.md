# Ideation Scope

## 対象

- 入力テーマを Discovery Brief に整理するための成果物境界。
- multi_intent 判定時の Intent 候補、候補状態、依存順序。
- amadeus-intent-init へ渡す最初の候補の説明。

## 対象外

- Intent 初期化の自動実行。
- Requirement、Use Case、Unit、Bolt、Task の詳細化。
- Construction の実装、検証、PR 証拠。

## 詳細度

Discovery の責務範囲で、後続 phase が参照できる判断記録に留めます。

## 検証深度

構造検証では、Discovery 一覧、Brief、state.json、Intent 候補状態、初期化済み Intent へのリンクを確認します。
内容妥当性の承認は validator の対象外です。

## Inception への引き継ぎ

Inception では、Discovery Brief 作成を検証可能な Requirement、Story、Use Case、Unit、Bolt、Task に分けます。
