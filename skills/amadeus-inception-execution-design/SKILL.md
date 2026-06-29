---
name: amadeus-inception-execution-design
description: >-
  Amadeus Inception の内部 skill。相互作用整理済み Intent に対して、実施設計だけを実行し、
  units.md、units/<unit-id>-<slug>.md、units/<unit-id>-<slug>/design.md、bolts.md、bolts/<bolt-id>-<slug>.md、
  domain/subdomains.md、domain/bounded-contexts.md、domain/bounded-contexts/<bounded-context-id>-<slug>.md を作成または補修する必要がある場面では必ず使う。
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
- `.amadeus/intents/<intent-id>-<slug>.md`
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
- `.amadeus/intents/<intent-id>-<slug>/units/<unit-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/units/<unit-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/subdomains.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts/<bounded-context-id>-<slug>.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings/Gxxx-*.md`

`domain/subdomains.md` と `domain/bounded-contexts.md` は、Unit と境界参照を確認するための構造 index として作る。
境界づけられたコンテキストが確定している場合は、対応する Bounded Context のモジュールファイルを作る。
これは詳細な domain model や契約の作成ではない。

## 手順

1. ユースケースから、実施価値としてまとまる Unit を切る。
2. Unit ごとにモジュールファイルと Unit Design Brief の `design.md` を作る。
3. Unit Design Brief の `Bolt 分割方針` に従って Bolt を切る。
4. Bolt ごとにモジュールファイルを作り、Construction で Task 化するための完了条件、依存、未確認事項を残す。
5. 既存コードに載せる brownfield の場合は、既存能力、統合点、ギャップを読んでから Unit Design Brief を作る。
6. `inception.gate` を `passed` にする前提で進める場合は、少なくとも1件の境界づけられたコンテキストを確定し、Unit の `コンテキスト` から参照させる。
7. 境界づけられたコンテキストが未確認の場合は、未確認事項として残し、後続の traceability finalization で gate を `not_ready` にする。
8. モデル詳細と契約条件が未確認の場合は、対象 BC の `models.md` と `contracts.md` に未確認事項として残す。
9. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
10. 作成後に validator が使える場合は、対象 Intent を検証する。

## 禁止事項

- `requirements/**`、`user-stories/**`、`use-cases/**` を更新しない。
- `traceability.md`、`decisions/**`、`state.json` を更新しない。
- domain model、契約、Spec、実装、CI を作らない。
- `tasks.md` や Task ID を作らない。
- Bolt 配下に `design.md` を作らない。

## 次の skill

- 追跡と状態確定へ進む場合: `amadeus-inception-traceability-finalization`
- Inception 全体を進める場合: `amadeus-inception`
