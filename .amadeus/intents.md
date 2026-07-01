# インテント

## 一覧

| 識別子 | 概要 | 依存 | 詳細 |
|---|---|---|---|
| 20260629-self-dev-steering-layer | Amadeus 本体リポジトリに自己開発用 steering layer を導入する。 | なし | [20260629-self-dev-steering-layer.md](intents/20260629-self-dev-steering-layer.md) |
| 20260701-self-development-cycle-stage-workspace | 自己開発 cycle の stage 判定と workspace 対応記録を定義する。 | 20260629-self-dev-steering-layer | [20260701-self-development-cycle-stage-workspace.md](intents/20260701-self-development-cycle-stage-workspace.md) |
| 20260701-construction-finalization-traceability-skill | Construction finalization skill に完了時の追跡表要件を明記する。 | 20260701-self-development-cycle-stage-workspace | [20260701-construction-finalization-traceability-skill.md](intents/20260701-construction-finalization-traceability-skill.md) |
| 20260701-skill-execution-reporting | amadeus-* skill の実行上の問題報告を標準化する。 | 20260701-construction-finalization-traceability-skill | [20260701-skill-execution-reporting.md](intents/20260701-skill-execution-reporting.md) |
| 20260701-git-branching-policy | Git ブランチ戦略を steering policy として定義する。 | 20260701-self-development-cycle-stage-workspace | [20260701-git-branching-policy.md](intents/20260701-git-branching-policy.md) |
| 20260701-feedback-learning-loop | 後段 feedback と Intent 横断の学習ループを定義する。 | 20260701-skill-execution-reporting | [20260701-feedback-learning-loop.md](intents/20260701-feedback-learning-loop.md) |
| 20260701-history-learning-review-skills | `.amadeus/` 過去分析と学習分類の内部 skill を追加する。 | 20260701-feedback-learning-loop | [20260701-history-learning-review-skills.md](intents/20260701-history-learning-review-skills.md) |
| 20260702-stage-prerequisite-checks | phase skill 起動時に skill 供給元と実行環境の stage 前提を確認する。 | 20260701-history-learning-review-skills | [20260702-stage-prerequisite-checks.md](intents/20260702-stage-prerequisite-checks.md) |
| 20260701-skill-contract-catalog | Skill Contract を amadeus-contracts に追加し、skill 実行契約を生成参照できるようにする。 | 20260701-feedback-learning-loop | [20260701-skill-contract-catalog.md](intents/20260701-skill-contract-catalog.md) |
| 20260701-decision-review-grilling-gate | phase skill 起動時の decision tree 再評価と grilling 起動条件を標準化する。 | 20260701-skill-contract-catalog | [20260701-decision-review-grilling-gate.md](intents/20260701-decision-review-grilling-gate.md) |
| 20260702-reference-link-policy | Amadeus 成果物の参照リンク化方針を定義する。 | 20260701-self-development-cycle-stage-workspace | [20260702-reference-link-policy.md](intents/20260702-reference-link-policy.md) |

## 依存関係

| インテント | 依存 | 理由 |
|---|---|---|
| 20260629-self-dev-steering-layer | なし | 初回導入 Intent であり、既存 Intent に依存しないため。 |
| 20260701-self-development-cycle-stage-workspace | 20260629-self-dev-steering-layer | 初回導入 Intent の D002 により、Issue #233 を後続 Intent として扱うため。 |
| 20260701-construction-finalization-traceability-skill | 20260701-self-development-cycle-stage-workspace | Issue #245 は、Issue #233 の Construction 最終化で見つかった skill 説明と validator 要件のずれを扱うため。 |
| 20260701-skill-execution-reporting | 20260701-construction-finalization-traceability-skill | Issue #248 は、Issue #245 の自己開発作業中に見つかった skill 実行上の問題報告の扱いを標準化するため。 |
| 20260701-git-branching-policy | 20260701-self-development-cycle-stage-workspace | Issue #254 は、複数 Intent と複数 worktree の作業判断を steering policy として扱うため、stage と workspace の対応記録を前提にする。 |
| 20260701-feedback-learning-loop | 20260701-skill-execution-reporting | Issue #259 は、Issue #248 の実行時問題報告を入力にして、後段 feedback と Intent 横断の学習先を標準化するため。 |
| 20260701-history-learning-review-skills | 20260701-feedback-learning-loop | Issue #277 は、Issue #259 の学習分類契約を内部 skill として具体化し、Issue #272 の dry-run が過去分析結果を入力にできる前提を作るため。 |
| 20260702-stage-prerequisite-checks | 20260701-history-learning-review-skills | Issue #278 は、Issue #277 と Issue #272 の前提不成立を代表例として、phase skill 起動時の skill 供給元と実行環境の stage 前提確認を扱うため。 |
| 20260701-skill-contract-catalog | 20260701-feedback-learning-loop | Issue #263 は、Issue #257 の decision review と Issue #259 の learning review が参照する skill 実行契約を生成物として扱うため。 |
| 20260701-decision-review-grilling-gate | 20260701-skill-contract-catalog | Issue #257 は、phase skill 起動時の decision tree 再評価で Skill Contract と既存成果物を入力にするため。 |
| 20260702-reference-link-policy | 20260701-self-development-cycle-stage-workspace | Issue #243 は、自己開発 cycle と workspace 対応記録で作成された Functional Design を観察例にし、Amadeus 成果物の参照リンク化方針を後続 Intent として扱うため。 |
