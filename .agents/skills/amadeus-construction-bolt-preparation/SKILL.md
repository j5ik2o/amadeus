---
name: amadeus-construction-bolt-preparation
description: >-
  Amadeus Construction の内部 skill。Inception 完了済み Intent の対象 Bolt に対して、Bolt 実行準備だけを進める。
  対象 Bolt、前提、作業順序、検証入口を確認し、bolts/<bolt-id>/design.md、tasks.md、notes.md、Design Gate ready、
  traceability の Construction Design 追跡を作成または補修する場面では必ず使う。実装とテスト実行はしない。
---

# amadeus-construction-bolt-preparation

## 目的

Construction phase の Bolt 実行準備だけを進める。
対象 Bolt の Domain Design、Logical Design、実装設計、検証設計を `design.md` に確定する。
その Construction Design を根拠に `tasks.md` を生成し、Implementation Execution が進める `ready` 状態まで到達させる。

この skill は `amadeus-construction` の内部 skill である。
公開入口としての `amadeus-construction` から呼び出されることを主な用途にする。

## 前提

対象 Intent が Inception を完了していることを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/units.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/units/<unit-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/bolt.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- 作業ツリーの関連コード、テスト、設定

`state.json.inception.gate` が `passed` でない場合は停止する。
対象 Bolt が確定できない場合は、`amadeus-construction` に戻して一問だけ確認する。

## テンプレート

新規作成または構造補修では、`amadeus-construction/templates/intents/construction/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/construction/` にある場合は、そちらを優先する。

## 成果物

作成または更新できる Amadeus 成果物は次だけである。

- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/tasks.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/notes.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`

既存成果物がある場合は、既存の見出しと記録を尊重する。
不明な値は空欄にせず、`未確認` と書く。

## 手順

1. 対象 Bolt の完了条件、対象 Unit、依存、未確認事項を確認する。
2. 対象 Bolt が参照する Unit Design Brief の設計戦略、責務境界、検証観点、Construction への引き継ぎを確認する。
3. 作業ツリーから実装対象候補、既存テスト、検証コマンドを確認する。
4. `design.md` に `概要`、`Domain Design`、`Logical Design`、`実装設計`、`検証設計`、`設計変更記録` を作る。
5. 既存コード調査の詳細は `notes.md` に残し、設計判断に効く制約の要約だけを `design.md` に書く。
6. `Task 生成 Review Gate` を通してから、`design.md` を根拠に `tasks.md` を作る。
7. `tasks.md` には Task ID、作業、要求、ユースケース、依存、設計根拠、証拠を記録する。
8. `notes.md` に実行方針、対象 Task、作業順序、未確認事項を記録する。
9. `traceability.md` に `Construction Design からの追跡` を追加または更新し、`Construction Design | Task | 実装 | 検証 | PR | 状態` の表を作る。
10. `state.json.construction.requiredBoltArtifacts` に対象 Bolt の `design.md`、`tasks.md`、`notes.md` を含める。
11. `state.json.construction.bolts[]` に対象 Bolt の `designGate` と `taskPlan` を作り、実装へ進める粒度なら `designGate.status` を `ready`、`taskPlan.status` を `generated` にする。
12. 実装やテスト実行は行わない。

## `tasks.md`

`tasks.md` は、同じ Bolt の `bolt.md`、対象 Unit の Unit Design Brief、Construction Design の `design.md` を入力にして作る。

必須形式は次である。

```md
- [ ] T001: タスク名
  - 作業:
    - 具体的な作業を書く。
  - 要求: R001
  - ユースケース: UC001
  - 依存: なし
  - 設計根拠: design.md#実装設計
  - 証拠: 未登録
```

Task ID は Bolt 内で `Tnnn` の3桁連番にする。
`設計根拠` は、同じ Bolt の `design.md` 内で Task 化の根拠になる見出しまたは判断を指す。
別 Bolt の Task を参照する場合は、`B001/T002` のように `<bolt-id>/<task-id>` で書く。
`作業` は省略しない。
Task の依存関係は `依存` に書く。
同じ Bolt 内の Task に依存する場合は `T001` と書く。
別 Bolt の Task に依存する場合は `B001/T002` と書く。

## Task 生成 Review Gate

`tasks.md` を書く前に、Task 案を作業メモとして保持し、まだファイルへ書き込まない。
同じ Bolt の `bolt.md`、対象 Unit の `design.md`、Construction Design の `design.md`、対象要求、対象ユースケースを読み、次を確認する。

- 対象 Bolt の完了条件が、少なくとも1つの Task に対応している。
- Construction Design の Domain Design、Logical Design、実装設計、検証設計が Task に反映されている。
- 各 Task に、具体的な `作業` がある。
- 各 Task に、要求 ID とユースケース ID がある。ユースケースを参照しない場合は、理由を `traceability.md` に残す。
- 各 Task に、`依存` がある。依存がなければ `なし` と書く。
- 各 Task に、観測できる完了状態または証拠候補がある。
- 暗黙の前提、準備作業、外部依存、順序制約が隠れていない。
- Task が複数 Bolt の責務をまたぐ場合は、統合 Task として理由を明示する。

問題が Task 案の局所修正で解ける場合は、最大2回まで修正して Review Gate を再実行する。
要求、ユースケース、Unit Design Brief、Bolt、Construction Design の不足や矛盾が原因の場合は、`tasks.md` を書かずに止める。
その場合は、不足している成果物と該当見出しを示し、上流成果物または Construction Design の refine に戻す。

## 禁止事項

- 実装コードやテストコードを変更しない。
- `acceptance.md`、`decisions.md` を更新しない。
- Design Gate の evidence は対象 Bolt の `design.md` 以外にしない。
- PR 記録を作らない。
- Spec、`.kiro/specs/**`、`openspec/**` を作らない。

## 次の skill

- 実装実行へ進む場合: `amadeus-construction-implementation-execution`
- Construction 全体を進める場合: `amadeus-construction`
