# D001: Inception 所有境界

## 背景

Issue #298 は、skill 変更のレビュー支援契約を steering policy として確定することを求める。

grilling session で、自動化（behavioral eval の必須化）は非採用と確定している。

## 判断

Inception の所有境界を、`steering/policies.md`、`development.md`、README（英語、日本語）の文書契約に固定する。

skill 本文の実装変更、behavioral eval、README の skill 一覧再構成、stage0 採用判断の変更は扱わない。

## 理由

Ideation の scope（SC-IN-001 から SC-IN-006、SC-OUT-001 から SC-OUT-005）が採用済みであり、追加の境界判断が不要なため。

## 影響

- 要求は R001 から R004 の4件に固定する。
- Construction は文書変更だけを扱い、検証は validator、標準検証、文書間整合確認になる。
