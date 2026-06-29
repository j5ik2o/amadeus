# 判断

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Inception の対象境界を固定する | 採用 | なし | [D001-inception-boundary.md](decisions/D001-inception-boundary.md) |
| D002 | BC004 販売管理を唯一の所有コンテキストにする | 採用 | D001 | [D002-bc004-ownership.md](decisions/D002-bc004-ownership.md) |
| D003 | Unit と Bolt の粒度を固定する | 採用 | D001, D002 | [D003-unit-bolt-granularity.md](decisions/D003-unit-bolt-granularity.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Ideation の対象と対象外を Inception の要求へ渡すため。 |
| D002 | D001 | 所有コンテキストは Inception の対象境界に従うため。 |
| D003 | D001, D002 | Unit と Bolt は要求範囲と BC004 の責務境界に従うため。 |
