# D001: Ideation 完了判断

## 背景

Issue #274 は、Construction 内部 skill の `次の skill` 欄が次の内部 skill を直接呼ぶ案内に見える問題を扱う。

特に `amadeus-construction-verification-hardening` の後で止まると、`amadeus-construction-traceability-finalization` による tasks、acceptance、traceability、decisions、state.json の更新を忘れるリスクがある。

## 判断

Ideation を完了し、Inception へ進める。

Inception では、内部 skill の `次の skill` 欄を、親 skill 経由で継続する目的と、直接委譲の条件に分解する。

Construction の stage 構造変更、内部 skill の責務変更、validator 変更は対象外にする。

## 理由

Issue #274 から、対象境界、対象外、実行スコープ、成果物深度、検証戦略を判断できる。

受け入れ条件は、skill 文書の文面要求と確認観点として Inception に分解できる。

現時点で追加質問が必要な未確定事項は、対象 skill の既存文面確認と既存コード分析で扱える。

## 影響

Inception では、`amadeus-construction-implementation-execution` と `amadeus-construction-verification-hardening` を主要対象にする。

必要に応じて、他の Construction 内部 skill の `次の skill` 欄も同じ方針で確認する。

PR 準備時には、対象 Intent の validator、`npm run typecheck`、`npm run diff:check`、該当 skill の文面確認を記録する。
