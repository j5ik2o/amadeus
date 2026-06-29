---
name: amadeus-construction-traceability-finalization
description: >-
  Amadeus Construction の内部 skill。検証済みの対象 Bolt に対して、追跡と状態確定だけを進める。
  tasks.md、acceptance.md、traceability.md、decisions.md、state.json を更新し、PR URL がある場合だけ bolts/<bolt-id>/pr.md を
  作成または補修する場面では必ず使う。実装やテスト実行はしない。
---

# amadeus-construction-traceability-finalization

## 目的

Construction phase の追跡と状態確定だけを進める。

この skill は `amadeus-construction` の内部 skill である。
実装と検証の結果を、Task、要求、受け入れ状態、追跡、判断、`state.json` に反映する。

## 前提

対象 Bolt の実装と検証が済んでいることを前提にする。

少なくとも次を読む。

- `.amadeus/intents/<intent-id>-<slug>/state.json`
- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts/<bolt-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/tasks.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/notes.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/test-results.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/decisions.md`

`test-results.md` がない場合は、`amadeus-construction-verification-hardening` を案内して停止する。

## テンプレート

新規作成または構造補修では、`amadeus-construction/templates/intents/construction/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/construction/` にある場合は、そちらを優先する。

## 成果物

作成または更新できる Amadeus 成果物は次だけである。

- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/tasks.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/pr.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/decisions.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/decisions/<decision-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/construction/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/construction/grillings/Gxxx-*.md`

`pr.md` は PR URL が存在する場合だけ作る。
PR を言及する場合は、必ず URL を記録する。

## 手順

1. `test-results.md` の証拠を対象 Task と Requirement に対応付ける。
2. 完了した Task の `証拠` を更新する。
3. `acceptance.md` の要求状態と証拠を更新する。
4. `traceability.md` の `Construction Design からの追跡` に実装、検証、PR の証拠を反映する。
5. `traceability.md` に Deployment Unit または証拠への追跡を反映する。
6. Construction の境界や重要判断を `decisions.md` と `decisions/**` に残す。
7. `state.json.phase` を `construction` にし、Construction の必須成果物を反映する。
8. PR URL がある場合だけ `pr.md` を作る。
9. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
10. validator が使える場合は、対象 Intent を検証する。

## 禁止事項

- 実装コードやテストコードを変更しない。
- Inception 成果物の要求、ユースケース、Unit、Bolt、Design を都合よく書き換えない。
- PR URL がないのに `pr.md` を作らない。
- テスト未実行の結果を証拠として記録しない。
- `verified` 相当の人間承認を validator pass だけで付けない。
- Spec、`.kiro/specs/**`、`openspec/**` を作らない。

## 次の skill

- Construction 全体を進める場合: `amadeus-construction`
- 成果物構造を検証する場合: `amadeus-validator`
