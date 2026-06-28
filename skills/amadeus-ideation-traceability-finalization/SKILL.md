---
name: amadeus-ideation-traceability-finalization
description: >-
  Amadeus Ideation の内部 skill。初期モックまで整理済みの Intent に対して、追跡と状態確定だけを実行し、
  traceability.md、decisions.md、decisions/<decision-id>-<slug>.md、state.json を作成または補修する必要がある場面では必ず使う。
  scope、ideation、mocks、Inception 成果物、Spec、実装は作らない。
---

# amadeus-ideation-traceability-finalization

## 目的

Ideation phase の追跡と状態確定だけを進める。

この skill は `amadeus-ideation` の内部 skill である。
公開入口としての `amadeus-ideation` から呼び出されることを主な用途にする。

## 前提

対象 Intent に `scope.md`、`ideation.md`、初期モックが存在することを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation.md`
- `.amadeus/intents/<intent-id>-<slug>/mocks/*.puml`

`scope.md` がない場合は停止し、先に `amadeus-ideation-scope-framing` を使う。
`ideation.md` がない場合は停止し、先に `amadeus-ideation-feasibility-shaping` を使う。
初期モックがない場合は停止し、先に `amadeus-ideation-mock-framing` を使う。

## テンプレート

新規作成または構造補修では、`amadeus-ideation/templates/intents/ideation/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/ideation/` にある場合は、そちらを優先する。

対象テンプレートは次である。

- `traceability.md`
- `decisions.md`
- `decisions/D001-complete-ideation.md`
- `state.json`

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/decisions/<decision-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings/Gxxx-*.md`

`state.json.phase` は `ideation` にする。
Ideation が完了している場合は、`state.json.ideation.gate` を `passed` にする。
未完了の場合は、`not_ready`、`waiting_approval`、`failed` のいずれかを使う。

## 手順

1. `scope.md`、`ideation.md`、`mocks/*.puml` から Ideation 要素と依存を拾う。
2. `traceability.md` に Ideation 要素と依存関係の追跡を書く。
3. Ideation を完了して Inception へ進める場合は、判断 `D001` を作る。
4. `decisions.md` に判断一覧と依存関係を書く。
5. `state.json` の `requiredArtifacts` と `requiredMocks` に、存在する相対パスだけを書く。
6. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
7. 作成後に validator が使える場合は、対象 Intent を検証する。

## 禁止事項

- `scope.md`、`ideation.md`、`mocks/**` を更新しない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- `domain/**`、Spec、実装、CI を作らない。
- `state.json` の `phase` を `ideation` 以外にしない。

## 次の skill

- Inception 成果物へ進む場合: `amadeus-inception`
- Ideation 全体を進める場合: `amadeus-ideation`
