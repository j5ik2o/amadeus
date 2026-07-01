# UC001: 現在の次工程案内を確認する

## 概要

Agent は、Construction 内部 skill の `次の skill` 欄を読み、現在の案内が親 skill 経由の継続として読み取れるかを確認する。

## アクター

- ACT002 Agent

## 外部システム

- なし

## 事前条件

- Ideation が完了している。
- 対象 skill 本文を読める。

## 基本フロー

1. Agent は `amadeus-construction` の公開入口契約を読む。
2. Agent は `amadeus-construction-implementation-execution` の `次の skill` 欄を読む。
3. Agent は `amadeus-construction-verification-hardening` の `次の skill` 欄を読む。
4. Agent は、親 skill 経由の継続目的と内部 skill 直接利用条件が読み取れるかを整理する。

## 代替フロー

- 周辺の Construction 内部 skill に同じ誤読余地が見つかった場合は、UC004 の確認対象へ渡す。

## 対象要求

- R001
- R002
- R003
- R004

## 未確認事項

- 周辺 skill の更新要否は Construction で確定する。
