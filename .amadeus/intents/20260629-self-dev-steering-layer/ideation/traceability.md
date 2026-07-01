# 追跡

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| Intent | 20260629-self-dev-steering-layer | [20260629-self-dev-steering-layer.md](../../20260629-self-dev-steering-layer.md) | Inception の要求分析で参照する。 |
| Issue | #108 | [GitHub Issue](https://github.com/j5ik2o/amadeus/issues/108) | Inception の背景と受け入れ条件の根拠にする。 |
| 後続 Issue | #233 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/233) | stage 判定と build workspace / target workspace の対応記録だけを扱う後続 Intent の入力にする。 |
| 対象境界 | 初回導入範囲 | [scope.md](scope.md) | Inception の対象と対象外の制約にする。 |
| 実行制御 | feature、Inception と Construction は後続化 | [scope.md](scope.md) | 初回 Intent の完了境界と後続 Intent の分割根拠にする。 |
| 成果物深度 | standard | [scope.md](scope.md) | Requirement、Acceptance、Traceability、Decision の詳細化を後続 Intent に渡す根拠にする。 |
| 検証戦略 | standard | [scope.md](scope.md) | steering layer、対象 Intent、標準検証の確認方針として使う。 |
| Scope | 初回導入範囲 | [scope.md](scope.md) | Inception の対象と対象外の制約にする。 |
| Development | 開発手順 | [development.md](../../../development.md) | 後続 Intent の作業順序と PR 準備条件の根拠にする。 |
| Feasibility | 実現可能 | [ideation.md](ideation.md) | Inception で Requirement と Acceptance を作る根拠にする。 |
| Mock | 初期確認 | [initial-confirmation.puml](mocks/initial-confirmation.puml) | Inception で自己開発の流れを説明する入力にする。 |
| Grilling | Issue #233 引き継ぎ範囲 | [G001-issue-233-handoff-scope.md](grillings/G001-issue-233-handoff-scope.md) | 後続 Intent の対象範囲判断として参照する。 |
| 状態 | Ideation completed | [state.json](../state.json) | 初回導入 Intent は Ideation gate passed で完了し、Inception 以降は後続 Issue と後続 Intent に渡す。 |

## 初回 Intent の provenance

| 項目 | 実績 | 根拠 |
|---|---|---|
| build workspace | `/Users/j5ik2o/.codex/worktrees/4d97/amadeus` | PR #112 の作業 workspace。 |
| build workspace commit | `d65708fc92c0205033a047af0755336e94e4827f` | `codex/self-dev-steering-layer` の merge 前 head。 |
| target workspace | `/Users/j5ik2o/.codex/worktrees/4d97/amadeus` | PR #112 の対象 workspace。 |
| target workspace commit | `d65708fc92c0205033a047af0755336e94e4827f` | 初回導入成果物を持つ PR head。 |
| 利用した昇格済み skill | 該当なし | 初回導入では skill 昇格を後続 Intent に分けるため。 |
| 利用した validator | `.agents/skills/amadeus-validator/validator/AmadeusValidator.ts`、commit `d65708fc92c0205033a047af0755336e94e4827f`、md5 `4f7ddeabcdd8efc8a046a69b52f35da9` | PR branch 上の validator。 |
| 利用した開発用スクリプト | 該当なし | 初回導入成果物は手作業で整理したため。 |
| stage 判定 | stage2 候補 | PR #112 の CI と review comment 対応を完了条件にするため。 |
| 人間による次回 stage0 採用判断 | 未承認 | merge 後に人間が判断するため。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260629-self-dev-steering-layer | なし | 初回導入 Intent であり、既存 Intent に依存しないため。 | [intents.md](../../../intents.md) |
| 外部システム | EXT001 GitHub | なし | Issue と PR を接続するため。 | [external-systems.md](../../../steering/external-systems.md) |
| アクター | ACT001 Maintainer | なし | stage0 採用判断と merge 判断を行うため。 | [actors.md](../../../steering/actors.md) |
