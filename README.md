# Amadeus

Amadeus DLC は、Amadeus の設計、仕様、実装の流れを扱うための作業領域です。

このリポジトリでは、root `.amadeus/` を実運用状態として置きません。
生成例は [examples/](examples/) 配下の段階別 snapshot として管理します。

## 使い方

現時点で確定している入口は、次の10個です。

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

Construction は、Inception で定義した Bolt を Task に分解し、実装、検証、証拠化する入口です。
Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は、対応 skill が確定するまで手順として固定しません。

Amadeus DLC の phase ごとの stage reference は、[docs/reference/04-stages/](docs/reference/04-stages/) を参照してください。

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
- `.amadeus/discoveries/<discovery-id>.md`
- `.amadeus/discoveries/<discovery-id>/state.json`

この段階では、Requirement、Use Case、Unit、Bolt、Task、実装方針は作りません。
Discovery が完了しても、`amadeus-ideation` は自動実行しません。

課題サイズが明確な場合は、`amadeus-discovery` を挟まずに `amadeus-ideation` を使います。

### 3. Domain Event から流れを整理する

対象テーマの流れや境界が複雑で、Domain Event、Process、Aggregate Candidate、Bounded Context Candidate を先に整理したい場合は、`amadeus-event-storming` を使います。

`amadeus-event-storming` は、phase を進める入口ではありません。
Discovery、Ideation、Inception、Domain Modeling が参照できる補助分析成果物を作ります。

pre-intent の場合は、次だけを作成または更新します。

- `.amadeus/event-storming/<event-storming-id>.md`
- `.amadeus/event-storming/<event-storming-id>/events.md`
- `.amadeus/event-storming/<event-storming-id>/flow.md`
- `.amadeus/event-storming/<event-storming-id>/board.md`
- `.amadeus/event-storming/<event-storming-id>/aggregate-candidates.md`
- `.amadeus/event-storming/<event-storming-id>/bounded-context-candidates.md`
- `.amadeus/event-storming/<event-storming-id>/hotspots.md`
- `.amadeus/event-storming/<event-storming-id>/state.json`

Intent 配下の場合は、同じ構造を `.amadeus/intents/<intent-id>-<slug>/event-storming/<event-storming-id>.md` と `.amadeus/intents/<intent-id>-<slug>/event-storming/<event-storming-id>/` に置きます。

Event Storming で扱う Event は Domain Event だけです。
UI event、technical event、integration event、log event は Domain Event にせず、必要なら `hotspots.md` または `flow.md` の補足に残します。

この段階では、Requirement、Use Case、Unit、Bolt、Task、Aggregate、Bounded Context、Contract、実装は確定しません。

### 4. Intent を Ideation completed へ進める

新しい Intent を登録し、そのまま Ideation completed へ進める場合は、`amadeus-ideation` を使います。

`amadeus-ideation` は内部の Intent Capture & Framing から Traceability Finalization までを1回で進めます。

まず次の Intent Record を作成または更新します。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`

続けて、次だけを作成または更新します。

- `.amadeus/intents/<intent-id>-<slug>/ideation/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/decisions/<decision-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/mocks/*.puml`
- `.amadeus/intents/<intent-id>-<slug>/state.json`

Intent Record だけで止める公開モードはありません。
`state.json.phase` は `ideation` になり、完了時は `state.json.ideation.gate` が `passed` になります。

既定は `guided` です。
不足している論点は `/amadeus-grilling` で一問ずつ確認します。
質問した場合、そのターンでは成果物を作らず、回答を待ちます。

`scaffold-only` は、質問せずに既存情報だけで Intent Record から Ideation 完了成果物まで作る場合に使います。
不明点は空欄にせず、`未確認` として残します。

`repair` は、既存 Ideation 成果物の見出し、リンク、`state.json`、必須成果物の対応だけを補修する場合に使います。

既に Ideation 段階にある Intent を煮詰める場合は、`amadeus-ideation` が `refine` を自動選択します。
`refine` は、既存の `ideation/scope.md`、`ideation/ideation.md`、`ideation/decisions.md`、`ideation/traceability.md`、`ideation/mocks/*.puml`、`state.json` を読み、必要な Ideation 論点を一問ずつ確認します。
質問が必要なターンでは成果物を更新せず、回答後に Ideation 成果物だけを更新します。

この段階では、要求、ユースケース、Unit、Bolt、Task、ドメインモデルは作りません。

### 5. Intent を Inception へ進める

Ideation を完了した Intent から、要求、ユーザーストーリー、ユースケース、Unit、Bolt、Unit Design Brief へ進める場合は `amadeus-inception` を使います。

`amadeus-inception` は、次を作成または更新します。

- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/requirements/<requirement-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/user-stories.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/user-stories/<story-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/use-cases.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/use-cases/<use-case-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/codebase-analysis.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/<unit-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/<unit-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts/<bolt-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/decisions/<decision-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`

この skill は、domain model、Spec、実装を作りません。
domain model や契約が不足している場合は、`amadeus-domain-grilling` または `amadeus-domain-modeling` に渡します。

Bolt は `inception/bolts/` に置きます。
Bolt が複数 Unit をまたぐ場合でも、Intent なしの横断 Bolt にはしません。

Inception では Task ID と `tasks.md` を作りません。
Task は Construction で、対象 Bolt のモジュールファイル、参照先 Unit Design Brief、Functional Design を入力にして作ります。

Intent、Requirement、Story、Use Case、Unit、Bolt、Design が常に 1:1 になる場合は、まず grill 不足を疑います。
それでも自然な粒度であれば、例外理由を `inception/traceability.md` または `inception/decisions.md` に残します。

### 7. Intent を Construction へ進める

Inception を完了した Intent から、Bolt を Task に分解し、実装、検証、証拠化へ進める場合は `amadeus-construction` を使います。

`amadeus-construction` は公開入口です。
成果物作成、実装、検証、追跡更新を直接行わず、次の内部 skill を順に呼び出します。

| 内部 skill | プロセス | 主な結果 |
|---|---|---|
| `amadeus-construction-functional-design` | Functional Design | Unit ごとの `functional-design/**`、Functional Design state |
| `amadeus-construction-bolt-preparation` | Bolt 実行準備 | 対象 Bolt、Task Generation Gate、`tasks.md`、`notes.md` |
| `amadeus-construction-implementation-execution` | 実装実行 | Task Generation 済み Task の実装、実装判断、`notes.md` |
| `amadeus-construction-verification-hardening` | 検証と堅牢化 | テスト実装、テスト実行、安全性確認、CI 確認、`test-results.md` |
| `amadeus-construction-traceability-finalization` | 追跡と状態確定 | `tasks.md`、`acceptance.md`、`traceability.md`、`decisions.md`、`state.json`、任意の `pr.md` |

Construction では、Unit ごとの Functional Design に業務ロジック、業務ルール、Domain Entity、必要な UI 構成を記録します。
Bolt preparation では、Functional Design、Unit Design Brief、対象 Bolt のモジュールファイルを根拠に `tasks.md` を生成します。
Task の依存は、同じ Bolt 内なら `T001`、別 Bolt の Task なら `B001/T002` のように書きます。
依存だけでは作業内容を表せないため、Task には必ず `作業` を書きます。
Bolt と Task が常に 1:1 になる場合は、まず Functional Design と Bolt scope の分解不足を疑います。
Implementation Execution は、対象 Bolt の `taskGeneration.status` が `ready_for_approval` または `passed` でない場合は進めません。

`pr.md` は PR URL が存在する場合だけ作ります。
PR を記録する場合は、必ず URL を書きます。

この段階では、Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は作りません。

### 8. 論点を一問ずつ確認する

guided で不足論点を確認する場合は、`amadeus-grilling` を使います。

`amadeus-grilling` は、設計や方針の曖昧さを一問ずつ解消するための skill です。
質問には推奨回答と理由を添え、ユーザーの回答を待ってから次へ進みます。
既存成果物を読めば分かることは質問せず、先に確認します。

### 9. 用語とドメインモデルを整理する

用語、概念、ドメインモデル、契約を整理する場合は、`amadeus-domain-modeling` を使います。

`amadeus-domain-modeling` は、Ideation 固定ではなく、全 phase で使う横断支援 skill です。
未確定語は Intent の `domain-notes.md` に記録し、確定した共有用語は `.amadeus/glossary.md` に追加します。
全体として採用するモデルや契約は `.amadeus/domain/**` に反映します。
特定 Unit の実装設計に閉じるモデルや契約は、Construction の Functional Design で扱います。

`CONTEXT.md` や `docs/adr/**` は更新しません。

### 10. 用語とモデルを質問で詰めながら記録する

用語、概念、境界づけられたコンテキスト、DDD モデル、契約、ドメイン判断を一問ずつ詰めながら Amadeus 成果物へ残す場合は、`amadeus-domain-grilling` を使います。

`amadeus-domain-grilling` は、`amadeus-grilling` と `amadeus-domain-modeling` の合成入口です。
質問進行は `amadeus-grilling` に従い、回答後の記録先は `amadeus-domain-modeling` に従います。

質問が必要なターンでは成果物を更新せず、ユーザーの回答を待ちます。
回答で確定した内容だけを `.amadeus/glossary.md`、対象 Intent の `domain-notes.md`、`.amadeus/domain/**`、`inception/traceability.md`、Construction の Functional Design、必要最小限の decision に反映します。

一般的な設計質問だけなら `amadeus-grilling`、記録済み内容の補修だけなら `amadeus-domain-modeling` を使います。

### 11. 成果物を検証する

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
| ライフサイクル進行 | `amadeus-ideation` | Intent Record、`scope.md`、`ideation.md`、判断、追跡、初期モックを作る | 要求、ユースケース、Unit、Bolt、ドメインモデル |
| ライフサイクル進行 | `amadeus-inception` | 要求、受け入れ状態、ユーザーストーリー、ユースケース、Unit、Bolt、Unit Design Brief、追跡、判断を作る | Task、domain model、Spec、実装 |
| ライフサイクル進行 | `amadeus-construction` | Bolt を Task に分解し、実装、検証、証拠化し、追跡と状態を更新する | Spec、Operation 成果物 |
| 補助分析 | `amadeus-event-storming` | Domain Event、Process、Aggregate Candidate、Bounded Context Candidate、Hotspot を整理する | Requirement、Use Case、Unit、Bolt、Task、Aggregate、Bounded Context |
| 横断支援 | `amadeus-grilling` | 全 phase で論点を一問ずつ確認する | 成果物の作成や変更 |
| 横断支援 | `amadeus-domain-modeling` | 全 phase で用語、概念、モデル、契約を整理する | `CONTEXT.md`、`docs/adr/**` |
| 横断支援 | `amadeus-domain-grilling` | 用語、概念、モデル、契約を一問ずつ詰め、回答後に Amadeus 成果物へ記録する | 独自の成果物構造や識別子規則 |
| 横断検証 | `amadeus-validator` | 全 phase で成果物構造を検証する | 成果物の作成や変更 |

## 注意事項

- `.amadeus/` が Amadeus 成果物のルートです。
- Intent ディレクトリ名は `.amadeus/intents.md` と `.amadeus/intents/<intent-id>-<slug>/` で一致させます。
- 不明な値は空欄にせず、`未確認` と書きます。
- 推測で外部システム、境界づけられたコンテキスト、Intent、依存関係を作りません。
- Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は、対応 skill が確定するまで手順として固定しません。
