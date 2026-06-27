---
name: amadeus-inception-interaction-modeling
description: >-
  Amadeus Inception の内部 skill。要件定義済み Intent に対して、相互作用整理だけを実行し、
  user-stories.md、user-stories/<story-id>.md、use-cases.md、use-cases/<use-case-id>.md を作成または補修する必要がある場面では必ず使う。
  requirements、units、bolts、traceability、decisions、Spec、実装は作らない。
---

# amadeus-inception-interaction-modeling

## 目的

Inception phase の相互作用整理だけを進める。

この skill は `amadeus-intent-inception` の内部 skill である。
要件定義の成果物から、ユーザーストーリーとユースケースを作る。

## 前提

対象 Intent が Ideation を完了し、要件定義の成果物を持っていることを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/requirements/**`
- `.amadeus/intents/<intent-id>-<slug>/acceptance.md`
- steering layer

要件定義の成果物が不足している場合は、`amadeus-inception-requirements-definition` を案内して停止する。

## テンプレート

新規作成または構造補修では、`amadeus-intent-inception/templates/intents/inception/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/inception/` にある場合は、そちらを優先する。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents/<intent-id>-<slug>/user-stories.md`
- `.amadeus/intents/<intent-id>-<slug>/user-stories/<story-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/use-cases.md`
- `.amadeus/intents/<intent-id>-<slug>/use-cases/<use-case-id>-<slug>.md`

既存成果物がある場合は、同じ ID と同じファイル名を尊重する。
不明な値は空欄にせず、`未確認` と書く。

## 手順

1. 要求と受け入れ状態から、アクター価値をユーザーストーリーとして切る。
2. ユーザーストーリーから、システムとの相互作用をユースケースとして切る。
3. 要求、ユーザーストーリー、ユースケースが常に 1:1 になる場合は、粒度不足を疑う。
4. それでも自然な粒度であれば、後続の追跡確定で理由を残せるように根拠を本文に残す。
5. 作成後に validator が使える場合は、対象 Intent を検証する。

## 禁止事項

- `requirements/**`、`acceptance.md` を更新しない。
- `units/**`、`bolts/**`、`domain/**` を作らない。
- `traceability.md`、`decisions/**`、`state.json` を更新しない。
- Spec、実装、CI を作らない。
- ユースケースを要求の箇条書きとして作らない。

## 次の skill

- 実施設計へ進む場合: `amadeus-inception-execution-design`
- Inception 全体を進める場合: `amadeus-intent-inception`
