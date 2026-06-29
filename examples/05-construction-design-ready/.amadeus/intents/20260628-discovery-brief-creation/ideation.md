# Ideation

## 実現可能性

| 観点 | 状態 | メモ |
|---|---|---|
| 技術 | 確認済み | Discovery Brief と Intent 候補は Amadeus 成果物として記録できる。実装方式はこの Ideation では扱わない。 |
| 運用 | 確認済み | Amadeus 利用者が大きな入力テーマを渡し、AI が Discovery Brief 確認カードで整理内容を提示する流れとして成立する。 |
| セキュリティ | 未確認 | 入力テーマに含まれる機密情報の扱いは、この Intent では未確認にする。 |
| 依存 | 確認済み | 先行 Intent への依存はない。後続候補は Discovery Brief の形が固定された後に進める。 |

## 体制

| 役割 | 種別 | 関心 |
|---|---|---|
| Amadeus 利用者 | 判断者 | 入力テーマが適切な粒度の Intent 候補に分かれ、最初に進める候補を判断できること。 |
| Amadeus メンテナー | 参照者 | skill で生成できる例示が、Discovery の責務境界を越えないこと。 |
| Inception 担当 | 後続担当 | Discovery Brief 記録と Intent 候補提示を要求候補として参照できること。 |

## 初期モック

| モック | 目的 | ファイル |
|---|---|---|
| Discovery Brief 確認カード | 入力テーマ、判定、Intent 候補、最初に Intent 化する候補、推奨次アクションを確認する。 | [initial-confirmation.puml](mocks/initial-confirmation.puml) |

## 未確定事項

- 入力テーマに機密情報が含まれる場合の扱いは未確認。
- Discovery Brief の候補数が多い場合の表示上限は未確認。
- 最初に Intent 化する候補を人間が差し替える場合の扱いは未確認。

## 学習候補

- 実際の入力テーマから、multi_intent 判定に必要な確認した前提の粒度を学習する。
- Intent 候補の依存順序を、後続の Ideation と Inception が参照しやすい形で学習する。
- Discovery の責務境界を越えずに、要求候補へ引き継げる記録粒度を学習する。
