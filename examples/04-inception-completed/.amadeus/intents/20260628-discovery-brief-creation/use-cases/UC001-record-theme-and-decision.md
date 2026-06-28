# UC001 入力テーマと判定を記録する

## 概要

Amadeus 利用者が大きな入力テーマを提示し、Discovery Brief に入力テーマ、前提、判定、判定理由を記録する。

## アクター

- ACT001

## 事前条件

- Steering layer が存在する。

## 基本フロー

1. 利用者が大きな入力テーマを提示する。
2. Amadeus が既存 Discovery と既存 Intent との関係を確認する。
3. Amadeus が判定と判定理由を Discovery Brief に記録する。

## 代替フロー

- 既存 Intent に吸収できる場合は existing_intent_update として記録する。

## 事後条件

- Discovery Brief に入力テーマと判定が残る。
