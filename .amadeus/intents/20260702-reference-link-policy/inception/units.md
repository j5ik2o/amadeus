# ユニット

## 一覧

| 識別子 | 概要 | 要求 | コンテキスト | 依存 | 詳細 |
|---|---|---|---|---|---|
| U001 | Amadeus 成果物の参照リンク化方針と適用成果物範囲を扱う。 | R001, R002, R003 | BC001 | なし | [U001-reference-link-contract.md](units/U001-reference-link-contract.md) |
| U002 | 未リンク参照と permalink 条件の検出境界を扱う。 | R004 | BC001 | U001 | [U002-validation-boundary.md](units/U002-validation-boundary.md) |

Unit の `コンテキスト` は Domain Map の `adopted` Bounded Context を参照する。

## 依存関係

| ユニット | 依存 | 理由 |
|---|---|---|
| U001 | なし | 参照リンク化方針と適用成果物範囲が、検出境界の前提であるため。 |
| U002 | U001 | validator と eval の検出境界は、参照リンク化方針と適用範囲を前提にするため。 |
