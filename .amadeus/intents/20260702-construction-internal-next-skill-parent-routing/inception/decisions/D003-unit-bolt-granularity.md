# D003: Unit と Bolt の粒度

## 背景

Issue #274 の主要対象は、Construction 内部 skill の `次の skill` 欄である。

対象 skill は複数あるが、価値境界は「親 skill 経由で次工程へ進む案内を読めること」に集約できる。

## 判断

Unit は U001 の1つにする。

Bolt は B001、B002、B003 の3つに分ける。

- B001 は implementation execution の実装後案内を扱う。
- B002 は verification hardening の検証後案内を扱う。
- B003 は source skill、昇格先成果物、周辺 skill の整合確認を扱う。

## 理由

Unit を主要対象 skill ごとに分けると、要求と価値境界が重複する。

一方で Bolt は、Construction で文面更新と確認を段階的に Task 化しやすいように対象を分ける必要がある。

## 影響

Task Generation では、B001 と B002 を文面更新、B003 を整合確認として扱う。

周辺 skill に更新が必要な場合は、B003 の範囲で扱う。
