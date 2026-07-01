# Amadeus DLC

この文書は、エージェントがこのリポジトリで Amadeus を扱うときの共通入口である。
概要は [README.md](README.md) を参照する。
詳細な成果物規則は [docs/amadeus/stages/](docs/amadeus/stages/) と [examples/README.md](examples/README.md) を参照する。

## 作業言語

- 返答、仕様、調査メモ、検証結果は日本語で書く。
- 日本語の技術文書を書く、または推敲するときは `japanese-tech-writing` skill の規範に従う。
- 英語の識別子、ファイル名、コマンド名は必要な場合だけ使う。

## Project Context

### Paths

- Steering layer: 対象 workspace の `.amadeus/` 直下の成果物
- Intent layer: 対象 workspace の `.amadeus/intents/<intent-id>-<slug>/`
- Skill sources: `skills/amadeus-*/`
- Promoted skills: `.agents/skills/amadeus-*/`

### Steering layer

Steering layer は、複数 Intent で共有する前提を扱う。
例示は [examples/](examples/) 配下の各 snapshot に置く。

### Intent layer

Intent layer は、特定 Intent の要求、受け入れ状態、ユースケース、Unit、Bolt、Task、判断、追跡を扱う。
例示の Intent 一覧は各 snapshot の `.amadeus/intents.md` を参照する。

## Skills

現時点で確定している入口は次の 10 個である。

1. `amadeus-steering`
2. `amadeus-discovery`
3. `amadeus-event-storming`
4. `amadeus-ideation`
5. `amadeus-inception`
6. `amadeus-construction`
7. `amadeus-grilling`
8. `amadeus-domain-modeling`
9. `amadeus-domain-grilling`
10. `amadeus-validator`

Construction は、Inception で定義した Unit を Functional Design で具体化し、Bolt を Task に分解してから実装、検証、証拠化する入口である。
Construction では、Unit ごとの `functional-design/` に詳細な Domain Model、Intent Contracts、機能構造、業務ルール、必要な UI 構成を整理する。
Construction の Bolt preparation では、Functional Design、Unit Design Brief、対象 Bolt のモジュールファイルを根拠に `tasks.md` を生成する。
Construction では、Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物を作らない。

Discovery は、Ideation の前に入力テーマを整理する任意の補助分析入口である。
Discovery は `amadeus-ideation` を自動実行しない。

Event Storming は、Domain Event、Process、Aggregate Candidate、Bounded Context Candidate、Hotspot を整理する補助分析入口である。
Event Storming は phase を進めず、Requirement、Use Case、Unit、Bolt、Task、Aggregate、Bounded Context を確定しない。

未確定の skill 名や旧コマンド名を前提にしない。

## Validation

`amadeus-validator` は、`.amadeus/` 配下のファイル更新を検知して自動起動しない。
`.amadeus/` 配下の成果物を作成または更新した場合は、作業後に明示的に実行する。
対象 Intent ディレクトリ名が分かる場合は、対象 Intent も指定して検証する。

構造検証は次で行う。

```sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts .
```

特定 Intent を含めて検証する場合は次で行う。

```sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . <intent-id>-<slug>
```

このリポジトリの例示 snapshot を検証する場合は次で行う。

```sh
npm run validate:all
```

Skill 昇格の確認は、必要に応じて `dev-scripts/promote-skill.ts` を使う。
昇格先に `evals/` や開発用ファイルを混ぜない。

## Development Rules

- 基準 branch は `main` として扱い、Git ブランチ戦略は [Git Branching Policy](.amadeus/steering/policies/git-branching.md) に従う。
- 古い成果物階層や旧コマンド群を、確認なしに戻さない。
- 不明な値は空欄にせず、`未確認` として記録する。
- 推測で外部システム、境界づけられたコンテキスト、Intent、依存関係を作らない。
- 実装や文書変更の前に、対象範囲と検証方法を明確にする。
