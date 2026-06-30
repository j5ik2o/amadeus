---
name: amadeus-inception-user-stories
description: >-
  Amadeus Inception の内部 skill。要件定義済みで、人間アクターのユーザー価値表現が必要な Intent に対して、ユーザーストーリーだけを実行し、
  user-stories.md、user-stories/<story-id>.md を作成または補修する必要がある場面では必ず使う。
  use-cases、units、bolts、traceability、decisions、Spec、実装は作らない。
---

# amadeus-inception-user-stories

## 目的

Inception phase の User Stories だけを進める。

この skill は `amadeus-inception` の内部 skill である。
要件定義の成果物から、人間アクターのユーザー価値としてのユーザーストーリーを作る。

システムまたは外部システムだけが相互作用主体である場合は、この skill で空の Story 成果物を作らない。

## 前提

対象 Intent が Ideation を完了し、要件定義の成果物を持っていることを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/ideation/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/requirements/**`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- steering layer

要件定義の成果物が不足している場合は、`amadeus-inception-requirements-definition` を案内して停止する。

## テンプレート

新規作成または構造補修では、`amadeus-inception/templates/intents/inception/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/inception/` にある場合は、そちらを優先する。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents/<intent-id>-<slug>/inception/user-stories.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/user-stories/<story-id>-<slug>.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/inception/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/inception/grillings/Gxxx-*.md`

既存成果物がある場合は、同じ ID と同じファイル名を尊重する。
不明な値は空欄にせず、`未確認` と書く。

## 手順

1. Requirement と受け入れ状態から、人間アクターのユーザー価値表現が必要かを判定する。
2. 必要な場合は、ユーザー価値をユーザーストーリーとして切る。
3. 不要な場合は、Story 成果物を作らず、後続の Use Cases で Story 参照を `なし` にする前提を親 skill に返す。
4. ユーザーストーリーが Requirement の言い換えだけになっている場合は、粒度不足を疑う。
5. 自然な粒度であれば、後続の追跡確定で理由を残せるように根拠を本文に残す。
6. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
7. 作成後に validator が使える場合は、対象 Intent を検証する。

## 禁止事項

- `requirements/**`、`acceptance.md` を更新しない。
- `use-cases/**`、`units/**`、`bolts/**` を作らない。
- `traceability.md`、`decisions/**`、`state.json` を更新しない。
- domain model、Spec、実装、CI を作らない。

## 次の skill

- Use Cases へ進む場合: `amadeus-inception-use-cases`
- Inception 全体を進める場合: `amadeus-inception`
