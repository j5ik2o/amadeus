# B001 検出スクリプトと eval

## 概要

未 finalize の Intent を列挙する検出スクリプトを `skills/amadeus-construction/scripts/` に新設し、先に失敗する eval を `skills/amadeus-construction/evals/` に追加する。

## 対象ユニット

- U001

## 設計

- [U001 design](../units/U001-finalization-resume-contract/design.md)

## 完了条件

- eval が、未 finalize あり、なし、対象外（`.amadeus/intents/` なし）の3状態を固定入力で検証し、実装前に失敗した記録がある。
- 検出スクリプトが、対象 workspace を引数に、R001 の判定規則（実装済みかつ検証済み、`pr.md` なし、`construction.gate` 未 passed）で Intent を列挙する。
- gh CLI、ネットワーク、repo root の開発用スクリプトへ依存しない。
- 未 finalize の有無を出力または終了コードで区別できる。
- eval が repo の標準検証（`test:it:*`）から実行される。

## 依存

なし。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction/scripts/`（新設） | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `skills/amadeus-construction/evals/` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `package.json` | 未確認 | なし | 未確認 |

## 未確認事項

- 出力形式（1行1件かJSON か）と終了コードの仕様は Functional Design で確定する。
