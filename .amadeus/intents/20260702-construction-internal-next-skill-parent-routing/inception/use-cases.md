# ユースケース

## 一覧

| 識別子 | アクター | 外部システム | ストーリー | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| UC001 | ACT002 Agent | なし | S001 | R001, R002, R003, R004 | なし | [UC001-identify-current-next-skill-guidance.md](use-cases/UC001-identify-current-next-skill-guidance.md) |
| UC002 | ACT002 Agent | なし | S001 | R001, R003, R004, R005 | UC001 | [UC002-update-implementation-guidance.md](use-cases/UC002-update-implementation-guidance.md) |
| UC003 | ACT002 Agent | なし | S001 | R002, R003, R004, R005 | UC001, UC002 | [UC003-update-verification-guidance.md](use-cases/UC003-update-verification-guidance.md) |
| UC004 | ACT001 Maintainer | EXT001 GitHub | S002 | R003, R004, R005 | UC002, UC003 | [UC004-review-routing-alignment.md](use-cases/UC004-review-routing-alignment.md) |

## 依存関係

| ユースケース | 依存 | 理由 |
|---|---|---|
| UC001 | なし | 既存案内の確認が、説明更新の前提であるため。 |
| UC002 | UC001 | 実装後案内は、現状の `次の skill` 欄を確認してから更新するため。 |
| UC003 | UC001, UC002 | 検証後案内は、現状確認と実装後案内の表現方針を前提に更新するため。 |
| UC004 | UC002, UC003 | 整合レビューは、主要対象 skill の更新結果を前提にするため。 |
