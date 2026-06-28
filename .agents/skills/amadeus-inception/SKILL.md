---
name: amadeus-inception
description: >-
  Amadeus の Ideation 完了済み Intent を Inception 段階へ進め、要求、受け入れ状態、ユーザーストーリー、ユースケース、
  既存コード分析、Unit、Unit Design Brief、Bolt、追跡、判断を作成、点検、補修、または煮詰める。`state.json.phase` が `ideation` で gate passed の
  Intent を Inception へ進める場面、または既に Inception 成果物を持つ Intent の requirements、user-stories、use-cases、
  codebase-analysis、units、bolts、design、traceability、decisions を refine したい場面では必ず使う。domain model、Spec、実装を作るための skill
  ではない。
---

# amadeus-inception

## 目的

Ideation 完了済みの Intent を Inception 段階へ進める。または、既に Inception 段階にある Intent を煮詰める。

この skill は、Intent から要求、ユーザーストーリー、ユースケース、Unit、Unit Design Brief、Bolt への分解と追跡を固定する。
既存コードがある brownfield では、要求やユースケースを既存能力、統合点、ギャップに照らしてから Unit Design Brief へ渡す。
ここで扱う設計は、Unit の課題解決方針を定める設計ブリーフである。
Bolt は Unit Design Brief に従って実行可能な作業単位へ分割する。
Task は Construction Design を根拠に Construction phase で生成する。
Spec、実装、CI、運用手順は作らない。

## 前提

対象 Intent が `.amadeus/intents/<intent-id>-<slug>/` に存在し、Ideation を完了していることを前提にする。

少なくとも次が存在しない場合は、作業を止めて `amadeus-intent-init` または `amadeus-ideation` を案内する。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions.md`

`state.json.phase` が `ideation` でない場合は、現在の phase と不足成果物を確認してから止める。
`state.json.ideation.gate` が `passed` でない場合は、Inception へ進めず `amadeus-ideation` の `refine` を案内する。

既存のドメイン用語、境界づけられたコンテキスト、契約が不足している場合は、Inception 成果物の中で推測して確定しない。
必要なら `amadeus-domain-grilling` または `amadeus-domain-modeling` を案内する。

## 入力

- 検証対象の作業ディレクトリ。
- 対象 Intent ディレクトリ名。
- Inception の進め方。
  - `auto`: 既存状態から `guided`、`refine`、`repair` を判定する。
  - `guided`: 質問してから作る。
  - `scaffold-only`: 質問せず、分かる情報だけで作る。
  - `refine`: 既存 Inception 成果物を質問で煮詰める。
  - `repair`: 既存 Inception 成果物の構造だけを補修する。
- 分かっている場合は、要求、利用者価値、相互作用、Unit 境界、Unit Design Brief 候補、Bolt 境界、Construction へ渡す作業粒度の候補。

実行モードの指定がなければ `auto` にする。

## テンプレート

Inception 成果物を新規作成または構造補修する場合は、テンプレートを使う。

優先順位は次である。

1. `.amadeus/settings/templates/intents/inception/`
2. この skill に同梱された `templates/intents/inception/`

`.amadeus/settings/templates/intents/inception/` は、プロジェクト固有の上書きとして扱う。
存在しない場合は、`templates/intents/inception/` の標準テンプレートを使う。
どちらもない場合は、作成前にテンプレート不足として止める。

テンプレートの `<...>` は、Ideation 成果物、steering layer、domain layer、回答内容から分かる値に置き換える。
分からない項目は空欄にせず、本文と未確認事項に `未確認` として残す。
`codebase-analysis.md` は brownfield の場合だけ必須成果物に含める。
`domain/subdomains.md` と `domain/bounded-contexts.md` は、Inception 検証で Unit と境界参照を確認するための構造 index として作る。
これは詳細な domain model や契約の作成ではない。
`inception.gate` を `passed` にする場合は、対象 Intent の解決領域として少なくとも1件の境界づけられたコンテキストを確定し、`units.md` の `コンテキスト` に同じ `BCnnn` を参照させる。
境界づけられたコンテキストが未確認の場合は、推測で `passed` にせず、未確認事項を残して `state.json.inception.gate` を `not_ready` にする。
モデル詳細と契約条件が未確認の場合は、対象 BC の `models.md` と `contracts.md` に未確認事項として残してよい。

## 内部プロセス

`amadeus-inception` は公開入口である。

作成や補修を実行する場合は、この skill だけで成果物を直接作らない。

内部では次の順番で内部 skill を使う。

| 内部 skill | 役割 | 主な成果物 |
|---|---|---|
| `amadeus-inception-requirements-definition` | 要件定義 | `requirements.md`, `requirements/**`, `acceptance.md` |
| `amadeus-inception-interaction-modeling` | 相互作用整理 | `user-stories.md`, `user-stories/**`, `use-cases.md`, `use-cases/**` |
| `amadeus-inception-execution-design` | 実施設計 | `units.md`, `units/**`, `bolts.md`, `bolts/**`, `domain/subdomains.md`, `domain/bounded-contexts.md` |
| `amadeus-inception-traceability-finalization` | 追跡と状態確定 | `traceability.md`, `decisions.md`, `decisions/**`, `state.json` |

`requirements.md`、`requirements/**`、`acceptance.md` を作成または補修する場合は、必ず `amadeus-inception-requirements-definition` を使う。

`user-stories.md`、`user-stories/**`、`use-cases.md`、`use-cases/**` を作成または補修する場合は、必ず `amadeus-inception-interaction-modeling` を使う。

`units.md`、`units/**`、`bolts.md`、`bolts/**`、`domain/subdomains.md`、`domain/bounded-contexts.md` を作成または補修する場合は、必ず `amadeus-inception-execution-design` を使う。

`traceability.md`、`decisions.md`、`decisions/**`、`state.json` を作成または補修する場合は、必ず `amadeus-inception-traceability-finalization` を使う。

Inception 全体を進める場合は、4つの内部 skill を上から順に使う。
各内部 skill の実行後に対象 Intent の成果物を読み直し、次の内部 skill に渡す前提を更新する。

内部プロセスは、ユーザーに細かい skill command として公開する前提ではない。

ただし、ユーザーが特定の内部プロセスだけを指定した場合は、そのプロセスに対応する成果物だけを作成または更新する。

指定がない場合は、前提成果物を読んだうえで、不足している内部 skill から順に使う。

後続プロセスの成果物を、前段プロセスの中で先回りして作らない。

既存成果物がある場合は、同じ ID と同じファイル名を尊重し、不足の補完または最小更新に留める。

## 実行モード

### `auto`

既定モード。
対象 Intent の状態を読み、実行モードを自動判定する。

判定では、少なくとも次を読む。

- `.amadeus/intents.md`
- `intent.md`
- `state.json`
- `scope.md`
- `ideation.md`
- `traceability.md`
- `decisions.md`
- 既存の `requirements.md`
- 既存の `acceptance.md`
- 既存の `user-stories.md`
- 既存の `use-cases.md`
- 既存の `codebase-analysis.md`
- 既存の `units.md`
- 既存の `bolts.md`
- 既存の `units/*/design.md`
- 既存の `domain/**`
- steering layer

判定規則は次である。

| 状態 | 自動選択 | 理由 |
|---|---|---|
| `intent.md` または `state.json` がない | 停止 | Intent の入れ物が不足しているため |
| Ideation 必須成果物がない | 停止 | Inception の前提が不足しているため |
| `state.json.phase` が `ideation` で gate が `passed`、Inception 成果物が不足している | `guided` | Inception へ進める前段だから |
| `state.json.phase` が `inception` で必須成果物が存在し、内容を煮詰める依頼である | `refine` | 既存 Inception を深める段階だから |
| `state.json.phase` が `inception` で必須見出し、相対リンク、依存表記、`requiredArtifacts` だけが壊れている | `repair` | 構造補修が目的だから |
| `state.json.phase` が `inception` だが、構造補修と内容判断の両方が必要である | まず `repair` | 壊れた構造の上で内容判断をしないため |
| ユーザーが `scaffold-only` を明示した | `scaffold-only` | 質問しない作成を明示しているため |

`auto` で `guided`、`refine`、`repair` を選んだ場合は、選択理由を短く示してから該当モードの手順に従う。

### `guided`

作成前に、Inception 成果物に必要な不足だけを質問する。

質問は `/amadeus-grilling` を使って行う。
複数の論点が残っている場合でも、一度に並べず一問ずつ質問する。
質問数の目安は5問にする。
目安を超えても、Inception 成果物に必要な判断が未確定であれば質問を続ける。
目安を超えて質問を続ける場合は、追加確認が必要な理由を短く示す。
既存の `intent.md`、`scope.md`、`ideation.md`、`traceability.md`、`decisions.md`、steering layer、domain layer から分かることは質問しない。

質問候補は次である。

- 要求として採用する利用者価値と制約は何か。
- ユーザーストーリーが必要なアクター価値は何か。
- ユースケースとして叙述すべきシステムとの相互作用は何か。
- 既存コードに載せる場合、読むべき既存能力、統合点、ギャップ候補は何か。
- Unit を切る価値境界と、境界づけられたコンテキストは何か。
- Unit Design Brief には、どの解決戦略、責務境界、構成候補、データと契約候補、検証観点が必要か。
- Bolt を切る実施境界と、Unit Design Brief との対応は何か。
- Construction Design で Task 化するために、Bolt へ渡す作業粒度、依存、証拠候補は何か。
- Intent、Requirement、Story、Use Case、Unit、Bolt のピラミッド構造が崩れる場合、その理由は何か。

質問した場合は、その場で成果物を作らず、ユーザーの回答を待つ。
回答を受け取ってから Inception 成果物を作る。
回答に記録対象の判断が含まれる場合は、Inception 成果物への反映と同じ変更で `grillings.md` と `grillings/Gxxx-*.md` を対象 Intent 配下に更新する。
`requirements.md` または `acceptance.md` を作る場合は、書き込み前に `Requirements Review Gate` を通す。
既存コードに載せる Intent で Unit Design Brief を作る場合は、先に `Codebase Analysis Gate` を通す。

### `scaffold-only`

ユーザーが明示した場合だけ使う。
質問せず、既存 Ideation 成果物と domain layer から分かる範囲で Inception 成果物を作る。

不明な項目は空欄にせず、`未確認` と書く。
未確認事項には、後で人間が答えるべき問いを残す。
Requirements Review Gate と Codebase Analysis Gate は、既存成果物と与えられた入力による自己点検として扱う。
未確認事項が残るだけなら停止せず、該当成果物に `未確認` として残し、`state.json.inception.gate` を `not_ready` にする。
スコープ、目的、アクター、外部システム、ドメイン用語、契約の矛盾がある場合だけ停止する。

### `repair`

ユーザーが明示した場合だけ使う。
既存の Inception 成果物を点検し、欠けている必須見出し、`state.json` の不整合、相対リンク欠落、依存表記の欠落、識別子の重複だけを補修する。

`repair` では、新しい要求、ユースケース、ユニット、ボルト、設計、タスクを根拠なく追加しない。
ドメインモデル、Spec、実装は作らない。

### `refine`

既に Inception 段階にある Intent を、質問で煮詰める。

`refine` は、Inception 成果物の所有範囲だけを扱う。
ドメインモデル、Spec、実装へ進めない。

開始時に、少なくとも次を読む。

- `intent.md`
- `scope.md`
- `ideation.md`
- `requirements.md`
- `acceptance.md`
- `user-stories.md`
- `use-cases.md`
- `codebase-analysis.md`
- `units.md`
- `bolts.md`
- `bolts/*/bolt.md`
- `units/*/design.md`
- `traceability.md`
- `decisions.md`
- `state.json`
- `domain/**`
- steering layer

読めば分かることは質問しない。
まだ人間の判断が必要な Inception 論点を1つだけ選び、`amadeus-grilling` の質問作法に従って一問だけ質問する。

質問候補は次である。

- 要求の採用、分割、依存、受け入れ状態の曖昧さ。
- ユーザーストーリーが要求の言い換えになっている箇所。
- ユースケースが相互作用ではなく要求の箇条書きになっている箇所。
- Unit が価値単位として大きすぎる、または細かすぎる箇所。
- Bolt が Unit と 1:1 になっており、分解不足か自然な粒度かを判断すべき箇所。
- Unit Design Brief が不足しており、Bolt が要求やユースケースから直接作られている箇所。
- Construction で Task 化できるだけの作業粒度、依存、証拠候補が Bolt に残っていない箇所。
- ピラミッド構造が崩れており、grill 不足を疑うべき箇所。

質問した場合は、そのターンでは成果物を更新しない。
ユーザーの回答を受け取ってから、必要最小限の Inception 成果物だけを更新する。
回答に記録対象の判断が含まれる場合は、Inception 成果物への反映と同じ変更で `grillings.md` と `grillings/Gxxx-*.md` を対象 Intent 配下に更新する。
`requirements.md` または `acceptance.md` を更新する場合は、書き込み前に `Requirements Review Gate` を通す。
既存コードに載せる Intent で Unit Design Brief を更新する場合は、先に `Codebase Analysis Gate` を通す。

## 成果物

作成または更新するものは次だけである。

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
- `.amadeus/intents/<intent-id>-<slug>/domain/subdomains.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions/<decision-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- 記録対象の質問と回答が発生した場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings.md`
- 記録対象の質問と回答が発生した場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings/Gxxx-*.md`

`intent.md`、`scope.md`、`ideation.md` は原則として既存内容を尊重する。
Inception の回答により明らかな `未確認` を埋める必要がある場合だけ、該当箇所を最小限更新する。

## 識別子

Inception 成果物の識別子は次を使う。

| 成果物 | 識別子 |
|---|---|
| 要求 | `Rnnn` |
| ユーザーストーリー | `Snnn` |
| ユースケース | `UCnnn` |
| ユニット | `Unnn` |
| ボルト | `Bnnn` |
| 判断 | `Dnnn` |

`nnn` は3桁の連番にする。
既存 ID がある場合は欠番を再利用せず、次の番号を使う。

## 依存関係

全ての一覧ファイルは `依存` 列を持つ。
全ての一覧ファイルは `依存関係` 見出しを持つ。

依存がない場合は `なし` と書く。
依存がある場合は、同じ成果物種別の ID を書く。

依存は、何を作るかの説明の代わりにしない。

## ピラミッド構造

基本形は次である。

```text
Intent
  -> Requirement
    -> User Story
      -> Use Case
        -> Unit
          -> Unit Design Brief
          -> Bolt
```

下位成果物が上位成果物と常に 1:1 になる場合は、分割不足を疑う。
まず `amadeus-grilling` で、要求、相互作用、価値単位、実施境界を十分に分けたか確認する。

それでも 1:1 が自然な場合は、例外として認める。
ただし、`traceability.md` または `decisions.md` に理由を残す。

例外理由には、少なくとも次を書く。

- どの階層が 1:1 になっているか。
- grill 不足ではないと判断した理由。
- 後で分割を見直す条件。

## `requirements.md`

必須見出しは次である。

- `一覧`
- `依存関係`
- `受け入れ状態`

`一覧` の表は、次の列を持つ。

- `識別子`
- `概要`
- `状態`
- `依存`
- `詳細`

要求状態は、次の順に進める。

```text
提案 -> 採用済み -> 充足済み -> 検証済み
```

Inception で新しく作る要求は、原則として `提案` または `採用済み` にする。
実装証拠なしに `充足済み` や `検証済み` にしない。

## Requirements Review Gate

`requirements.md`、`requirements/<requirement-id>-<slug>.md`、`acceptance.md` を書く前に、要求案を作業メモとして保持し、まだファイルへ書き込まない。
`intent.md`、`scope.md`、`ideation.md`、steering layer、domain layer を読み、次を確認する。

- 要求が、利用者、運用者、外部システムから観測できる振る舞い、制約、受け入れ状態を表している。
- 要求が、実装方法、技術選定、内部 API、ファイル構造、データモデル、コンポーネント構成を固定していない。
- `scope.md` の `対象` と `対象外`、`ideation.md` の未確定事項が要求案に反映されている。
- 各要求に `Rnnn`、概要、状態、依存、詳細リンク、受け入れ状態がある。
- 各要求が検証可能で、曖昧語だけで成立していない。
- 要求間依存が、受け入れ条件の前提関係として説明できる。
- ユーザーストーリー、ユースケース、Unit、Bolt へ進むための入口として十分である。
- 既存の用語、境界づけられたコンテキスト、契約と矛盾していない。

問題が要求案の局所修正で解ける場合は、最大2回まで修正して Review Gate を再実行する。
スコープ、目的、アクター、外部システム、ドメイン用語、契約に未解決の矛盾がある場合は、要求を書かずに止める。
その場合は、`amadeus-grilling` の質問作法に従って、一問だけ質問する。

Amadeus の要求形式では、Kiro の番号付き `Requirement 1` や EARS 文をそのまま必須形式にしない。
必要なら EARS を参考にしてもよいが、日本語として自然で、検証可能な `Rnnn` 要求にする。

## `acceptance.md`

必須見出しは次である。

- `要求状態`
- `状態ルール`

`要求状態` の表は、次の列を持つ。

- `要求`
- `状態`
- `証拠`

証拠がない場合は `未登録` と書く。

## `user-stories.md`

必須見出しは次である。

- `一覧`
- `依存関係`

`一覧` の表は、次の列を持つ。

- `識別子`
- `アクター`
- `概要`
- `要求`
- `依存`
- `詳細`

ユーザーストーリーは、要求のユーザー価値表現である。
必要な場合だけ作る。
作る場合は必ずアクターを参照する。

## `use-cases.md`

必須見出しは次である。

- `一覧`
- `依存関係`

`一覧` の表は、次の列を持つ。

- `識別子`
- `アクター`
- `外部システム`
- `ストーリー`
- `要求`
- `依存`
- `詳細`

ユースケースは、要求の言い換えではなく、システムとの相互作用に含まれる手順を叙述的に示す。

## `codebase-analysis.md`

既存コードに載せる Intent の場合に作る。
greenfield で既存コードがない場合は作らず、`traceability.md` に対象外理由を残す。

必須見出しは次である。

- `対象コード`
- `既存能力`
- `統合点`
- `ギャップ`
- `リスク`
- `Inception への入力`

`対象コード` には、読んだ既存コード、設定、テスト、ドキュメントの範囲を書く。
推測で存在しないパスを書かない。

`既存能力` には、要求やユースケースに既に使える振る舞いを書く。
`統合点` には、既存コードへ接続できそうな境界、公開 API、設定、データ、テストの入口を書く。
`ギャップ` には、要求、ユースケース、Unit Design Brief、Bolt へ渡す不足を、実装指示ではなく分析として書く。
`リスク` には、既存コードの制約、破壊しやすい箇所、未確認事項を書く。
`Inception への入力` には、Unit Design Brief、Bolt、Construction Design へ渡す判断材料を書く。

## Codebase Analysis Gate

既存コードに載せる Intent で Unit Design Brief を書く前に、コードベース分析案を作業メモとして保持し、まだファイルへ書き込まない。
対象要求、対象ユースケース、既存コード、既存テスト、既存ドキュメントを読み、次を確認する。

- 既存コードを読む範囲が、要求とユースケースに対応している。
- 既存能力、統合点、ギャップ、リスクを分けている。
- 既存コードにある事実と、これから設計で決める仮説を混同していない。
- Unit の責務境界や Bolt 分割に影響する既存構造、依存、制約を示している。
- Unit Design Brief に渡す入力はあるが、実装手順や Spec を先取りしていない。
- 既存テストまたは検証入口がある場合は、証拠候補として記録している。
- 既存コード分析だけでは確定できない論点を `未確認` として残している。

問題がコードベース分析案の局所修正で解ける場合は、最大2回まで修正して Review Gate を再実行する。
要求、ユースケース、スコープ、ドメイン用語との矛盾が原因の場合は、Unit Design Brief を書かずに止める。
その場合は、不足している成果物と該当見出しを示し、上流成果物の refine に戻す。

## `units.md`

必須見出しは次である。

- `一覧`
- `依存関係`

`一覧` の表は、次の列を持つ。

- `識別子`
- `概要`
- `要求`
- `コンテキスト`
- `依存`
- `詳細`

ユニットは Intent 配下の価値単位である。
Unit を切るときは、対象 Intent の domain layer と steering layer の境界づけられたコンテキストを参照する。

`詳細` は `units/<unit-id>-<slug>/unit.md` を指す。
Unit 詳細はディレクトリ化し、同じディレクトリに `design.md` を置く。

## `units/<unit-id>-<slug>/unit.md`

必須見出しは次である。

- `ユニット`
- `対象要求`
- `価値境界`
- `検証観点`
- `未確認事項`
- `関連成果物`

`関連成果物` には、同じディレクトリの `design.md` への相対リンクを置く。

## `units/<unit-id>-<slug>/design.md`

必須見出しは次である。

- `概要`
- `設計戦略`
- `責務境界`
- `構成候補`
- `データと契約候補`
- `検証観点`
- `Bolt 分割方針`
- `Construction への引き継ぎ`

Unit Design Brief は、Unit の課題解決方針を定める設計成果物である。
Bolt や実装の都合ではなく、要求、ユースケース、価値境界から導く。

`概要` では、この文書が Unit Design Brief であることを書く。
Inception では Unit の課題解決方針、Bolt 分割、Construction へ渡す設計入力だけを扱う。
詳細な Domain Design、Logical Design、実装設計、テスト設計は Construction で確定する。

`設計戦略` では、この Unit の課題解決方針を書く。

`責務境界` では、この Unit が所有するもの、所有しないもの、依存してよいもの、後続で再確認が必要になる条件を書く。

`構成候補` では、責務名レベルの構成候補を書く。
実装コンポーネント名、クラス名、ファイル名は確定しない。

`データと契約候補` では、入力候補、出力候補、状態候補、事前条件候補、事後条件候補、不変条件候補を書く。
型、保存先、API スキーマは Construction で確定する。

`検証観点` では、受け入れ状態に必要な観測可能な振る舞いと、Construction で具体化するテスト種別候補を書く。

`Bolt 分割方針` では、設計戦略をどの Bolt に分けて実行するかを書く。

`Construction への引き継ぎ` では、Domain Design、Logical Design、実装、検証で確定する未決定事項を書く。

## `bolts.md`

必須見出しは次である。

- `一覧`
- `依存関係`

`一覧` の表は、次の列を持つ。

- `識別子`
- `概要`
- `ユニット`
- `設計`
- `依存`
- `詳細`

ボルトは Intent 配下に置く。
ボルトは Unit の子ディレクトリに固定しない。
ボルト側から対象 Unit と Unit Design Brief を参照する。

横断的に見える Bolt であっても、Intent なしでは作らない。
横断的 Bolt は、対象 Intent の中で、複数 Unit または複数関心をまたぐ Bolt として定義する。
複数 Unit をまたぐ Bolt では、`設計` に複数の Unit Design Brief へのリンクを書き、`bolt.md` の `複数 Unit を扱う理由` に理由を残す。

## `bolts/<bolt-id>-<slug>/bolt.md`

必須見出しは次である。

- `概要`
- `対象ユニット`
- `設計`
- `完了条件`
- `依存`
- `未確認事項`

`設計` には、対象 Unit の `design.md` への相対リンクを置く。
複数 Unit を対象にする場合だけ、`複数 Unit を扱う理由` 見出しを追加して理由を書く。
Bolt 配下に `design.md` は作らない。

## Construction Task 生成への引き継ぎ

Inception では `tasks.md` を作らない。
Task は Construction phase の `bolts/<bolt-id>-<slug>/design.md` を根拠に、`amadeus-construction-bolt-preparation` が生成する。

Bolt には、Construction Design で Task 化できるように次を残す。

- 対象 Unit と Unit Design Brief への参照。
- 対象要求、対象ユースケース、完了条件。
- 実施境界、依存、未確認事項。
- Construction で確定する Domain Design、Logical Design、実装設計、検証設計への入力。

## `traceability.md`

Inception 段階の必須見出しは次である。

- `要求からの追跡`
- `背景からの追跡`
- `ボルトからの追跡`
- `設計からの追跡`
- `既存コード分析からの追跡`
- `ユニットからの追跡`
- `ドメインモデルからの追跡`
- `依存関係からの追跡`

`設計からの追跡` では、Unit Design Brief がどの Unit、要求、ユースケース、Bolt に展開されたかを追跡する。
表は、次の列を持つ。

- `設計`
- `ユニット`
- `要求`
- `ユースケース`
- `ボルト`

`既存コード分析からの追跡` では、`codebase-analysis.md` がどの要求、ユースケース、Unit Design Brief、Bolt の入力になったかを追跡する。
表は、次の列を持つ。

- `分析`
- `要求`
- `ユースケース`
- `ユニット`
- `ボルト`
- `設計`
- `入力`

`分析` は `codebase-analysis.md` への相対リンクにする。
`設計` は Unit Design Brief への相対リンクにする。
`入力` には、既存コード分析から後続成果物へ渡す判断材料を書く。
greenfield で `codebase-analysis.md` を作らない場合も、この見出しには必須列を持つ空表を置き、対象外理由を本文に残す。
空表は、見出しと区切り行だけを置き、データ行を書かない。

`依存関係からの追跡` では、Intent、要求、ユーザーストーリー、ユースケース、ユニット、ボルト、判断の依存を同じ表で追跡する。

## `state.json`

Inception 完了時の `state.json` は次の形にする。
既存の `initialized` や `ideation` の状態ブロックは削除せず、Inception の状態を追加する。

```json
{
  "intent": "<intent-id>-<slug>",
  "phase": "inception",
  "status": "completed",
  "ideation": {
    "status": "completed",
    "gate": "passed"
  },
  "inception": {
    "status": "completed",
    "requiredArtifacts": [
      "requirements.md",
      "acceptance.md",
      "user-stories.md",
      "use-cases.md",
      "units.md",
      "units/<unit-id>-<slug>/unit.md",
      "units/<unit-id>-<slug>/design.md",
      "bolts.md",
      "traceability.md",
      "decisions.md"
    ],
    "requiredBoltArtifacts": [
      "bolts/<bolt-id>-<slug>/bolt.md"
    ],
    "gate": "passed"
  }
}
```

Inception がまだ完了していない場合は、`status` または `inception.status` を `in_progress`、`waiting_approval`、`needs_changes` のいずれかにする。
`gate` は `not_ready`、`waiting_approval`、`passed`、`failed` のいずれかにする。
`codebase-analysis.md` は、既存コードに載せる brownfield Intent の場合だけ `requiredArtifacts` に含める。
greenfield の場合は含めず、`traceability.md` に対象外理由を残す。
`domain/subdomains.md` と `domain/bounded-contexts.md` は構造検証用 index なので、`requiredArtifacts` に含めなくてもよい。
ただし Inception 成果物を作るときは必ず作る。
`inception.gate` を `passed` にする場合は、対象 Intent の `domain/bounded-contexts.md` に少なくとも1件の BC があり、`units.md` の `コンテキスト` がその BC を参照している必要がある。

## 禁止事項

- `state.json.ideation.gate` が `passed` でない Intent を Inception へ進めない。
- 境界づけられたコンテキストが未確認のまま `inception.gate` を `passed` にしない。
- 詳細な domain model、contract を推測で作らない。
- `domain/subdomains.md` と `domain/bounded-contexts.md` を省略しない。
- 要求に実装方法、技術選定、内部 API、ファイル構造、データモデル、コンポーネント構成を混ぜない。
- スコープ、目的、アクター、外部システム、ドメイン用語、契約の矛盾が残ったまま要求を書かない。
- Spec、実装詳細、実装、CI、運用手順を作らない。
- 既存コード分析で実装手順や Spec を先取りしない。
- Bolt を Intent なしに作らない。
- Bolt を Unit 配下のディレクトリに作らない。
- Bolt 配下に `design.md` を作らない。
- Inception で `tasks.md` を作らない。
- 依存関係だけを書いて、具体的な作業や理由を書かない。
- ピラミッド構造が崩れた理由を残さずに 1:1 の分解を確定しない。
- repo の開発用文書や開発用スクリプトを実行時参照として書かない。

## 次の skill

- Intent の Ideation 成果物が不足している場合: `amadeus-ideation`
- 用語、概念、ドメインモデル、契約が不足している場合: `amadeus-domain-grilling` または `amadeus-domain-modeling`
- 成果物の構造を検証する場合: `amadeus-validator`
- Spec へ進める場合: 未確定
