# Unit Design Brief

## 概要

この文書は Unit Design Brief である。
Inception では、finalization 再開契約の課題解決方針を定め、Bolt 分割と Construction へ渡す設計入力だけを扱う。
検出スクリプトの詳細仕様、skill 本文の最終文言、実装は Construction で確定する。

## 設計戦略

- merge というセッション外イベントの再開を、イベント監視ではなく「再実行時の決定論的な状態検出」で成立させる。
- 判定規則を1箇所（未 finalize の定義）に固定し、検出スクリプトと auto 判定表の行が同じ規則を参照する。
- 検出はオフラインで完結させる。基準 branch 由来の checkout に未 finalize 状態が存在すること自体を merge の証拠として扱う。
- スクリプトは skill の同梱物として昇格し、検証（eval）は source 側に置いて昇格先へ混入させない。

## 責務境界

- 所有するもの: 未 finalize 判定規則の文書化、検出スクリプトと eval、auto 判定表の再開行、Decision Review の入力証拠参照。
- 所有しないもの: merge イベント監視、finalization の実行内容そのもの（既存の traceability-finalization の責務）、他 phase skill の判定。
- 依存してよいもの: `state.json` と Bolt 成果物の既存構造、promote 手順、レビュー支援契約、Bun 実行環境。
- 後続で再確認が必要になる条件: state 構造が変わった場合（関連: state 雛形生成の Issue #311）、phase PR の統合条件が導入された場合（Issue #310）。

## 構成候補

- 未 finalize 判定: 判定規則の定義と、その文書上の置き場所を扱う。
- 検出スクリプト: workspace を入力に未 finalize の Intent を列挙する実行可能な手段を扱う。
- 再開規則: auto 判定表の行と Decision Review の入力証拠参照を扱う。
- 検証と昇格: eval 先行の検証と promote 同期を扱う。

## データと契約候補

- 入力候補: 対象 workspace の path、`.amadeus/intents/**` の `state.json` と Bolt 成果物。
- 出力候補: 未 finalize の Intent の一覧（機械可読）、検出なしの区別。
- 状態候補: 未 finalize、finalize 済み、対象外（construction 未開始）。
- 事前条件候補: 基準 branch 由来の checkout である。
- 事後条件候補: merge 後の再実行で auto 判定が finalization を選ぶ。
- 不変条件候補: 判定に GitHub への照会を必須にしない。

## 検証観点

- eval は、未 finalize あり、なし、対象外の3状態を固定入力で検証する。
- 実装前に eval が失敗することを確認する（RED の記録）。
- 昇格先成果物と source の同期を promote 手順と標準検証で確認する。
- auto 判定表の変更は、skill 変更 PR の挙動差分要約で影響を説明する。

## Bolt 分割方針

- B001 で検出スクリプトと eval を実装する（判定規則の実装を含む）。
- B002 で skill 本文の auto 判定表と Decision Review 記述を更新し、promote で昇格先を同期する。

## Construction への引き継ぎ

- Functional Design で確定する事項: 未 finalize 判定の状態モデル、検出スクリプトの入出力契約（引数、出力形式、終了コード）。
- 文書変更で確定する事項: auto 判定表の行の文言と、既存行（refine、repair）との排他条件の表現。
- 検証時に確定する事項: eval を repo の test chain（`test:it:*`）へ組み込む入口名。
