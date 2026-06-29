# Unit Design Brief

## 概要

この文書は U002 の Unit Design Brief である。
Inception では、Intent 候補提示の課題解決方針を定め、Bolt 分割と Construction へ渡す設計入力だけを扱う。
詳細な Domain Design、Logical Design、実装設計、テスト設計は Construction で確定する。

## 設計戦略

- Discovery Brief に記録された入力テーマと判断を根拠に、Intent 候補、候補判断、推奨次アクションを提示する。
- multi_intent の場合は、最初に Intent 化する候補を1件に絞る。
- Intent 初期化の自動実行は範囲外として扱う。

## 責務境界

- 所有するもの: Intent 候補提示、候補判断、推奨次アクション、最初の候補確認。
- 所有しないもの: Discovery Brief の初期記録、Intent 初期化の自動実行、Construction の証拠化。
- 依存してよいもの: U001 が記録する Discovery Brief、scope と ideation の対象外制約。
- 後続で再確認が必要になる条件: Intent 候補の並び順や推奨理由の詳細な評価基準を確定する時。

## 構成候補

- Discovery Brief 参照。
- Intent 候補抽出。
- 候補判断提示。
- 推奨次アクション提示。
- 最初に進める候補提示。

## データと契約候補

- 入力候補: Discovery Brief、候補判断の前提、multi_intent 判定。
- 出力候補: Intent 候補一覧、候補判断、推奨次アクション、最初に進める候補。
- 状態候補: 候補未提示、候補提示済み、最初の候補確認済み、未確認事項あり。
- 事前条件候補: Discovery Brief が記録済みである。
- 事後条件候補: 利用者が最初に進める Intent 候補を確認できる。
- 不変条件候補: 候補提示は Intent 初期化を自動実行しない。

## 検証観点

- Intent 候補、候補判断、推奨次アクションが提示されている。
- multi_intent の場合に最初に Intent 化する候補が1件に絞られている。
- Intent 初期化の自動実行へ進んでいない。

## Bolt 分割方針

- B002 で Intent 候補提示の成果物境界、完了条件、未確認事項を Construction へ渡せる形にする。

## Construction への引き継ぎ

- Domain Design で確定する事項: Intent 候補と候補判断の詳細モデル。
- Logical Design で確定する事項: 候補提示と最初の候補確認の処理順序。
- 実装時に確認する事項: 候補一覧と推奨次アクションの保存形式。
- 検証時に確定する事項: 候補提示、最初の候補確認、対象外動作の検証方法。
