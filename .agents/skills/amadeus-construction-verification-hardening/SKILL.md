---
name: amadeus-construction-verification-hardening
description: >-
  Amadeus Construction の内部 skill。実装済みの対象 Bolt に対して、検証と堅牢化だけを進める。
  テスト実装、テスト実行、安全性確認、CI 確認を行い、bolts/<bolt-id>/test-results.md を作成または補修する場面では必ず使う。
  実装、traceability、state.json、PR 記録は更新しない。
---

# amadeus-construction-verification-hardening

## 目的

Construction phase の検証と堅牢化だけを進める。

この skill は `amadeus-construction` の内部 skill である。
対象 Bolt の実装結果を、Task、要求、ユースケース、Unit Design Brief の検証観点に照らして確認する。

## 前提

対象 Bolt の実装実行が済んでいることを前提にする。

少なくとも次を読む。

- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/acceptance.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/units/<unit-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/bolts/<bolt-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/tasks.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/design.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/notes.md`
- 関連する実装コード、テスト、CI 設定

実装差分がない場合は、何を検証したいのかを確定できないため停止する。

## テンプレート

新規作成または構造補修では、`amadeus-construction/templates/intents/construction/` のテンプレートを使う。

プロジェクト固有テンプレートが `.amadeus/settings/templates/intents/construction/` にある場合は、そちらを優先する。

## 成果物

作成または更新できる Amadeus 成果物は次だけである。

- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/test-results.md`
- `.amadeus/intents/<intent-id>-<slug>/construction/bolts/<bolt-id>-<slug>/notes.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/construction/grillings.md`
- 記録対象の質問と回答が親 skill から渡された場合だけ、`.amadeus/intents/<intent-id>-<slug>/construction/grillings/Gxxx-*.md`

## 手順

1. Task、要求、Unit Design Brief、Construction Design の検証設計から必要な検証を決める。
2. 必要なテストが不足していれば、対象 Task に対応する範囲で追加する。
3. 関連テスト、型検査、lint、CI 相当の入口を実行する。
4. セキュリティ、権限、入力、ログ、秘密情報、破壊的変更の観点を確認する。
5. `test-results.md` に実行コマンド、結果、失敗があれば扱い、受け入れ証拠を記録する。
6. 親 skill から記録対象の質問と回答が渡された場合だけ、`amadeus-grilling` の構造に従って Grilling Decision Trail を同じ変更で更新する。

## 禁止事項

- 対象 Task に対応しない大きな実装変更をしない。
- `traceability.md`、`acceptance.md`、`decisions.md`、`state.json` を更新しない。
- PR 記録を作らない。
- 実行していないテストや CI を成功として書かない。
- Spec、`.kiro/specs/**`、`openspec/**` を作らない。

## 次の skill

- 追跡と状態確定へ進む場合: `amadeus-construction-traceability-finalization`
- Construction 全体を進める場合: `amadeus-construction`
