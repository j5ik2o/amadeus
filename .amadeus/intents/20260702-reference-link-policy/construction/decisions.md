# Construction 判断

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Functional Design の対象 Unit と Domain Map 反映範囲を固定する。 | active | なし | [D001-functional-design-scope.md](decisions/D001-functional-design-scope.md) |
| D002 | 参照リンク化対象とリンク先規則を Construction template へ記録する。 | active | D001 | [D002-reference-link-rules.md](decisions/D002-reference-link-rules.md) |
| D003 | 参照リンク化方針の適用成果物範囲を固定する。 | active | D002 | [D003-artifact-application-scope.md](decisions/D003-artifact-application-scope.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Construction の Functional Design 対象を先に固定する必要があるため。 |
| D002 | D001 | 参照リンク化対象とリンク先規則は U001 の Functional Design を根拠にするため。 |
| D003 | D002 | 適用成果物範囲は、参照リンク化対象とリンク先規則を前提にするため。 |
