# ユースケース

## 一覧

| 識別子 | アクター | 外部システム | ストーリー | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| UC001 | ACT002 Agent | EXT001 GitHub | S001 | R001, R002 | なし | [UC001-define-reference-link-rules.md](use-cases/UC001-define-reference-link-rules.md) |
| UC002 | ACT002 Agent | EXT001 GitHub | S001 | R003 | UC001 | [UC002-apply-artifact-scope.md](use-cases/UC002-apply-artifact-scope.md) |
| UC003 | ACT001 Maintainer | EXT001 GitHub | S001 | R004 | UC001, UC002 | [UC003-review-validation-boundary.md](use-cases/UC003-review-validation-boundary.md) |

## 依存関係

| ユースケース | 依存 | 理由 |
|---|---|---|
| UC001 | なし | 参照リンク化対象とリンク先規則は、適用範囲と検出境界の前提であるため。 |
| UC002 | UC001 | 成果物への適用範囲は、参照リンク化対象とリンク先規則を前提にするため。 |
| UC003 | UC001, UC002 | 検出境界は、参照リンク化対象、リンク先規則、適用成果物を前提にするため。 |
