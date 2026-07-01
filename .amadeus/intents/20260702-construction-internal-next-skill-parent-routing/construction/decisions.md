# Construction Decisions

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Functional Design は次工程案内の文面契約に限定する。 | accepted | なし | [D001-functional-design-scope.md](decisions/D001-functional-design-scope.md) |
| D002 | 周辺 Construction 内部 skill の案内も親 skill 経由にそろえる。 | accepted | D001 | [D002-surrounding-skill-routing-alignment.md](decisions/D002-surrounding-skill-routing-alignment.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Construction の設計境界を先に固定するため。 |
| D002 | D001 | Functional Design の文面契約を前提に、周辺 skill の整合範囲を判断するため。 |
