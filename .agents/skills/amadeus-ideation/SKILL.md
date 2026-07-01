---
name: amadeus-ideation
description: >-
  Amadeus の Ideation 段階を進める公開入口。入力テーマ、Discovery Brief、または既存 Intent から Intent Record を作る場面、
  既に Ideation 段階の Intent の scope、実現可能性、初期モック、traceability、decisions、state.json を点検、補修、
  または煮詰める場面では必ず使う。実成果物は内部 skill に委譲し、requirements、use-cases、units、bolts、
  domain model、Spec、実装は作らない。
---

# amadeus-ideation

## 目的

入力テーマ、Discovery Brief、または既存 Intent を Ideation 段階へ進める。
または、既に Ideation 段階にある Intent を煮詰める。

この skill は Ideation の公開入口である。
プロセスの順序を決め、必要な内部 skill を呼び出す。

この skill 自体は、成果物を直接作成または更新しない。
成果物の作成または更新は、必ず内部 skill に委譲する。

要求、ユースケース、ユニット、ボルト、タスク、ドメインモデル、Spec、実装は作らない。

## 前提

`.amadeus/` の steering layer が存在することを前提にする。

Intent Record が存在しない場合でも停止しない。
入力テーマまたは Discovery Brief から、内部 skill `amadeus-ideation-intent-capture` で最小の Intent Record を作る。

Intent Record は次で構成する。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`

Intent のモジュールファイルには、`目標プロファイル`、目的、成功条件、範囲を置く。
`目標プロファイル` には `goalType`、`scope`、`labels` を置く。

Intent Capture & Framing 後の `state.json.phase` は `ideation` にする。
`state.json.phase` に `initialized` は使わない。
通常実行では、Intent Record 作成だけで止めず、同じ `amadeus-ideation` 実行の中で Traceability Finalization まで進める。

## 入力

- 検証対象の作業ディレクトリ。
- 入力テーマ、Discovery Brief、または対象 Intent ディレクトリ名。
- Ideation の進め方。
  - `auto`: 既存状態から `guided`、`refine`、`repair` を判定する。
  - `guided`: 質問してから作る。
  - `scaffold-only`: 質問せず、分かる情報だけで Intent Record から Ideation 完了成果物まで作る。
  - `refine`: 既存 Ideation 成果物を質問で煮詰める。
  - `repair`: 既存 Ideation 成果物の構造だけを補修する。
- 分かっている場合は、目標種別、進行プロファイル、ラベル、対象境界、実行スコープ、成果物深度、検証戦略、実現可能性、体制、初期モック、引き継ぎの観点。

実行モードの指定がなければ `auto` にする。

## 内部プロセス

Ideation は次の内部プロセスに分けて実行する。

1. Intent Capture & Framing: `amadeus-ideation-intent-capture`
2. スコープ整理: `amadeus-ideation-scope-framing`
3. 実現可能性と体制整理: `amadeus-ideation-feasibility-shaping`
4. 初期モック具体化: `amadeus-ideation-mock-framing`
5. 追跡と状態確定: `amadeus-ideation-traceability-finalization`

Intent Record を作成または補修する場合は、必ず `amadeus-ideation-intent-capture` を使う。
`scope.md` を作成または補修する場合は、必ず `amadeus-ideation-scope-framing` を使う。
`ideation.md` を作成または補修する場合は、必ず `amadeus-ideation-feasibility-shaping` を使う。
`mocks/*.puml` を作成または補修する場合は、必ず `amadeus-ideation-mock-framing` を使う。
`traceability.md`、`decisions.md`、`decisions/*.md`、`state.json` を作成または補修する場合は、必ず `amadeus-ideation-traceability-finalization` を使う。

ユーザーが特定の内部プロセスだけを指定した場合は、その内部 skill だけを使う。
ユーザーが Ideation 全体を進めるよう依頼した場合は、不足している内部プロセスを上から順に実行する。
Intent Record がない場合でも、Intent Capture & Framing だけで停止しない。
続けて Scope Framing、Feasibility Shaping、Mock Framing、Traceability Finalization を同じ実行で進める。

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
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- 既存の `scope.md`
- 既存の `ideation.md`
- 既存の `traceability.md`
- 既存の `decisions.md`
- 既存の `mocks/*.puml`
- 既存の `inception/**`
- 既存の `construction/**`

判定規則は次である。

| 状態 | 自動選択 | 理由 |
|---|---|---|
| Intent Record がないが、入力テーマまたは Discovery Brief があり、質問不要で進められる | `scaffold-only` | Intent Capture & Framing から Ideation 完了まで一続きで作れるため |
| `.amadeus/intents.md` の行、`Intent のモジュールファイル`、`state.json` のいずれかだけが欠けている | `repair` | Intent Record の構造補修が必要だから |
| `state.json.phase` が `initialized` である | 停止 | 旧 phase は受け入れないため |
| `state.json.phase` が `ideation` で `scope.md` 以降が未作成だが、`inception/**` または `construction/**` が存在する | 停止 | 後続 stage 成果物があり、Ideation の継続として安全に扱えないため |
| `state.json.phase` が `ideation` で `ideation.intentCapture.status` が `completed` だが、`scope.md` 以降、`inception/**`、`construction/**` が未作成であり、質問不要で進められる | `scaffold-only` | 中断した Ideation を同じ実行契約で完了まで進めるため |
| `state.json.phase` が `ideation` で `ideation.intentCapture.status` が `completed` だが、`scope.md` 以降、`inception/**`、`construction/**` が未作成であり、Ideation 判断が不足している | `guided` | Intent Record は保持し、不足判断だけを確認して後続成果物を作るため |
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
既存の `Intent のモジュールファイル`、`state.json`、`.amadeus/intents.md`、steering layer から分かることは質問しない。

質問候補は次である。

- Ideation の対象に含めるものと含めないものは何か。
- 実現可能性で確認すべき技術、運用、セキュリティ、依存の観点は何か。
- 判断者、参照者、検証対象、後続担当は誰か。
- 初期モックは何を確認するために必要か。
- Inception へ引き継ぐ未確定事項は何か。

質問した場合は、その場で成果物を作らず、ユーザーの回答を待つ。
回答を受け取ってから、必要な内部 skill を順に使う。
回答に記録対象の判断が含まれる場合は、Ideation 成果物への反映と同じ変更で `ideation/grillings.md` と `ideation/grillings/Gxxx-*.md` を対象 Intent 配下に更新する。
この場合、親 skill は記録対象の質問、確認理由、推奨回答、推奨理由、ユーザー回答、確定判断、反映先を、委譲先の内部 skill へ明示的に渡す。
Grilling Decision Trail の実ファイル更新は、該当する Ideation 成果物を更新する内部 skill が同じ変更で行う。

### `scaffold-only`

ユーザーが明示した場合、または Intent Record がなく入力テーマか Discovery Brief があり、質問不要で進められる場合だけ使う。
質問せず、分かる範囲で Intent Record と Ideation 完了成果物を作る。
Intent Record 作成だけで停止しない。

不明な項目は空欄にせず、`未確認` と書く。
未確認事項には、後で人間が答えるべき問いを残す。

作成は、内部プロセスの順番に従って内部 skill へ委譲し、Traceability Finalization まで進める。

### `repair`

ユーザーが明示した場合だけ使う。
既存の Ideation 成果物を点検し、欠けている必須見出し、`state.json` の不整合、相対リンク欠落、`requiredArtifacts`、`requiredMocks` の欠落を補修する。
既存の `ideation/grillings.md` または `ideation/grillings/Gxxx-*.md` が存在し、構造だけが壊れている場合は、Grilling Decision Trail の索引、session ファイル名、必須見出し、表列、相対リンク、状態、反映先、判断 ID、置き換え先、質問記録の参照だけを補修してよい。

補修対象に応じて、対応する内部 skill だけを使う。
要求、ユースケース、ユニット、ボルト、ドメインモデルを新規作成しない。

### `refine`

既に Ideation 段階にある Intent を、質問で煮詰める。

`refine` は、Ideation 成果物の所有範囲だけを扱う。
要求、ユースケース、ユニット、ボルト、タスク、ドメインモデルへ進めない。

開始時に、少なくとも次を読む。

- `Intent のモジュールファイル`
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
回答に記録対象の判断が含まれる場合は、Ideation 成果物への反映と同じ変更で `ideation/grillings.md` と `ideation/grillings/Gxxx-*.md` を対象 Intent 配下に更新する。
この場合、親 skill は記録対象の質問、確認理由、推奨回答、推奨理由、ユーザー回答、確定判断、反映先を、委譲先の内部 skill へ明示的に渡す。
Grilling Decision Trail の実ファイル更新は、該当する Ideation 成果物を更新する内部 skill が同じ変更で行う。

## 成果物境界

Ideation 全体で作成または更新できるものは次だけである。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/decisions/<decision-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/mocks/*.puml`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- 記録対象の質問と回答が発生した場合だけ、`.amadeus/intents/<intent-id>-<slug>/ideation/grillings.md`
- 記録対象の質問と回答が発生した場合だけ、`.amadeus/intents/<intent-id>-<slug>/ideation/grillings/Gxxx-*.md`

`Intent のモジュールファイル` は原則として既存内容を尊重する。
ただし、Ideation の回答により目的、成功条件、範囲の明らかな `未確認` を埋める必要がある場合だけ、該当箇所を最小限更新する。

新規作成で初期モックを1つだけ作る場合は、`mocks/initial-confirmation.puml` を作る。
初期モックの題材名に合わせて、ファイル名を言い換えない。

## 検証

内部 skill の実行後に次を確認する。

1. `state.json` が JSON として解釈できる。
2. `state.json.phase` が `ideation` である。
3. `state.json.ideation.requiredArtifacts` の相対パスが存在する。
4. `state.json.ideation.requiredMocks` の相対パスが存在する `.puml` ファイルである。
5. 昇格済みの `amadeus-validator` が使える場合は、対象 Intent ディレクトリ名を指定して検証する。

## 実行時問題報告

skill 実行中に問題や懸念を見つけた場合は、現在の Intent 対象、後続 Issue 候補、報告不要のいずれかに分類する。

現在の Intent 対象に含めるのは、その問題や懸念が対象境界、要求、Use Case、Unit、Bolt、Task、Functional Design のいずれかへ直接追跡でき、現在の成功条件を満たすために必要な場合だけである。

後続 Issue 候補にするのは、現在の Intent の成功条件には不要だが、Amadeus の skill、template、validator、eval、example、docs、運用に影響する場合である。
この場合は現在の Intent 成果物へ混ぜず、作業報告で Issue 候補として提示する。
GitHub Issue を作成するのは、人間が Issue 化を承認した場合だけである。

報告不要にするのは、軽い感想、一時的な作業メモ、すでに解消した局所的な気づき、現在の判断に影響しない観察である。

報告する場合は、少なくとも次を含める。

- 問題または懸念の要約。
- 発見した skill 名。
- 対象 Intent、phase、stage、Unit、Bolt。
  分からない項目は `未確認` と書く。
- 影響範囲。
- 推奨分類として、現在の Intent 対象、後続 Issue 候補、報告不要のいずれか。
- 根拠となる成果物 path、PR URL、Issue URL、検証結果。
- validator または evaluator で検出すべきか、人間判断だけで扱うべきか。

報告内容に秘密情報や不要な個人情報を含めない。
validator の `pass` は、実行時に参照できる最低限の構造条件を満たすという意味であり、内容承認として扱わない。

## 禁止事項

- 成果物をこの親 skill だけで直接作成または更新しない。
- Intent Record の作成または補修を `amadeus-ideation-intent-capture` 以外で行わない。
- `state.json.phase` に `initialized` を書かない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- `domain/**` を作らない。
- Ideation の質問に回答が必要な場合、そのターンで成果物を作らない。
- `refine` で質問が必要な場合、そのターンで成果物を更新しない。
- repo の開発用文書や開発用スクリプトを実行時参照として書かない。

## 次の skill

- Intent Record を作る場合: `amadeus-ideation-intent-capture`
- Inception 成果物へ進む場合: `amadeus-inception`
- 成果物の構造を検証する場合: `amadeus-validator`
