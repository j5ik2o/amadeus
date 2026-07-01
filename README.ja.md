# Amadeus

Amadeus は、AI と人間が協調してソフトウェア開発を進める Amadeus DLC を運用するためのプロジェクトです。
Amadeus は、Ideation、Inception、Construction、補助分析を進めるための agent skill、template、example、validator、ドキュメントを提供します。

[English](README.md) | [日本語](README.ja.md)

## Highlights

- `amadeus-steering`、`amadeus-ideation`、`amadeus-inception`、`amadeus-construction` などの目的別 skill で Amadeus DLC を進めます。
- phase state、gate、traceability、decisions、検証結果を明示し、成果物を監査しやすくします。
- [examples/](examples/) 配下の生成例を、skill が生成できる snapshot として参照できます。
- 同梱の `amadeus-validator` で Amadeus workspace と Intent 成果物を検証できます。

## Quickstart

### Requirements

- Node.js と npm。
- Bun。
- [package.json](package.json) に定義された依存。

### Install

```sh
bun install
```

### Run

同梱 example を検証します。

```sh
npm run validate:all
```

mock provider を使う標準検証を実行します。

```sh
npm run test:all
```

## Usage

Amadeus は agent skill を通じて使います。
skill は Amadeus DLC への関わり方で分類します。

### フェーズスキル

フェーズスキルは lifecycle の順序で使います。
`amadeus-discovery` は任意ですが、入力テーマが大きい、曖昧、または Intent 作成に進む準備ができていない場合に推奨します。

1. `amadeus-steering`
2. `amadeus-discovery`（任意、推奨）
3. `amadeus-ideation`
4. `amadeus-inception`
5. `amadeus-construction`

### 横断的補助スキル

横断的補助スキルは、phase の途中で追加分析、ドメイン確認、成果物検証が必要な場合に使います。

- `amadeus-event-storming`
- `amadeus-domain-grilling`
- `amadeus-validator`

### 内部スキル

内部スキルは、必要に応じて Amadeus の workflow から使う実装補助です。
明示的に内部スキルが必要な作業でない場合は、フェーズスキルまたは横断的補助スキルを公開入口として使います。
README では workflow family ごとに整理し、すべての内部 step を公開入口として扱わないようにします。

| family | 内部 skill |
|---|---|
| 判断と学習支援 | `amadeus-decision-review`、`amadeus-grilling`、`amadeus-history-review`、`amadeus-learning-review` |
| ドメイン支援 | `amadeus-domain-modeling` |
| Ideation 内部 | `amadeus-ideation-intent-capture`、`amadeus-ideation-scope-framing`、`amadeus-ideation-feasibility-shaping`、`amadeus-ideation-mock-framing`、`amadeus-ideation-traceability-finalization` |
| Inception 内部 | `amadeus-inception-codebase-analysis`、`amadeus-inception-requirements-definition`、`amadeus-inception-user-stories`、`amadeus-inception-use-cases`、`amadeus-inception-units-generation`、`amadeus-inception-traceability-finalization` |
| Construction 内部 | `amadeus-construction-functional-design`、`amadeus-construction-bolt-preparation`、`amadeus-construction-implementation-execution`、`amadeus-construction-verification-hardening`、`amadeus-construction-traceability-finalization` |

Amadeus skill を確認または変更するときは、必ず `skill-forge` で skill 境界、trigger description、本文指示、eval coverage、存在する場合は Codex metadata を確認します。
skill 変更 PR では、この確認と結果の PR 説明への記録が必須条件です。定義は steering policies（[.amadeus/steering/policies.md](.amadeus/steering/policies.md)）にあります。
Amadeus の source を変更する場合は、`skills/amadeus-*` と `.agents/skills/amadeus-*` の両方を確認し、昇格先成果物はリポジトリの昇格手順でそろえます。

このリポジトリでは、root `.amadeus/` を Amadeus 本体開発用の steering layer として扱います。
リポジトリ内の生成例は [examples/](examples/) 配下の段階別 snapshot として管理します。

### Typical Flow

| 手順 | skill | 目的 |
|---|---|---|
| 1 | `amadeus-steering` | workspace の共有土台を作成または点検します。 |
| 2 | `amadeus-discovery` | 大きい入力テーマ、曖昧な入力テーマ、既存 Intent との関係が不明な入力テーマを Intent 化前に整理します。この手順は任意ですが推奨します。 |
| 3 | `amadeus-ideation` | Intent Record を作り、Ideation 成果物を完了状態へ進めます。 |
| 4 | `amadeus-inception` | Requirement、受け入れ状態、User Story、Use Case、Unit、Bolt、Unit Design Brief、traceability、decision を定義します。 |
| 5 | `amadeus-construction` | Bolt を Task に分解し、実装、検証、証拠化、traceability 更新まで進めます。 |

横断的補助スキルは、必要に応じて flow と併用します。
`amadeus-event-storming` は Domain Event、Process、Aggregate Candidate、Bounded Context Candidate、Hotspot を補助分析として整理します。
`amadeus-domain-grilling` は質問によるドメイン確認と成果物更新を組み合わせます。
`amadeus-validator` は workspace と Intent の成果物構造を検証します。

### Validation

workspace 単位の example 成果物だけを検証します。

```sh
npm run validate
```

Intent 単位の example 成果物を検証します。

```sh
npm run validate:intents
```

example wrapper の対象をすべて検証します。

```sh
npm run validate:all
```

validator を workspace に対して直接実行します。

```sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts <workspace>
```

validator を特定 Intent に対して直接実行します。

```sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts <workspace> <intent-id>-<slug>
```

## Documentation

- agent 共通入口: [AMADEUS.md](AMADEUS.md)
- 生成例: [examples/](examples/)
- Stage reference:
  - [Steering](docs/amadeus/stages/steering.md)
  - [Discovery](docs/amadeus/stages/discovery.md)
  - [Ideation](docs/amadeus/stages/ideation.md)
  - [Inception](docs/amadeus/stages/inception.md)
  - [Construction](docs/amadeus/stages/construction.md)
  - [Operation](docs/amadeus/stages/operation.md)
- Architecture Decision: [docs/adr/](docs/adr/)
- AI-DLC 参照資料: [docs/ai-dlc/](docs/ai-dlc/)

## Boundaries

- `.amadeus/` は対象 workspace の成果物ルートです。
  このリポジトリ root では、Amadeus 本体開発用の steering layer に限定して扱います。
- Intent ディレクトリ名は `.amadeus/intents.md` と `.amadeus/intents/<intent-id>-<slug>/` で一致させます。
- ドメイン上の発見は範囲に応じて置き分けます。
  対象 Intent の `domain-notes.md`、`.amadeus/domain-map.md`、`.amadeus/context-map.md`、`inception/traceability.md`、Construction の Functional Design を使い分けます。
- 不明な値は空欄にせず、`未確認` と記録します。
- 外部システム、Bounded Context、Intent、依存関係を推測で作りません。
- Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は、対応 skill が確定するまで手順として固定しません。

## Getting Help

- Issues: [github.com/amadeus-dlc/amadeus/issues](https://github.com/amadeus-dlc/amadeus/issues)

## Contributing

このリポジトリには、現時点で `CONTRIBUTING.md` がありません。
大きな変更を始める前に、対象範囲、影響する skill、期待する成果物、検証計画を GitHub Issue に記録してください。

ローカル開発では次を使います。

```sh
npm run test:all
```

## License

このリポジトリは MIT OR Apache-2.0 のデュアルライセンスです。
詳細は [LICENSE-MIT](LICENSE-MIT) と [LICENSE-APACHE](LICENSE-APACHE) を参照してください。
