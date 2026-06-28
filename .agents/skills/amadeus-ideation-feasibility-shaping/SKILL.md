---
name: amadeus-ideation-feasibility-shaping
description: >-
  Amadeus Ideation の内部 skill。scope.md 作成済みの Intent に対して、実現可能性、体制、
  未確定事項、学習候補の整理だけを実行し、ideation.md を作成または補修する必要がある場面では必ず使う。
  mocks、traceability、decisions、Inception 成果物、Spec、実装は作らない。
---

# amadeus-ideation-feasibility-shaping

## 目的

Ideation phase の実現可能性と体制整理だけを進める。

この skill は `amadeus-ideation` の内部 skill である。
公開入口としての `amadeus-ideation` から呼び出されることを主な用途にする。

## 前提

対象 Intent に `scope.md` が存在することを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/scope.md`
- steering layer

`scope.md` がない場合は停止し、先に `amadeus-ideation-scope-framing` を使う。

## テンプレート

新規作成または構造補修では、`amadeus-ideation/templates/intents/ideation/` の `ideation.md` テンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/ideation/ideation.md` にある場合は、そちらを優先する。

テンプレートの `<...>` は、既存成果物とユーザー回答から分かる値に置き換える。
分からない項目は空欄にせず、`未確認` と書く。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents/<intent-id>-<slug>/ideation.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings/Gxxx-*.md`

`ideation.md` の必須見出しは次である。

- `実現可能性`
- `体制`
- `初期モック`
- `未確定事項`
- `学習候補`

## 手順

1. `scope.md` から対象、対象外、検証深度を読む。
2. 実現可能性を技術、運用、セキュリティ、依存の観点で整理する。
3. 判断者、参照者、検証対象、後続担当を整理する。
4. 初期モックで確認したい内容を、後続の `amadeus-ideation-mock-framing` へ渡せる粒度で書く。
5. 未確定事項と学習候補を残す。
6. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
7. 作成後に validator が使える場合は、対象 Intent を検証する。

## 禁止事項

- `scope.md` の境界を大きく変えない。
- `mocks/**`、`traceability.md`、`decisions/**`、`state.json` を更新しない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- `domain/**`、Spec、実装、CI を作らない。

## 次の skill

- 初期モック具体化へ進む場合: `amadeus-ideation-mock-framing`
- Ideation 全体を進める場合: `amadeus-ideation`
