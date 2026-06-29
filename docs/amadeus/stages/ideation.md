# Ideation Phase Stage Reference

## Phase Overview

Ideation phase は、初期化済み Intent のスコープ、実現可能性、初期モック、追跡、判断を整理する phase である。

Ideation phase は、新しい Intent の登録を扱わない。

登録済み Intent の範囲、詳細度、検証深度を Scope Framing で整理する。

この phase では、要求、ユースケース、Unit、Bolt、Task、Domain Model、Spec、実装を作らない。

Ideation の公開入口は `amadeus-ideation` である。

公開入口は成果物を直接作らず、内部 skill を順に呼び出す。

## Stage Summary Table

| Stage | Name | Execution | Condition | Lead Skill | Outputs |
|---|---|---|---|---|---|
| 1.1 | Scope Framing | ALWAYS | Intent の入れ物があり、Ideation 成果物を作る場合 | `amadeus-ideation-scope-framing` | `ideation/scope.md` |
| 1.2 | Feasibility Shaping | ALWAYS | `scope.md` が存在する場合 | `amadeus-ideation-feasibility-shaping` | `ideation/ideation.md` |
| 1.3 | Mock Framing | CONDITIONAL | 初期モックで確認すべき判断点がある場合 | `amadeus-ideation-mock-framing` | `ideation/mocks/*.puml` |
| 1.4 | Traceability Finalization | ALWAYS | `scope.md`、`ideation.md`、初期モックが存在する場合 | `amadeus-ideation-traceability-finalization` | `traceability.md`、`decisions.md`、`state.json` |

## Stage 1.1: Scope Framing

### Metadata

| Property | Value |
|---|---|
| Stage | 1.1 |
| Phase | Ideation |
| Execution | ALWAYS |
| Condition | Intent のモジュールファイルと `state.json` が存在する |
| Lead Skill | `amadeus-ideation-scope-framing` |
| Mode | internal |

### Purpose

Scope Framing は、Intent の対象、対象外、詳細度、検証深度、Inception への引き継ぎを整理する。

### Inputs

- `.amadeus/intents.md`
- `Intent のモジュールファイル`
- `state.json`
- steering layer

### Steps

1. Intent の目的、成功条件、制約、依存を読む。
2. steering layer から対象領域、対象外領域、アクターを拾う。
3. `scope.md` に対象、対象外、詳細度、検証深度、Inception への引き継ぎを書く。
4. 判断できない境界は `未確認` として残す。

### Outputs

| Artifact | Description |
|---|---|
| `ideation/scope.md` | Ideation の対象、対象外、詳細度、検証深度、Inception への引き継ぎ |

### Notes

この stage では、`ideation.md`、`mocks/**`、`traceability.md`、`decisions/**`、`state.json` を更新しない。

## Stage 1.2: Feasibility Shaping

### Metadata

| Property | Value |
|---|---|
| Stage | 1.2 |
| Phase | Ideation |
| Execution | ALWAYS |
| Condition | `ideation/scope.md` が存在する |
| Lead Skill | `amadeus-ideation-feasibility-shaping` |
| Mode | internal |

### Purpose

Feasibility Shaping は、実現可能性、体制、未確定事項、学習候補を整理する。

### Inputs

- `ideation/scope.md`
- `Intent のモジュールファイル`
- `state.json`
- steering layer

### Steps

1. `scope.md` から対象、対象外、検証深度を読む。
2. 実現可能性を技術、運用、セキュリティ、依存の観点で整理する。
3. 判断者、参照者、検証対象、後続担当を整理する。
4. 初期モックで確認したい内容を後続 stage へ渡せる粒度で書く。
5. 未確定事項と学習候補を残す。

### Outputs

| Artifact | Description |
|---|---|
| `ideation/ideation.md` | 実現可能性、体制、初期モック、未確定事項、学習候補 |

### Notes

この stage では、`scope.md` の境界を大きく変えない。

## Stage 1.3: Mock Framing

### Metadata

| Property | Value |
|---|---|
| Stage | 1.3 |
| Phase | Ideation |
| Execution | CONDITIONAL |
| Condition | `scope.md` と `ideation.md` が存在し、初期モックで確認すべき判断点がある |
| Lead Skill | `amadeus-ideation-mock-framing` |
| Mode | internal |

### Purpose

Mock Framing は、要求とユースケースへ進む前に確認したい判断点を初期モックとして具体化する。

### Inputs

- `ideation/scope.md`
- `ideation/ideation.md`

### Steps

1. `ideation.md` の `初期モック` と `未確定事項` を読む。
2. 初期モックで確認する判断点を1つに絞る。
3. 既存 `mocks/*.puml` がある場合は、重複ファイルを作らず既存ファイルを補修する。
4. 新規作成で初期モックを1つだけ作る場合は、`mocks/initial-confirmation.puml` を使う。

### Outputs

| Artifact | Description |
|---|---|
| `ideation/mocks/initial-confirmation.puml` | PlantUML Salt による初期モック |
| `ideation/mocks/*.puml` | 既存モックの補修または追加モック |

### Notes

初期モックは高忠実度 UI ではなく、後続の要求とユースケースの具体例として確認できる粒度にする。

## Stage 1.4: Traceability Finalization

### Metadata

| Property | Value |
|---|---|
| Stage | 1.4 |
| Phase | Ideation |
| Execution | ALWAYS |
| Condition | `scope.md`、`ideation.md`、初期モックが存在する |
| Lead Skill | `amadeus-ideation-traceability-finalization` |
| Mode | internal |

### Purpose

Traceability Finalization は、Ideation の追跡、判断、状態を確定する。

### Inputs

- `ideation/scope.md`
- `ideation/ideation.md`
- `ideation/mocks/*.puml`
- `state.json`

### Steps

1. `scope.md`、`ideation.md`、`mocks/*.puml` から Ideation 要素と依存を拾う。
2. `traceability.md` に Ideation 要素と依存関係の追跡を書く。
3. Ideation を完了して Inception へ進める場合は、判断 `D001` を作る。
4. `decisions.md` に判断一覧と依存関係を書く。
5. `state.json` の `requiredArtifacts` と `requiredMocks` に存在する相対パスだけを書く。

### Outputs

| Artifact | Description |
|---|---|
| `ideation/traceability.md` | Ideation 要素と依存関係の追跡 |
| `ideation/decisions.md` | Ideation の判断一覧 |
| `ideation/decisions/<decision-id>-<slug>.md` | 個別判断 |
| `state.json` | `phase: ideation` と Ideation gate 状態 |

### Approval Gate

Ideation gate は `state.json.ideation.gate` で表す。

完了している場合は `passed`、未完了の場合は `not_ready`、`waiting_approval`、`failed` のいずれかにする。

### Notes

Ideation が完了しても、Inception 成果物はこの phase では作らない。

## Phase Summary

### Key Outputs

- `ideation/scope.md`
- `ideation/ideation.md`
- `ideation/mocks/*.puml`
- `ideation/traceability.md`
- `ideation/decisions.md`
- `state.json`

### Handoff to Inception

Inception へ進むには、Ideation の必須成果物が存在し、`state.json.ideation.gate` が `passed` である必要がある。

## Cross-References

- [Initialization Phase Stages](initialization.md)
- [Inception Phase Stages](inception.md)
