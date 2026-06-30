# Inception Phase Stage Reference

## AI-DLC v2 Reference

- [AI-DLC v2 Inception Stage](https://github.com/awslabs/aidlc-workflows/blob/v2/docs/reference/04-stages/inception.md)

## Phase Overview

Inception phase は、Ideation 完了済み Intent を、Requirement、必要な場合の User Story、Use Case、Unit、Unit Design Brief、Bolt へ分解する phase である。

この phase は、Construction で Task 化できるだけの要求、必要な場合の人間アクター価値、システム相互作用、Unit、Bolt、追跡を固定する。

Task、Spec、実装、CI、Operation 成果物は作らない。

Domain Model や契約が不足している場合は、Inception 成果物の中で推測して確定せず、`amadeus-domain-grilling` または `amadeus-domain-modeling` に渡す。

## Execution 判定基準

`Execution` は、対象 stage を Inception の通常進行に含めるかを示す。

実行可否そのものは `Condition` と前段成果物の存在で判定する。

`ALWAYS` は、`Condition` を満たす場合に必ず実行する stage である。

`CONDITIONAL` は、`Condition` を満たしたうえで、対象 Intent の性質に応じて実行を判定する stage である。

既存成果物がある場合は、再作成ではなく点検または補修で充足してよい。

Inception を完了状態へ進め、Construction へ引き継ぐ場合は、Requirements Definition、Use Cases、Units Generation、Traceability Finalization をすべて充足する。

User Stories は、人間アクターのユーザー価値表現が必要な場合だけ充足対象に含める。

システムまたは外部システムだけが相互作用主体であり、「誰が、何のために、何をしたいか」と受け入れ条件を明示する必要がない場合は、User Stories を作らない。

この場合でも、Use Cases は Requirement とシステム境界から必ず作る。

Use Cases は、User Stories が存在する場合だけ Story を参照する。

いずれかの stage を充足できない場合は、`state.json.inception.gate` を `passed` にしない。

## Stage Summary Table

| Stage | Name | Execution | Condition | Lead Skill | Outputs |
|---|---|---|---|---|---|
| 2.1 | Requirements Definition | ALWAYS | Ideation gate が `passed` の場合 | `amadeus-inception-requirements-definition` | `requirements.md`、`requirements/**`、`acceptance.md` |
| 2.2 | User Stories | CONDITIONAL | 要件定義済みで、人間アクターのユーザー価値表現が必要な場合 | `amadeus-inception-user-stories` | `user-stories.md`、`user-stories/**` |
| 2.3 | Use Cases | ALWAYS | 要件定義済みで、必要な User Stories が作成済みまたは不要と判断済みの場合 | `amadeus-inception-use-cases` | `use-cases.md`、`use-cases/**` |
| 2.4 | Units Generation | ALWAYS | Use Cases 作成済みの場合 | `amadeus-inception-units-generation` | `units.md`、`units/**`、`bolts.md`、`bolts/**` |
| 2.5 | Traceability Finalization | ALWAYS | Units Generation 済みの場合 | `amadeus-inception-traceability-finalization` | `traceability.md`、`decisions.md`、`state.json` |

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

## Stage 2.2: User Stories

### Metadata

| Property | Value |
|---|---|
| Stage | 2.2 |
| Phase | Inception |
| Execution | CONDITIONAL |
| Condition | `requirements.md`、`requirements/**`、`acceptance.md` が存在し、人間アクターのユーザー価値表現が必要な場合 |
| Lead Skill | `amadeus-inception-user-stories` |
| Mode | internal |

### Purpose

User Stories は、Requirement から人間アクターのユーザー価値を切り出す。

システムまたは外部システムだけが相互作用主体である場合は、User Stories を作らない。

### Inputs

- `inception/requirements.md`
- `inception/requirements/**`
- `inception/acceptance.md`
- `ideation/scope.md`
- `ideation/ideation.md`
- steering layer

### Steps

1. Requirement と受け入れ状態から、人間アクターのユーザー価値表現が必要かを判定する。
2. 必要な場合は、ユーザー価値を Story として切る。
3. 不要な場合は、Use Cases で Requirement とシステム境界から相互作用を切る前提にする。
4. Story が Requirement の言い換えだけになっている場合は、粒度不足を疑う。
5. 自然な粒度であれば、後続の追跡確定で理由を残せるように根拠を本文に残す。

### Outputs

| Artifact | Description |
|---|---|
| `inception/user-stories.md` | Story 一覧 |
| `inception/user-stories/<story-id>-<slug>.md` | Story 詳細 |

### Approval Gate

User Stories の結果が Requirement の意味を変える場合は、Requirements Definition に戻す。

### Notes

Story を Requirement の箇条書きとして作らない。

Story が不要な場合は、空の Story 成果物を作らず、Use Cases 以降で Story 参照を `なし` にする。

## Stage 2.3: Use Cases

### Metadata

| Property | Value |
|---|---|
| Stage | 2.3 |
| Phase | Inception |
| Execution | ALWAYS |
| Condition | `requirements.md`、`requirements/**`、`acceptance.md` が存在し、必要な User Stories が作成済みまたは不要と判断済みである |
| Lead Skill | `amadeus-inception-use-cases` |
| Mode | internal |

### Purpose

Use Cases は、Requirement とシステム境界から、アクターまたは外部システムとシステムの相互作用を切り出す。

User Stories が存在する場合は、必要に応じて Story を参照する。

### Inputs

- `inception/requirements.md`
- `inception/acceptance.md`
- `inception/user-stories.md`、存在する場合
- `inception/user-stories/**`、存在する場合
- `ideation/scope.md`
- `ideation/ideation.md`
- steering layer

### Steps

1. Requirement、受け入れ状態、システム境界から、アクターまたは外部システムとシステムの相互作用を Use Case として切る。
2. User Stories が存在する場合は、Use Case から該当 Story を参照する。
3. User Stories が存在しない場合は、Story 参照を `なし` にする。
4. Use Case が Requirement の箇条書きになっている場合は、相互作用として書き直す。
5. Requirement、Story、Use Case が常に 1:1 になる場合は、Story が存在する範囲で粒度不足を疑う。
6. Requirement と Use Case が常に 1:1 になる場合も、粒度不足を疑う。
7. 自然な粒度であれば、後続の追跡確定で理由を残せるように根拠を本文に残す。

### Outputs

| Artifact | Description |
|---|---|
| `inception/use-cases.md` | Use Case 一覧 |
| `inception/use-cases/<use-case-id>-<slug>.md` | Use Case 詳細 |

### Approval Gate

Use Cases の結果が Requirement または存在する User Story の意味を変える場合は、前段の stage に戻す。

### Notes

Use Case を Requirement の箇条書きとして作らない。

## Stage 2.4: Units Generation

### Metadata

| Property | Value |
|---|---|
| Stage | 2.4 |
| Phase | Inception |
| Execution | ALWAYS |
| Condition | Requirement と Use Case が存在し、必要な Story が存在するまたは不要と判断済みである |
| Lead Skill | `amadeus-inception-units-generation` |
| Mode | internal |

### Purpose

Units Generation は、Use Case から Unit を切り、Unit Design Brief を作り、その設計戦略に従って Bolt を切る。

Task は Construction の Task Generation で生成する。

### Inputs

- `inception/requirements.md`
- `inception/acceptance.md`
- `inception/user-stories.md`、存在する場合
- `inception/use-cases.md`
- steering layer
- domain layer

### Steps

1. Use Case から、実施価値としてまとまる Unit を切る。
2. Unit ごとにモジュールファイルと Unit Design Brief の `design.md` を作る。
3. Unit Design Brief の `Bolt 分割方針` に従って Bolt を切る。
4. Bolt ごとにモジュールファイルを作り、Construction で Task 化するための完了条件、依存、未確認事項を残す。
5. brownfield の場合は、既存能力、統合点、ギャップを読んでから Unit Design Brief を作る。
6. Unit の `コンテキスト` は `.amadeus/domain/**` の Bounded Context、または未確認として扱う。
7. 対応する Bounded Context が未確認の場合は、推測で Intent 固有の domain 成果物を作らず、未確認事項として残す。

### Outputs

| Artifact | Description |
|---|---|
| `inception/units.md` | Unit 一覧 |
| `inception/units/<unit-id>-<slug>.md` | Unit のモジュールファイル |
| `inception/units/<unit-id>-<slug>/design.md` | Unit Design Brief |
| `inception/bolts.md` | Bolt 一覧 |
| `inception/bolts/<bolt-id>-<slug>.md` | Bolt のモジュールファイル |

### Approval Gate

brownfield で Unit Design Brief を作る場合は、Codebase Analysis Gate を通す。

### Notes

Inception は Intent 固有の `domain/**` を作らない。

正式な Domain Model は `.amadeus/domain/**` に置く。

## Stage 2.5: Traceability Finalization

### Metadata

| Property | Value |
|---|---|
| Stage | 2.5 |
| Phase | Inception |
| Execution | ALWAYS |
| Condition | Requirement、Use Case、Unit、Unit Design Brief、Bolt が存在し、必要な Story が存在するまたは不要と判断済みである |
| Lead Skill | `amadeus-inception-traceability-finalization` |
| Mode | internal |

### Purpose

Traceability Finalization は、Requirement、存在する場合の Story、Use Case、Unit、Unit Design Brief、Bolt の追跡関係と状態を確定する。

### Inputs

- `inception/requirements.md`
- `inception/acceptance.md`
- `inception/user-stories.md`、存在する場合
- `inception/use-cases.md`
- `inception/units.md`
- `inception/units/**`
- `inception/bolts.md`
- `inception/bolts/**`
- `state.json`

### Steps

1. Requirement、存在する場合の Story、Use Case、Unit、Unit Design Brief、Bolt の追跡関係を `traceability.md` に反映する。
   `対象境界からの追跡` では、`ideation/scope.md` の採用済み `SC-IN-*` を Requirement、存在する場合の Story、Use Case、Unit、Bolt へ接続する。
2. Inception の境界、粒度、対象外、greenfield または brownfield の判断を `decisions.md` と `decisions/**` に残す。
3. `state.json.phase` を `inception` にし、Inception の必須成果物を反映する。
4. Story が不要な場合は、`state.json.inception.requiredStoryArtifacts` を空配列にする。
5. Unit から参照する Bounded Context が未確認なら `state.json.inception.gate` は `not_ready` にする。
6. Bounded Context と Unit 参照が確定している場合は `passed` にしてよい。
7. validator で対象 Intent を検証する。

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
- `inception/user-stories.md`、必要な場合
- `inception/use-cases.md`
- `inception/units.md`
- `inception/units/**/design.md`
- `inception/bolts.md`
- `inception/bolts/**`
- `inception/traceability.md`
- `inception/decisions.md`
- `state.json`

### Handoff to Construction

Construction へ進むには、Inception の必須成果物が存在し、`state.json.inception.gate` が `passed` である必要がある。

## Cross-References

- [Ideation Phase Stages](ideation.md)
- [Construction Phase Stages](construction.md)
