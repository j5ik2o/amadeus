---
name: amadeus-ideation-scope-framing
description: >-
  Amadeus Ideation の内部 skill。Intent Record 作成済みの Ideation Intent に対して、スコープ整理だけを実行し、
  scope.md を作成または補修する必要がある場面では必ず使う。ideation、mocks、traceability、decisions、
  Inception 成果物、Spec、実装は作らない。
---

# amadeus-ideation-scope-framing

## 目的

Ideation phase のスコープ整理だけを進める。

この skill は `amadeus-ideation` の内部 skill である。
公開入口としての `amadeus-ideation` から呼び出されることを主な用途にする。

## 前提

対象 Intent の Intent Record が作成済みであることを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- steering layer

`Intent のモジュールファイル` または `state.json` がない場合は停止する。
その場合は `amadeus-ideation-intent-capture` で Intent Record を補修するよう案内する。

## テンプレート

新規作成または構造補修では、`amadeus-ideation/templates/intents/ideation/` の `scope.md` テンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/ideation/scope.md` にある場合は、そちらを優先する。

テンプレートの `<...>` は、既存 `Intent のモジュールファイル`、`state.json`、steering layer、ユーザー回答から分かる値に置き換える。
分からない項目は空欄にせず、`未確認` と書く。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents/<intent-id>-<slug>/ideation/scope.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/ideation/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/ideation/grillings/Gxxx-*.md`

`scope.md` の必須見出しは次である。

- `対象境界`
- `実行制御`
- `成果物深度`
- `検証戦略`
- `Inception への引き継ぎ`

`対象境界` には、`対象` と `対象外` の小見出しを置く。
ここでの `対象` と `対象外` は Intent が扱う利用者価値、業務境界、外部境界であり、AI-DLC v2 の Scope ではない。

`実行制御` には、Intent Record の `scope` を初期値として、AI-DLC v2 の Scope に相当する `実行スコープ` と、省略する stage があればその理由を書く。
`成果物深度` には、成果物の粒度と説明量を書く。
`検証戦略` には、検証量と検証方法を書く。
成果物深度と検証戦略は独立して判断する。

## 手順

1. Intent の目標プロファイル、目的、成功条件、制約、依存を読む。
2. Steering layer から、この Intent の対象領域、対象外領域、アクターを拾う。
3. `scope.md` に対象境界、実行制御、成果物深度、検証戦略、Inception への引き継ぎを書く。
4. 判断できない境界は `未確認` として残す。
5. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
6. 作成後に validator が使える場合は、対象 Intent を検証する。

## 禁止事項

- Intent Record を新規作成しない。
- `ideation.md`、`mocks/**`、`traceability.md`、`decisions/**`、`state.json` を更新しない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- `domain/**`、Spec、実装、CI を作らない。

## 次の skill

- 実現可能性と体制整理へ進む場合: `amadeus-ideation-feasibility-shaping`
- Ideation 全体を進める場合: `amadeus-ideation`
