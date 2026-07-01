# Ideation Phase Stage Reference

## AI-DLC v2 Reference

- [AI-DLC v2 Ideation Stage](https://github.com/awslabs/aidlc-workflows/blob/v2/docs/reference/04-stages/ideation.md)

## Phase Overview

Ideation phase は、Intent Capture & Framing、スコープ、実現可能性、初期モック、追跡、判断を整理する phase である。

Ideation phase は、新しい Intent Record の作成を扱う。
Intent Record では、`goalType`、`scope`、`labels` を目標プロファイルとして記録する。
作成済み Intent Record の目標プロファイル、対象境界、実行制御、成果物深度、検証戦略を Scope Framing で整理する。

この phase では、要求、ユースケース、Unit、Bolt、Task、Domain Model、Spec、実装を作らない。

Ideation の公開入口は `amadeus-ideation` である。

公開入口は成果物を直接作らず、内部 skill を順に呼び出す。
入力テーマまたは Discovery Brief から開始した場合でも、公開入口は Stage 1.0 だけで止めない。
Stage 1.0 から Stage 1.4 までを同じ実行で進める。

## Execution 判定基準

`Execution` は、対象 stage を Ideation の通常進行に含めるかを示す。

実行可否そのものは `Condition` と前段成果物の存在で判定する。

`ALWAYS` は、`Condition` を満たす場合に必ず実行する stage である。

既存成果物がある場合は、再作成ではなく点検または補修で充足してよい。

`CONDITIONAL` は、`Condition` が真の場合だけ実行する stage である。

`CONDITIONAL` の stage を実行しない場合は、後続 stage がその出力を必須入力にしてはならず、`state.json` の必須成果物にも含めない。

現行の Ideation 成果物契約では、Ideation を完了状態へ進める場合に初期モックを作る。

そのため、Mock Framing は Ideation 完了時の必須 stage として扱う。

将来、初期モックなしの Ideation 完了を許可する場合は、`amadeus-ideation-traceability-finalization`、`amadeus-validator`、eval、example の契約を同じ変更で更新する。

## Stage Summary Table

| Stage | Name | Execution | Condition | Lead Skill | Outputs |
|---|---|---|---|---|---|
| 1.0 | Intent Capture & Framing | ALWAYS | Intent Record がない、または構造補修が必要な場合 | `amadeus-ideation-intent-capture` | `intents.md`、`intents/<intent-id>-<slug>.md`、`state.json` |
| 1.1 | Scope Framing | ALWAYS | Intent Record があり、Ideation 成果物を作る場合 | `amadeus-ideation-scope-framing` | `ideation/scope.md` |
| 1.2 | Feasibility Shaping | ALWAYS | `scope.md` が存在する場合 | `amadeus-ideation-feasibility-shaping` | `ideation/ideation.md` |
| 1.3 | Mock Framing | ALWAYS | `scope.md` と `ideation.md` が存在し、Ideation を完了状態へ進める場合 | `amadeus-ideation-mock-framing` | `ideation/mocks/*.puml` |
| 1.4 | Traceability Finalization | ALWAYS | `scope.md`、`ideation.md`、初期モックが存在する場合 | `amadeus-ideation-traceability-finalization` | `traceability.md`、`decisions.md`、`state.json` |

## Stage 1.0: Intent Capture & Framing

### Metadata

| Property | Value |
|---|---|
| Stage | 1.0 |
| Phase | Ideation |
| Execution | ALWAYS |
| Condition | Intent Record がない、または構造補修が必要な場合 |
| Lead Skill | `amadeus-ideation-intent-capture` |
| Mode | internal |

### Purpose

Intent Capture & Framing は、入力テーマ、Discovery Brief、または既存情報から Intent Record を作る。

`goalType` は、Intent が扱う目標の性質を表す。
値は `business`、`technical`、`mixed`、`未確認` のいずれかである。

`scope` は、AI-DLC v2 の Scope に対応する進行プロファイルを表す。
値は `enterprise`、`feature`、`mvp`、`poc`、`bugfix`、`refactor`、`infra`、`security-patch`、`workshop`、`未確認` のいずれかである。

`labels` は、検索、集計、補足分類に使う任意ラベルである。
`labels` は phase や stage の制御には使わない。

### Outputs

| Artifact | Description |
|---|---|
| `.amadeus/intents.md` | Intent 一覧と依存関係 |
| `.amadeus/intents/<intent-id>-<slug>.md` | Intent の目標プロファイル、目的、成功条件、範囲 |
| `.amadeus/intents/<intent-id>-<slug>/state.json` | `phase: ideation` と Intent Capture 状態 |

### Notes

この stage は公開入口の途中段階である。
`amadeus-ideation` は、この stage だけで終了しない。

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

Scope Framing は、Intent の目標プロファイル、対象境界、実行制御、成果物深度、検証戦略、Inception への引き継ぎを整理する。
`対象` と `対象外` は Intent の境界であり、AI-DLC v2 の実行スコープとは分けて扱う。

### Inputs

- `.amadeus/intents.md`
- `Intent のモジュールファイル`
- `state.json`
- steering layer

### Steps

1. Intent の目標プロファイル、目的、成功条件、制約、依存を読む。
2. steering layer から対象領域、対象外領域、アクターを拾う。
3. `scope.md` に対象境界、実行制御、成果物深度、検証戦略、Inception への引き継ぎを書く。
4. 判断できない境界は `未確認` として残す。

### Outputs

| Artifact | Description |
|---|---|
| `ideation/scope.md` | Ideation の対象境界、実行制御、成果物深度、検証戦略、Inception への引き継ぎ |

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

1. `scope.md` から対象境界、実行スコープ、成果物深度、検証戦略を読む。
2. 実現可能性を技術、運用、セキュリティ、依存の観点で整理する。
3. 判断者、参照者、検証対象、後続担当を整理する。
4. 初期モックで確認したい内容を後続 stage へ渡せる粒度で書く。
5. 未確定事項と学習候補を残す。

### Outputs

| Artifact | Description |
|---|---|
| `ideation/ideation.md` | 実現可能性、体制、初期モック、未確定事項、学習候補 |

### Notes

この stage では、`scope.md` の対象境界、実行制御、成果物深度、検証戦略を大きく変えない。

## Stage 1.3: Mock Framing

### Metadata

| Property | Value |
|---|---|
| Stage | 1.3 |
| Phase | Ideation |
| Execution | ALWAYS |
| Condition | `scope.md` と `ideation.md` が存在し、Ideation を完了状態へ進める場合 |
| Lead Skill | `amadeus-ideation-mock-framing` |
| Mode | internal |

### Purpose

Mock Framing は、要求とユースケースへ進む前に確認したい判断点を初期モックとして具体化する。

### Inputs

- `ideation/scope.md`
- `ideation/ideation.md`

### Steps

1. `scope.md` の対象境界、成果物深度、検証戦略を読む。
2. `ideation.md` の `初期モック` と `未確定事項` を読む。
3. 初期モックで確認する判断点を1つに絞る。
4. 対象境界と成果物深度から外れる高忠実度 UI や過剰な分岐は作らない。
5. 既存 `mocks/*.puml` がある場合は、重複ファイルを作らず既存ファイルを補修する。
6. 新規作成で初期モックを1つだけ作る場合は、`mocks/initial-confirmation.puml` を使う。

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

1. `scope.md` の対象境界、実行制御、成果物深度、検証戦略と、`ideation.md`、`mocks/*.puml` から Ideation 要素と依存を拾う。
2. `traceability.md` に、対象境界、実行制御、成果物深度、検証戦略が後続成果物へどう渡るかを書く。
3. Ideation を完了して Inception へ進める場合は、対象境界、実行スコープ、成果物深度、検証戦略を採用する判断 `D001` を作る。
4. `decisions.md` に判断一覧と依存関係を書く。
5. Inception 以降に `scope.md` を変更する場合は、影響を受ける Requirement、Story、Use Case、Unit、Bolt を確認する判断を追加または置き換える。
6. `state.json` の `requiredArtifacts` と `requiredMocks` に存在する相対パスだけを書く。

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
`state.json` には、実行スコープ、成果物深度、検証戦略を保存しない。
これらの定義元は `ideation/scope.md` であり、採用または変更理由は `ideation/decisions.md` と `ideation/decisions/**` に残す。

### Notes

Ideation が完了しても、Inception 成果物はこの phase では作らない。

## Phase Summary

### Key Outputs

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `ideation/scope.md`
- `ideation/ideation.md`
- `ideation/mocks/*.puml`
- `ideation/traceability.md`
- `ideation/decisions.md`
- `state.json`

### Handoff to Inception

Inception へ進むには、Ideation の必須成果物が存在し、`state.json.ideation.gate` が `passed` である必要がある。

## Cross-References

- [Inception Phase Stages](inception.md)
