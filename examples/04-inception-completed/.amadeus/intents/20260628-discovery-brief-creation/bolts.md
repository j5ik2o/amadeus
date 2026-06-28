# Bolts

## 一覧

| 識別子 | 概要 | ユニット | 設計 | 依存 | 詳細 |
|---|---|---|---|---|---|
| B001 | Discovery Brief の基本記録を整える | U001 | [U001 design](units/U001-discovery-brief-recording/design.md) | なし | [B001-discovery-brief-recording/bolt.md](bolts/B001-discovery-brief-recording/bolt.md) |
| B002 | Intent 候補と推奨次アクションを整える | U002 | [U002 design](units/U002-intent-candidate-guidance/design.md) | B001 | [B002-intent-candidate-guidance/bolt.md](bolts/B002-intent-candidate-guidance/bolt.md) |

## 依存関係

| ボルト | 依存 | 理由 |
|---|---|---|
| B001 | なし | Brief の基本記録は候補整理の前提になるため |
| B002 | B001 | 候補整理は記録済み Brief を前提にするため |
