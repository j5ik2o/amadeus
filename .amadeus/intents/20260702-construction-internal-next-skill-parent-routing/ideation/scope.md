# スコープ

## 対象境界

### 対象

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-IN-001 | `amadeus-construction-implementation-execution` の `次の skill` 欄に、実装後は親 skill を検証目的で呼ぶことを明記する。 | [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274) | 採用 |
| SC-IN-002 | `amadeus-construction-verification-hardening` の `次の skill` 欄に、検証後は親 skill をファイナライズ目的で呼ぶことを明記する。 | [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274) | 採用 |
| SC-IN-003 | 内部 skill の直接利用は、親 skill から明示的に委譲されている場合だけであることを説明する。 | [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274) | 採用 |
| SC-IN-004 | 実装完了だけでは Construction 完了ではなく、検証と traceability finalization が必要であることを読み取れるようにする。 | [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274) | 採用 |
| SC-IN-005 | 必要に応じて、他の Construction 内部 skill の `次の skill` 欄に同じ誤読余地がないか確認する。 | [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274) | 採用 |

### 対象外

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-OUT-001 | Construction の stage 構造を変更する。 | [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274) | 採用 |
| SC-OUT-002 | 内部 skill の責務を変更する。 | [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274) | 採用 |
| SC-OUT-003 | 成果物レイアウトを変更する。 | [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274) | 採用 |
| SC-OUT-004 | Construction 各工程の一括自動実行を追加する。 | [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274) | 採用 |
| SC-OUT-005 | validator を変更する。 | [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274) | 採用 |

## 実行制御

| 項目 | 値 | 理由 |
|---|---|---|
| 実行スコープ | refactor | Construction の動作や成果物構造ではなく、既存 skill 記述の誘導を補正するため。 |
| 省略 stage | なし | Requirement、Acceptance、Use Case、Unit、Bolt へ分解し、source skill と昇格先成果物の差分を Construction で実行できる状態にするため。 |

## 成果物深度

| 項目 | 値 | 理由 |
|---|---|---|
| 深度 | standard | 対象 skill、親 skill 経由の継続目的、直接委譲の条件、完了条件を追跡できる粒度が必要であるため。 |

## 検証戦略

| 項目 | 値 | 理由 |
|---|---|---|
| 戦略 | standard | 対象 Intent の validator、`npm run typecheck`、`npm run diff:check` に加え、該当 skill の文面確認で受け入れ条件を確認するため。 |

## Inception への引き継ぎ

- 実装後は `amadeus-construction` を検証目的で呼ぶことを Requirement にする。
- 検証後は `amadeus-construction` をファイナライズ目的で呼ぶことを Requirement にする。
- 内部 skill の直接利用条件を Acceptance にする。
- source skill と昇格先成果物を同じ内容に保つ必要があるかを Codebase Analysis で確認する。
- 他の Construction 内部 skill の `次の skill` 欄も、同じ誤読余地がないか確認する。
