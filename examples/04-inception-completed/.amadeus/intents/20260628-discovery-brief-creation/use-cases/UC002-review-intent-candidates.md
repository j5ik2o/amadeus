# UC002 Intent 候補を確認する

## 概要

Amadeus 利用者が Discovery Brief の Intent 候補を確認し、最初に進める候補と依存順序を把握する。

## アクター

- ACT001

## 事前条件

- Discovery Brief に multi_intent の判定が記録されている。

## 基本フロー

1. 利用者が Intent 候補一覧を読む。
2. Amadeus が候補の状態、課題、成功状態、除外範囲、依存を示す。
3. 利用者が recommended または initialized の候補を確認する。

## 代替フロー

- 候補が1件だけなら single_intent として扱う。

## 事後条件

- 最初に進める Intent 候補が明確になる。
