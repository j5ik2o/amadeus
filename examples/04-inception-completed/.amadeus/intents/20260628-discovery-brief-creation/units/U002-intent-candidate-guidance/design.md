# U002 Unit Design Brief

## 概要

この文書は U002 の Unit Design Brief です。
Inception では、Intent 候補と推奨次アクションを Construction へ渡せる設計入力として整理します。

## 設計戦略

Intent 候補は、候補、状態、Intent、課題、成功状態、除外範囲、依存を持つ表として扱います。
状態は recommended、waiting、initialized、discarded に限定します。

## 責務境界

所有するもの:

- Intent 候補表。
- 候補状態。
- 推奨次アクション。

所有しないもの:

- Intent の中身の生成。
- Ideation 以降の成果物。

## 構成候補

- Candidate 一覧。
- Candidate 状態検査。
- Intent リンク検査。

## データと契約候補

入力候補:

- multi_intent 判定。
- 候補ごとの課題と成功状態。

出力候補:

- Intent 候補表。
- 推奨次アクション。

事前条件候補:

- Discovery Brief の基本記録が存在する。

事後条件候補:

- 最初に進める候補が1件に絞られる。

不変条件候補:

- initialized の候補は存在する Intent へリンクする。

## 検証観点

- 候補状態の許可値。
- recommended 件数。
- initialized 候補のリンク。

## Bolt 分割方針

B002 で候補状態と推奨次アクションの整合を扱います。

## Construction への引き継ぎ

- Discovery から Intent 初期化へ引き継ぐ候補選択規則を Construction で確定します。
