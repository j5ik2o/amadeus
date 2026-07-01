# スコープ

## 対象境界

### 対象

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-IN-001 | Git ブランチ戦略を Amadeus の steering policy として扱う方針を定義する。 | [Issue #254](https://github.com/amadeus-dlc/amadeus/issues/254) | 採用 |
| SC-IN-002 | `.amadeus/steering/policies.md` と `.amadeus/steering/policies/git-branching.md` の責務を整理する。 | [Issue #254](https://github.com/amadeus-dlc/amadeus/issues/254) | 採用 |
| SC-IN-003 | branch 作成、`origin/main` 追従、PR 作成、merge 後処理、複数 worktree の衝突回避を判断項目として扱う。 | [Issue #254](https://github.com/amadeus-dlc/amadeus/issues/254) | 採用 |
| SC-IN-004 | AGENTS.md の操作指示と steering policy の責務分担を Inception で整理できる状態にする。 | [Issue #254](https://github.com/amadeus-dlc/amadeus/issues/254) | 採用 |
| SC-IN-005 | Intent の traceability や acceptance から参照する policy を後続 stage へ引き継ぐ。 | [Issue #254](https://github.com/amadeus-dlc/amadeus/issues/254) | 採用 |
| SC-IN-006 | validator または evaluator で検出する候補と、人間判断に残す候補を整理する。 | [Issue #254](https://github.com/amadeus-dlc/amadeus/issues/254) | 採用 |

### 対象外

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-OUT-001 | GitHub branch protection 設定そのものを変更する。 | [Issue #254](https://github.com/amadeus-dlc/amadeus/issues/254) | 採用 |
| SC-OUT-002 | CI workflow を変更する。 | [Issue #254](https://github.com/amadeus-dlc/amadeus/issues/254) | 採用 |
| SC-OUT-003 | merge 操作を自動化する。 | [Issue #254](https://github.com/amadeus-dlc/amadeus/issues/254) | 採用 |
| SC-OUT-004 | 既存 PR の branch を整理する。 | [Issue #254](https://github.com/amadeus-dlc/amadeus/issues/254) | 採用 |
| SC-OUT-005 | Ideation の段階で要求、ユースケース、Unit、Bolt、Task、実装を作る。 | [amadeus-ideation](../../../.agents/skills/amadeus-ideation/SKILL.md) | 採用 |

## 実行制御

| 項目 | 値 | 理由 |
|---|---|---|
| 実行スコープ | infra | Amadeus 自己開発の作業基準を steering policy として整備するため。 |
| 省略 stage | なし | policy の責務、参照方法、検出対象を Inception で分解し、Construction で steering policy と検証契約に反映する必要があるため。 |

## 成果物深度

| 項目 | 値 | 理由 |
|---|---|---|
| 深度 | standard | 複数 Intent と複数 worktree の作業判断を追跡できる粒度が必要であるため。 |

## 検証戦略

| 項目 | 値 | 理由 |
|---|---|---|
| 戦略 | standard | validator、必要な eval、typecheck、diff check で、steering policy と参照契約を確認するため。 |

## Inception への引き継ぎ

- Git ブランチ戦略を steering policy として扱う判断を Requirement と Acceptance にする。
- `.amadeus/steering/policies.md` に置く概要と、`.amadeus/steering/policies/git-branching.md` に置く具体ルールの境界を整理する。
- AGENTS.md は実行操作指示、steering policy は Amadeus DLC 成果物から参照する長期方針、という責務分担を検証する。
- branch prefix、1 Issue 1 branch、`origin/main` 追従、rebase、merge commit、fast-forward、PR 作成前検証、merge 後処理、docs-only 例外を要求候補として整理する。
- validator または evaluator で検出する候補と、人間判断だけで扱う候補を分ける。
