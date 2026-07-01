# 追跡

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| Intent | 20260701-skill-contract-catalog | [20260701-skill-contract-catalog.md](../../20260701-skill-contract-catalog.md) | Inception の要求分析で参照する。 |
| Issue | #263 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/263) | Requirement、Acceptance、Use Case、Unit、Bolt の根拠にする。 |
| 先行 Intent | 20260701-feedback-learning-loop | [state.json](../../20260701-feedback-learning-loop/state.json) | feedback 条件と learning review の入力契約を整理する背景にする。 |
| 対象境界 | Skill Contract と生成参照 | [scope.md](scope.md) | Inception の Requirement、Use Case、Unit、Bolt の対象と対象外の制約にする。 |
| 実行制御 | refactor、stage 省略なし | [scope.md](scope.md) | Inception から Construction へ進める前提にする。 |
| 成果物深度 | standard | [scope.md](scope.md) | 契約型、生成物、参照入口、代表 skill 範囲を分解する入力にする。 |
| 検証戦略 | standard | [scope.md](scope.md) | typecheck、contracts:generate、contracts:check、validator または evaluator の入口確認を PR 準備条件にする。 |
| Mock | 初期確認 | [initial-confirmation.puml](mocks/initial-confirmation.puml) | Inception で契約要素、管理元、生成物、利用先の確認例にする。 |
| 状態 | Ideation completed | [state.json](../state.json) | Inception へ進める前提にする。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260701-skill-contract-catalog | 20260701-feedback-learning-loop | Issue #263 は、Issue #257 の decision review と Issue #259 の learning review が参照する skill 実行契約を生成物として扱うため。 | [intents.md](../../../intents.md) |
| Issue | #263 | #257 | decision review が Skill Contract を入力として使う設計が必要であるため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/257) |
| Issue | #263 | #259 | learning review と後段 feedback が Skill Contract を入力として使う設計が必要であるため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/259) |
| Issue | #263 | #248 | 実行時問題報告の分類契約を、Skill Contract の feedback 条件へ接続するため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/248) |
| 外部システム | EXT001 GitHub | なし | Issue、PR、review comment、後続 Issue 候補を追跡の根拠に使うため。 | [external-systems.md](../../../steering/external-systems.md) |
| アクター | ACT001 Maintainer | なし | Skill Contract の項目、生成物、代表 skill 範囲を承認するため。 | [actors.md](../../../steering/actors.md) |

## 受け入れ条件への対応

| 受け入れ条件 | Ideation での扱い | Inception への引き渡し |
|---|---|---|
| Skill Contract の TypeScript 型 | scope の SC-IN-001 に記録した。 | 型と catalog の要求へ落とす。 |
| 代表 skill の事前条件、不変条件、事後条件 | scope の SC-IN-002 と mock に記録した。 | 代表 skill ごとの契約範囲を要求へ落とす。 |
| 生成物の作成 | scope の SC-IN-003 と SC-IN-004 に記録した。 | `contracts:generate` と `contracts:check` の扱いを具体化する。 |
| validator または evaluator の参照入口 | scope の SC-IN-005 に記録した。 | 参照入口と初期検証範囲を定義する。 |
| #257 と #259 への接続 | scope の SC-IN-006 と依存関係に記録した。 | decision review と learning review の入力契約を整理する。 |

## 逆方向 feedback

Ideation で見つかった不足は、Inception 開始時の decision review で再確認する。

Inception 以降で Skill Contract の対象境界、成果物深度、検証方針が不足すると分かった場合は、後段成果物だけを補修せず、Ideation の該当成果物へ戻す。
