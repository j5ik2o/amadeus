# UC002 Handoff Grilling Or Route

## 概要

Agent が decision review の結果を処理分岐へ分類し、必要な場合だけ `amadeus-grilling` に一問を渡す。

## アクター

- ACT002 Agent
- ACT001 Maintainer

## 外部システム

- なし

## 事前条件

- UC001 により、判断ノードと証拠が整理されている。

## 基本フロー

1. Agent は判断ノードを `grill_required`、`no_grill`、`repair_only`、`follow_up_issue_candidate` に分類する。
2. Agent は `grill_required` の場合、一問、確認理由、推奨回答、推奨理由、反映先候補を作る。
3. Agent は質問実行を `amadeus-grilling` に委譲する。
4. Maintainer は質問へ回答する。
5. Agent は回答後に、該当 phase 成果物と Grilling Decision Trail を更新する候補を得る。

## 代替フロー

- `no_grill` の場合は、質問せず通常処理へ進む。
- `repair_only` の場合は、対象 phase の repair へ進む。
- `follow_up_issue_candidate` の場合は、現在成果物へ混ぜず報告する。

## 事後条件

- 質問すべき場合と質問しない場合の理由を説明できる。

## 要求

- R002
- R003
