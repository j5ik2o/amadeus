---
name: amadeus-construction-implementation-execution
description: >-
  Amadeus Construction の内部 skill。Bolt 実行準備済みの対象 Bolt に対して、Task に対応する実装実行だけを進める。
  Inception の Bolt、design、tasks、notes を根拠に最小のコード変更と必要なテストコード変更を行う場面では必ず使う。
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

- `.amadeus/intents/<intent-id>-<slug>/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/units.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/bolt.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/tasks.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/notes.md`
- 関連する既存コード、テスト、設定

`notes.md` がない場合は、`amadeus-construction-bolt-preparation` を案内して停止する。

## 成果物

変更できるものは次だけである。

- 対象 Task に直接対応する実装コード。
- 対象 Task の検証に必要なテストコード。
- `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/notes.md`

`notes.md` には、実装中に確定した判断、未確認事項、後続検証で確認すべき観点だけを書く。

## 手順

1. 対象 Task と対応する要求、ユースケース、設計入力を確認する。
2. 既存コードの局所パターンを読み、既存スタイルに合わせる。
3. 可能な場合は、先に失敗するテストまたは決定論的検証を追加する。
4. Task に対応する最小実装を行う。
5. 実装判断や未確認事項があれば `notes.md` に残す。
6. 検証結果の確定は次の内部 skill に渡す。

## 禁止事項

- 対象 Task に対応しない speculative な実装をしない。
- Inception 成果物の要求、ユースケース、Unit、Bolt、Design を書き換えない。
- `test-results.md`、`pr.md`、`traceability.md`、`acceptance.md`、`state.json` を更新しない。
- テスト未実行の結果を証拠として記録しない。
- Spec、`.kiro/specs/**`、`openspec/**` を作らない。

## 次の skill

- 検証と堅牢化へ進む場合: `amadeus-construction-verification-hardening`
- Construction 全体を進める場合: `amadeus-construction`
