# D001: functional design scope

## 背景

対象 Unit は UI を持たない内部 skill 契約である。

## 判断

Functional Design は `business-logic-model.md`、`business-rules.md`、`domain-entities.md` に限定し、`frontend-components.md` は作らない。

## 理由

`amadeus-history-review`、`amadeus-learning-review`、`amadeus-discovery dry-run` consumer 境界は、Agent の実行判断と成果物契約であり、画面構成を持たないため。

## 影響

Construction の検証は skill 本文、昇格先成果物、text contract、validator を中心に行う。
