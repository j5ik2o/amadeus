# スコープ

## 対象境界

### 対象

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-IN-001 | 完了済み Construction の `traceability.md` に必要な `Construction からの追跡` 表要件を skill に明記する。 | [Issue #245](https://github.com/amadeus-dlc/amadeus/issues/245) | 採用 |
| SC-IN-002 | `ボルト`、`タスク`、`証拠`、`状態` を必須列として扱うことを後続成果物へ渡す。 | [Issue #245](https://github.com/amadeus-dlc/amadeus/issues/245) | 採用 |
| SC-IN-003 | `Task Generation からの追跡` だけでは完了済み Construction の traceability 条件を満たさないことを説明する。 | [PR #244](https://github.com/amadeus-dlc/amadeus/pull/244) | 採用 |
| SC-IN-004 | source skill、昇格先成果物、template、example の確認要否を Inception へ引き継ぐ。 | [steering/policies.md](../../../steering/policies.md) | 採用 |

### 対象外

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-OUT-001 | validator の成果物契約を変更する。 | [Issue #245](https://github.com/amadeus-dlc/amadeus/issues/245) | 採用 |
| SC-OUT-002 | Issue #233 の Construction 成果物を再設計する。 | [PR #244](https://github.com/amadeus-dlc/amadeus/pull/244) | 採用 |
| SC-OUT-003 | 新しい phase、stage、または traceability 状態を追加する。 | [development.md](../../../development.md) | 採用 |
| SC-OUT-004 | 実装コードを大規模に構造変更する。 | [Issue #245](https://github.com/amadeus-dlc/amadeus/issues/245) | 採用 |

## 実行制御

| 項目 | 値 | 理由 |
|---|---|---|
| 実行スコープ | refactor | validator の既存要件に skill 説明を合わせる補正であり、利用者向けの新機能追加ではないため。 |
| 省略 stage | なし | Requirement、Acceptance、Use Case、Unit、Bolt へ分解し、source skill と昇格先成果物の必要差分を Construction で実行できる状態へ進めるため。 |

## 成果物深度

| 項目 | 値 | 理由 |
|---|---|---|
| 深度 | standard | skill 説明、validator 要件、template または example の確認要否を追跡できる粒度が必要であるため。 |

## 検証戦略

| 項目 | 値 | 理由 |
|---|---|---|
| 戦略 | standard | 対象 Intent の validator、`npm run typecheck`、`npm run diff:check` で成果物契約と標準検証を確認するため。 |

## Inception への引き継ぎ

- Construction 完了時に `Construction からの追跡` 表が必要であることを Requirement にする。
- 表の必須列を `ボルト`、`タスク`、`証拠`、`状態` として Acceptance にする。
- `amadeus-construction` と `amadeus-construction-traceability-finalization` のどちらへ何を明記するかを Use Case と Unit で分ける。
- source skill と昇格先成果物の対応更新が必要かを Codebase Analysis で確認する。
- template または example の `construction/traceability.md` に同じ契約を反映する必要があるかを確認する。
