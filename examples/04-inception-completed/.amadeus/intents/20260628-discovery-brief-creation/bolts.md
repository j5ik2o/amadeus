# ボルト

## 一覧

| 識別子 | 概要 | ユニット | 設計 | 依存 | 詳細 |
|---|---|---|---|---|---|
| B001 | Discovery Brief 記録 | U001 | [design.md](units/U001-discovery-brief-recording/design.md) | なし | [B001-discovery-brief-recording.md](bolts/B001-discovery-brief-recording.md) |
| B002 | Intent 候補提示 | U002 | [design.md](units/U002-intent-candidate-presentation/design.md) | B001 | [B002-intent-candidate-presentation.md](bolts/B002-intent-candidate-presentation.md) |

## 依存関係

| ボルト | 依存 | 理由 |
|---|---|---|
| B001 | なし | Discovery Brief 記録は候補提示の前提であるため。 |
| B002 | B001 | Intent 候補提示は記録済みの Discovery Brief を入力にするため。 |
