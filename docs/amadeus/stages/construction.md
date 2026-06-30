# Construction Phase Stage Reference

## AI-DLC v2 Reference

- [AI-DLC v2 Construction Stage](https://github.com/awslabs/aidlc-workflows/blob/v2/docs/reference/04-stages/construction.md)

## Phase Overview

Construction phase は、Inception で定義した Unit を Functional Design で具体化し、Bolt を Task に分解してから実装、検証、証拠化する phase である。

Unit Design Brief は Construction の入力であり、Construction で上書きしない。

Bolt は Task、実装、検証、PR 記録、追跡へ進める実行単位である。
Bolt 側の設計ファイルは作らない。

Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は作らない。

## Execution 判定基準

`Execution` は、対象 stage を Construction の通常進行に含めるかを示す。

実行可否そのものは `Condition`、対象 Unit、対象 Bolt、Functional Design の必要性、Task 生成状態、実装差分、検証結果で判定する。

`CONDITIONAL per Unit` は、対象 Unit ごとに `Condition` を満たす場合だけ実行する stage である。

`ALWAYS per Bolt` は、対象 Bolt ごとに `Condition` を満たす場合に必ず実行する stage である。

`ALWAYS per ready Bolt` は、対象 Bolt の Task 生成状態が実装可能な場合に必ず実行する stage である。

`ALWAYS after implementation` は、対象 Bolt の実装差分がある場合に必ず実行する stage である。

`ALWAYS after verification` は、検証結果を記録済みの場合に必ず実行する stage である。

既存成果物がある場合は、再作成ではなく点検または補修で充足してよい。

対象 Bolt が複数ある場合は、Bolt ごとにこの判定を独立して行い、他 Bolt の未完了を対象 Bolt の完了証拠として扱わない。

## Stage Summary Table

| Stage | Name | Execution | Condition | Lead Skill | Outputs |
|---|---|---|---|---|---|
| 3.1 | Functional Design | CONDITIONAL per Unit | 対象 Unit が Construction scope に含まれ、Functional Design が必要な場合 | `amadeus-construction-functional-design` | `construction/<unit-id>-<slug>/functional-design/**`、`state.json` |
| 3.2 | Bolt Preparation | ALWAYS per Bolt | Functional Design と対象 Bolt が確定している場合 | `amadeus-construction-bolt-preparation` | `tasks.md`、`notes.md`、`traceability.md`、`state.json` |
| 3.3 | Implementation Execution | ALWAYS per ready Bolt | `taskGeneration.status` が `ready_for_approval` または `passed` の場合 | `amadeus-construction-implementation-execution` | 実装コード、テストコード、`notes.md` |
| 3.4 | Verification Hardening | ALWAYS after implementation | 対象 Bolt の実装差分がある場合 | `amadeus-construction-verification-hardening` | `test-results.md`、`notes.md` |
| 3.5 | Traceability Finalization | ALWAYS after verification | `test-results.md` が存在する場合 | `amadeus-construction-traceability-finalization` | `tasks.md`、`acceptance.md`、`traceability.md`、`decisions.md`、`state.json`、任意の `pr.md` |

## Stage 3.1: Functional Design

### Metadata

| Property | Value |
|---|---|
| Stage | 3.1 |
| Phase | Construction |
| Execution | CONDITIONAL per Unit |
| Condition | 対象 Unit が Construction scope に含まれ、Functional Design が必要である |
| Lead Skill | `amadeus-construction-functional-design` |
| Mode | internal |
| Per-Unit | Yes |

### Purpose

Functional Design は、対象 Unit の機能構造、業務ルール、Domain Entity、必要な UI 構成を整理する。

この stage は Unit ごとに必要性を判定し、不要な Unit は `state.json.construction.functionalDesign` で `not_required/skipped` として記録する。

### Inputs

- `inception/requirements.md`
- `inception/acceptance.md`
- `inception/use-cases.md`
- `inception/units.md`
- 対象 Unit のモジュールファイル
- 対象 Unit の Unit Design Brief
- `inception/bolts.md`
- 対象 Bolt のモジュールファイル
- `.amadeus/domain/**`
- `state.json.construction.functionalDesign.targetUnits`
- `state.json.construction.targetUnits`
- `state.json.construction.targetBolts`

### Steps

1. `state.json.construction.functionalDesign.targetUnits`、`state.json.construction.targetUnits`、`state.json.construction.targetBolts`、ユーザー指定の順に対象 Unit を解決する。
2. 対象 Unit が解決できない場合は、`requirement: unresolved`、`status: blocked`、`blockedReason: target_unit_unresolved` を記録する。
3. 対象 Unit が Construction scope に含まれない場合は、`requirement: not_required`、`status: skipped`、`skipReason: unit_not_in_construction_scope` を記録する。
4. 対象 Unit の UI 構成が未解決の場合は、`frontendSurface: unresolved`、`status: blocked`、`blockedReason: frontend_surface_unresolved` を記録する。
5. Functional Design が必要な Unit は `requirement: required` として進める。
6. 成果物要求、条件付き成果物、パス、見出し、表構造は Amadeus DLC Contract Catalog から導出する。
7. `FunctionalDesignGateResult` は `status` と Catalog 検証から導出し、`state.json` には保存しない。

### Outputs

| Artifact | Description |
|---|---|
| `construction/<unit-id>-<slug>/functional-design/business-logic-model.md` | 対象 Unit の業務ロジック構造 |
| `construction/<unit-id>-<slug>/functional-design/business-rules.md` | 対象 Unit の業務ルール |
| `construction/<unit-id>-<slug>/functional-design/domain-entities.md` | 対象 Unit の Domain Entity |
| `construction/<unit-id>-<slug>/functional-design/frontend-components.md` | `frontendSurface: present` の場合だけ必要な UI 構成 |
| `state.json` | Functional Design の Unit 別状態 |

### State Contract

`state.json.construction.functionalDesign` は次の形を持つ。

```ts
type ConstructionFunctionalDesignState = {
  targetUnits: UnitId[];
  units: FunctionalDesignUnitState[];
};

type FunctionalDesignUnitState = {
  unitId: UnitId;
  requirement: "required" | "not_required" | "unresolved";
  status: "not_started" | "in_progress" | "ready_for_approval" | "passed" | "failed" | "skipped" | "blocked";
  frontendSurface: "present" | "absent" | "unresolved";
  targetSource: "functional_design_target_units" | "construction_target_units" | "construction_target_bolts" | "user_specified";
  runMode: "initial" | "rerun";
  skipReason?: "unit_not_in_construction_scope";
  blockedReason?: "target_unit_unresolved" | "unit_design_missing" | "frontend_surface_unresolved" | "required_input_missing";
};
```

`FunctionalDesignUnitState` に `artifacts`、`required`、`surfaces`、`gate` は保存しない。

`frontendSurface: absent` は Unit 全体の skip を意味しない。
この場合は `frontend-components.md` の条件付き requirement だけが不要になる。

## Stage 3.2: Bolt Preparation

### Metadata

| Property | Value |
|---|---|
| Stage | 3.2 |
| Phase | Construction |
| Execution | ALWAYS per Bolt |
| Condition | Functional Design と対象 Bolt が確定している |
| Lead Skill | `amadeus-construction-bolt-preparation` |
| Mode | internal |
| Per-Bolt | Yes |

### Purpose

Bolt Preparation は、対象 Bolt の Task を生成できるだけの入力が揃っているかを確認し、`tasks.md` と `notes.md` を作る。

Task 生成は Functional Design、Unit Design Brief、対象 Bolt のモジュールファイルを入力にする。
Bolt 側の `design.md` は入力にしない。

### Inputs

- `inception/requirements.md`
- `inception/acceptance.md`
- `inception/use-cases.md`
- `inception/units.md`
- 対象 Unit のモジュールファイル
- 対象 Unit の Unit Design Brief
- 対象 Unit の Functional Design
- `inception/bolts.md`
- 対象 Bolt のモジュールファイル
- `construction/bolts/<bolt-id>-<slug>/notes.md`
- 対象 Unit と対象 Bolt の `実装対象`
- 作業ツリーの関連コード、テスト、設定

### Steps

1. 対象 Bolt の完了条件、対象 Unit、依存、未確認事項を確認する。
2. 対象 Unit の Unit Design Brief と Functional Design を確認する。
3. 対象 Unit と対象 Bolt の `実装対象` を読み、対象 Intent 成果物と対象実装リポジトリを同じ作業空間で読めるか確認する。
4. 作業ツリーから実装対象候補、既存テスト、検証コマンドを確認する。
5. `Task Generation Gate` を通してから、`tasks.md` を作る。
6. `tasks.md` には Task ID、作業、要求、ユースケース、依存、設計根拠、証拠を記録する。
7. `notes.md` に実行方針、対象 Task、作業順序、未確認事項を記録する。
8. `traceability.md` に `Task Generation からの追跡` を追加または更新する。
9. `state.json.construction.bolts[]` に対象 Bolt の `taskGeneration` を記録する。

### Outputs

| Artifact | Description |
|---|---|
| `construction/bolts/<bolt-id>-<slug>/tasks.md` | Task 一覧 |
| `construction/bolts/<bolt-id>-<slug>/notes.md` | 実行方針、調査詳細、未確認事項 |
| `construction/traceability.md` | Task Generation からの追跡 |
| `state.json` | 対象 Bolt の Task Generation 状態 |

### Task Generation Gate

`Task Generation Gate` は、対象 Bolt の Task を生成できるだけの入力が揃い、`tasks.md` が実装実行に渡せる状態かを表す。

`TaskGenerationGateResult` は state に保存しない。
Validator が `TaskGenerationStatus` と Contract Catalog の検証結果から導出する。

`ready_for_approval` は、人間承認待ちである。
`passed` は、人間承認済みである。
Task 生成が完了しただけでは `passed` にしない。

`TaskGenerationStatus` と evidence は任意に組み合わせない。
Validator は Amadeus DLC Contract Catalog の matrix から無効な組み合わせを `fail` の CheckResult にする。

```ts
type TaskGenerationStatus =
  | "not_started"
  | "in_progress"
  | "ready_for_approval"
  | "passed"
  | "failed"
  | "blocked";

type TaskGenerationBlockedReason =
  | "functional_design_missing"
  | "functional_design_not_passed"
  | "unit_design_missing"
  | "bolt_scope_unresolved"
  | "required_input_missing"
  | "task_generation_conflict";

type TaskGenerationEvidenceKind =
  | "functional_design"
  | "unit_design_brief"
  | "bolt_module"
  | "tasks"
  | "notes"
  | "approval";

type TaskGenerationEvidenceReference = TypedReference & {
  kind: TaskGenerationEvidenceKind;
};

type ConstructionBoltTaskGenerationState = {
  status: TaskGenerationStatus;
  evidence: TaskGenerationEvidenceReference[];
  blockedReason?: TaskGenerationBlockedReason;
};
```

### Evidence Matrix

| status | Required evidence | blockedReason |
|---|---|---|
| `not_started` | なし | 禁止 |
| `in_progress` | `bolt_module` | 禁止 |
| `ready_for_approval` | `functional_design`、`unit_design_brief`、`bolt_module`、`tasks` | 禁止 |
| `passed` | `functional_design`、`unit_design_brief`、`bolt_module`、`tasks`、`approval` | 禁止 |
| `failed` | 失敗対象を示す evidence | 任意 |
| `blocked` | 判定できている入力または不足している入力を示す evidence | 必須 |

複数 Unit を対象にする Bolt では、対象 Unit ごとに `functional_design` と `unit_design_brief` の evidence が必要である。

`ready_for_approval` と `passed` では、`tasks` evidence は `construction/bolts/<bolt-id>-<slug>/tasks.md` を指す。

## Stage 3.3: Implementation Execution

### Metadata

| Property | Value |
|---|---|
| Stage | 3.3 |
| Phase | Construction |
| Execution | ALWAYS per ready Bolt |
| Condition | `taskGeneration.status` が `ready_for_approval` または `passed` である |
| Lead Skill | `amadeus-construction-implementation-execution` |
| Mode | internal |
| Per-Bolt | Yes |

### Purpose

Implementation Execution は、対象 Bolt の Task に対応する最小の実装と、実装に必要なテストコード変更を行う。

### Inputs

- 対象 Task
- 対応する Requirement
- 対応する Use Case
- 対象 Unit の Unit Design Brief
- 対象 Unit の Functional Design
- 対象 Bolt のモジュールファイル
- `tasks.md`
- `notes.md`
- 関連する既存コード、テスト、設定

### Steps

1. 対象 Task と対応する要求、ユースケース、Unit Design Brief、Functional Design を確認する。
2. 既存コードの局所パターンを読み、既存スタイルに合わせる。
3. 可能な場合は、先に失敗するテストまたは決定論的検証を追加する。
4. Task に対応する最小実装を行う。
5. 実装判断や未確認事項があれば `notes.md` に残す。

### Outputs

| Artifact | Description |
|---|---|
| 実装コード | 対象 Task に直接対応する最小変更 |
| テストコード | 対象 Task の検証に必要な変更 |
| `construction/bolts/<bolt-id>-<slug>/notes.md` | 実装判断、調査詳細、未確認事項 |

### Notes

この stage では、`test-results.md`、`pr.md`、`traceability.md`、`acceptance.md`、`state.json` を更新しない。

## Stage 3.4: Verification Hardening

### Metadata

| Property | Value |
|---|---|
| Stage | 3.4 |
| Phase | Construction |
| Execution | ALWAYS after implementation |
| Condition | 対象 Bolt の実装差分がある |
| Lead Skill | `amadeus-construction-verification-hardening` |
| Mode | internal |
| Per-Bolt | Yes |

### Purpose

Verification Hardening は、対象 Bolt の実装結果を、Task、Requirement、Use Case、Unit Design Brief、Functional Design の検証観点に照らして確認する。

### Inputs

- `inception/requirements.md`
- `inception/acceptance.md`
- 対象 Unit の Unit Design Brief
- 対象 Unit の Functional Design
- 対象 Bolt のモジュールファイル
- `construction/bolts/<bolt-id>-<slug>/tasks.md`
- `construction/bolts/<bolt-id>-<slug>/notes.md`
- 関連する実装コード、テスト、CI 設定

### Steps

1. Task、Requirement、Unit Design Brief、Functional Design の検証観点から必要な検証を決める。
2. 必要なテストが不足していれば、対象 Task に対応する範囲で追加する。
3. 関連テスト、型検査、lint、CI 相当の入口を実行する。
4. セキュリティ、権限、入力、ログ、秘密情報、破壊的変更の観点を確認する。
5. `test-results.md` に実行コマンド、結果、失敗があれば扱い、受け入れ証拠を記録する。

### Outputs

| Artifact | Description |
|---|---|
| `construction/bolts/<bolt-id>-<slug>/test-results.md` | 実行した検証、結果、失敗時の扱い、受け入れ証拠 |
| `construction/bolts/<bolt-id>-<slug>/notes.md` | 後続検証で確認すべき観点 |

## Stage 3.5: Traceability Finalization

### Metadata

| Property | Value |
|---|---|
| Stage | 3.5 |
| Phase | Construction |
| Execution | ALWAYS after verification |
| Condition | `test-results.md` が存在する |
| Lead Skill | `amadeus-construction-traceability-finalization` |
| Mode | internal |
| Per-Bolt | Yes |

### Purpose

Traceability Finalization は、実装と検証の結果を、Task、Requirement、受け入れ状態、追跡、判断、`state.json` に反映する。

### Inputs

- `state.json`
- `inception/requirements.md`
- `inception/acceptance.md`
- `inception/bolts.md`
- 対象 Bolt のモジュールファイル
- `construction/bolts/<bolt-id>-<slug>/tasks.md`
- `construction/bolts/<bolt-id>-<slug>/notes.md`
- `construction/bolts/<bolt-id>-<slug>/test-results.md`
- `construction/traceability.md`
- `construction/decisions.md`

### Steps

1. `test-results.md` の証拠を対象 Task と Requirement に対応付ける。
2. 完了した Task の `証拠` を更新する。
3. `acceptance.md` の要求状態と証拠を更新する。
4. `traceability.md` の `Task Generation からの追跡` に実装、検証、PR の証拠を反映する。
5. `traceability.md` に Deployment Unit または証拠への追跡を反映する。
6. Construction の境界や重要判断を `decisions.md` と `decisions/**` に残す。
7. `state.json.phase` を `construction` にし、Construction の必須成果物を反映する。
8. PR URL がある場合だけ `pr.md` を作る。
9. validator が使える場合は、対象 Intent を検証する。

### Outputs

| Artifact | Description |
|---|---|
| `construction/bolts/<bolt-id>-<slug>/tasks.md` | Task の証拠更新 |
| `construction/bolts/<bolt-id>-<slug>/pr.md` | PR URL がある場合だけ作る PR 記録 |
| `inception/acceptance.md` | Requirement の受け入れ状態と証拠 |
| `construction/traceability.md` | 実装、検証、PR、状態の追跡 |
| `construction/decisions.md` | Construction の判断一覧 |
| `construction/decisions/<decision-id>-<slug>.md` | 個別判断 |
| `state.json` | `phase: construction` と Construction 状態 |

### Notes

Requirement の `verified` への遷移には人間承認が必要である。
Validator pass だけでは `verified` にしない。

PR URL がない場合は `pr.md` を作らない。

## Phase Summary

### Key Outputs

- `construction/<unit-id>-<slug>/functional-design/business-logic-model.md`
- `construction/<unit-id>-<slug>/functional-design/business-rules.md`
- `construction/<unit-id>-<slug>/functional-design/domain-entities.md`
- `construction/<unit-id>-<slug>/functional-design/frontend-components.md`
- `construction/bolts/<bolt-id>-<slug>/tasks.md`
- `construction/bolts/<bolt-id>-<slug>/notes.md`
- `construction/bolts/<bolt-id>-<slug>/test-results.md`
- `construction/bolts/<bolt-id>-<slug>/pr.md`
- `construction/traceability.md`
- `construction/decisions.md`
- `inception/acceptance.md`
- `state.json`

## Cross-References

- [Inception Phase Stages](inception.md)
- [Operation Phase Stages](operation.md)
