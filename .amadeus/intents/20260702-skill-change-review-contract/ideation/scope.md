# スコープ

## 対象境界

### 対象

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-IN-001 | 変更種別「skill 変更」の必須条件に、挙動差分の要約を追加する。 | [Issue #298](https://github.com/amadeus-dlc/amadeus/issues/298) | 採用 |
| SC-IN-002 | skill 変更 PR の作成前に skill-forge による確認を実施し、結果を PR 説明に記録する条件を必須化する。 | [Issue #298](https://github.com/amadeus-dlc/amadeus/issues/298) | 採用 |
| SC-IN-003 | skill 本文変更と他の変更種別を同一 PR に混ぜない粒度制約を定義する。 | [Issue #298](https://github.com/amadeus-dlc/amadeus/issues/298) | 採用 |
| SC-IN-004 | 緊急修正時と粒度制約の例外運用を、Git Branching Policy の例外記録と同じ型で定義する。 | [Git Branching Policy](../../../steering/policies/git-branching.md) | 採用 |
| SC-IN-005 | development.md の PR 準備条件から、skill 変更時の追加条件を追跡できるようにする。 | [Issue #298](https://github.com/amadeus-dlc/amadeus/issues/298) | 採用 |
| SC-IN-006 | README.md の skill-forge 確認記述と policies の整合を確認する。 | [Intent](../../20260702-skill-change-review-contract.md) | 採用 |

### 対象外

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-OUT-001 | skill 本文変更ごとの behavioral eval を必須化する。 | [Issue #298](https://github.com/amadeus-dlc/amadeus/issues/298) | 採用 |
| SC-OUT-002 | skill、validator、example の実装変更を行う。 | [Issue #298](https://github.com/amadeus-dlc/amadeus/issues/298) | 採用 |
| SC-OUT-003 | README の skill 一覧を再構成する。 | [Intent](../../20260702-skill-change-review-contract.md) | 採用 |
| SC-OUT-004 | stage0 採用判断を自動化する。 | [steering/policies.md](../../../steering/policies.md) | 採用 |
| SC-OUT-005 | 初期 Ideation で後続 phase の詳細成果物や実装を作る。 | [Intent](../../20260702-skill-change-review-contract.md) | 採用 |

## 実行制御

| 項目 | 値 | 理由 |
|---|---|---|
| 実行スコープ | refactor | 既存の変更種別表と README の推奨を、確定済みのレビュー支援契約へ強化するため。 |
| 省略 stage | なし | policies と development の更新要求と受け入れ状態を Inception で分解し、Construction で文書変更と検証を行うため。 |

## 成果物深度

| 項目 | 値 | 理由 |
|---|---|---|
| 深度 | standard | 変更種別表、PR 準備条件、例外運用の記録先を追跡できる粒度が必要であるため。 |

## 検証戦略

| 項目 | 値 | 理由 |
|---|---|---|
| 戦略 | standard | policies、development、README、Git Branching Policy の記述整合と validator 確認が必要であるため。 |

## Inception への引き継ぎ

- 挙動差分要約の必須項目を、固定の観点リストにするか自由記述にするか確定する。
- skill-forge 確認の記録形式として、PR 説明のどこに何を書くかを確定する。
- 粒度制約の例外条件と、例外の記録先を確定する。
- 緊急修正時の例外運用を、Git Branching Policy の例外記録と同じ型でそろえる。
- agent-instruction-rules の方針（肯定形で書く、禁止は失敗確認後に限る）と矛盾しない記述であることを、受け入れ状態で確認できるようにする。
