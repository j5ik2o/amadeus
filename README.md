# Amadeus DLC

Amadeus DLC は、Amadeus の設計、仕様、実装の流れを扱うための作業領域です。

このリポジトリでは、root `.amadeus/` を実運用状態として置きません。
生成例は [examples/](examples/) 配下の段階別 snapshot として管理します。

## 使い方

現時点で確定している入口は、次の10個です。

1. `amadeus-steering`
2. `amadeus-discovery`
3. `amadeus-intent-init`
4. `amadeus-ideation`
5. `amadeus-inception`
6. `amadeus-construction`
7. `amadeus-grilling`
8. `amadeus-domain-modeling`
9. `amadeus-domain-grilling`
10. `amadeus-validator`

Construction は、Inception で定義した Bolt と Task を実装、検証、証拠化する入口です。
Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は、対応 skill が確定するまで手順として固定しません。

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
- Discovery 一覧
- Intent 一覧

個別 Intent の要求、ユースケース、Unit、Bolt、Task は作りません。

既定は `guided` です。
必要な情報が足りない場合は質問し、回答を受けてから `.amadeus/` を作ります。

### 2. Intent 化前の入力テーマを整理する

入力テーマが大きい、曖昧、または既存 Intent との関係が不明な場合は、`amadeus-discovery` を使います。

`amadeus-discovery` は、次だけを作成または更新します。

- `.amadeus/discoveries.md`
- `.amadeus/discoveries/<discovery-id>/brief.md`
- `.amadeus/discoveries/<discovery-id>/state.json`

この段階では、Requirement、Use Case、Unit、Bolt、Task、実装方針は作りません。
Discovery が完了しても、`amadeus-intent-init` は自動実行しません。

課題サイズが明確な場合は、`amadeus-discovery` を挟まずに `amadeus-intent-init` を使います。

### 3. Intent の入れ物を作る

新しい Intent を登録する場合は、`amadeus-intent-init` を使います。

`amadeus-intent-init` は、次だけを作成または更新します。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`

この段階では、Ideation、要求、ユースケース、Unit、Bolt、Task、ドメインモデルは作りません。

`state.json` の phase は `initialized` になります。

### 4. Intent を Ideation へ進める

既存 Intent を Ideation へ進める場合は、`amadeus-ideation` を使います。

`amadeus-ideation` は、次だけを作成または更新します。

- `.amadeus/intents/<intent-id>-<slug>/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions/<decision-id>.md`
- `.amadeus/intents/<intent-id>-<slug>/mocks/*.puml`
- `.amadeus/intents/<intent-id>-<slug>/state.json`

既定は `guided` です。
不足している論点は `/amadeus-grilling` で一問ずつ確認します。
質問した場合、そのターンでは成果物を作らず、回答を待ちます。

`scaffold-only` は、質問せずに既存情報だけで Ideation 成果物を作る場合に使います。
不明点は空欄にせず、`未確認` として残します。

`repair` は、既存 Ideation 成果物の見出し、リンク、`state.json`、必須成果物の対応だけを補修する場合に使います。

既に Ideation 段階にある Intent を煮詰める場合は、`amadeus-ideation` が `refine` を自動選択します。
`refine` は、既存の `scope.md`、`ideation.md`、`decisions.md`、`traceability.md`、`mocks/*.puml`、`state.json` を読み、必要な Ideation 論点を一問ずつ確認します。
質問が必要なターンでは成果物を更新せず、回答後に Ideation 成果物だけを更新します。

この段階では、要求、ユースケース、Unit、Bolt、Task、ドメインモデルは作りません。

### 5. Intent を Inception へ進める

Ideation を完了した Intent から、要求、ユーザーストーリー、ユースケース、Unit、Bolt、Design、Task へ進める場合は `amadeus-inception` を使います。

`amadeus-inception` は、次を作成または更新します。

- `.amadeus/intents/<intent-id>-<slug>/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/requirements/<requirement-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/user-stories.md`
- `.amadeus/intents/<intent-id>-<slug>/user-stories/<story-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/use-cases.md`
- `.amadeus/intents/<intent-id>-<slug>/use-cases/<use-case-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/codebase-analysis.md`
- `.amadeus/intents/<intent-id>-<slug>/units.md`
- `.amadeus/intents/<intent-id>-<slug>/units/<unit-id>-<slug>/unit.md`
- `.amadeus/intents/<intent-id>-<slug>/units/<unit-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/bolt.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/tasks.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`

この skill は、domain model、Spec、実装を作りません。
domain model や契約が不足している場合は、`amadeus-domain-grilling` または `amadeus-domain-modeling` に渡します。

Bolt は Intent 直下に置きます。
Bolt が複数 Unit をまたぐ場合でも、Intent なしの横断 Bolt にはしません。

Task の依存は、同じ Bolt 内なら `T001`、別 Bolt の Task なら `B001/T002` のように書きます。
Task は同じ Bolt の `bolt.md` と参照先 Unit `design.md` を入力にして作ります。
依存だけでは作業内容を表せないため、Task には必ず `作業` を書きます。

Intent、Requirement、Story、Use Case、Unit、Bolt、Design、Task が常に 1:1 になる場合は、まず grill 不足を疑います。
それでも自然な粒度であれば、例外理由を `traceability.md` または `decisions.md` に残します。

### 6. Intent を Construction へ進める

Inception を完了した Intent から、Bolt と Task の実装、検証、証拠化へ進める場合は `amadeus-construction` を使います。

`amadeus-construction` は公開入口です。
成果物作成、実装、検証、追跡更新を直接行わず、次の内部 skill を順に呼び出します。

| 内部 skill | プロセス | 主な結果 |
|---|---|---|
| `amadeus-construction-bolt-preparation` | Bolt 実行準備 | 対象 Bolt、Task、前提、作業順序、検証入口、`notes.md` |
| `amadeus-construction-implementation-execution` | 実装実行 | 対象 Task の実装、実装判断、`notes.md` |
| `amadeus-construction-verification-hardening` | 検証と堅牢化 | テスト実装、テスト実行、安全性確認、CI 確認、`test-results.md` |
| `amadeus-construction-traceability-finalization` | 追跡と状態確定 | `tasks.md`、`acceptance.md`、`traceability.md`、`decisions.md`、`state.json`、任意の `pr.md` |

`pr.md` は PR URL が存在する場合だけ作ります。
PR を記録する場合は、必ず URL を書きます。

この段階では、Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は作りません。

### 7. 論点を一問ずつ確認する

guided で不足論点を確認する場合は、`amadeus-grilling` を使います。

`amadeus-grilling` は、設計や方針の曖昧さを一問ずつ解消するための skill です。
質問には推奨回答と理由を添え、ユーザーの回答を待ってから次へ進みます。
既存成果物を読めば分かることは質問せず、先に確認します。

### 8. 用語とドメインモデルを整理する

用語、概念、ドメインモデル、契約を整理する場合は、`amadeus-domain-modeling` を使います。

`amadeus-domain-modeling` は、Ideation 固定ではなく、全フェーズで使う横断支援 skill です。
未確定語は Intent の `domain-notes.md` に記録し、確定した共有用語は `.amadeus/glossary.md` に追加します。
Intent 固有のモデルや契約は `.amadeus/intents/<intent-id>-<slug>/domain/**` に反映し、全体モデルへ昇格する判断がある場合だけ `.amadeus/domain/**` を更新します。

`CONTEXT.md` や `docs/adr/**` は更新しません。

### 9. 用語とモデルを質問で詰めながら記録する

用語、概念、境界づけられたコンテキスト、DDD モデル、契約、ドメイン判断を一問ずつ詰めながら Amadeus 成果物へ残す場合は、`amadeus-domain-grilling` を使います。

`amadeus-domain-grilling` は、`amadeus-grilling` と `amadeus-domain-modeling` の合成入口です。
質問進行は `amadeus-grilling` に従い、回答後の記録先は `amadeus-domain-modeling` に従います。

質問が必要なターンでは成果物を更新せず、ユーザーの回答を待ちます。
回答で確定した内容だけを `.amadeus/glossary.md`、対象 Intent の `domain-notes.md`、`domain/**`、`traceability.md`、必要最小限の decision に反映します。

一般的な設計質問だけなら `amadeus-grilling`、記録済み内容の補修だけなら `amadeus-domain-modeling` を使います。

### 10. 成果物を検証する

`.amadeus/` の構造を検証する場合は、`amadeus-validator` を使います。

全体成果物だけを検証する場合:

```sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts .
```

特定 Intent も検証する場合:

```sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . <intent-id>-<slug>
```

Amadeus Validator は、配布先ユーザー環境で動く実行時検証です。
repo root の開発用 `scripts/` や package scripts を実行時検証の入口にはしません。

`pass` は、実行時に参照できる最低限の構造条件を満たすという意味です。
内容妥当性の承認や gate 通過そのものではありません。

## Skill 分類

| 分類 | 使う skill | 役割 | 作らないもの |
|---|---|---|---|
| ライフサイクル進行 | `amadeus-steering` | `.amadeus/` の共有土台を作る | 個別 Intent |
| ライフサイクル進行 | `amadeus-discovery` | Intent 化前の入力テーマを整理する | Requirement、Use Case、Unit、Bolt、Task |
| ライフサイクル進行 | `amadeus-intent-init` | Intent 登録、`intent.md`、`state.json` を作る | Ideation 以降の成果物 |
| ライフサイクル進行 | `amadeus-ideation` | `scope.md`、`ideation.md`、判断、追跡、初期モックを作る | 要求、ユースケース、Unit、Bolt、ドメインモデル |
| ライフサイクル進行 | `amadeus-inception` | 要求、受け入れ状態、ユーザーストーリー、ユースケース、Unit、Bolt、Design、Task、追跡、判断を作る | domain model、Spec、実装 |
| ライフサイクル進行 | `amadeus-construction` | Bolt と Task を実装、検証、証拠化し、追跡と状態を更新する | Spec、Operation 成果物 |
| 横断支援 | `amadeus-grilling` | 全フェーズで論点を一問ずつ確認する | 成果物の作成や変更 |
| 横断支援 | `amadeus-domain-modeling` | 全フェーズで用語、概念、モデル、契約を整理する | `CONTEXT.md`、`docs/adr/**` |
| 横断支援 | `amadeus-domain-grilling` | 用語、概念、モデル、契約を一問ずつ詰め、回答後に Amadeus 成果物へ記録する | 独自の成果物構造や識別子規則 |
| 横断検証 | `amadeus-validator` | 全フェーズで成果物構造を検証する | 成果物の作成や変更 |

## 注意事項

- `.amadeus/` が Amadeus 成果物のルートです。
- Intent ディレクトリ名は `.amadeus/intents.md` と `.amadeus/intents/<intent-id>-<slug>/` で一致させます。
- 不明な値は空欄にせず、`未確認` と書きます。
- 推測で外部システム、境界づけられたコンテキスト、Intent、依存関係を作りません。
- Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は、対応 skill が確定するまで手順として固定しません。
