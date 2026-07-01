# D001: Functional Design の範囲

## 背景

Issue #274 は、Construction 内部 skill の `次の skill` 欄に親 skill 経由の継続目的を明記することを求めている。

## 判断

Functional Design は次工程案内の文面契約に限定する。

Construction の stage 構造、内部 skill の責務、validator 契約、成果物レイアウトは変更しない。

## 理由

B001 は `amadeus-construction-implementation-execution` の案内補正を扱う。

この変更は文書上の guidance であり、Functional Design では詳細な文面方針、事前条件、事後条件、不変条件を固定すれば足りる。

## 影響

Task Generation では、source skill 更新と昇格先成果物への反映を分けて扱う。

B002 と B003 は後続 Bolt として残す。
