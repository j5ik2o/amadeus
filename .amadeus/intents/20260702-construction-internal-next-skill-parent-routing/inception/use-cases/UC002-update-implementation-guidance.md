# UC002: 実装後案内を更新する

## 概要

Agent は、`amadeus-construction-implementation-execution` の `次の skill` 欄を、実装後は親 skill を検証目的で呼ぶ案内へ更新する。

## アクター

- ACT002 Agent

## 外部システム

- なし

## 事前条件

- UC001 で現在の案内を確認している。

## 基本フロー

1. Agent は source skill の `amadeus-construction-implementation-execution` を更新対象にする。
2. Agent は実装後の検証へ進む場合に、`amadeus-construction` を検証目的で呼ぶ説明を追加する。
3. Agent は親 skill が `amadeus-construction-verification-hardening` に委譲する説明を追加する。
4. Agent は直接 `amadeus-construction-verification-hardening` を呼ぶ条件を、親 skill から明示的に委譲されている場合だけにする。

## 代替フロー

- source skill と昇格先成果物の差分がある場合は、既存の昇格手順に従って整合を取る。

## 対象要求

- R001
- R003
- R004
- R005

## 未確認事項

- 文面更新に対応する決定論的検証を追加する必要があるかは Construction で確認する。
