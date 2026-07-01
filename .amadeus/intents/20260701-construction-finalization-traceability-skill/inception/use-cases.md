# ユースケース

## 一覧

| 識別子 | アクター | 外部システム | ストーリー | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| UC001 | ACT002 Agent | なし | S001 | R001, R002, R003 | なし | [UC001-identify-traceability-contract.md](use-cases/UC001-identify-traceability-contract.md) |
| UC002 | ACT002 Agent | なし | S001 | R001, R002, R003, R004 | UC001 | [UC002-update-finalization-guidance.md](use-cases/UC002-update-finalization-guidance.md) |
| UC003 | ACT001 Maintainer | EXT001 GitHub | S001 | R004 | UC001, UC002 | [UC003-review-skill-contract-alignment.md](use-cases/UC003-review-skill-contract-alignment.md) |

## 依存関係

| ユースケース | 依存 | 理由 |
|---|---|---|
| UC001 | なし | validator と既存成果物の契約特定が、説明更新の前提であるため。 |
| UC002 | UC001 | finalization guidance は、特定した契約内容を前提に更新するため。 |
| UC003 | UC001, UC002 | レビューは、契約特定と guidance 更新の結果を前提にするため。 |
