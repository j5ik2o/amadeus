# Amadeus DLC

Amadeus DLC は、Amadeus の設計、仕様、実装の流れを扱うための作業領域です。

## 使い方

現時点で確定している入口は、次の5つです。

1. `amadeus-steering`
2. `amadeus-intent-init`
3. `amadeus-intent-ideation`
4. `amadeus-grilling`
5. `amadeus-execution-validator`

Inception 以降の要求、ユースケース、Unit、Bolt、Spec を作る skill は、まだ確定していません。

## 基本の流れ

### 1. Workspace の土台を作る

`.amadeus/` がない、または Amadeus の土台を点検したい場合は、`amadeus-steering` を使います。

`amadeus-steering` は、複数 Intent で共有する steering layer を扱います。

- 目的
- アクター
- 外部システム
- 用語
- ナレッジ
- ポリシー
- ドメインのサブドメイン
- 境界づけられたコンテキスト
- Intent 一覧

個別 Intent の要求、ユースケース、Unit、Bolt、Task は作りません。

既定は `guided` です。
必要な情報が足りない場合は質問し、回答を受けてから `.amadeus/` を作ります。

### 2. Intent の入れ物を作る

新しい Intent を登録する場合は、`amadeus-intent-init` を使います。

`amadeus-intent-init` は、次だけを作成または更新します。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>/intent.md`
- `.amadeus/intents/<intent-id>/state.json`

この段階では、Ideation、要求、ユースケース、Unit、Bolt、Task、ドメインモデルは作りません。

`state.json` の phase は `initialized` になります。

### 3. Intent を Ideation へ進める

既存 Intent を Ideation へ進める場合は、`amadeus-intent-ideation` を使います。

`amadeus-intent-ideation` は、次だけを作成または更新します。

- `.amadeus/intents/<intent-id>/scope.md`
- `.amadeus/intents/<intent-id>/ideation.md`
- `.amadeus/intents/<intent-id>/traceability.md`
- `.amadeus/intents/<intent-id>/decisions.md`
- `.amadeus/intents/<intent-id>/decisions/<decision-id>.md`
- `.amadeus/intents/<intent-id>/mocks/*.puml`
- `.amadeus/intents/<intent-id>/state.json`

既定は `guided` です。
不足している論点は `/amadeus-grilling` で一問ずつ確認します。
質問した場合、そのターンでは成果物を作らず、回答を待ちます。

`scaffold-only` は、質問せずに既存情報だけで Ideation 成果物を作る場合に使います。
不明点は空欄にせず、`未確認` として残します。

`repair` は、既存 Ideation 成果物の見出し、リンク、`state.json`、必須成果物の対応だけを補修する場合に使います。

この段階では、要求、ユースケース、Unit、Bolt、Task、ドメインモデルは作りません。

### 4. 論点を一問ずつ確認する

guided で不足論点を確認する場合は、`amadeus-grilling` を使います。

`amadeus-grilling` は、設計や方針の曖昧さを一問ずつ解消するための skill です。
質問には推奨回答と理由を添え、ユーザーの回答を待ってから次へ進みます。
既存成果物を読めば分かることは質問せず、先に確認します。

### 5. 成果物を検証する

`.amadeus/` の構造を検証する場合は、`amadeus-execution-validator` を使います。

全体成果物だけを検証する場合:

```sh
ruby .agents/skills/amadeus-execution-validator/validator/ExecutionValidator.rb .
```

特定 Intent も検証する場合:

```sh
ruby .agents/skills/amadeus-execution-validator/validator/ExecutionValidator.rb . <intent-id>
```

Execution Validator は、配布先ユーザー環境で動く実行時検証です。
repo root の開発用 `scripts/` や `pnpm test` を実行時検証の入口にはしません。

`pass` は、実行時に参照できる最低限の構造条件を満たすという意味です。
内容妥当性の承認や gate 通過そのものではありません。

## フェーズと成果物

| フェーズ | 使う skill | 作るもの | 作らないもの |
|---|---|---|---|
| Steering | `amadeus-steering` | `.amadeus/` の共有土台 | 個別 Intent |
| Initialized | `amadeus-intent-init` | Intent 登録、`intent.md`、`state.json` | Ideation 以降の成果物 |
| Ideation | `amadeus-intent-ideation` | `scope.md`、`ideation.md`、判断、追跡、初期モック | 要求、ユースケース、Unit、Bolt、ドメインモデル |
| Grilling | `amadeus-grilling` | 一問ずつの質問、推奨回答、回答待ち | 成果物の作成や変更 |
| Validation | `amadeus-execution-validator` | 検証結果 | 成果物の作成や変更 |

## 注意事項

- `.amadeus/` が Amadeus 成果物のルートです。
- Intent ID は `.amadeus/intents.md` と `.amadeus/intents/<intent-id>/` で一致させます。
- 不明な値は空欄にせず、`未確認` と書きます。
- 推測で外部システム、境界づけられたコンテキスト、Intent、依存関係を作りません。
- Inception 以降の成果物は、対応 skill が確定するまで手順として固定しません。
