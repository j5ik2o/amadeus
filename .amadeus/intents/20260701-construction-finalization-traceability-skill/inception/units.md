# ユニット

## 一覧

| 識別子 | 概要 | 要求 | コンテキスト | 依存 | 詳細 |
|---|---|---|---|---|---|
| U001 | Construction finalization skill の追跡表 guidance を扱う。 | R001, R002, R003 | BC001 | なし | [U001-finalization-skill-guidance.md](units/U001-finalization-skill-guidance.md) |
| U002 | traceability template、example、source skill と昇格先成果物の整合確認を扱う。 | R004 | BC001 | U001 | [U002-traceability-template-alignment.md](units/U002-traceability-template-alignment.md) |

Unit の `コンテキスト` は Domain Map の `adopted` Bounded Context を参照する。

## 依存関係

| ユニット | 依存 | 理由 |
|---|---|---|
| U001 | なし | 完了時表要件と必須列の guidance は、整合確認の前提であるため。 |
| U002 | U001 | template、example、source skill と昇格先成果物の整合は、採用する guidance 内容を前提にするため。 |
