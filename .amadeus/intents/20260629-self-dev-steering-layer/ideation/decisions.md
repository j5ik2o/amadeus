# 判断

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Ideation gate passed として完了し、後続 Issue と後続 Intent に渡す | 採用 | なし | [D001-complete-ideation.md](decisions/D001-complete-ideation.md) |
| D002 | Issue #233 へ渡す範囲を stage 判定と workspace 対応記録に限定する | 採用 | D001 | [D002-issue-233-handoff-scope.md](decisions/D002-issue-233-handoff-scope.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Issue #108 の初回完了条件が Ideation gate passed であるため。 |
| D002 | D001 | D001 で Inception 以降を後続 Issue と後続 Intent に渡すと決めているため。 |
