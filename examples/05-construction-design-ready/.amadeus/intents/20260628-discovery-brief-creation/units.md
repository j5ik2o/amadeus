# ユニット

## 一覧

| 識別子 | 概要 | 要求 | コンテキスト | 依存 | 詳細 |
|---|---|---|---|---|---|
| U001 | Discovery Brief 記録 | R001 | BC001 | なし | [U001-discovery-brief-recording.md](units/U001-discovery-brief-recording.md) |
| U002 | Intent 候補提示 | R002 | BC001 | U001 | [U002-intent-candidate-presentation.md](units/U002-intent-candidate-presentation.md) |

## 依存関係

| ユニット | 依存 | 理由 |
|---|---|---|
| U001 | なし | Discovery Brief の記録は候補提示の前提であり、単独で価値を持つため。 |
| U002 | U001 | Intent 候補提示は、記録済みの入力テーマ、判定、判定理由を根拠に成立するため。 |
