# D003: 代表 skill 範囲

## 背景

Inception は、代表 skill の最小対象を `amadeus-ideation`、`amadeus-inception`、`amadeus-construction` にする案を示している。

## 判断

初回の代表 skill は、phase 公開入口である `amadeus-ideation`、`amadeus-inception`、`amadeus-construction` の3件に限定する。
`amadeus-discovery` と `amadeus-validator` は初回反映対象外にする。

## 理由

Issue #248 の初回 Construction slice では、全 amadeus-* skill への一括反映よりも、主要 phase の公開入口に共通契約を入れることを優先する。
`amadeus-discovery` は Ideation 前の任意補助分析であり、`amadeus-validator` は構造検証入口であるため、同じ文言を即時に入れる必要性はこの slice では確定していない。

## 影響

- `amadeus-discovery` と `amadeus-validator` への横展開が必要だと分かった場合は、後続 Issue 候補として報告する。
- eval は代表 skill 3件の source と昇格先を確認する。
