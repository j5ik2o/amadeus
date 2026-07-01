---
name: amadeus-ideation-intent-capture
description: >-
  Amadeus Ideation の内部 skill。入力テーマ、Discovery Brief、または既存情報から Intent Record を作成または補修し、
  Intent Capture & Framing だけを実行する必要がある場面では必ず使う。scope、ideation、mocks、traceability、
  decisions、Inception 成果物、Spec、実装は作らない。
---

# amadeus-ideation-intent-capture

## 目的

Ideation phase の Intent Capture & Framing だけを進める。

この skill は `amadeus-ideation` の内部 skill である。
公開入口としての `amadeus-ideation` から呼び出されることを主な用途にする。

Intent Record を作成または補修する。
Intent Record は、Intent のモジュールファイル、モジュールディレクトリ、`.amadeus/intents.md` の行、`state.json` で構成する。
Intent のモジュールファイルには、`目標プロファイル`、目的、成功条件、範囲を置く。

要求、ユースケース、ユニット、ボルト、タスク、ドメインモデル、Spec、実装は作らない。

## 前提

`.amadeus/` の steering layer が存在することを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/discoveries.md`
- 関連する `.amadeus/discoveries/<discovery-id>.md`
- steering layer
- 既存の `.amadeus/intents/<intent-id>-<slug>.md`
- 既存の `.amadeus/intents/<intent-id>-<slug>/state.json`

存在しない任意成果物は読み飛ばしてよい。
`.amadeus/` がない場合は停止し、先に `amadeus-steering` を使うよう案内する。

## 入力

- 入力テーマ。
- Discovery Brief。
- 既存 Intent の断片。
- 希望する Intent 識別子。
- 依存 Intent。

入力テーマまたは Discovery Brief から Intent 識別子を作る場合は、`YYYYMMDD-<slug>` 形式にする。
日付は作業日のローカル日付を使う。
slug は小文字英数字とハイフンだけにする。

## テンプレート

Intent Record を新規作成または構造補修する場合は、テンプレートを使う。

優先順位は次である。

1. `.amadeus/settings/templates/intents/intent-record.md` と `.amadeus/settings/templates/intents/intent-record/`
2. `amadeus-ideation-intent-capture` に同梱された `templates/intents/intent-record.md` と `templates/intents/intent-record/`

プロジェクト固有テンプレートが存在しない場合は、同梱テンプレートを使う。
どちらもない場合は、作成前にテンプレート不足として止める。

テンプレートの `<...>` は、入力テーマ、Discovery Brief、steering layer、既存情報から分かる値に置き換える。
分からない項目は空欄にせず、`未確認` と書く。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- 関連する `.amadeus/discoveries/<discovery-id>.md`

関連する Discovery Brief を更新する場合は、対象候補の状態だけを `intent_record_created` にする。
候補状態に `captured`、`intent_created`、`linked`、`initialized` は使わない。

`state.json` は次を満たす。

- `intent` は Intent ディレクトリ名と一致する。
- `phase` は `ideation` である。
- `status` は `in_progress` である。
- `ideation.intentCapture.status` は `completed` である。
- `ideation.intentCapture.createdArtifacts` は Intent Record の作成済み成果物を指す。
- `ideation.intentCapture.next` は `ideation/scope-framing` である。
- `ideation.requiredArtifacts` は空配列である。
- `ideation.requiredMocks` は空配列である。
- `ideation.gate` は `not_ready` である。

## 手順

1. steering layer と入力を読み、Intent 名、目標種別、進行プロファイル、ラベル、目的、成功条件、範囲、依存を取り出す。
2. 関連する Discovery Brief がある場合は、対象候補を特定する。
3. Intent 識別子を決める。
4. `.amadeus/intents.md` に Intent 行と依存関係行を追加または補修する。
5. Intent のモジュールファイルを作成または補修する。
6. Intent のモジュールディレクトリを作成する。
7. `state.json` を作成または補修する。
8. 関連する Discovery 候補の状態を `intent_record_created` に更新する。
9. 作成後に validator が使える場合は、対象 Intent を検証する。

既存 Intent Record の一部だけが欠けている場合は、欠けている構造だけを補修する。
既存の目標プロファイル、目的、成功条件、範囲、依存は、明らかな欠落を埋める場合だけ更新する。

## 目標プロファイル

`目標プロファイル` は、Intent の達成対象と進め方を初期整理する。

| フィールド | 値 |
|---|---|
| `goalType` | `business`、`technical`、`mixed`、`未確認` |
| `scope` | `enterprise`、`feature`、`mvp`、`poc`、`bugfix`、`refactor`、`infra`、`security-patch`、`workshop`、`未確認` |
| `labels` | 任意のラベル。複数ある場合はカンマ区切りにする。未判断の場合は `未確認` と書く。 |

`goalType` は、Intent が達成したい目標の性質を表す。
`scope` は、AI-DLC v2 の Scope に対応する進行プロファイルを表す。
`labels` は、検索、集計、補足分類だけに使い、phase や stage の制御には使わない。

## 禁止事項

- 公開入口として直接使う前提で作業を広げない。
- `state.json.phase` に `initialized` を書かない。
- `initialized` ブロックを作らない。
- Discovery 候補状態に `initialized` を書かない。
- `scope.md`、`ideation.md`、`mocks/**`、`traceability.md`、`decisions/**` を作らない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- `domain/**`、Spec、実装、CI を作らない。
- repo の開発用文書や開発用スクリプトを実行時参照として書かない。

## 次の skill

- スコープ整理へ進む場合: `amadeus-ideation-scope-framing`
- Ideation 全体を進める場合: `amadeus-ideation`
- 成果物の構造を検証する場合: `amadeus-validator`
