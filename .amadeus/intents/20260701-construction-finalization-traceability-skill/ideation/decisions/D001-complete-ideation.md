# D001: Ideation 完了判断

## 背景

- [Issue #245](https://github.com/amadeus-dlc/amadeus/issues/245) は、Construction finalization skill に完了時の追跡表要件を明記することを求めている。
- [PR #244](https://github.com/amadeus-dlc/amadeus/pull/244) では、`Construction からの追跡` 表を追加した後に対象 Intent の validator が pass した。
- 現在の課題は、validator の成果物契約を変更することではなく、skill 説明から必要な表要件を判断できるようにすることである。

## 判断

- Ideation gate passed として、この Intent を Inception へ進める。
- Inception では、Construction 完了時の traceability 表要件、必須列、対象 skill、template または example の確認要否を Requirement、Acceptance、Use Case、Unit、Bolt へ分解する。
- validator の成果物契約変更と Issue #233 の成果物再設計は対象外にする。

## 理由

- Issue #245 の受け入れ条件は、skill 記述の補正として要求と受け入れ状態へ分解できる粒度である。
- 必須列は `ボルト`、`タスク`、`証拠`、`状態` として Issue 本文に明記されている。
- 先行 PR の検証結果により、`Construction からの追跡` 表を追加すれば validator の既存契約を満たせることが分かっている。

## 影響

- 後続の `amadeus-inception` では、source skill と昇格先成果物の対応更新を確認する。
- Construction では、skill 説明、必要な template、必要な example を Task 化できる。
- PR 準備時には、対象 Intent の validator、`npm run typecheck`、`npm run diff:check` を確認する。
