---
name: amadeus-inception-traceability-finalization
description: >-
  Amadeus Inception の内部 skill。Units Generation 済み Intent に対して、追跡と状態確定だけを実行し、
  traceability.md、decisions.md、decisions/<decision-id>-<slug>.md、state.json を更新または作成する必要がある場面では必ず使う。
  requirements、user-stories、use-cases、units、bolts、domain、Spec、実装は作らない。
---

# amadeus-inception-traceability-finalization

## 目的

Inception phase の追跡と状態確定だけを進める。

この skill は `amadeus-inception` の内部 skill である。
前段の成果物を追跡表、判断、`state.json` に反映する。

## 前提

対象 Intent が Ideation、要件定義、Use Cases、Units Generation の成果物を持っていることを前提にする。

User Stories は、人間アクターのユーザー価値表現が必要な場合だけ成果物を持っていることを前提にする。

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
- `.amadeus/intents/<intent-id>-<slug>/inception/units.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/*.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/*/design.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts/*.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/decisions.md`

Units Generation の成果物が不足している場合は、`amadeus-inception-units-generation` を案内して停止する。

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

1. Requirement、存在する場合の Story、Use Case、Unit、Unit Design Brief、Bolt の追跡関係を `traceability.md` に反映する。
   - `対象境界からの追跡` で、`ideation/scope.md` の採用済み `SC-IN-*` を Requirement、存在する場合の Story、Use Case、Unit、Bolt へ接続する。
   - `SC-OUT-*` は Inception 成果物へ混入させず、必要な場合は対象外制約として判断に残す。
   - `要求からの追跡` の `ボルト` 列と `ボルトからの追跡` の `要求` 列は双方向に一致させる。
   - `要求からの追跡` である要求が参照していない Bolt には、`ボルトからの追跡` でその要求を含めない。
2. Inception の境界、粒度、対象外、greenfield または brownfield の判断を `decisions.md` と `decisions/**` に残す。
3. `state.json.phase` を `inception` にし、Inception の必須成果物を反映する。
4. Story が不要な場合は、`state.json.inception.requiredStoryArtifacts` を空配列にする。
5. Unit から参照する Bounded Context が Domain Map で `adopted` ではない場合、`state.json.inception.gate` は `not_ready` にする。
6. Bounded Context と Unit 参照が採用済み Boundary として確定している場合は `passed` にしてよい。
7. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
8. 構造矛盾がないか validator で対象 Intent を検証する。

## 禁止事項

- `requirements/**`、`user-stories/**`、`use-cases/**`、`units/**`、`bolts/**` を作らない。
- Intent 固有の正式な Domain Model 成果物を作らない。
- 前段成果物の内容を都合よく書き換えない。
- Spec、実装、CI を作らない。
- 内容妥当性の承認を `validator pass` と混同しない。

## 次の skill

- Inception 全体を進める場合: `amadeus-inception`
- 成果物構造を検証する場合: `amadeus-validator`
