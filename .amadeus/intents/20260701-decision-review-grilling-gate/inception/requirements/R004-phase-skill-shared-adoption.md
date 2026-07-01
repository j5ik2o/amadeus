# R004 Phase Skill Shared Adoption

## 要求

Ideation、Inception、Construction の公開 phase skill が同じ decision review 規則を参照できる。

## 背景

Issue #257 の初期対象は、少なくとも Ideation、Inception、Construction の phase skill である。
同じ判断規則を参照できないと、phase ごとに質問要否の判断がずれる。

## 受け入れ状態

- `amadeus-ideation`、`amadeus-inception`、`amadeus-construction` の起動時判断で共通規則を参照できる。
- 既存の `guided`、`refine`、`repair` のモード判定と競合しない説明がある。
- 内部 skill として `amadeus-decision-review` を作る場合の呼び出し位置を説明できる。

## 対象外

- Discovery、Event Storming、Steering への初期一括適用。
- 各 phase の成果物構造の再設計。
