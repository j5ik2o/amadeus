# D001: Functional Design 対象

## 背景

Issue #263 の Inception では、Unit を Skill Contract catalog model、generation and drift、consumer integration の3つに分けている。

## 判断

Construction の Functional Design 対象を U001、U002、U003 に固定する。
3 Unit とも UI 構成はないため、`frontendSurface` は `absent` とする。

## 理由

Skill Contract は型、生成物、consumer 参照入口の順で成立する。
3 Unit をすべて Functional Design に通すことで、Bolt の Task が Unit Design Brief だけに依存しない。

## 影響

`frontend-components.md` は作らない。
Domain Map と Context Map に新しい採用項目は追加しない。
