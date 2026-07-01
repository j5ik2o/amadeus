# ユニット

## 一覧

| 識別子 | 概要 | 要求 | コンテキスト | 依存 | 詳細 |
|---|---|---|---|---|---|
| U001 | Construction 内部 skill の次工程案内を親 skill 経由の継続として整理する。 | R001, R002, R003, R004, R005 | BC001 | なし | [U001-construction-next-skill-guidance.md](units/U001-construction-next-skill-guidance.md) |

Unit の `コンテキスト` は Domain Map の `adopted` Bounded Context を参照する。

## 依存関係

| ユニット | 依存 | 理由 |
|---|---|---|
| U001 | なし | この Intent は Construction 内部 skill の次工程案内という単一の価値境界を扱うため。 |
