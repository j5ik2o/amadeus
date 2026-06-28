---
name: amadeus-inception-execution-design
description: >-
  Amadeus Inception の内部 skill。相互作用整理済み Intent に対して、実施設計だけを実行し、
  units.md、units/<unit-id>/{unit.md,design.md}、bolts.md、bolts/<bolt-id>/bolt.md、
  domain/subdomains.md、domain/bounded-contexts.md を作成または補修する必要がある場面では必ず使う。
  traceability、decisions、Spec、実装は作らない。
---

# amadeus-inception-execution-design

## 目的

Inception phase の実施設計だけを進める。

この skill は `amadeus-inception` の内部 skill である。
要求、ユーザーストーリー、ユースケースから Unit を切り、Unit Design Brief を作る。
その設計戦略に従って Bolt を切る。
Task は Construction Design を根拠に Construction phase で生成する。

## 前提

対象 Intent が Ideation、要件定義、相互作用整理を完了していることを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/user-stories.md`
- `.amadeus/intents/<intent-id>-<slug>/use-cases.md`
- steering layer
- domain layer

相互作用整理の成果物が不足している場合は、`amadeus-inception-interaction-modeling` を案内して停止する。

## テンプレート

新規作成または構造補修では、`amadeus-inception/templates/intents/inception/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/inception/` にある場合は、そちらを優先する。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents/<intent-id>-<slug>/units.md`
- `.amadeus/intents/<intent-id>-<slug>/units/<unit-id>-<slug>/unit.md`
- `.amadeus/intents/<intent-id>-<slug>/units/<unit-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/bolt.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/subdomains.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts.md`

`domain/subdomains.md` と `domain/bounded-contexts.md` は、Unit と境界参照を確認するための構造 index として作る。
これは domain model や契約の作成ではない。

## 手順

1. ユースケースから、実施価値としてまとまる Unit を切る。
2. Unit ごとに `unit.md` と Unit Design Brief の `design.md` を作る。
3. Unit Design Brief の `Bolt 分割方針` に従って Bolt を切る。
4. Bolt ごとに `bolt.md` を作り、Construction で Task 化するための完了条件、依存、未確認事項を残す。
5. 既存コードに載せる brownfield の場合は、既存能力、統合点、ギャップを読んでから Unit Design Brief を作る。
6. 境界づけられたコンテキスト、モデル、契約が未確認の場合は、空表と未確認事項だけを残す。
7. 作成後に validator が使える場合は、対象 Intent を検証する。

## 禁止事項

- `requirements/**`、`user-stories/**`、`use-cases/**` を更新しない。
- `traceability.md`、`decisions/**`、`state.json` を更新しない。
- domain model、契約、Spec、実装、CI を作らない。
- `tasks.md` や Task ID を作らない。
- Bolt 配下に `design.md` を作らない。

## 次の skill

- 追跡と状態確定へ進む場合: `amadeus-inception-traceability-finalization`
- Inception 全体を進める場合: `amadeus-inception`
