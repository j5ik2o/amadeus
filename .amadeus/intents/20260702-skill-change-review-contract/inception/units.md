# ユニット

## 一覧

| 識別子 | 概要 | 要求 | コンテキスト | 依存 | 詳細 |
|---|---|---|---|---|---|
| U001 | skill 変更のレビュー支援契約を steering policy として定義し、関連文書の整合を保つ。 | R001, R002, R003, R004 | BC001 | なし | [U001-skill-change-review-contract.md](units/U001-skill-change-review-contract.md) |

Unit の `コンテキスト` は Domain Map の `adopted` Bounded Context を参照する。

## 依存関係

| ユニット | 依存 | 理由 |
|---|---|---|
| U001 | なし | レビュー支援契約の定義と文書整合を単一の価値単位として扱うため。 |
