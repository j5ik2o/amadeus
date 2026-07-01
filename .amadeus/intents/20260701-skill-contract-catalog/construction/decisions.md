# Construction Decisions

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Functional Design の対象を U001、U002、U003 に固定する。 | accepted | なし | [D001-functional-design-scope.md](decisions/D001-functional-design-scope.md) |
| D002 | Skill Contract 参照文書は catalog から生成する。 | accepted | D001 | [D002-generated-skill-contract-reference.md](decisions/D002-generated-skill-contract-reference.md) |
| D003 | validator と evaluator の責務境界を分ける。 | accepted | D001, D002 | [D003-consumer-boundary.md](decisions/D003-consumer-boundary.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Construction の対象 Unit を固定する判断であるため。 |
| D002 | D001 | 生成物方針は Functional Design の対象範囲を前提にするため。 |
| D003 | D001, D002 | consumer 参照入口は catalog と生成物を前提にするため。 |
