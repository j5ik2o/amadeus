# User Stories

## 一覧

| 識別子 | アクター | 概要 | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|
| S001 | ACT001 | 大きな入力テーマを Discovery Brief として読み返したい | R001 | なし | [S001-read-discovery-brief.md](user-stories/S001-read-discovery-brief.md) |
| S002 | ACT001 | Intent 候補から最初に進める候補を選びたい | R002 | S001 | [S002-select-first-intent-candidate.md](user-stories/S002-select-first-intent-candidate.md) |

## 依存関係

| ユーザーストーリー | 依存 | 理由 |
|---|---|---|
| S001 | なし | Discovery Brief の確認は単独で成立するため |
| S002 | S001 | 候補選択は Brief の内容を読めることを前提にするため |
