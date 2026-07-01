---
name: amadeus-construction
description: >-
  Amadeus の Inception 完了済み Intent を Construction 段階へ進め、Bolt 実行、実装、検証、安全性確認、CI 確認、追跡、
  状態確定を進める公開入口。`state.json.phase` が `inception` で gate passed の Intent、または既に Construction 段階の
  Intent の functional-design/**、bolts/*/notes.md、test-results.md、pr.md、tasks.md、acceptance.md、traceability.md、decisions、state.json を
  点検、補修、または煮詰める場面では必ず使う。成果物や実装は直接扱わず、必ず Construction 内部 skill を呼び出す。
---

# amadeus-construction

## 目的

Inception 完了済みの Intent を Construction 段階へ進める。
または、既に Construction 段階にある Intent を煮詰める。

この skill は Construction の公開入口である。
プロセスの順序を決め、必要な内部 skill を呼び出す。

この skill 自体は、成果物作成、成果物更新、実装、テスト、PR 記録を直接行わない。
作業は必ず内部 skill に委譲する。

Construction は、Inception で定義した Unit を Functional Design で具体化し、Bolt を Task に分解してから実装、検証、証拠、追跡、状態確定へ進める phase である。
Construction では、Unit ごとの `functional-design/` を設計成果物として扱う。
Functional Design は詳細な Domain Model と Intent Contracts の管理元である。
Functional Design 承認後に、共有境界として採用する内容は Domain Map、コンテキスト間依存として採用する内容は Context Map へ反映できる。
Domain Map と Context Map は候補を扱わず、`adopted` と `retired` の現在の索引だけを扱う。
Bolt は Task、実装、検証、PR 記録、追跡へ進める実行単位であり、Bolt 側の `design.md` は作らない。
Unit Design Brief は Construction の入力であり、Construction で上書きしない。
Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は作らない。

## 前提

対象 Intent が `.amadeus/intents/<intent-id>-<slug>/` に存在し、Inception を完了していることを前提にする。

少なくとも次が存在しない場合は、作業を止めて `amadeus-inception` を案内する。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/<unit-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts/<bolt-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/decisions.md`

`state.json.phase` が `inception` または `construction` でない場合は、現在の phase と不足成果物を確認してから止める。
`state.json.phase` が `inception` で、かつ `state.json.inception.gate` が `passed` でない場合は、Construction へ進めず `amadeus-inception` の `refine` を案内する。
`state.json.phase` が `construction` の場合は、既存の Construction 成果物を読み、`auto`、`refine`、`repair` のいずれで続けるかを判定する。

## 入力

- 検証対象の作業ディレクトリ。
- 対象 Intent ディレクトリ名。
- 対象 Bolt ID または Bolt ディレクトリ名。
- Construction の進め方。
  - `auto`: 既存状態から `guided`、`refine`、`repair` を判定する。
  - `guided`: 不足論点を質問してから進める。
  - `scaffold-only`: 質問せず、分かる情報だけで実行記録を作る。
  - `refine`: 既存 Construction 成果物を質問で煮詰める。
  - `repair`: 既存 Construction 成果物の構造だけを補修する。
- 分かっている場合は、実装対象、検証入口、安全性確認、CI 確認、PR URL。

実行モードの指定がなければ `auto` にする。
対象 Bolt の指定がなければ、`bolts.md` と `state.json.construction.targetBolts` から対象候補を読む。
候補が複数あり、ユーザーの意図を成果物から確定できない場合は、一問だけ質問する。
Functional Design の対象 Unit は、`state.json.construction.functionalDesign.targetUnits`、`state.json.construction.targetUnits`、`state.json.construction.targetBolts`、ユーザー指定の順に解決する。
対象 Unit が解決できない場合は、`state.json.construction.functionalDesign.units[]` に `requirement: unresolved`、`status: blocked`、`blockedReason: target_unit_unresolved` を記録する。

## 内部プロセス

`amadeus-construction` は公開入口である。

作成、補修、実装、検証を実行する場合は、この skill だけで作業しない。

Construction では、内部 skill の前に Functional Design の必要性を Unit ごとに判定する。

Functional Design が必要な Unit は `state.json.construction.functionalDesign.units[]` に `requirement: required` として記録する。
Functional Design が不要な Unit は `requirement: not_required`、`status: skipped`、`skipReason: unit_not_in_construction_scope` として記録する。
既に `status: passed` の Unit を再実行しない場合は、`passed` を維持し、`skipped` に書き換えない。
再実行する場合だけ、対象 Unit の `runMode` を `rerun` にする。
`frontendSurface: absent` は Unit 全体の skip を意味しない。
この場合は `frontend-components.md` の条件付き requirement だけを不要にする。
判定不能な Unit は暗黙に skip せず、`status: blocked` と `blockedReason` で理由を記録する。
Functional Design の gate 結果は `status` から導出し、`state.json` には `gate` を保存しない。

Functional Design の判定後は、次の順番で内部 skill を使う。

| 内部 skill | プロセス | 主な結果 |
|---|---|---|
| `amadeus-construction-functional-design` | Functional Design | Unit ごとの `functional-design/**`、`state.json.construction.functionalDesign` |
| `amadeus-construction-bolt-preparation` | Bolt 実行準備 | 対象 Bolt、前提、作業順序、検証入口の確認、`tasks.md`、`notes.md`、Task Generation Gate |
| `amadeus-construction-implementation-execution` | 実装実行 | Task Generation 済み Task の実装、実装判断、`notes.md` |
| `amadeus-construction-verification-hardening` | 検証と堅牢化 | テスト実装、テスト実行、安全性確認、CI 確認、`test-results.md` |
| `amadeus-construction-traceability-finalization` | 追跡と状態確定 | `tasks.md`、`acceptance.md`、`traceability.md`、`decisions.md`、`state.json`、任意の `pr.md` |

Construction 全体を進める場合は、5つの内部 skill を上から順に使う。
各内部 skill の実行後に対象 Intent の成果物と作業ツリーを読み直し、次の内部 skill に渡す前提を更新する。

ユーザーが特定の内部プロセスだけを指定した場合は、そのプロセスに対応する内部 skill だけを使う。
指定がない場合は、前提成果物を読んだうえで、不足している内部 skill から順に使う。

後続プロセスの成果物を、前段プロセスの中で先回りして作らない。

## テンプレート

Construction 成果物を新規作成または構造補修する内部 skill は、テンプレートを使う。

優先順位は次である。

1. `.amadeus/settings/templates/intents/construction/`
2. この skill に同梱された `templates/intents/construction/`

`.amadeus/settings/templates/intents/construction/` は、プロジェクト固有の上書きとして扱う。
存在しない場合は、`templates/intents/construction/` の標準テンプレートを使う。
どちらもない場合は、作成前にテンプレート不足として止める。

## 実行モード

### `auto`

既定モード。
対象 Intent と Bolt の状態を読み、実行モードを自動判定する。

判定では、少なくとも次を読む。

- `.amadeus/intents.md`
- `Intent のモジュールファイル`
- `state.json`
- `requirements.md`
- `acceptance.md`
- `units.md`
- `bolts.md`
- `bolts/*.md`
- `units/*/design.md`
- 既存の `bolts/*/notes.md`
- 既存の `*/functional-design/**`
- 既存の `bolts/*/tasks.md`
- 既存の `bolts/*/test-results.md`
- 既存の `bolts/*/pr.md`
- `traceability.md`
- `decisions.md`
- steering layer

判定規則は次である。

| 状態 | 自動選択 | 理由 |
|---|---|---|
| Inception 必須成果物がない | 停止 | Construction の前提が不足しているため |
| `state.json.phase` が `inception` で gate が `passed`、Construction 成果物が不足している | `guided` | Construction へ進める前段だから |
| `state.json.phase` が `construction` で必須成果物が存在し、内容を煮詰める依頼である | `refine` | 既存 Construction を深める段階だから |
| `state.json.phase` が `construction` で必須見出し、相対リンク、`requiredArtifacts`、`requiredBoltArtifacts` だけが壊れている | `repair` | 構造補修が目的だから |
| `state.json.phase` が `construction` だが、構造補修と内容判断の両方が必要である | まず `repair` | 壊れた構造の上で内容判断をしないため |
| ユーザーが `scaffold-only` を明示した | `scaffold-only` | 質問しない記録作成を明示しているため |

### `guided`

作業前に、Construction に必要な不足だけを質問する。

質問は `amadeus-grilling` を使って行う。
複数の論点が残っている場合でも、一度に並べず一問ずつ質問する。
質問数の目安は4問にする。
目安を超えても、Construction に必要な判断が未確定であれば質問を続ける。
目安を超えて質問を続ける場合は、追加確認が必要な理由を短く示す。
既存の Inception 成果物、Bolt、Functional Design、Task、作業ツリー、テスト入口から分かることは質問しない。

質問した場合は、その場で成果物作成、実装、テスト実行をせず、ユーザーの回答を待つ。
回答に記録対象の判断が含まれる場合は、Construction 成果物への反映と同じ変更で `construction/grillings.md` と `construction/grillings/Gxxx-*.md` を対象 Intent 配下に更新する。
この場合、親 skill は記録対象の質問、確認理由、推奨回答、推奨理由、ユーザー回答、確定判断、反映先を、委譲先の内部 skill へ明示的に渡す。
Grilling Decision Trail の実ファイル更新は、該当する Construction 成果物を更新する内部 skill が同じ変更で行う。

### `scaffold-only`

ユーザーが明示した場合だけ使う。
質問せず、既存 Inception 成果物と作業ツリーから分かる範囲で Construction 記録を作る。

不明な項目は空欄にせず、`未確認` と書く。
未確認事項には、後で人間が答えるべき問いを残す。
実装やテストを実行していない場合は、実行済みのように書かない。

### `repair`

ユーザーが明示した場合だけ使う。
既存の Construction 成果物を点検し、欠けている必須見出し、`state.json` の不整合、相対リンク欠落、証拠欄の欠落だけを補修する。
既存の `construction/grillings.md` または `construction/grillings/Gxxx-*.md` が存在し、構造だけが壊れている場合は、Grilling Decision Trail の索引、session ファイル名、必須見出し、表列、相対リンク、状態、反映先、判断 ID、置き換え先、質問記録の参照だけを補修してよい。

`repair` では、新しい実装、テスト、PR 記録を根拠なく追加しない。

### `refine`

既に Construction 段階にある Intent を、質問で煮詰める。

開始時に、対象 Bolt の成果物と作業ツリーを読む。
読めば分かることは質問しない。
まだ人間の判断が必要な Construction 論点を1つだけ選び、`amadeus-grilling` の質問作法に従って一問だけ質問する。

質問した場合は、そのターンでは成果物更新、実装、テスト実行をしない。
ユーザーの回答を受け取ってから、必要最小限の内部 skill だけを使う。
回答に記録対象の判断が含まれる場合は、Construction 成果物への反映と同じ変更で `construction/grillings.md` と `construction/grillings/Gxxx-*.md` を対象 Intent 配下に更新する。
この場合、親 skill は記録対象の質問、確認理由、推奨回答、推奨理由、ユーザー回答、確定判断、反映先を、委譲先の内部 skill へ明示的に渡す。
Grilling Decision Trail の実ファイル更新は、該当する Construction 成果物を更新する内部 skill が同じ変更で行う。

## 成果物境界

Construction 全体で作成または更新できる Amadeus 成果物は次だけである。

- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/notes.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/test-results.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/pr.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/tasks.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/<unit-name>/functional-design/business-logic-model.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/<unit-name>/functional-design/business-rules.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/<unit-name>/functional-design/domain-entities.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/<unit-name>/functional-design/frontend-components.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/decisions/<decision-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- Functional Design 承認後に共有境界として採用する内容がある場合だけ、`.amadeus/domain-map.md`
- Functional Design 承認後にコンテキスト間依存として採用する内容がある場合だけ、`.amadeus/context-map.md`
- 記録対象の質問と回答が発生した場合だけ、`.amadeus/intents/<intent-id>-<slug>/construction/grillings.md`
- 記録対象の質問と回答が発生した場合だけ、`.amadeus/intents/<intent-id>-<slug>/construction/grillings/Gxxx-*.md`

実装コードやテストコードは、対象 Bolt の Task と作業ツリーから必要最小限だけ変更する。
Task に対応しない speculative な実装はしない。
Domain Map と Context Map へ反映する内容は、Functional Design、Construction の判断、追跡のいずれかを根拠にした `adopted` または `retired` の現在の索引だけに限定する。

`pr.md` は PR URL が存在する場合だけ作る。
PR を言及する場合は、必ず URL を記録する。

## 検証

内部 skill の実行後に次を確認する。

1. `state.json` が JSON として解釈できる。
2. `state.json.construction.requiredArtifacts` の相対パスが存在する。
3. `state.json.construction.requiredBoltArtifacts` の相対パスが存在する。
4. `state.json.construction.functionalDesign` が Unit ごとの必要性、状態、UI 構成、対象解決元、実行モードを持つ。
5. 対象 Unit の `functional-design/**` に Catalog 由来の必須見出しと表構造がある。
6. 対象 Bolt の `tasks.md` に作業、要求、ユースケース、依存、設計根拠、証拠がある。
7. `state.json.construction.bolts[]` が対象 Bolt の `taskGeneration` と evidence を持つ。
8. `traceability.md` に `Task Generation からの追跡` があり、Task Generation から Task まで追跡できる。
9. 完了済み Construction では `traceability.md` に `Construction からの追跡` があり、`ボルト`、`タスク`、`証拠`、`状態` の列で実装と検証の証拠まで追跡できる。
10. `Task Generation からの追跡` だけでは完了済み Construction の traceability 条件を満たさない。
11. `test-results.md` が存在する段階では、実行した検証と失敗時の扱いが記録されている。
12. 昇格済みの `amadeus-validator` が使える場合は、対象 Intent ディレクトリ名を指定して検証する。

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

- 成果物や実装をこの親 skill だけで直接作成または更新しない。
- Inception 成果物の要求、ユースケース、Unit、Bolt、Design を都合よく書き換えない。
- Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物を作らない。
- PR URL がないのに `pr.md` を作らない。
- テスト未実行なのに成功証拠として記録しない。
- `state.json` の `phase` を `construction` 以外にしない。
- Bolt 側の設計ファイルを作らない。
- 旧 Bolt gate フィールドを state に残さない。
- repo の開発用文書や開発用スクリプトを実行時参照として書かない。

## 次の skill

- Inception 成果物へ戻る場合: `amadeus-inception`
- Construction 成果物の構造を検証する場合: `amadeus-validator`
