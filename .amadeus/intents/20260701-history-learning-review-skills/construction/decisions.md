# Construction 判断

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Functional Design は UI なしの内部 skill 契約として扱う。 | accepted | なし | [D001-functional-design-scope.md](decisions/D001-functional-design-scope.md) |
| D002 | `amadeus-history-review` と `amadeus-learning-review` は別内部 skill として追加する。 | accepted | D001 | [D002-split-internal-skills.md](decisions/D002-split-internal-skills.md) |
| D003 | `dry-run` 本体は Issue #272 に残し、この Intent では consumer 境界だけを記録する。 | accepted | D002 | [D003-dry-run-consumer-boundary.md](decisions/D003-dry-run-consumer-boundary.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Construction の成果物範囲を先に固定するため。 |
| D002 | D001 | 内部 skill の責務境界は Functional Design の範囲に依存するため。 |
| D003 | D002 | `dry-run` consumer 境界は history review と learning review の責務分離に依存するため。 |
