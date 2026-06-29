# 要求

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| R001 | Discovery Brief を記録できる | 採用済み | なし | [R001-discovery-brief-recording.md](requirements/R001-discovery-brief-recording.md) |
| R002 | Intent 候補を提示できる | 採用済み | R001 | [R002-intent-candidate-presentation.md](requirements/R002-intent-candidate-presentation.md) |

## 依存関係

| 要求 | 依存 | 理由 |
|---|---|---|
| R001 | なし | 入力テーマ、前提、判定、判定理由を記録することが後続判断の入口になるため。 |
| R002 | R001 | Intent 候補は Discovery Brief に記録された入力テーマと判断を根拠に提示するため。 |

## 受け入れ状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 採用済み | 未登録 |
| R002 | 採用済み | 未登録 |
