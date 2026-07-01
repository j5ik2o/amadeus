# D001 Functional Design Scope

## 状態

accepted。

## 背景

Issue #259 は、後段発見を上流成果物や横断学習へ戻す契約を扱う。
新しい UI、外部実行時機構、Domain Map の境界追加は主目的ではない。

## 判断

Functional Design は feedback routing と learning promotion の契約に限定する。
frontend surface は存在しないため、`frontend-components.md` は作らない。

## 根拠

- R001 から R005。
- U001 feedback-routing-contract。
- U002 learning-promotion-contract。

## 影響

Construction 成果物は、Unit ごとの業務ロジック、業務ルール、Domain Entity、Bolt tasks、検証結果に限定する。
