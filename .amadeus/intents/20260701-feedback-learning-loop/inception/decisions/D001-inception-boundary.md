# D001: Inception 境界判断

## 背景

Issue #259 は、Amadeus DLC に後段 feedback と Intent 横断の学習ループを定義することを求めている。

Ideation では、前段へ戻す条件、学習先分類、成果物責務、validator/evaluator の結果分類、Issue #257 との接続境界を Inception へ渡している。

## 判断

Inception の対象境界を、後段 feedback と Intent 横断学習の lifecycle contract に固定する。

この Inception では、要求、受け入れ状態、User Story、Use Case、既存コード分析、Unit、Unit Design Brief、Bolt、追跡、判断を作る。
Spec、実装、Task、詳細な Domain Model、Intent Contracts は作らない。

## 理由

Issue #259 の受け入れ条件は、後段発見の分類、横断学習の昇格先、成果物責務、検証結果の扱い、Issue #257 との境界を要求している。
これらは Construction で skill 契約や eval へ反映する前に、Inception で要求と作業単位へ分ける必要がある。

## 影響

Construction では、phase skill、内部 stage skill、steering knowledge、validator または evaluator の説明と関連 eval を対象にする。

完了済み Intent 成果物の一括移行、外部学習基盤導入、Operation phase の全面設計は扱わない。
