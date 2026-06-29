---
name: amadeus-inception-traceability-finalization
description: >-
  Amadeus Inception の内部 skill。実施設計済み Intent に対して、追跡と状態確定だけを実行し、
  traceability.md、decisions.md、decisions/<decision-id>-<slug>.md、state.json を更新または作成する必要がある場面では必ず使う。
  requirements、user-stories、use-cases、units、bolts、domain、Spec、実装は作らない。
---

# amadeus-inception-traceability-finalization

## 目的

Inception phase の追跡と状態確定だけを進める。

この skill は `amadeus-inception` の内部 skill である。
前段の成果物を追跡表、判断、`state.json` に反映する。

## 前提

対象 Intent が Ideation、要件定義、相互作用整理、実施設計の成果物を持っていることを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/ideation/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/user-stories.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/use-cases.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/*.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/*/design.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts/*.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/domain/**`
- `.amadeus/intents/<intent-id>-<slug>/inception/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/decisions.md`

実施設計の成果物が不足している場合は、`amadeus-inception-execution-design` を案内して停止する。

## テンプレート

新規作成または構造補修では、`amadeus-inception/templates/intents/inception/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/inception/` にある場合は、そちらを優先する。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents/<intent-id>-<slug>/inception/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/decisions/<decision-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/inception/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/inception/grillings/Gxxx-*.md`

既存成果物がある場合は、同じ ID と同じファイル名を尊重する。
不明な値は空欄にせず、`未確認` と書く。

## 手順

1. Requirement、Story、Use Case、Unit、Unit Design Brief、Bolt の追跡関係を `traceability.md` に反映する。
2. Inception の境界、粒度、対象外、greenfield または brownfield の判断を `decisions.md` と `decisions/**` に残す。
3. `state.json.phase` を `inception` にし、Inception の必須成果物を反映する。
4. 対象 Intent の境界づけられたコンテキスト、または Unit から BC への参照が未確認なら `state.json.inception.gate` は `not_ready` にする。
5. 詳細なモデルや契約条件だけが未確認で、BC と Unit 参照が確定している場合は `passed` にしてよい。
6. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
7. 構造矛盾がないか validator で対象 Intent を検証する。

## 禁止事項

- `requirements/**`、`user-stories/**`、`use-cases/**`、`units/**`、`bolts/**`、`domain/**` を作らない。
- 前段成果物の内容を都合よく書き換えない。
- Spec、実装、CI を作らない。
- 内容妥当性の承認を `validator pass` と混同しない。

## 次の skill

- Inception 全体を進める場合: `amadeus-inception`
- 成果物構造を検証する場合: `amadeus-validator`
