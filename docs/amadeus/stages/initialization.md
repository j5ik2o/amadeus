# Initialization Phase Stages

## Phase Overview

Initialization phase は、Amadeus DLC を実行する workspace の土台と Intent の入れ物を準備する phase である。

この phase は、複数 Intent で共有する steering layer、Intent 化前の Discovery、個別 Intent の登録を扱う。

Amadeus DLC には `Intent Capture & Framing` という単独 stage はない。

Intent として扱う前の入力テーマ整理は Discovery Framing で扱い、Intent の登録は Intent Registration で扱う。

登録済み Intent の範囲整理は、Ideation phase の Scope Framing で扱う。

この phase では、Ideation、Requirement、Use Case、Unit、Bolt、Task、実装を作らない。

## Scope-Driven Stage Inclusion

Initialization の stage は、workspace と入力テーマの状態で実行対象が変わる。

`.amadeus/` がない場合は、まず steering layer を作る。

入力テーマが大きい、曖昧、または既存 Intent との関係が不明な場合は、Discovery を実行する。

単一 Intent として扱える題材が明確な場合は、Intent Registration を実行する。

## Stage Summary

| Stage | Name | Execution | Condition | Lead Skill | Outputs |
|---|---|---|---|---|---|
| 0.1 | Steering Layer Setup | CONDITIONAL | `.amadeus/` がない、または steering layer を点検する場合 | `amadeus-steering` | `.amadeus/README.md`、`steering.md`、`glossary.md`、`domain/**`、`discoveries.md`、`intents.md` |
| 0.2 | Discovery Framing | CONDITIONAL | 入力テーマの粒度、既存 Discovery、既存 Intent との関係が未確定の場合 | `amadeus-discovery` | `discoveries.md`、`discoveries/<discovery-id>.md`、`discoveries/<discovery-id>/state.json` |
| 0.3 | Intent Registration | ALWAYS for new Intent | 単一 Intent として登録する題材が確定した場合 | `amadeus-intent-init` | `intents.md`、`intents/<intent-id>-<slug>.md`、`intents/<intent-id>-<slug>/state.json` |

## Stage 0.1: Steering Layer Setup

### Metadata

| Property | Value |
|---|---|
| Stage | 0.1 |
| Phase | Initialization |
| Execution | CONDITIONAL |
| Condition | `.amadeus/` がない、または steering layer を点検する場合 |
| Lead Skill | `amadeus-steering` |
| Mode | guided、discovery、scaffold-only |

### Purpose

Steering Layer Setup は、複数 Intent で共有する目的、方針、知識、用語、アクター、外部システム、ドメイン境界を準備する。

個別 Intent の要求、ユースケース、Unit、Bolt、Task は作らない。

### Inputs

- 対象 workspace。
- greenfield または brownfield の区分。
- プロダクト目的、主要アクター、外部システム、既知の用語、既知の制約。

### Steps

1. 対象 workspace と `.amadeus/` の有無を確認する。
2. greenfield または brownfield を判定する。
3. 既存資料がある場合は、README、設計資料、ドメイン資料、既存 `.amadeus/` を読む。
4. 不足している steering layer の判断だけを質問する。
5. steering layer の必須成果物を作る。
6. 不明な値は `未確認` として記録する。
7. validator が使える場合は、全体成果物を検証する。

### Outputs

| Artifact | Description |
|---|---|
| `.amadeus/README.md` | workspace の Amadeus 成果物入口 |
| `.amadeus/steering.md` | steering layer の役割、読む順序、責務境界 |
| `.amadeus/steering/**` | 目的、アクター、外部システム、知識、ポリシー、技術、構造 |
| `.amadeus/glossary.md` | 共有用語 |
| `.amadeus/domain/**` | 共有 Domain Model の入口 |
| `.amadeus/discoveries.md` | Discovery 一覧 |
| `.amadeus/intents.md` | Intent 一覧 |

### Notes

外部システム、境界づけられたコンテキスト、Intent は、存在が未確認なら行を作らない。

主要領域だけが分かる場合は、サブドメインに `未確認` を残す。

## Stage 0.2: Discovery Framing

### Metadata

| Property | Value |
|---|---|
| Stage | 0.2 |
| Phase | Initialization |
| Execution | CONDITIONAL |
| Condition | 入力テーマの粒度、既存 Discovery、既存 Intent との関係が未確定の場合 |
| Lead Skill | `amadeus-discovery` |
| Mode | guided、scaffold-only、repair |

### Purpose

Discovery Framing は、入力テーマをそのまま Intent 化せず、課題粒度、重複、既存 Intent との関係、Intent 化方針を整理する。

### Inputs

- 入力テーマ。
- Discovery のモジュールディレクトリ名。
- 既存 Discovery と既存 Intent。
- steering layer。

### Steps

1. steering layer が存在することを確認する。
2. 既存 Discovery と既存 Intent を確認する。
3. 同じテーマや近いテーマがある場合は、既存 Discovery の再開または補修を優先する。
4. Discovery 判定に必要な不足だけを質問する。
5. Discovery のモジュールファイルと `state.json` を作る。
6. `discoveries.md` に一覧行を追加する。
7. gate 条件を満たす場合は `gate: passed` にする。

### Outputs

| Artifact | Description |
|---|---|
| `.amadeus/discoveries.md` | Discovery 一覧 |
| `.amadeus/discoveries/<discovery-id>.md` | 入力テーマ、判定、Intent Draft、Intent 候補、推奨次アクション |
| `.amadeus/discoveries/<discovery-id>/state.json` | Discovery の状態、判定、gate |
| `.amadeus/discoveries/<discovery-id>/grillings/**` | 記録対象の質問と回答がある場合だけ作る |

### Notes

Discovery は Ideation や Inception の代替ではない。

`amadeus-intent-init` は自動実行しない。

## Stage 0.3: Intent Registration

### Metadata

| Property | Value |
|---|---|
| Stage | 0.3 |
| Phase | Initialization |
| Execution | ALWAYS for new Intent |
| Condition | 単一 Intent として登録する題材が確定した場合 |
| Lead Skill | `amadeus-intent-init` |
| Mode | guided、scaffold-only |

### Purpose

Intent Registration は、新しい Intent の最低限の入れ物を作る。

Ideation、要求、ユースケース、Unit、Bolt、Task、Domain Model は作らない。

### Inputs

- Intent の題材または目的。
- Discovery Brief。
- Intent ディレクトリ名。
- 依存する既存 Intent。
- steering layer。

### Steps

1. steering layer が存在することを確認する。
2. Discovery Brief が指定された場合は、対象 Discovery の gate と decision を読む。
3. Intent ディレクトリ名を確定する。
4. Intent 登録に必要な不足だけを質問する。
5. `intents.md` に対象 Intent を追加する。
6. Intent のモジュールファイルと `state.json` を作る。
7. validator が使える場合は、全体成果物と対象 Intent を検証する。

### Outputs

| Artifact | Description |
|---|---|
| `.amadeus/intents.md` | Intent 一覧と依存関係 |
| `.amadeus/intents/<intent-id>-<slug>.md` | Intent の目的、成功条件、範囲 |
| `.amadeus/intents/<intent-id>-<slug>/state.json` | Intent の初期状態 |
| `.amadeus/intents/<intent-id>-<slug>/initialization/grillings/**` | 記録対象の質問と回答がある場合だけ作る |

### Notes

`state.json.phase` は `initialized` にする。

`state.json` は Intent のモジュールディレクトリ直下に置き、`initialization/` には移さない。

## Re-initialization

既存 workspace を補修する場合は、既存の本文、判断、用語、識別子を尊重する。

欠けている成果物だけを追加し、既存行を根拠なく並べ替えない。

## Cross-References

- [Ideation Phase Stages](ideation.md)
- [Inception Phase Stages](inception.md)
- [ADR 0002: Intent Phase Directory Layout を採用する](../../adr/0002-intent-phase-directory-layout.md)
