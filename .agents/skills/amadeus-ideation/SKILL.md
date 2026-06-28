---
name: amadeus-ideation
description: >-
  Amadeus の既存 Intent に対して Ideation 段階のプロセスを進める公開入口。`intent.md` と `state.json` を持つ
  initialized Intent を Ideation へ進める場面、または既に Ideation 段階の Intent の scope、実現可能性、初期モック、
  traceability、decisions、state.json を点検、補修、または煮詰める場面では必ず使う。実成果物は内部 skill に委譲し、
  requirements、use-cases、units、bolts、domain model、Spec、実装は作らない。
---

# amadeus-ideation

## 目的

既存 Intent を Ideation 段階へ進める。
または、既に Ideation 段階にある Intent を煮詰める。

この skill は Ideation の公開入口である。
プロセスの順序を決め、必要な内部 skill を呼び出す。

この skill 自体は、成果物を直接作成または更新しない。
成果物の作成または更新は、必ず内部 skill に委譲する。

要求、ユースケース、ユニット、ボルト、タスク、ドメインモデル、Spec、実装は作らない。

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
- 分かっている場合は、対象、対象外、実現可能性、体制、初期モック、引き継ぎの観点。

実行モードの指定がなければ `auto` にする。

## 内部プロセス

Ideation は次の内部プロセスに分けて実行する。

1. スコープ整理: `amadeus-ideation-scope-framing`
2. 実現可能性と体制整理: `amadeus-ideation-feasibility-shaping`
3. 初期モック具体化: `amadeus-ideation-mock-framing`
4. 追跡と状態確定: `amadeus-ideation-traceability-finalization`

`scope.md` を作成または補修する場合は、必ず `amadeus-ideation-scope-framing` を使う。
`ideation.md` を作成または補修する場合は、必ず `amadeus-ideation-feasibility-shaping` を使う。
`mocks/*.puml` を作成または補修する場合は、必ず `amadeus-ideation-mock-framing` を使う。
`traceability.md`、`decisions.md`、`decisions/*.md`、`state.json` を作成または補修する場合は、必ず `amadeus-ideation-traceability-finalization` を使う。

ユーザーが特定の内部プロセスだけを指定した場合は、その内部 skill だけを使う。
ユーザーが Ideation 全体を進めるよう依頼した場合は、不足している内部プロセスを上から順に実行する。

先の内部プロセスの成果物が不足している場合は、後続の内部 skill を先に実行しない。
後続成果物を先取りして作らない。

## テンプレート

Ideation 成果物を新規作成または構造補修する内部 skill は、テンプレートを使う。

優先順位は次である。

1. `.amadeus/settings/templates/intents/ideation/`
2. `amadeus-ideation` に同梱された `templates/intents/ideation/`

`.amadeus/settings/templates/intents/ideation/` は、プロジェクト固有の上書きとして扱う。
存在しない場合は、同梱テンプレートを使う。
どちらもない場合は、作成前にテンプレート不足として止める。

ユーザーが明示しない限り、同梱テンプレートのファイル名を変更しない。
初期モックの標準ファイル名は `mocks/initial-confirmation.puml` とする。

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

質問は `amadeus-grilling` を使って行う。
複数の論点が残っている場合でも、一度に並べず一問ずつ質問する。
質問数の目安は5問にする。
目安を超えても、Ideation 成果物に必要な判断が未確定であれば質問を続ける。
目安を超えて質問を続ける場合は、追加確認が必要な理由を短く示す。
既存の `intent.md`、`state.json`、`.amadeus/intents.md`、steering layer から分かることは質問しない。

質問候補は次である。

- Ideation の対象に含めるものと含めないものは何か。
- 実現可能性で確認すべき技術、運用、セキュリティ、依存の観点は何か。
- 判断者、参照者、検証対象、後続担当は誰か。
- 初期モックは何を確認するために必要か。
- Inception へ引き継ぐ未確定事項は何か。

質問した場合は、その場で成果物を作らず、ユーザーの回答を待つ。
回答を受け取ってから、必要な内部 skill を順に使う。
回答に記録対象の判断が含まれる場合は、Ideation 成果物への反映と同じ変更で `grillings.md` と `grillings/Gxxx-*.md` を対象 Intent 配下に更新する。

### `scaffold-only`

ユーザーが明示した場合だけ使う。
質問せず、既存 `intent.md` と `state.json` から分かる範囲で Ideation 成果物を作る。

不明な項目は空欄にせず、`未確認` と書く。
未確認事項には、後で人間が答えるべき問いを残す。

作成は、内部プロセスの順番に従って内部 skill へ委譲する。

### `repair`

ユーザーが明示した場合だけ使う。
既存の Ideation 成果物を点検し、欠けている必須見出し、`state.json` の不整合、相対リンク欠落、`requiredArtifacts`、`requiredMocks` の欠落を補修する。

補修対象に応じて、対応する内部 skill だけを使う。
要求、ユースケース、ユニット、ボルト、ドメインモデルを新規作成しない。

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

質問した場合は、そのターンでは成果物を更新しない。
ユーザーの回答を受け取ってから、必要最小限の内部 skill だけを使う。
回答に記録対象の判断が含まれる場合は、Ideation 成果物への反映と同じ変更で `grillings.md` と `grillings/Gxxx-*.md` を対象 Intent 配下に更新する。

## 成果物境界

Ideation 全体で作成または更新できるものは次だけである。

- `.amadeus/intents/<intent-id>-<slug>/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions/<decision-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/mocks/*.puml`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- 記録対象の質問と回答が発生した場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings.md`
- 記録対象の質問と回答が発生した場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings/Gxxx-*.md`

`intent.md` は原則として既存内容を尊重する。
ただし、Ideation の回答により目的、成功条件、範囲の明らかな `未確認` を埋める必要がある場合だけ、該当箇所を最小限更新する。

新規作成で初期モックを1つだけ作る場合は、`mocks/initial-confirmation.puml` を作る。
初期モックの題材名に合わせて、ファイル名を言い換えない。

## 検証

内部 skill の実行後に次を確認する。

1. `state.json` が JSON として解釈できる。
2. `state.json.ideation.requiredArtifacts` の相対パスが存在する。
3. `state.json.ideation.requiredMocks` の相対パスが存在する `.puml` ファイルである。
4. 昇格済みの `amadeus-validator` が使える場合は、対象 Intent ディレクトリ名を指定して検証する。

## 禁止事項

- Intent の入れ物を新規作成しない。
- `.amadeus/intents.md` に新しい Intent 行を追加しない。
- 成果物をこの親 skill だけで直接作成または更新しない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- `domain/**` を作らない。
- Ideation の質問に回答が必要な場合、そのターンで成果物を作らない。
- `refine` で質問が必要な場合、そのターンで成果物を更新しない。
- `state.json` の `phase` を `ideation` 以外にしない。
- repo の開発用文書や開発用スクリプトを実行時参照として書かない。

## 次の skill

- Intent の入れ物がない場合: `amadeus-intent-init`
- Inception 成果物へ進む場合: `amadeus-inception`
- 成果物の構造を検証する場合: `amadeus-validator`
