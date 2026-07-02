# ユニット

## 一覧

| 識別子 | 概要 | 要求 | コンテキスト | 依存 | 詳細 |
|---|---|---|---|---|---|
| U001 | merge 後の finalization を決定論的に再開、検出できる契約を Construction phase skill に持たせる。 | R001, R002, R003, R004 | BC001 | なし | [U001-finalization-resume-contract.md](units/U001-finalization-resume-contract.md) |

Unit の `コンテキスト` は Domain Map の `adopted` Bounded Context を参照する。

## 依存関係

| ユニット | 依存 | 理由 |
|---|---|---|
| U001 | なし | 再開規則、検出手段、検証を単一の価値単位として扱うため。 |
