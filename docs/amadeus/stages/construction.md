# Construction Phase Stage Reference

## Phase Overview

Construction phase は、Inception で定義した Bolt を Construction Design で具体化し、Task に分解してから実装、検証、証拠化する phase である。

Construction では、Bolt ごとの `design.md` を第一級成果物として作り、Domain Design、Logical Design、実装設計、検証設計を確定する。

Unit Design Brief は Construction の入力であり、Construction で上書きしない。

Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は作らない。

## Bolt-by-Bolt Construction

Construction は Bolt ごとに進める。

対象 Bolt は、`inception/bolts.md`、`state.json.construction.targetBolts`、またはユーザー指定から決める。

対象 Bolt が確定できない場合は、`amadeus-construction` が一問だけ確認する。

各 Bolt は、実行準備、実装実行、検証と堅牢化、追跡と状態確定の順に進む。

## Stage Summary Table

| Stage | Name | Execution | Condition | Lead Skill | Outputs |
|---|---|---|---|---|---|
| 3.1 | Bolt Preparation | ALWAYS per Bolt | Inception gate が `passed` で対象 Bolt が確定している | `amadeus-construction-bolt-preparation` | `design.md`、`tasks.md`、`notes.md`、`traceability.md`、`state.json` |
| 3.2 | Implementation Execution | ALWAYS per ready Bolt | Design Gate が `ready` または `passed` で、Task が generated の場合 | `amadeus-construction-implementation-execution` | 実装コード、テストコード、`design.md`、`notes.md` |
| 3.3 | Verification Hardening | ALWAYS after implementation | 対象 Bolt の実装差分がある場合 | `amadeus-construction-verification-hardening` | `test-results.md`、`notes.md` |
| 3.4 | Traceability Finalization | ALWAYS after verification | `test-results.md` が存在する場合 | `amadeus-construction-traceability-finalization` | `tasks.md`、`acceptance.md`、`traceability.md`、`decisions.md`、`state.json`、任意の `pr.md` |

## Stage 3.1: Bolt Preparation

### Metadata

| Property | Value |
|---|---|
| Stage | 3.1 |
| Phase | Construction |
| Execution | ALWAYS per Bolt |
| Condition | Inception gate が `passed` で対象 Bolt が確定している |
| Lead Skill | `amadeus-construction-bolt-preparation` |
| Mode | internal |
| Per-Bolt | Yes |

### Purpose

Bolt Preparation は、対象 Bolt の Domain Design、Logical Design、実装設計、検証設計を `design.md` に確定する。

その Construction Design を根拠に `tasks.md` を生成し、Implementation Execution が進める `ready` 状態まで到達させる。

### Inputs

- `inception/requirements.md`
- `inception/acceptance.md`
- `inception/units.md`
- `inception/bolts.md`
- 対象 Unit の `design.md`
- 対象 Bolt のモジュールファイル
- `construction/traceability.md`
- 作業ツリーの関連コード、テスト、設定

### Steps

1. 対象 Bolt の完了条件、対象 Unit、依存、未確認事項を確認する。
2. 対象 Bolt が参照する Unit Design Brief の設計戦略、責務境界、検証観点、Construction への引き継ぎを確認する。
3. 作業ツリーから実装対象候補、既存テスト、検証コマンドを確認する。
4. `design.md` に `概要`、`Domain Design`、`Logical Design`、`実装設計`、`検証設計`、`設計変更記録` を作る。
5. 既存コード調査の詳細は `notes.md` に残す。
6. `Task 生成 Review Gate` を通してから、`design.md` を根拠に `tasks.md` を作る。
7. `traceability.md` に `Construction Design からの追跡` を追加または更新する。
8. `state.json.construction.bolts[]` に対象 Bolt の Design Gate と Task 生成状態を記録する。

### Outputs

| Artifact | Description |
|---|---|
| `construction/bolts/<bolt-id>-<slug>/design.md` | Construction Design |
| `construction/bolts/<bolt-id>-<slug>/tasks.md` | Task 一覧 |
| `construction/bolts/<bolt-id>-<slug>/notes.md` | 実行方針、調査詳細、未確認事項 |
| `construction/traceability.md` | Construction Design からの追跡 |
| `state.json` | 対象 Bolt の Design Gate と Task 生成状態 |

### Approval Gate

`tasks.md` を書く前に Task 生成 Review Gate を通す。

問題が上流成果物や Construction Design の不足にある場合は、`tasks.md` を書かずに止める。

### Notes

この stage では、実装コードやテストコードを変更しない。

## Stage 3.2: Implementation Execution

### Metadata

| Property | Value |
|---|---|
| Stage | 3.2 |
| Phase | Construction |
| Execution | ALWAYS per ready Bolt |
| Condition | Design Gate が `ready` または `passed` で、Task が generated の場合 |
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
- 対象 Bolt の Construction Design
- `tasks.md`
- `notes.md`
- 関連する既存コード、テスト、設定

### Steps

1. 対象 Task と対応する要求、ユースケース、Unit Design Brief、Construction Design を確認する。
2. 既存コードの局所パターンを読み、既存スタイルに合わせる。
3. 可能な場合は、先に失敗するテストまたは決定論的検証を追加する。
4. Task に対応する最小実装を行う。
5. 実装中に Construction Design の本文を更新した場合は、`設計変更記録` に理由を残す。
6. 実装判断や未確認事項があれば `notes.md` に残す。

### Outputs

| Artifact | Description |
|---|---|
| 実装コード | 対象 Task に直接対応する最小変更 |
| テストコード | 対象 Task の検証に必要な変更 |
| `construction/bolts/<bolt-id>-<slug>/design.md` | 実装中に確定した設計変更 |
| `construction/bolts/<bolt-id>-<slug>/notes.md` | 実装判断、調査詳細、未確認事項 |

### Approval Gate

対象 Task に対応しない変更が必要になった場合は、実装を広げず、Construction Design または上流成果物へ戻す。

### Notes

この stage では、`test-results.md`、`pr.md`、`traceability.md`、`acceptance.md`、`state.json` を更新しない。

## Stage 3.3: Verification Hardening

### Metadata

| Property | Value |
|---|---|
| Stage | 3.3 |
| Phase | Construction |
| Execution | ALWAYS after implementation |
| Condition | 対象 Bolt の実装差分がある |
| Lead Skill | `amadeus-construction-verification-hardening` |
| Mode | internal |
| Per-Bolt | Yes |

### Purpose

Verification Hardening は、対象 Bolt の実装結果を、Task、Requirement、Use Case、Unit Design Brief の検証観点に照らして確認する。

### Inputs

- `inception/requirements.md`
- `inception/acceptance.md`
- 対象 Unit の `design.md`
- 対象 Bolt のモジュールファイル
- `construction/bolts/<bolt-id>-<slug>/tasks.md`
- `construction/bolts/<bolt-id>-<slug>/design.md`
- `construction/bolts/<bolt-id>-<slug>/notes.md`
- 関連する実装コード、テスト、CI 設定

### Steps

1. Task、Requirement、Unit Design Brief、Construction Design の検証設計から必要な検証を決める。
2. 必要なテストが不足していれば、対象 Task に対応する範囲で追加する。
3. 関連テスト、型検査、lint、CI 相当の入口を実行する。
4. セキュリティ、権限、入力、ログ、秘密情報、破壊的変更の観点を確認する。
5. `test-results.md` に実行コマンド、結果、失敗があれば扱い、受け入れ証拠を記録する。

### Outputs

| Artifact | Description |
|---|---|
| `construction/bolts/<bolt-id>-<slug>/test-results.md` | 実行した検証、結果、失敗時の扱い、受け入れ証拠 |
| `construction/bolts/<bolt-id>-<slug>/notes.md` | 後続検証で確認すべき観点 |

### Approval Gate

検証が失敗した場合は、失敗内容を記録し、再実装、追加確認、スコープ調整のいずれかに戻す。

### Notes

実行していないテストや CI を成功として書かない。

## Stage 3.4: Traceability Finalization

### Metadata

| Property | Value |
|---|---|
| Stage | 3.4 |
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
- `construction/bolts/<bolt-id>-<slug>/design.md`
- `construction/bolts/<bolt-id>-<slug>/notes.md`
- `construction/bolts/<bolt-id>-<slug>/test-results.md`
- `construction/traceability.md`
- `construction/decisions.md`

### Steps

1. `test-results.md` の証拠を対象 Task と Requirement に対応付ける。
2. 完了した Task の `証拠` を更新する。
3. `acceptance.md` の要求状態と証拠を更新する。
4. `traceability.md` の `Construction Design からの追跡` に実装、検証、PR の証拠を反映する。
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

### Approval Gate

Requirement の `verified` への遷移には人間承認が必要である。

validator pass だけでは `verified` にしない。

### Notes

PR URL がない場合は `pr.md` を作らない。

## Phase Summary

### Key Outputs

- `construction/bolts/<bolt-id>-<slug>/design.md`
- `construction/bolts/<bolt-id>-<slug>/tasks.md`
- `construction/bolts/<bolt-id>-<slug>/notes.md`
- `construction/bolts/<bolt-id>-<slug>/test-results.md`
- `construction/bolts/<bolt-id>-<slug>/pr.md`
- `construction/traceability.md`
- `construction/decisions.md`
- `inception/acceptance.md`
- `state.json`

### Handoff to Operation

Operation 成果物は、対応 skill が確定するまで Amadeus DLC の標準成果物として固定しない。

## Cross-References

- [Inception Phase Stages](inception.md)
- [Operation Phase Stages](operation.md)
