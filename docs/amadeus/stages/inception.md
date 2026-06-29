# Inception Phase Stage Reference

## Phase Overview

Inception phase は、Ideation 完了済み Intent を、Requirement、Story、Use Case、Unit、Unit Design Brief、Bolt へ分解する phase である。

この phase は、Construction で Task 化できるだけの要求、相互作用、実施設計、追跡を固定する。

Task、Spec、実装、CI、Operation 成果物は作らない。

Domain Model や契約が不足している場合は、Inception 成果物の中で推測して確定せず、`amadeus-domain-grilling` または `amadeus-domain-modeling` に渡す。

## Stage Summary Table

| Stage | Name | Execution | Condition | Lead Skill | Outputs |
|---|---|---|---|---|---|
| 2.1 | Requirements Definition | ALWAYS | Ideation gate が `passed` の場合 | `amadeus-inception-requirements-definition` | `requirements.md`、`requirements/**`、`acceptance.md` |
| 2.2 | Interaction Modeling | ALWAYS | 要件定義済みの場合 | `amadeus-inception-interaction-modeling` | `user-stories.md`、`user-stories/**`、`use-cases.md`、`use-cases/**` |
| 2.3 | Execution Design | ALWAYS | 相互作用整理済みの場合 | `amadeus-inception-execution-design` | `units.md`、`units/**`、`bolts.md`、`bolts/**`、`domain/**` |
| 2.4 | Traceability Finalization | ALWAYS | 実施設計済みの場合 | `amadeus-inception-traceability-finalization` | `traceability.md`、`decisions.md`、`state.json` |

## Stage 2.1: Requirements Definition

### Metadata

| Property | Value |
|---|---|
| Stage | 2.1 |
| Phase | Inception |
| Execution | ALWAYS |
| Condition | Ideation gate が `passed` の場合 |
| Lead Skill | `amadeus-inception-requirements-definition` |
| Mode | internal |

### Purpose

Requirements Definition は、Ideation 成果物から Requirement と受け入れ状態を定義する。

### Inputs

- `ideation/scope.md`
- `ideation/ideation.md`
- `ideation/traceability.md`
- `ideation/decisions.md`
- steering layer

### Steps

1. Ideation 成果物から、要求候補、対象外、制約、受け入れ状態の根拠を拾う。
2. 要求 ID は既存 ID の次番号を使う。
3. `requirements.md` に要求一覧を作る。
4. `requirements/<requirement-id>-<slug>.md` に要求詳細を作る。
5. `acceptance.md` に受け入れ状態を作る。

### Outputs

| Artifact | Description |
|---|---|
| `inception/requirements.md` | Requirement 一覧 |
| `inception/requirements/<requirement-id>-<slug>.md` | Requirement 詳細 |
| `inception/acceptance.md` | Requirement の受け入れ状態 |

### Approval Gate

`requirements.md` または `acceptance.md` を作る場合は、書き込み前に Requirements Review Gate を通す。

### Notes

推測で Domain Model、Bounded Context、契約を確定しない。

## Stage 2.2: Interaction Modeling

### Metadata

| Property | Value |
|---|---|
| Stage | 2.2 |
| Phase | Inception |
| Execution | ALWAYS |
| Condition | `requirements.md`、`requirements/**`、`acceptance.md` が存在する |
| Lead Skill | `amadeus-inception-interaction-modeling` |
| Mode | internal |

### Purpose

Interaction Modeling は、Requirement からアクター価値とシステム相互作用を切り出す。

### Inputs

- `inception/requirements.md`
- `inception/requirements/**`
- `inception/acceptance.md`
- `ideation/scope.md`
- `ideation/ideation.md`
- steering layer

### Steps

1. Requirement と受け入れ状態から、アクター価値を Story として切る。
2. Story から、システムとの相互作用を Use Case として切る。
3. Requirement、Story、Use Case が常に 1:1 になる場合は、粒度不足を疑う。
4. 自然な粒度であれば、後続の追跡確定で理由を残せるように根拠を本文に残す。

### Outputs

| Artifact | Description |
|---|---|
| `inception/user-stories.md` | Story 一覧 |
| `inception/user-stories/<story-id>-<slug>.md` | Story 詳細 |
| `inception/use-cases.md` | Use Case 一覧 |
| `inception/use-cases/<use-case-id>-<slug>.md` | Use Case 詳細 |

### Approval Gate

相互作用整理の結果が Requirement の意味を変える場合は、Requirements Definition に戻す。

### Notes

Use Case を Requirement の箇条書きとして作らない。

## Stage 2.3: Execution Design

### Metadata

| Property | Value |
|---|---|
| Stage | 2.3 |
| Phase | Inception |
| Execution | ALWAYS |
| Condition | Requirement、Story、Use Case が存在する |
| Lead Skill | `amadeus-inception-execution-design` |
| Mode | internal |

### Purpose

Execution Design は、Use Case から Unit を切り、Unit Design Brief を作り、その設計戦略に従って Bolt を切る。

Task は Construction Design を根拠に Construction phase で生成する。

### Inputs

- `inception/requirements.md`
- `inception/acceptance.md`
- `inception/user-stories.md`
- `inception/use-cases.md`
- steering layer
- domain layer

### Steps

1. Use Case から、実施価値としてまとまる Unit を切る。
2. Unit ごとにモジュールファイルと Unit Design Brief の `design.md` を作る。
3. Unit Design Brief の `Bolt 分割方針` に従って Bolt を切る。
4. Bolt ごとにモジュールファイルを作り、Construction で Task 化するための完了条件、依存、未確認事項を残す。
5. brownfield の場合は、既存能力、統合点、ギャップを読んでから Unit Design Brief を作る。
6. `inception.gate` を `passed` にする前提で進める場合は、少なくとも1件の境界づけられたコンテキストを確定し、Unit の `コンテキスト` から参照させる。

### Outputs

| Artifact | Description |
|---|---|
| `inception/units.md` | Unit 一覧 |
| `inception/units/<unit-id>-<slug>.md` | Unit のモジュールファイル |
| `inception/units/<unit-id>-<slug>/design.md` | Unit Design Brief |
| `inception/bolts.md` | Bolt 一覧 |
| `inception/bolts/<bolt-id>-<slug>.md` | Bolt のモジュールファイル |
| `inception/domain/subdomains.md` | Intent 固有のサブドメイン index |
| `inception/domain/bounded-contexts.md` | Intent Bounded Context index |
| `inception/domain/bounded-contexts/<bounded-context-id>-<slug>.md` | Bounded Context のモジュールファイル |

### Approval Gate

brownfield で Unit Design Brief を作る場合は、Codebase Analysis Gate を通す。

### Notes

`domain/subdomains.md` と `domain/bounded-contexts.md` は、Unit と境界参照を確認するための構造 index として作る。

これは詳細な Domain Model や契約の作成ではない。

## Stage 2.4: Traceability Finalization

### Metadata

| Property | Value |
|---|---|
| Stage | 2.4 |
| Phase | Inception |
| Execution | ALWAYS |
| Condition | Requirement、Story、Use Case、Unit、Unit Design Brief、Bolt が存在する |
| Lead Skill | `amadeus-inception-traceability-finalization` |
| Mode | internal |

### Purpose

Traceability Finalization は、Requirement、Story、Use Case、Unit、Unit Design Brief、Bolt の追跡関係と状態を確定する。

### Inputs

- `inception/requirements.md`
- `inception/acceptance.md`
- `inception/user-stories.md`
- `inception/use-cases.md`
- `inception/units.md`
- `inception/units/**`
- `inception/bolts.md`
- `inception/bolts/**`
- `inception/domain/**`
- `state.json`

### Steps

1. Requirement、Story、Use Case、Unit、Unit Design Brief、Bolt の追跡関係を `traceability.md` に反映する。
2. Inception の境界、粒度、対象外、greenfield または brownfield の判断を `decisions.md` と `decisions/**` に残す。
3. `state.json.phase` を `inception` にし、Inception の必須成果物を反映する。
4. 対象 Intent の Bounded Context、または Unit から Bounded Context への参照が未確認なら `state.json.inception.gate` は `not_ready` にする。
5. 詳細なモデルや契約条件だけが未確認で、Bounded Context と Unit 参照が確定している場合は `passed` にしてよい。
6. validator で対象 Intent を検証する。

### Outputs

| Artifact | Description |
|---|---|
| `inception/traceability.md` | Inception の追跡 |
| `inception/decisions.md` | Inception の判断一覧 |
| `inception/decisions/<decision-id>-<slug>.md` | 個別判断 |
| `state.json` | `phase: inception` と Inception gate 状態 |

### Approval Gate

Inception gate は `state.json.inception.gate` で表す。

Construction へ進むには `passed` が必要である。

### Notes

Inception の Traceability は Task を接続しない。

Task は Construction 以降の Traceability で接続する。

## Phase Summary

### Key Outputs

- `inception/requirements.md`
- `inception/acceptance.md`
- `inception/user-stories.md`
- `inception/use-cases.md`
- `inception/units.md`
- `inception/units/**/design.md`
- `inception/bolts.md`
- `inception/bolts/**`
- `inception/domain/**`
- `inception/traceability.md`
- `inception/decisions.md`
- `state.json`

### Handoff to Construction

Construction へ進むには、Inception の必須成果物が存在し、`state.json.inception.gate` が `passed` である必要がある。

## Cross-References

- [Ideation Phase Stages](ideation.md)
- [Construction Phase Stages](construction.md)
