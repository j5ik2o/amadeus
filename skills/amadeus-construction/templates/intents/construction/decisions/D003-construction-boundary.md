# D003: Construction の境界を固定する

## 背景

Construction では、Inception で定義した Bolt を Construction Design で具体化し、Task に分解してから実装、検証、証拠化する。

## 判断

Construction の公開入口は内部 skill を呼び出し、親 skill 自体では成果物作成、実装、検証を直接行わない。

## 理由

Bolt 実行準備、実装実行、検証と堅牢化、追跡と状態確定を分けることで、どのプロセスが何を更新したかを検証しやすくするためである。

## 影響

- Construction 成果物は、対象 Bolt 配下の実行記録、検証結果、PR 記録、追跡と状態に限定する。
- Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は Construction 初期スコープから外す。
