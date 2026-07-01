# Construction Decisions

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Functional Design は報告契約と昇格整合に限定する。 | accepted | なし | [D001-functional-design-scope.md](decisions/D001-functional-design-scope.md) |
| D002 | 報告契約は公開 skill の共通節として追加する。 | accepted | D001 | [D002-public-skill-contract.md](decisions/D002-public-skill-contract.md) |
| D003 | 初回の代表 skill は phase 公開入口3件に限定する。 | accepted | D002 | [D003-representative-skill-scope.md](decisions/D003-representative-skill-scope.md) |
| D004 | ローカル検証結果を Construction 完了証拠として採用する。 | accepted | D002, D003 | [D004-local-verification.md](decisions/D004-local-verification.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Construction の設計境界を先に決めるため。 |
| D002 | D001 | 公開 skill へ置く契約は設計境界に含まれるため。 |
| D003 | D002 | 代表 skill の範囲は採用した共通契約を前提に判断するため。 |
| D004 | D002, D003 | 検証結果は、契約配置と代表 skill 範囲が確定した後に採用するため。 |
