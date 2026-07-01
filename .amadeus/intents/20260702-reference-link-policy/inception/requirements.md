# 要求

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| R001 | 参照先が一意に決まる ID と成果物名を Markdown リンクとして扱う対象範囲を説明できる。 | 採用済み | なし | [R001-reference-targets.md](requirements/R001-reference-targets.md) |
| R002 | workspace 内成果物、GitHub ファイルパス、PR番号、Issue番号のリンク先規則を説明できる。 | 採用済み | R001 | [R002-link-target-rules.md](requirements/R002-link-target-rules.md) |
| R003 | template、example、traceability、decisions、既存成果物のどこへ参照リンク化方針を適用するか説明できる。 | 採用済み | R001, R002 | [R003-artifact-application-scope.md](requirements/R003-artifact-application-scope.md) |
| R004 | 未リンク参照と permalink 条件を validator、eval、人間判断のどれで扱うか説明できる。 | 採用済み | R001, R002, R003 | [R004-validation-boundary.md](requirements/R004-validation-boundary.md) |

## 依存関係

| 要求 | 依存 | 理由 |
|---|---|---|
| R001 | なし | リンク化対象の参照種別が、リンク先規則と適用範囲の前提であるため。 |
| R002 | R001 | リンク先規則は、リンク化対象として採用した参照種別ごとに定義するため。 |
| R003 | R001, R002 | 適用範囲は、リンク化対象とリンク先規則を前提に整理するため。 |
| R004 | R001, R002, R003 | 検出境界は、対象参照、リンク先規則、適用成果物を前提に判断するため。 |

## 受け入れ状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 採用済み | 未登録 |
| R002 | 採用済み | 未登録 |
| R003 | 採用済み | 未登録 |
| R004 | 採用済み | 未登録 |
