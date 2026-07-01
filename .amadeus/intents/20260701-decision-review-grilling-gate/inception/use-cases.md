# ユースケース

## 一覧

| 識別子 | アクター | 外部システム | ストーリー | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| UC001 | ACT002 Agent | EXT001 GitHub | S001 | R001, R002, R005 | なし | [UC001-review-phase-decision-tree.md](use-cases/UC001-review-phase-decision-tree.md) |
| UC002 | ACT002 Agent, ACT001 Maintainer | なし | S001 | R002, R003 | UC001 | [UC002-handoff-grilling-or-route.md](use-cases/UC002-handoff-grilling-or-route.md) |
| UC003 | ACT002 Agent, ACT003 Validator, ACT004 Evaluator | EXT001 CI | S001 | R004, R005 | UC001, UC002 | [UC003-adopt-shared-phase-rule.md](use-cases/UC003-adopt-shared-phase-rule.md) |

## 依存関係

| ユースケース | 依存 | 理由 |
|---|---|---|
| UC001 | なし | decision tree 再評価が後続分岐の前提であるため。 |
| UC002 | UC001 | grilling handoff と route は、再評価結果を入力にするため。 |
| UC003 | UC001, UC002 | phase skill 反映は、再評価と分岐契約を前提にするため。 |

## 未確認事項

- なし。
