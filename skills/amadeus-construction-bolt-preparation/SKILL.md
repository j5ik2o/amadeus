---
name: amadeus-construction-bolt-preparation
description: >-
  Amadeus Construction の内部 skill。Inception 完了済み Intent の対象 Bolt に対して、Bolt 実行準備だけを進める。
  対象 Bolt、前提、作業順序、検証入口を確認し、tasks.md、notes.md、Task Generation Gate、
  traceability の Task Generation 追跡を作成または補修する場面では必ず使う。実装とテスト実行はしない。
---

# amadeus-construction-bolt-preparation

## 目的

Construction phase の Bolt 実行準備だけを進める。
対象 Bolt のモジュールファイル、対象 Unit の Functional Design、Unit Design Brief を根拠に `tasks.md` を生成する。
Task Generation Gate を人間承認待ちまたは承認済みの状態まで到達させる。

この skill は `amadeus-construction` の内部 skill である。
公開入口としての `amadeus-construction` から呼び出されることを主な用途にする。

## 前提

対象 Intent が Inception を完了していることを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/<unit-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts/<bolt-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/<unit-id>-<slug>/functional-design/**`
- `.amadeus/intents/<intent-id>-<slug>/construction/traceability.md`
- 作業ツリーの関連コード、テスト、設定

`state.json.inception.gate` が `passed` でない場合は停止する。
対象 Unit の Functional Design が `passed` または `ready_for_approval` でない場合は停止する。
対象 Bolt が確定できない場合は、`amadeus-construction` に戻して一問だけ確認する。

## テンプレート

新規作成または構造補修では、`amadeus-construction/templates/intents/construction/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/construction/` にある場合は、そちらを優先する。

## 成果物

作成または更新できる Amadeus 成果物は次だけである。

- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/tasks.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/notes.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/construction/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/construction/grillings/Gxxx-*.md`

既存成果物がある場合は、既存の見出しと記録を尊重する。
不明な値は空欄にせず、`未確認` と書く。

## 手順

1. 対象 Bolt の完了条件、対象 Unit、依存、未確認事項を確認する。
2. 対象 Bolt が参照する Unit Design Brief の設計戦略、責務境界、検証観点、Construction への引き継ぎを確認する。
3. 対象 Unit と対象 Bolt の `実装対象` を確認し、repository、path、branch、PR、CI の未確認事項を把握する。
4. 対象 Unit の Functional Design が Task 生成の入力として使える状態か確認する。
5. 作業ツリーから実装対象候補、既存テスト、検証コマンドを確認する。
6. `Task Generation Gate` を通してから、Functional Design、Unit Design Brief、対象 Bolt のモジュールファイルを根拠に `tasks.md` を作る。
7. `tasks.md` には Task ID、作業、要求、ユースケース、依存、設計根拠、証拠を記録する。
8. `notes.md` に実行方針、対象 Task、作業順序、未確認事項を記録する。
9. `traceability.md` に `Task Generation からの追跡` を追加または更新し、`Evidence | Task | 実装 | 検証 | PR | 状態` の表を作る。`ユースケース` が `なし` の Task がある場合は `理由` 列を追加する。
10. `state.json.construction.requiredBoltArtifacts` に対象 Bolt の `tasks.md` と `notes.md` を含める。
11. `state.json.construction.bolts[]` に対象 Bolt の `taskGeneration` を作り、実装へ渡せる粒度なら `status` を `ready_for_approval` にする。
12. 人間承認済みの場合だけ `status` を `passed` にし、`approval` evidence を追加する。
13. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
14. 実装やテスト実行は行わない。

## `tasks.md`

`tasks.md` は、同じ Bolt のモジュールファイル、対象 Unit の Unit Design Brief、対象 Unit の Functional Design を入力にして作る。

必須形式は次である。

```md
- [ ] T001: タスク名
  - 作業:
    - 具体的な作業を書く。
  - 要求: R001
  - ユースケース: UC001
  - 依存: なし
  - 設計根拠: ../../<unit-id>-<slug>/functional-design/business-logic-model.md
  - 証拠: 未登録
```

Task ID は Bolt 内で `Tnnn` の3桁連番にする。
`要求` は Requirement ID にする。
`ユースケース` は Use Case ID または `なし` にする。
`なし` は、相互作用がない内部作業の場合だけ使う。
`設計根拠` は、対象 Unit の Functional Design または Unit Design Brief 内で Task 化の根拠になる見出しまたは判断を指す。
別 Bolt の Task を参照する場合は、`B001/T002` のように `<bolt-id>/<task-id>` で書く。
`作業` は省略しない。
Task の依存関係は `依存` に書く。
同じ Bolt 内の Task に依存する場合は `T001` と書く。
別 Bolt の Task に依存する場合は `B001/T002` と書く。

## Task Generation Gate

`tasks.md` を書く前に、Task 案を作業メモとして保持し、まだファイルへ書き込まない。
同じ Bolt のモジュールファイル、対象 Unit の Unit Design Brief、対象 Unit の Functional Design、対象要求、Task が参照するユースケースを読み、次を確認する。

- 対象 Bolt の完了条件が、少なくとも1つの Task に対応している。
- 対象 Bolt の `実装対象` が、Task の実施範囲を判断できる粒度で読める。
- Functional Design の業務ロジック、業務ルール、Intent Contracts、Domain Entity、必要な UI 構成が Task に反映されている。
- 各 Task に、具体的な `作業` がある。
- 各 Task に、要求 ID がある。
- ユースケースは Use Case ID または `なし` にする。
- `なし` は、相互作用がない内部作業の場合だけ使う。
- ユースケースを `なし` にする場合は、`traceability.md` の `Task Generation からの追跡` に `理由` 列を追加し、同じ追跡行に Use Case を参照しない理由を残す。
- 各 Task に、`依存` がある。依存がなければ `なし` と書く。
- 各 Task に、観測できる完了状態または証拠候補がある。
- 暗黙の前提、準備作業、外部依存、順序制約が隠れていない。
- Task が複数 Bolt の責務をまたぐ場合は、統合 Task として理由を明示する。

問題が Task 案の局所修正で解ける場合は、最大2回まで修正して Review Gate を再実行する。
要求、ユースケース、Unit Design Brief、Bolt、Functional Design の不足や矛盾が原因の場合は、`tasks.md` を書かずに止める。
その場合は、不足している成果物と該当見出しを示し、上流成果物または Functional Design の refine に戻す。

## 禁止事項

- 実装コードやテストコードを変更しない。
- `acceptance.md`、`decisions.md` を更新しない。
- Bolt 側の `design.md` を作らない。
- 旧 Bolt gate フィールドを state に残さない。
- PR 記録を作らない。
- Spec、`.kiro/specs/**`、`openspec/**` を作らない。

## 次の skill

- 実装実行へ進む場合: `amadeus-construction-implementation-execution`
- Construction 全体を進める場合: `amadeus-construction`
