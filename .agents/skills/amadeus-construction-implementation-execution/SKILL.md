---
name: amadeus-construction-implementation-execution
description: >-
  Amadeus Construction の内部 skill。Bolt 実行準備済みの対象 Bolt に対して、Task に対応する実装実行だけを進める。
  Inception の Bolt、Unit Design Brief、Functional Design、tasks、notes を根拠に最小のコード変更と必要なテストコード変更を行う場面では必ず使う。
  検証結果、traceability、state.json、PR 記録は更新しない。
---

# amadeus-construction-implementation-execution

## 目的

Construction phase の実装実行だけを進める。

この skill は `amadeus-construction` の内部 skill である。
対象 Bolt の Task に対応する最小の実装と、実装に必要なテストコード変更を行う。

## 前提

対象 Intent が Inception を完了し、対象 Bolt の実行準備が済んでいることを前提にする。

少なくとも次を読む。

- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/<unit-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts/<bolt-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/<unit-id>-<slug>/functional-design/**`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/tasks.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/notes.md`
- 関連する既存コード、テスト、設定

`notes.md` がない場合は、`amadeus-construction-bolt-preparation` を案内して停止する。
`tasks.md` がない場合は、`amadeus-construction-bolt-preparation` を案内して停止する。
`state.json.construction.bolts[]` の対象 Bolt の `taskGeneration.status` が `ready_for_approval` または `passed` でない場合は、実装せずに停止する。

## 成果物

変更できるものは次だけである。

- 対象 Task に直接対応する実装コード。
- 対象 Task の検証に必要なテストコード。
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/notes.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/construction/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/construction/grillings/Gxxx-*.md`

`notes.md` には、実装中に確定した判断、調査詳細、未確認事項、後続検証で確認すべき観点だけを書く。

## 手順

1. 対象 Task と対応する要求、ユースケース、Unit Design Brief、Functional Design を確認する。
2. 対象 Unit と対象 Bolt の `実装対象` を確認し、対象リポジトリと path を特定する。
3. 既存コードの局所パターンを読み、既存スタイルに合わせる。
4. 可能な場合は、先に失敗するテストまたは決定論的検証を追加する。
5. Task に対応する最小実装を行う。
6. 実装判断や未確認事項があれば `notes.md` に残す。
7. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。
8. 検証結果の確定は次の内部 skill に渡す。

## 禁止事項

- 対象 Task に対応しない speculative な実装をしない。
- Inception 成果物の要求、ユースケース、Unit、Bolt、Design を書き換えない。
- `test-results.md`、`pr.md`、`traceability.md`、`acceptance.md`、`state.json` を更新しない。
- Bolt 側の `design.md` を作らない。
- テスト未実行の結果を証拠として記録しない。
- Spec、`.kiro/specs/**`、`openspec/**` を作らない。

## 次の skill

- 実装後の検証へ進む場合: `amadeus-construction` を検証目的で呼び出す。
  親 skill は `amadeus-construction-verification-hardening` に委譲する。
- 親 skill から検証プロセスを明示的に委譲されている場合だけ: `amadeus-construction-verification-hardening`
- Construction 全体を進める場合: `amadeus-construction`
