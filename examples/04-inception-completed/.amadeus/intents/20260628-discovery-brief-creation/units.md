# Units

## 一覧

| 識別子 | 概要 | 要求 | コンテキスト | 依存 | 詳細 |
|---|---|---|---|---|---|
| U001 | Discovery Brief の基本記録 | R001 | なし | なし | [U001-discovery-brief-recording/unit.md](units/U001-discovery-brief-recording/unit.md) |
| U002 | Intent 候補と推奨次アクションの整理 | R002 | なし | U001 | [U002-intent-candidate-guidance/unit.md](units/U002-intent-candidate-guidance/unit.md) |

## 依存関係

| ユニット | 依存 | 理由 |
|---|---|---|
| U001 | なし | Brief の基本記録は候補整理の前提になるため |
| U002 | U001 | 候補整理は記録済み Brief を前提にするため |
