---
name: amadeus-intent-ideation
description: >-
  Amadeus の既存 Intent に対して Ideation 段階の成果物だけを作成、点検、補修、または煮詰める。`intent.md` と `state.json` を持つ
  initialized Intent を Ideation へ進める場面、または既に Ideation 段階の Intent の `scope.md`、`ideation.md`、`traceability.md`、
  `decisions.md`、`mocks/*.puml`、Ideation gate 付き `state.json` を一問ずつ refine したい場面では必ず使う。requirements、
  use-cases、units、bolts、domain model を作るための skill ではない。
---

# amadeus-intent-ideation

## 目的

既存 Intent を Ideation 段階へ進める。または、既に Ideation 段階にある Intent を煮詰める。

この skill は、Intent の意図、実現可能性、スコープ、体制、初期モック、後続への引き継ぎを固定する。
要求、ユースケース、ユニット、ボルト、タスク、ドメインモデルは作らない。

## 前提

対象 Intent が `.amadeus/intents/<intent-id>-<slug>/` に存在することを前提にする。

少なくとも次が存在しない場合は、作業を止めて `amadeus-intent-init` を案内する。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`

`state.json` が存在しないが `intent.md` は存在する場合は、Intent 登録状態を確認し、`amadeus-intent-init` で補修するよう案内する。
この skill は、Intent の入れ物を新規作成しない。

## 入力

- 検証対象の作業ディレクトリ。
- 対象 Intent ディレクトリ名。
- Ideation の進め方。
  - `auto`: 既存状態から `guided`、`refine`、`repair` を判定する。
  - `guided`: 質問してから作る。
  - `scaffold-only`: 質問せず、分かる情報だけで作る。
  - `refine`: 既存 Ideation 成果物を質問で煮詰める。
  - `repair`: 既存 Ideation 成果物の構造だけを補修する。
- 分かっている場合は、実現可能性、スコープ、体制、初期モックの観点。

実行モードの指定がなければ `auto` にする。

## 実行モード

### `auto`

既定モード。
対象 Intent の状態を読み、実行モードを自動判定する。

判定では、少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- 既存の `scope.md`
- 既存の `ideation.md`
- 既存の `traceability.md`
- 既存の `decisions.md`
- 既存の `mocks/*.puml`

判定規則は次である。

| 状態 | 自動選択 | 理由 |
|---|---|---|
| `intent.md` または `state.json` がない | 停止 | Intent の入れ物が不足しているため |
| `state.json.phase` が `initialized` で Ideation 成果物が不足している | `guided` | Ideation へ進める前段だから |
| `state.json.phase` が `ideation` で必須成果物が存在し、内容を煮詰める依頼である | `refine` | 既存 Ideation を深める段階だから |
| `state.json.phase` が `ideation` で必須見出し、相対リンク、`requiredArtifacts`、`requiredMocks` だけが壊れている | `repair` | 構造補修が目的だから |
| `state.json.phase` が `ideation` だが、構造補修と内容判断の両方が必要である | まず `repair` | 壊れた構造の上で内容判断をしないため |
| ユーザーが `scaffold-only` を明示した | `scaffold-only` | 質問しない作成を明示しているため |

`auto` で `refine` を選んだ場合は、選択理由を短く示してから `refine` の手順に従う。
`auto` で `repair` を選んだ場合は、補修対象を示してから `repair` の手順に従う。

### `guided`

作成前に、Ideation 成果物に必要な不足だけを質問する。

質問は `/amadeus-grilling` を使って行う。
複数の論点が残っている場合でも、一度に並べず一問ずつ質問する。
質問総数は最大5つにする。
既存の `intent.md`、`state.json`、`.amadeus/intents.md`、steering layer から分かることは質問しない。

質問候補は次である。

- Ideation の対象に含めるものと含めないものは何か。
- 実現可能性で確認すべき技術、運用、セキュリティ、依存の観点は何か。
- 判断者、参照者、検証対象、後続担当は誰か。
- 初期モックは何を確認するために必要か。
- Inception へ引き継ぐ未確定事項は何か。

質問した場合は、その場で成果物を作らず、ユーザーの回答を待つ。
回答を受け取ってから Ideation 成果物を作る。

### `scaffold-only`

ユーザーが明示した場合だけ使う。
質問せず、既存 `intent.md` と `state.json` から分かる範囲で Ideation 成果物を作る。

不明な項目は空欄にせず、`未確認` と書く。
未確認事項には、後で人間が答えるべき問いを残す。

### `repair`

ユーザーが明示した場合だけ使う。
既存の Ideation 成果物を点検し、欠けている必須見出し、`state.json` の不整合、相対リンク欠落、`requiredArtifacts` / `requiredMocks` の欠落を補修する。

`repair` では、要求、ユースケース、ユニット、ボルト、ドメインモデルを新規作成しない。

### `refine`

既に Ideation 段階にある Intent を、質問で煮詰める。

`refine` は、Ideation 成果物の所有範囲だけを扱う。
要求、ユースケース、ユニット、ボルト、タスク、ドメインモデルへ進めない。

開始時に、少なくとも次を読む。

- `intent.md`
- `scope.md`
- `ideation.md`
- `traceability.md`
- `decisions.md`
- `state.json`
- `mocks/*.puml`
- steering layer

読めば分かることは質問しない。
まだ人間の判断が必要な Ideation 論点を1つだけ選び、`amadeus-grilling` の質問作法に従って一問だけ質問する。

質問候補は次である。

- `scope.md` の対象、対象外、詳細度、検証深度、Inception への引き継ぎの曖昧さ。
- `ideation.md` の実現可能性、体制、初期モック、未確定事項、学習候補の不足。
- `decisions.md` の判断を採用済みにするか、未採用に戻すか。
- `traceability.md` の Ideation 要素、依存、後続への渡し方の不足。
- `mocks/*.puml` が何を確認するための初期モックか。
- `state.json.ideation.gate` を `passed`、`waiting_approval`、`not_ready`、`failed` のどれにするか。

質問した場合は、そのターンでは成果物を更新しない。
ユーザーの回答を受け取ってから、必要最小限の Ideation 成果物だけを更新する。

回答後に更新できるものは、`成果物` に列挙したファイルだけである。
回答によってドメイン、要求、ユースケース、ユニット、ボルトが必要になった場合は、Ideation の引き継ぎ事項として記録し、該当フェーズの skill に渡す。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents/<intent-id>-<slug>/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions/<decision-id>.md`
- `.amadeus/intents/<intent-id>-<slug>/mocks/*.puml`
- `.amadeus/intents/<intent-id>-<slug>/state.json`

`intent.md` は原則として既存内容を尊重する。
ただし、Ideation の回答により目的、成功条件、範囲の明らかな `未確認` を埋める必要がある場合だけ、該当箇所を最小限更新する。

## `state.json`

Ideation 完了時の `state.json` は次の形にする。

```json
{
  "intent": "<intent-id>-<slug>",
  "phase": "ideation",
  "status": "completed",
  "ideation": {
    "status": "completed",
    "requiredArtifacts": [
      "intent.md",
      "scope.md",
      "ideation.md",
      "decisions.md",
      "traceability.md"
    ],
    "requiredMocks": [
      "mocks/<mock-name>.puml"
    ],
    "gate": "passed"
  }
}
```

Ideation がまだ完了していない場合は、`status` または `ideation.status` を `in_progress`、`waiting_approval`、`needs_changes` のいずれかにする。
`gate` は `not_ready`、`waiting_approval`、`passed`、`failed` のいずれかにする。

## `scope.md`

必須見出しは次である。

- `対象`
- `対象外`
- `詳細度`
- `検証深度`
- `Inception への引き継ぎ`

`対象` と `対象外` は、後続の要求、ユースケース、ユニット、ボルトを切るための境界として書く。
分からない場合は `未確認` と書き、未確認事項へ確認すべき問いを残す。

## `ideation.md`

必須見出しは次である。

- `実現可能性`
- `体制`
- `初期モック`
- `未確定事項`
- `学習候補`

`実現可能性` は、技術、運用、セキュリティ、依存を最低候補として扱う。
根拠が弱い場合は、確定したように書かず `要確認` とする。

`初期モック` は PlantUML Salt を標準にする。
高忠実度 UI ではなく、後続の要求とユースケースの具体例として確認できる粒度にする。

## `traceability.md`

Ideation 段階の必須見出しは次である。

- `Ideation からの追跡`
- `依存関係からの追跡`

`Ideation からの追跡` の表は、次の列を持つ。

- `Ideation 要素`
- `対象`
- `定義元`
- `後続への渡し方`

`依存関係からの追跡` の表は、次の列を持つ。

- `種別`
- `対象`
- `依存`
- `理由`
- `定義元`

Initialized 段階から引き継いだ Intent と、`.amadeus/intents.md` の Intent 間依存を必ず追跡する。
判断を作る場合は、判断の依存も追跡する。

## `decisions.md`

Ideation を完了して Inception へ進める場合は、判断 `D001` を作る。

`decisions.md` の必須見出しは次である。

- `一覧`
- `依存関係`

`D001` の詳細ファイルには、次を置く。

- `背景`
- `判断`
- `理由`
- `影響`

Ideation が未完了の場合は、`D001` を採用済みにしない。

## `mocks/*.puml`

初期モックは PlantUML Salt で作る。

ファイル名は、確認したい対象が分かる `<slug>.puml` にする。
暗い雰囲気や装飾的な図ではなく、要求やユースケースの具体例として読める UI または確認カードにする。

## 検証

作成後に次を確認する。

1. `state.json` が JSON として解釈できる。
2. `state.json.ideation.requiredArtifacts` の相対パスが存在する。
3. `state.json.ideation.requiredMocks` の相対パスが存在する `.puml` ファイルである。
4. 昇格済みの `amadeus-intent-validator` が使える場合は、対象 Intent ディレクトリ名を指定して検証する。

## 禁止事項

- Intent の入れ物を新規作成しない。
- `.amadeus/intents.md` に新しい Intent 行を追加しない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- `domain/**` を作らない。
- Ideation の質問に回答が必要な場合、そのターンで成果物を作らない。
- `refine` で質問が必要な場合、そのターンで成果物を更新しない。
- `state.json` の `phase` を `ideation` 以外にしない。
- repo の開発用文書や開発用スクリプトを実行時参照として書かない。

## 次の skill

- Intent の入れ物がない場合: `amadeus-intent-init`
- Inception 成果物へ進む場合: `amadeus-intent-inception`
- 成果物の構造を検証する場合: `amadeus-intent-validator`
