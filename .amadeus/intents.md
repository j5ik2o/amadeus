# インテント

## 一覧

| 識別子 | 概要 | 依存 | 詳細 |
|---|---|---|---|
| 20260629-self-dev-steering-layer | Amadeus 本体リポジトリに自己開発用 steering layer を導入する。 | なし | [20260629-self-dev-steering-layer.md](intents/20260629-self-dev-steering-layer.md) |
| 20260701-self-development-cycle-stage-workspace | 自己開発 cycle の stage 判定と workspace 対応記録を定義する。 | 20260629-self-dev-steering-layer | [20260701-self-development-cycle-stage-workspace.md](intents/20260701-self-development-cycle-stage-workspace.md) |
| 20260701-construction-finalization-traceability-skill | Construction finalization skill に完了時の追跡表要件を明記する。 | 20260701-self-development-cycle-stage-workspace | [20260701-construction-finalization-traceability-skill.md](intents/20260701-construction-finalization-traceability-skill.md) |
| 20260701-skill-execution-reporting | amadeus-* skill の実行上の問題報告を標準化する。 | 20260701-construction-finalization-traceability-skill | [20260701-skill-execution-reporting.md](intents/20260701-skill-execution-reporting.md) |
| 20260701-git-branching-policy | Git ブランチ戦略を steering policy として定義する。 | 20260701-self-development-cycle-stage-workspace | [20260701-git-branching-policy.md](intents/20260701-git-branching-policy.md) |

## 依存関係

| インテント | 依存 | 理由 |
|---|---|---|
| 20260629-self-dev-steering-layer | なし | 初回導入 Intent であり、既存 Intent に依存しないため。 |
| 20260701-self-development-cycle-stage-workspace | 20260629-self-dev-steering-layer | 初回導入 Intent の D002 により、Issue #233 を後続 Intent として扱うため。 |
| 20260701-construction-finalization-traceability-skill | 20260701-self-development-cycle-stage-workspace | Issue #245 は、Issue #233 の Construction 最終化で見つかった skill 説明と validator 要件のずれを扱うため。 |
| 20260701-skill-execution-reporting | 20260701-construction-finalization-traceability-skill | Issue #248 は、Issue #245 の自己開発作業中に見つかった skill 実行上の問題報告の扱いを標準化するため。 |
| 20260701-git-branching-policy | 20260701-self-development-cycle-stage-workspace | Issue #254 は、複数 Intent と複数 worktree の作業判断を steering policy として扱うため、stage と workspace の対応記録を前提にする。 |
