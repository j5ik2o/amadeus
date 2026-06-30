---
name: amadeus-inception-units-generation
description: >-
  Amadeus Inception の内部 skill。ユースケース作成済み Intent に対して、Units Generation だけを実行し、
  units.md、units/<unit-id>-<slug>.md、units/<unit-id>-<slug>/design.md、bolts.md、bolts/<bolt-id>-<slug>.md を作成または補修する必要がある場面では必ず使う。
  traceability、decisions、domain、Spec、実装は作らない。
---

# amadeus-inception-units-generation

## 目的

Inception phase の Units Generation だけを進める。

この skill は `amadeus-inception` の内部 skill である。
Requirement、存在する場合の User Story、Use Case から Unit を切り、Unit Design Brief を作る。
その設計戦略に従って Bolt を切る。
Task は Construction の Task Generation で生成する。

## 前提

対象 Intent が Ideation、要件定義、Use Cases を完了していることを前提にする。

User Stories は、人間アクターのユーザー価値表現が必要な場合だけ完了していることを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/ideation/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/user-stories.md`、存在する場合
- `.amadeus/intents/<intent-id>-<slug>/inception/use-cases.md`
- steering layer

Use Cases の成果物が不足している場合は、`amadeus-inception-use-cases` を案内して停止する。

## テンプレート

新規作成または構造補修では、`amadeus-inception/templates/intents/inception/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/inception/` にある場合は、そちらを優先する。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents/<intent-id>-<slug>/inception/units.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/<unit-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/<unit-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts/<bolt-id>-<slug>.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/inception/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/inception/grillings/Gxxx-*.md`

既存成果物がある場合は、同じ ID と同じファイル名を尊重する。
不明な値は空欄にせず、`未確認` と書く。

## 手順

1. ユースケースから、実施価値としてまとまる Unit を切る。
2. Unit ごとにモジュールファイルと Unit Design Brief の `design.md` を作る。
3. Unit Design Brief の `Bolt 分割方針` に従って Bolt を切る。
4. Bolt ごとにモジュールファイルを作り、Construction で Task 化するための完了条件、依存、未確認事項を残す。
5. 既存コードに載せる brownfield の場合は、既存能力、統合点、ギャップを読んでから Unit Design Brief を作る。
6. Unit と Bolt のモジュールファイルに `実装対象` を作り、repository、path、branch、PR、CI を分かる範囲で記録する。
7. 実装対象の `repository` と `path` が未確定の場合は `未確認` と書き、`branch`、`PR`、`CI` が該当しない場合は `なし` と書く。
8. Unit の `コンテキスト` は `.amadeus/domain/**` の Bounded Context、または未確認として扱う。
9. 対応する Bounded Context が未確認の場合は、推測で Intent 固有の domain 成果物を作らず、未確認事項として残す。
10. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
11. 作成後に validator が使える場合は、対象 Intent を検証する。

## 禁止事項

- `requirements/**`、`user-stories/**`、`use-cases/**` を更新しない。
- `traceability.md`、`decisions/**`、`state.json` を更新しない。
- `domain/**` を作らない。
- domain model、契約、Spec、実装、CI を作らない。
- `tasks.md` や Task ID を作らない。
- Bolt 配下に `design.md` を作らない。

## 次の skill

- 追跡と状態確定へ進む場合: `amadeus-inception-traceability-finalization`
- Inception 全体を進める場合: `amadeus-inception`
