# D001: Inception 境界

## 背景

Issue #274 は、Construction 内部 skill の `次の skill` 欄に、親 skill 経由で継続する目的を明記することを求めている。

対象は主に `amadeus-construction-implementation-execution` と `amadeus-construction-verification-hardening` である。

## 判断

Inception の対象境界を Construction 内部 skill の次工程案内に固定する。

Construction の stage 構造変更、内部 skill の責務変更、成果物レイアウト変更、Construction 各工程の一括自動実行追加、validator 変更は対象外にする。

## 理由

Issue #274 の受け入れ条件は、skill 文書の文面要求と確認観点として分解できる。

一方で、Construction の構造や責務を変える必要は Issue 本文から読み取れない。

## 影響

Construction では、対象 skill の `次の skill` 欄と source skill / 昇格先成果物の整合確認を中心に Task 化する。

目的と異なる構造変更が必要だと分かった場合は、後続 Intent 候補として分ける。
