# 判断

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Ideation を完了し Inception へ進める | 採用 | なし | [D001-complete-ideation.md](decisions/D001-complete-ideation.md) |
| D002 | Inception の分解境界を固定する | 採用 | D001 | [D002-inception-boundary.md](decisions/D002-inception-boundary.md) |
| D003 | Inception gate を passed にする | 採用 | D002 | [D003-pass-inception-gate.md](decisions/D003-pass-inception-gate.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Ideation の対象、対象外、実現可能性、体制、初期モック、追跡がそろっているため。 |
| D002 | D001 | Inception の分解は Ideation 完了後に確定するため。 |
| D003 | D002 | Inception gate は要求、相互作用、Unit、Bolt、境界の追跡後に判断するため。 |
