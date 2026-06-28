# Amadeus テーマ分解 Discovery Brief

## 入力テーマ

Amadeus を使う人が、大きな開発テーマを投げても、適切な粒度の Intent に分けて、後続の Ideation と Inception に進められるようにしたい。

## 確認した前提

- 入力テーマは単一の実装変更ではなく、Discovery、Intent 初期化、検証、例示参照にまたがります。
- 例示は Amadeus 自身の改善テーマを使います。
- 最初に Intent 化する候補は、入力テーマを Discovery Brief に整理できることです。
- Construction は、実装と検証証拠に結びつくため今回の例示 snapshot には含めません。

## 判定

multi_intent

## 判定理由

入力テーマには、入力整理、Intent 初期化への引き継ぎ、成果物検証、例示参照の4つの関心が含まれます。
これらを1つの Intent にすると、後続の Ideation と Inception で要求、相互作用、Unit、Bolt が広がりすぎます。
そのため Discovery では multi_intent と判定し、最初の候補だけを Intent 化します。

## Intent Draft

該当なし

## Intent 候補

| 候補 | 状態 | Intent | 課題 | 成功状態 | 除外範囲 | 依存 |
|---|---|---|---|---|---|---|
| 入力テーマを Discovery Brief に整理できる | initialized | [20260628-discovery-brief-creation](../../intents/20260628-discovery-brief-creation/intent.md) | 大きな入力テーマが Intent 化前に整理されず、粒度判断が後続 phase に流れ込む | Discovery Brief に入力テーマ、判定、候補、推奨次アクションが残る | Intent 初期化、Ideation、Inception、実装 | なし |
| Discovery から Intent 初期化へ引き継げる | waiting | 未作成 | Discovery の候補を Intent の入れ物へ渡す手順が曖昧になる | recommended または initialized の候補から Intent を初期化できる | Ideation 以降の成果物 | 入力テーマを Discovery Brief に整理できる |
| Discovery を含む成果物構造を検証できる | waiting | 未作成 | Discovery が成果物構造として壊れても検出しにくい | Validator が Discovery、Intent、phase 別成果物を検証できる | 内容妥当性の承認 | 入力テーマを Discovery Brief に整理できる |
| Discovery の例示スナップショットを参照できる | waiting | 未作成 | root .amadeus と例示が混ざり、読者が実運用状態と誤解する | examples 配下で段階別 snapshot を参照できる | Construction の実装証拠 | 入力テーマを Discovery Brief に整理できる |

## 候補判断

最初に Intent 化する候補は「入力テーマを Discovery Brief に整理できる」です。
この候補を先に進めると、後続候補の入力になる Discovery Brief の形を固定できます。

## 既存 Intent との関係

作成済み Intent は [20260628-discovery-brief-creation](../../intents/20260628-discovery-brief-creation/intent.md) です。

## 推奨次アクション

作成済み Intent [20260628-discovery-brief-creation](../../intents/20260628-discovery-brief-creation/intent.md) を amadeus-ideation に進めます。
