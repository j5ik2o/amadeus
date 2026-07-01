# UC003 Adopt Shared Phase Rule

## 概要

Agent、Validator、Evaluator が、Ideation、Inception、Construction の公開 phase skill で共通の decision review 規則を参照できるか確認する。

## アクター

- ACT002 Agent
- ACT003 Validator
- ACT004 Evaluator

## 外部システム

- EXT001 CI

## 事前条件

- UC001 と UC002 により、decision review の入力、分岐、grilling handoff が整理されている。

## 基本フロー

1. Agent は公開 phase skill の起動時判断に共通規則を反映する候補を確認する。
2. Agent は Skill Contract が decision review の入力証拠として使えるか確認する。
3. Validator は構造検出の範囲を確認する。
4. Evaluator は品質評価として扱う候補を確認する。
5. CI は生成物や template eval のずれを検出する。

## 代替フロー

- evaluator の扱いが大きい場合は、後続 Issue 候補として切り出す。
- Discovery、Event Storming、Steering への適用は初期対象外として扱う。

## 事後条件

- 初期対象 phase skill が同じ decision review 規則を参照する方針を説明できる。

## 要求

- R004
- R005
