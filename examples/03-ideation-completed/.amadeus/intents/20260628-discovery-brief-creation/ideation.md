# Ideation

## 実現可能性

Discovery Brief は既存の Steering layer と Intent layer の間に置けます。
成果物は Markdown と state.json で表せるため、既存の Amadeus 成果物構造と整合します。

## 体制

| 役割 | 対象 | 責務 |
|---|---|---|
| 判断者 | Amadeus メンテナー | Discovery の責務境界と Intent 候補の粒度を判断する |
| 参照者 | Amadeus 利用者 | 大きなテーマを投げた後の進め方を読む |
| 検証対象 | Amadeus Validator | Discovery と Intent の構造を確認する |
| 後続担当 | Amadeus skill | Intent 初期化、Ideation、Inception を進める |

## 初期モック

初期モックでは、大きな入力テーマを受け取り、Discovery Brief に候補と推奨次アクションが表示される流れを確認します。

## 未確定事項

- 実プロジェクトで複数候補の優先順位をどこまで自動提案するかは未確認です。

## 学習候補

- Discovery Brief から Intent 初期化へ渡す最小情報。
- candidate 状態が recommended から initialized へ変わる時の表示。
