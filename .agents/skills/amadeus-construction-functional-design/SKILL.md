---
name: amadeus-construction-functional-design
description: >-
  Amadeus Construction の内部 skill。Construction の先頭 Stage として Unit ごとの Functional Design だけを進める。
  state.json.construction.functionalDesign の条件型に従い、construction/<unit-id>-<slug>/functional-design/** と state を作成または補修する場面では必ず使う。
  Bolt Preparation、tasks.md、実装、検証、追跡確定は行わない。
---

# amadeus-construction-functional-design

## 目的

Construction phase の `3.1 Functional Design` だけを進める。

この skill は `amadeus-construction` の内部 skill である。
Unit ごとの Functional Design の必要性を state 型で判定し、必要な Unit の Functional Design 成果物を作成または補修する。
Functional Design は詳細な Domain Model と Intent Contracts の管理元である。
Functional Design の承認後に Domain Map と Context Map へ昇格する候補を、`domain-entities.md` の `Domain Map と Context Map への反映候補` に記録する。
Functional Design が `passed` で、共有境界として採用する判断がある場合は Domain Map、コンテキスト間依存として採用する判断がある場合は Context Map へ反映できる。
Domain Map と Context Map には候補を載せない。

Bolt Preparation、Task 生成、実装、検証、PR 記録、追跡確定は行わない。

## 前提

対象 Intent が Inception を完了していることを前提にする。

少なくとも次を読む。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/use-cases.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/<unit-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/<unit-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts/<bolt-id>-<slug>.md`
- `.amadeus/domain-map.md`、存在する場合
- `.amadeus/context-map.md`、存在する場合
- 作業ツリーの関連コード、テスト、設定

`state.json.inception.gate` が `passed` でない場合は停止する。
対象 Unit が確定できない場合は、`state.json.construction.functionalDesign.units[]` に `requirement: unresolved`、`status: blocked`、`blockedReason: target_unit_unresolved` を記録する。

## 成果物

作成または更新できる Amadeus 成果物は次だけである。

- `.amadeus/intents/<intent-id>-<slug>/construction/<unit-id>-<slug>/functional-design/business-logic-model.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/<unit-id>-<slug>/functional-design/business-rules.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/<unit-id>-<slug>/functional-design/domain-entities.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/<unit-id>-<slug>/functional-design/frontend-components.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/decisions/<decision-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- Functional Design が `passed` で共有境界として採用する内容がある場合だけ、`.amadeus/domain-map.md`
- Functional Design が `passed` でコンテキスト間依存として採用する内容がある場合だけ、`.amadeus/context-map.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/construction/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/construction/grillings/Gxxx-*.md`

`frontend-components.md` は `frontendSurface: present` の場合だけ作成または補修する。
`frontendSurface: absent` の場合、Unit 全体を skip しない。

## 手順

1. 対象 Unit を `state.json.construction.functionalDesign.targetUnits`、`state.json.construction.targetUnits`、`state.json.construction.targetBolts`、ユーザー指定の順に解決する。
2. 対象 Unit ごとに `requirement`、`status`、`frontendSurface`、`targetSource`、`runMode` を決める。
3. 必要な Unit の core 3 文書を Catalog の見出しと表構造に従って作成または補修する。
   template に Catalog 外の補助見出しがある場合は、その見出しも保持する。
4. UI 構成がある Unit だけ `frontend-components.md` を作成または補修する。
5. `state.json.construction.functionalDesign` を更新し、`artifacts`、`required`、`surfaces`、`gate` を保存しない。
6. Functional Design の判断が Construction の境界や重要判断に当たる場合だけ、`decisions.md` と `decisions/**` に残す。
7. Functional Design の承認後に Domain Map と Context Map へ昇格する候補があれば、`domain-entities.md` の `Domain Map と Context Map への反映候補` に記録する。
8. Functional Design が `passed` で、共有境界として採用する判断がある場合は Domain Map、コンテキスト間依存として採用する判断がある場合は Context Map を、`adopted` または `retired` の現在の索引として更新する。
9. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。

## 状態契約

Functional Design の要否はファイル存在ではなく `state.json.construction.functionalDesign` で判定する。

`requirement: required` の Unit は、Catalog から core 3 文書が必須として導出される。
`frontend-components.md` の必須性は `frontendSurface` だけで決める。

`FunctionalDesignGateResult` は state に保存しない。
Validator が `FunctionalDesignStatus` と Catalog に基づく成果物検証から導出する。

既に `status: passed` の Unit を再実行しない場合は、`passed` を維持する。
再実行対象にする場合だけ `runMode: rerun` として、対象 Unit の `functional-design/` を更新する。

## 禁止事項

- Bolt 側の設計ファイルを作らない。
- `tasks.md` を作らない。
- 実装コードやテストコードを変更しない。
- `test-results.md`、`pr.md`、`traceability.md`、`acceptance.md` を更新しない。
- `state.json.construction.functionalDesign.units[]` に `artifacts`、`required`、`surfaces`、`gate` を保存しない。
- Functional Design の要否をファイル存在で判定しない。
- Spec、`.kiro/specs/**`、`openspec/**` を作らない。

## 次の skill

- Bolt Preparation へ進む場合: `amadeus-construction` を Bolt 実行準備目的で呼び出す。
  親 skill は `amadeus-construction-bolt-preparation` に委譲する。
- 親 skill から Bolt 実行準備プロセスを明示的に委譲されている場合だけ: `amadeus-construction-bolt-preparation`
- Construction 全体を進める場合: `amadeus-construction`
