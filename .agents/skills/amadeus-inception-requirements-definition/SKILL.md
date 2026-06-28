---
name: amadeus-inception-requirements-definition
description: >-
  Amadeus Inception の内部 skill。Ideation 完了済み Intent に対して、要件定義だけを実行し、
  requirements.md、requirements/<requirement-id>.md、acceptance.md を作成または補修する必要がある場面では必ず使う。
  user-stories、use-cases、units、bolts、traceability、decisions、Spec、実装は作らない。
---

# amadeus-inception-requirements-definition

## 目的

Inception phase の要件定義だけを進める。

この skill は `amadeus-inception` の内部 skill である。
公開入口としての `amadeus-inception` から呼び出されることを主な用途にする。

## 前提

対象 Intent が Ideation を完了していることを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions.md`
- steering layer

`state.json.phase` が `ideation` でなく、既存の Inception 成果物もない場合は停止する。
`state.json.ideation.gate` が `passed` でない場合は停止する。

## テンプレート

新規作成または構造補修では、`amadeus-inception/templates/intents/inception/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/inception/` にある場合は、そちらを優先する。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents/<intent-id>-<slug>/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/requirements/<requirement-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/acceptance.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings/Gxxx-*.md`

既存成果物がある場合は、同じ ID と同じファイル名を尊重する。
不明な値は空欄にせず、`未確認` と書く。

## 手順

1. Ideation 成果物から、要求候補、対象外、制約、受け入れ状態の根拠を拾う。
2. 要求 ID は既存 ID の次番号を使う。
3. `requirements.md` に要求一覧を作る。
4. `requirements/<requirement-id>-<slug>.md` に要求詳細を作る。
5. `acceptance.md` に受け入れ状態を作る。
6. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
7. `traceability.md` と `decisions.md` は、この内部 skill では更新しない。
8. 作成後に validator が使える場合は、対象 Intent を検証する。

## 禁止事項

- `user-stories/**`、`use-cases/**`、`units/**`、`bolts/**` を作らない。
- `domain/**`、`traceability.md`、`decisions/**`、`state.json` を更新しない。
- Spec、実装、CI を作らない。
- 推測でドメインモデル、境界づけられたコンテキスト、契約を確定しない。

## 次の skill

- 相互作用整理へ進む場合: `amadeus-inception-interaction-modeling`
- Inception 全体を進める場合: `amadeus-inception`
