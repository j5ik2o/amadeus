# Requirements

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| R001 | 入力テーマを Discovery Brief に記録できる | 採用済み | なし | [R001-record-discovery-brief.md](requirements/R001-record-discovery-brief.md) |
| R002 | multi_intent の候補と推奨次アクションを示せる | 採用済み | R001 | [R002-show-intent-candidates.md](requirements/R002-show-intent-candidates.md) |

## 依存関係

| 要求 | 依存 | 理由 |
|---|---|---|
| R001 | なし | 入力テーマの記録は他の候補判断の前提になるため |
| R002 | R001 | 候補判断は記録済みの入力テーマを前提にするため |

## 受け入れ状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 採用済み | 未登録 |
| R002 | 採用済み | 未登録 |
