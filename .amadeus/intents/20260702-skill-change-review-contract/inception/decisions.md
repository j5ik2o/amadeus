# Inception 判断

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Inception の所有境界を steering policy と関連文書の契約に固定する。 | accepted | なし | [D001-inception-scope.md](decisions/D001-inception-scope.md) |
| D002 | Unit のコンテキストとして採用済みの BC001 を参照し、Domain Map は更新しない。 | accepted | D001 | [D002-bc001-reference.md](decisions/D002-bc001-reference.md) |
| D003 | User Stories を作成し、Intent:Unit 1:1 を例外として認め、R004 を UC002 の前提として対応付ける。 | accepted | D001 | [D003-granularity-and-stories.md](decisions/D003-granularity-and-stories.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Inception の所有境界を固定するため。 |
| D002 | D001 | 所有境界が決まってから Unit のコンテキスト参照を確定するため。 |
| D003 | D001 | 所有境界が決まってから成果物の粒度例外を判断するため。 |
