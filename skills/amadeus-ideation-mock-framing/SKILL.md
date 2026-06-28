---
name: amadeus-ideation-mock-framing
description: >-
  Amadeus Ideation の内部 skill。scope.md と ideation.md 作成済みの Intent に対して、
  初期モック具体化だけを実行し、mocks/*.puml を作成または補修する必要がある場面では必ず使う。
  traceability、decisions、state.json、Inception 成果物、Spec、実装は作らない。
---

# amadeus-ideation-mock-framing

## 目的

Ideation phase の初期モック具体化だけを進める。

この skill は `amadeus-ideation` の内部 skill である。
公開入口としての `amadeus-ideation` から呼び出されることを主な用途にする。

## 前提

対象 Intent に `scope.md` と `ideation.md` が存在することを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation.md`

`scope.md` がない場合は停止し、先に `amadeus-ideation-scope-framing` を使う。
`ideation.md` がない場合は停止し、先に `amadeus-ideation-feasibility-shaping` を使う。

## テンプレート

新規作成または構造補修では、`amadeus-ideation/templates/intents/ideation/mocks/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/ideation/mocks/` にある場合は、そちらを優先する。

ユーザーが明示しない限り、同梱テンプレートのファイル名を変更しない。
新規作成で初期モックを1つだけ作る場合は、`mocks/initial-confirmation.puml` を作る。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents/<intent-id>-<slug>/mocks/*.puml`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings/Gxxx-*.md`

初期モックは PlantUML Salt で作る。
高忠実度 UI ではなく、後続の要求とユースケースの具体例として確認できる粒度にする。

## 手順

1. `ideation.md` の `初期モック` と `未確定事項` を読む。
2. 初期モックで確認する判断点を1つに絞る。
3. 既存 `mocks/*.puml` がある場合は、重複ファイルを作らず既存ファイルを補修する。
4. 新規作成で初期モックを1つだけ作る場合は、`mocks/initial-confirmation.puml` を使う。
5. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
6. 作成後に validator が使える場合は、対象 Intent を検証する。

## 禁止事項

- 初期モックの題材名に合わせて、`mocks/initial-confirmation.puml` を別名にしない。
- `scope.md`、`ideation.md`、`traceability.md`、`decisions/**`、`state.json` を更新しない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- `domain/**`、Spec、実装、CI を作らない。

## 次の skill

- 追跡と状態確定へ進む場合: `amadeus-ideation-traceability-finalization`
- Ideation 全体を進める場合: `amadeus-ideation`
