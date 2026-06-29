# Unit Design Brief

## 概要

この文書は U001 の Unit Design Brief である。
Inception では、Discovery Brief 記録の課題解決方針を定め、Bolt 分割と Construction へ渡す設計入力だけを扱う。
詳細な Domain Design、Logical Design、実装設計、テスト設計は Construction で確定する。

## 設計戦略

- 利用者の入力テーマを、後続 phase が参照できる Discovery Brief として記録する。
- 記録対象は、入力テーマ、確認した前提、判定、判定理由に限定する。
- Intent 候補提示は U002 に分け、記録責務と候補提示責務を混ぜない。

## 責務境界

- 所有するもの: Discovery Brief の記録項目と記録完了条件。
- 所有しないもの: Intent 候補の提示、Intent 初期化の自動実行、Construction の証拠化。
- 依存してよいもの: Steering layer の目的、アクター、ポリシー、Intent の scope と ideation。
- 後続で再確認が必要になる条件: Discovery Brief の表示文言と具体的な対話手順を確定する時。

## 構成候補

- 入力テーマ受領。
- 前提整理。
- 判定記録。
- 判定理由記録。
- 未確認事項記録。

## データと契約候補

- 入力候補: 入力テーマ、確認済み前提、未確認前提。
- 出力候補: Discovery Brief。
- 状態候補: 記録前、記録済み、未確認事項あり。
- 事前条件候補: 利用者が入力テーマを提示している。
- 事後条件候補: Discovery Brief に入力テーマ、確認した前提、判定、判定理由が記録されている。
- 不変条件候補: Discovery の範囲で Requirement、Use Case、Unit、Bolt、Task を作らない。

## 検証観点

- Discovery Brief の必須項目が記録されている。
- 判定と判定理由が空欄になっていない。
- 後続 phase へ渡す粒度が Discovery の責務境界を越えていない。

## Bolt 分割方針

- B001 で Discovery Brief 記録の成果物境界、完了条件、未確認事項を Construction へ渡せる形にする。

## Construction への引き継ぎ

- Domain Design で確定する事項: Discovery Brief の詳細モデル。
- Logical Design で確定する事項: Discovery Brief 記録の処理順序。
- 実装時に確認する事項: Markdown 成果物としての保存形式と編集単位。
- 検証時に確定する事項: 必須項目の欠落検出と責務境界の逸脱検出。
