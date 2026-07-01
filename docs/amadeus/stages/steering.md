# Steering Layer Reference

## AI-DLC v2 Reference

- [AI-DLC v2 Initialization Stage](https://github.com/awslabs/aidlc-workflows/blob/v2/docs/reference/04-stages/initialization.md)
- [AI-DLC v2 Rule System](https://github.com/awslabs/aidlc-workflows/blob/v2/docs/reference/08-rule-system.md)

## Positioning

Steering は、Amadeus DLC の phase ではない。

Steering は、Ideation、Inception、Construction へ進む前に、workspace 全体で共有する目的、方針、知識、用語、アクター、外部システム、Discovery 一覧、Intent 一覧をそろえる基盤である。

`amadeus-steering` は、この steering layer を greenfield または brownfield で作成、点検、補修する公開入口である。

Amadeus 自身を対象 workspace にする場合も brownfield として扱う。
自己開発専用の steering mode は作らず、既存資料と既存 `.amadeus/` を点検して、欠けている steering layer 成果物だけを補う。

Steering は、設計判断の管理元ではない。
Domain Map と Context Map は Steering の一部ではなく、Inception と Construction の承認済み stage 成果物から更新される root 成果物である。

## Responsibility

`amadeus-steering` は、作業場所の初期文脈と初期化に必要な成果物だけを扱う。

個別 Intent の Requirement、Story、Use Case、Unit、Bolt、Task は作らない。
個別 Intent が必要になった場合は、`amadeus-ideation` に渡す。

`amadeus-steering` は、Domain Map、Context Map、Subdomain、Bounded Context、コンテキスト間依存、詳細な Domain Model、契約を作らない。
これらは対象 stage の成果物、判断、追跡、承認に基づいて後続 stage で扱う。

旧共有 domain ディレクトリは廃止対象である。
後方互換は残さず、現在の成果物契約へ寄せる。

## Execution 判定基準

`Execution` は、対象 stage を Steering の通常進行に含めるかを示す。

実行可否そのものは `Condition` と workspace、既存 steering layer、既存成果物の状態で判定する。

`CONDITIONAL` は、`Condition` が真の場合だけ実行する stage である。

`CONDITIONAL` の stage を実行しない場合は、後続 stage がその出力を必須入力にしてはならず、一覧成果物にも作成済みとして記録しない。

既存成果物がある場合は、再作成ではなく点検または補修で充足してよい。

## Stage Summary Table

| Stage | Name | Execution | Condition | Lead Skill | Outputs |
|---|---|---|---|---|---|
| S.1 | Steering Layer Preparation | CONDITIONAL | `.amadeus/` がない、または steering layer の点検、補修が必要な場合 | `amadeus-steering` | `.amadeus/README.md`、`steering.md`、`steering/**`、`glossary.md`、`discoveries.md`、`intents.md` |

## Stage S.1: Steering Layer Preparation

### Metadata

| Property | Value |
|---|---|
| Stage | S.1 |
| Phase | なし |
| Execution | CONDITIONAL |
| Condition | `.amadeus/` がない、または steering layer の点検、補修が必要な場合 |
| Lead Skill | `amadeus-steering` |
| Mode | public |

### Purpose

Steering Layer Preparation は、Amadeus DLC を適用する workspace の共有基盤を作る。

greenfield では最小の steering layer を作る。
brownfield では既存資料と既存 `.amadeus/` を読み、欠けている成果物だけを補う。

自己開発 bootstrap では、初回 `.amadeus/` が採用対象ではなく bootstrap 用になる場合がある。
昇格済み skill で `.amadeus/` を作り直す場合は、作り直し前の `.amadeus/` を `.amadeus-snapshots/previous/` に退避し、退避版は git 管理外で直近1世代だけ保持する。
差分確認の採用判断だけを、採用対象 `.amadeus/` の既存成果物に要約する。
この扱いは `amadeus-steering` の実行モードに依存しない。

### Inputs

- 対象 workspace
- greenfield または brownfield の判断
- 既存 README、設計資料、ドメイン資料
- 分かっているプロダクト目的、主要アクター、外部システム、制約、主要ドメイン領域

### Outputs

| Artifact | Description |
|---|---|
| `.amadeus/README.md` | Amadeus 成果物の入口 |
| `.amadeus/steering.md` | steering layer のモジュールファイル |
| `.amadeus/steering/**` | 目的、方針、知識、技術、構造、アクター、外部システム |
| `.amadeus/glossary.md` | Amadeus DLC 全体の用語集 |
| `.amadeus/discoveries.md` | Discovery 一覧 |
| `.amadeus/intents.md` | Intent 一覧 |

### Excluded Outputs

Steering Layer Preparation は、次の成果物を作らない。

| Artifact | Reason |
|---|---|
| 旧共有 domain ディレクトリ | 旧成果物配置であり、後方互換を残さない。 |
| `.amadeus/domain-map.md` | Inception と Construction の承認済み stage 成果物から更新する root 成果物である。 |
| `.amadeus/context-map.md` | Inception と Construction の承認済み stage 成果物から更新する root 成果物である。 |

## Notes

AI-DLC v2 の Initialization は Intent Record の作成を含む。
Amadeus DLC では、Intent Record 作成は Ideation の Intent Capture & Framing に置く。

そのため、`amadeus-steering` は AI-DLC v2 の Initialization と一対一には対応しない。
Amadeus DLC では、workspace 共有基盤を作る公開入口として扱う。

## Cross-References

- [Discovery Reference](discovery.md)
- [Ideation Phase Stages](ideation.md)
- [ADR 0002: Intent Phase Directory Layout を採用する](../../adr/0002-intent-phase-directory-layout.md)
