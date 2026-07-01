# D001: Ideation 完了判断

## 背景

- [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) は、Amadeus 成果物に記載する ID、PR番号、Issue番号、ファイルパス、成果物名のリンク化方針を扱う。
- [Discovery](../../../discoveries/20260702-reference-link-policy.md) では、今回の入力を single_intent と判定している。
- 既存の [20260701-self-development-cycle-stage-workspace](../../20260701-self-development-cycle-stage-workspace.md) は、今回の観察例を含む既存 Intent である。

## 判断

- 対象境界、実行スコープ、成果物深度、検証戦略を採用する。
- Ideation を完了し、Inception へ進める。

## 理由

- Issue #243 の本文から、目的、検討対象、リンク方針、対象外、受け入れ条件を読み取れる。
- 参照リンク化方針は、template、validator、eval、example、既存成果物に影響するが、同じ方針の適用先として Inception で整理できる。
- 初期確認モックにより、参照種別ごとの表記、リンク先、検出方針を確認できる。

## 影響

- Inception では、参照種別ごとのリンク先と表示形式を Requirement と Acceptance にする。
- Inception では、validator で fail、warning、対象外のどれとして扱うかを整理する。
- Inception では、template、eval、example、既存成果物への適用範囲を整理する。
- `state.json` には、実行スコープ、成果物深度、検証戦略を保存しない。
- Inception 以降に `scope.md` を変更する場合は、影響を受ける Requirement、Story、Use Case、Unit、Bolt を確認する。
