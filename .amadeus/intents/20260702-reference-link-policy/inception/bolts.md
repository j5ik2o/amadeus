# ボルト

## 一覧

| 識別子 | 概要 | ユニット | 設計 | 依存 | 詳細 |
|---|---|---|---|---|---|
| B001 | 参照リンク化対象とリンク先規則を定義する。 | U001 | [design.md](units/U001-reference-link-contract/design.md) | なし | [B001-reference-link-rules.md](bolts/B001-reference-link-rules.md) |
| B002 | template、example、既存成果物への適用範囲を定義する。 | U001 | [design.md](units/U001-reference-link-contract/design.md) | B001 | [B002-artifact-application-scope.md](bolts/B002-artifact-application-scope.md) |
| B003 | validator、eval、人間判断の検出境界を定義する。 | U002 | [design.md](units/U002-validation-boundary/design.md) | B001, B002 | [B003-validation-boundary.md](bolts/B003-validation-boundary.md) |

## 依存関係

| ボルト | 依存 | 理由 |
|---|---|---|
| B001 | なし | 参照リンク化対象とリンク先規則は、適用範囲と検出境界の前提であるため。 |
| B002 | B001 | 成果物への適用範囲は、参照リンク化対象とリンク先規則を前提にするため。 |
| B003 | B001, B002 | 検出境界は、参照リンク化対象、リンク先規則、適用成果物を前提にするため。 |
