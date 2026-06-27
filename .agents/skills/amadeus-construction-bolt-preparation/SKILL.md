---
name: amadeus-construction-bolt-preparation
description: >-
  Amadeus Construction の内部 skill。Inception 完了済み Intent の対象 Bolt に対して、Bolt 実行準備だけを進める。
  対象 Bolt、Task、前提、作業順序、検証入口を確認し、必要な場合に bolts/<bolt-id>/notes.md を作成または補修する場面では必ず使う。
  実装、テスト実行、traceability、state.json 更新はしない。
---

# amadeus-construction-bolt-preparation

## 目的

Construction phase の Bolt 実行準備だけを進める。

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
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/bolt.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/tasks.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- 作業ツリーの関連コード、テスト、設定

`state.json.inception.gate` が `passed` でない場合は停止する。
対象 Bolt が確定できない場合は、`amadeus-construction` に戻して一問だけ確認する。

## テンプレート

新規作成または構造補修では、`amadeus-construction/templates/intents/construction/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/construction/` にある場合は、そちらを優先する。

## 成果物

作成または更新できる Amadeus 成果物は次だけである。

- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/notes.md`

既存成果物がある場合は、既存の見出しと記録を尊重する。
不明な値は空欄にせず、`未確認` と書く。

## 手順

1. 対象 Bolt の完了条件、対象 Unit、Task、依存を確認する。
2. `design.md` の責務境界、構成、データと契約、検証方針、Task への入力を確認する。
3. 作業ツリーから実装対象候補、既存テスト、検証コマンドを確認する。
4. `notes.md` に実行方針、対象 Task、未確認事項を記録する。
5. 実装やテスト実行は行わない。

## 禁止事項

- 実装コードやテストコードを変更しない。
- `tasks.md`、`acceptance.md`、`traceability.md`、`decisions.md`、`state.json` を更新しない。
- PR 記録を作らない。
- Spec、`.kiro/specs/**`、`openspec/**` を作らない。

## 次の skill

- 実装実行へ進む場合: `amadeus-construction-implementation-execution`
- Construction 全体を進める場合: `amadeus-construction`
