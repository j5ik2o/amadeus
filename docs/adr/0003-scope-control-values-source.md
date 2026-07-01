# ADR 0003: scope 制御値の定義元を分ける

## ステータス

採用。

## 日付

2026-06-30。

## 背景

Amadeus DLC の Ideation では、Intent Record が `goalType`、`scope`、`labels` を扱う。

`scope.md` は、対象境界、実行制御、成果物深度、検証戦略を扱う。

一方で、`state.json` は phase、gate、必須成果物、実行時の進行状態を扱う。

`scope`、`実行スコープ`、`成果物深度`、`検証戦略` を `state.json` にも保存すると、Intent Record、`scope.md`、`state.json` のどれを更新すべきかが曖昧になる。

さらに、制御値の変更理由は値だけでは説明できない。

変更理由と影響範囲は、判断と追跡として記録する必要がある。

## 決定

Intent の `goalType`、`scope`、`labels` は Intent Record の目標プロファイルに置く。

`goalType` は、Intent が扱う目標の性質を表す。

`scope` は、AI-DLC v2 の Scope に対応する進行プロファイルを表す。
`scope` はタグではなく単一の制御値である。

`labels` は、検索、集計、補足分類に使う任意ラベルである。
`labels` は phase や stage の制御には使わない。

Scope Framing は、Intent Record の `scope` を初期値として `ideation/scope.md` の `実行スコープ` を整理する。

Ideation gate 通過後の対象境界、実行スコープ、成果物深度、検証戦略の定義元は `ideation/scope.md` に限定する。

`state.json` には、これらの制御値を保存しない。

`state.json` は、phase、gate、status、必須成果物、実行時に必要な対象 Unit や Bolt の状態だけを扱う。

`ideation/decisions.md` と `ideation/decisions/**` は、制御値を採用または変更した理由を扱う。

Ideation 完了時は、`D001` が対象境界、実行スコープ、成果物深度、検証戦略を採用した判断を記録する。

Ideation 完了後に `scope.md` の対象境界、実行スコープ、成果物深度、検証戦略を変更する場合は、新しい判断を作るか、既存判断を明示的に置き換える。

`ideation/traceability.md` は、対象境界、実行制御、成果物深度、検証戦略が後続成果物へどう渡るかを扱う。

対象境界と後続成果物の具体的な対応は、Inception 以降の `traceability.md` で Requirement、Story、Use Case、Unit、Bolt の ID と接続する。

## 影響

validator は、Intent の `state.json` に scope 制御値を保存しないことを検査する。

validator は、`ideation/traceability.md` が対象境界、実行制御、成果物深度、検証戦略を追跡対象として持つことを検査する。

Inception 以降に `scope.md` を変更する場合は、影響を受ける Requirement、Story、Use Case、Unit、Bolt を確認し、該当する `decisions.md` と `traceability.md` を更新する。

## 非目標

この ADR では、対象境界と Inception 成果物の内容整合検査を定義しない。

この ADR では、対象外混入を warning と gate failure のどちらで扱うかを決めない。

これらは後続 Issue で扱う。
