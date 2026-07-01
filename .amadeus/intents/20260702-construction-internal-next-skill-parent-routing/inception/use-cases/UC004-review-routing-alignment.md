# UC004: 次工程案内の整合を確認する

## 概要

Maintainer は、Construction 内部 skill の次工程案内が公開入口契約、source skill、昇格先成果物、周辺 skill と整合していることを確認する。

## アクター

- ACT001 Maintainer

## 外部システム

- EXT001 GitHub

## 事前条件

- UC002 と UC003 の対象説明が更新されている。

## 基本フロー

1. Maintainer は PR 上で対象 skill 差分を確認する。
2. Maintainer は `amadeus-construction` の公開入口契約と矛盾していないことを確認する。
3. Maintainer は source skill と昇格先成果物の説明が整合していることを確認する。
4. Maintainer は周辺の Construction 内部 skill の `次の skill` 欄に同じ誤読余地がないかを確認する。

## 代替フロー

- 周辺 skill に更新が必要だと判断した場合は、この Intent の Construction 対象に含める。
- 目的と異なる構造変更が必要だと判断した場合は、後続 Intent 候補として分ける。

## 対象要求

- R003
- R004
- R005

## 未確認事項

- PR URL は Construction で作成後に記録する。
