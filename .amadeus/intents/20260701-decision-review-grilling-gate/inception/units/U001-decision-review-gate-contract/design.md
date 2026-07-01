# U001 Decision Review Gate Contract Design

## 概要

この文書は U001 の Unit Design Brief である。

Inception では、decision review の課題解決方針、Bolt 分割、Construction へ渡す設計入力だけを扱う。

## 設計戦略

decision review は、phase skill 起動時に既存成果物と現在参照できる証拠を読み、判断ノードごとに分岐を説明できるか確認する判断ゲートとして設計する。

質問実行は `amadeus-grilling` に委譲し、decision review 自体は質問しない。

## 責務境界

所有するもの:

- 入力証拠の分類。
- 判断ノードの再評価。
- `grill_required`、`no_grill`、`repair_only`、`follow_up_issue_candidate` の分岐。
- `amadeus-grilling` に渡す一問と補足項目。

所有しないもの:

- `amadeus-grilling` の質問作法。
- Grilling Decision Trail の配置変更。
- validator による内容承認。
- 既存 Intent 成果物の一括移行。

依存してよいもの:

- phase skill の既存成果物。
- Issue、PR、作業ツリー、validator 結果。
- Skill Contract。
- 信頼できる参照元。

後続で再確認が必要になる条件:

- Skill Contract の入力項目が decision review に足りない場合。
- `follow_up_issue_candidate` の分類が実行時問題報告と重複する場合。

## 構成候補

| 構成候補 | 役割 |
|---|---|
| Decision Review Input | 既存成果物、Issue、PR、作業ツリー、validator 結果、Skill Contract、信頼できる参照元を表す。 |
| Decision Node | phase skill が選ぶ判断分岐を表す。 |
| Decision Review Outcome | `grill_required`、`no_grill`、`repair_only`、`follow_up_issue_candidate` を表す。 |
| Grilling Handoff | `amadeus-grilling` に渡す一問と補足項目を表す。 |

## データと契約候補

| 種別 | 候補 |
|---|---|
| 入力候補 | 対象 Intent、対象 phase、既存成果物、Issue、PR、作業ツリー、validator 結果、Skill Contract、信頼できる参照元。 |
| 出力候補 | outcome、判断理由、不明瞭ノード、質問候補、反映先候補、後続 route。 |
| 状態候補 | `grill_required`、`no_grill`、`repair_only`、`follow_up_issue_candidate`。 |
| 事前条件候補 | 対象 Intent と phase skill の入力を解決できる。 |
| 事後条件候補 | 次に進む処理分岐を説明できる。 |
| 不変条件候補 | decision review 自体は質問を実行しない。 |

## 検証観点

- 不明瞭ノードの分類が、Issue #257 の受け入れ条件と対応している。
- `amadeus-grilling` への委譲項目が不足していない。
- validator の `pass` と decision review の結果を混同していない。

## Bolt 分割方針

- B001 は decision review の内部 skill 契約を定義する。
- B003 は Skill Contract や検証との整合を扱う。

## Construction への引き継ぎ

- 内部 skill を新設する場合は、source skill と昇格先 skill を同期する。
- Skill Contract に decision review の consumer 入力が足りるか確認する。
- 質問実行は `amadeus-grilling` へ委譲する契約を守る。
