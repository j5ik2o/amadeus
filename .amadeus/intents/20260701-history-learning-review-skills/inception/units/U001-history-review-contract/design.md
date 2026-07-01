# Unit Design Brief

## 概要

この文書は Unit Design Brief である。
Inception では、`amadeus-history-review` の課題解決方針を定め、Bolt 分割と Construction へ渡す設計入力だけを扱う。
詳細な Domain Design、Logical Design、実装設計、テスト設計は Construction で確定する。

## 設計戦略

- `amadeus-history-review` を `amadeus-decision-review` と同じ内部 skill 形式で追加する。
- `.amadeus/` の過去成果物を読む対象と、抽出する項目を明示する。
- 読み取り専用であることを、目的、境界、禁止事項、次の skill の各観点から説明する。
- 分析結果は `amadeus-learning-review` または `amadeus-discovery dry-run` の入力として渡せる粒度にする。

## 責務境界

- 所有するもの: `.amadeus/` 過去成果物の読み取り対象、抽出項目、分析結果、根拠。
- 所有しないもの: 成果物更新、GitHub Issue 作成、Intent Record 作成、自動昇格、学習先分類の最終判断、`dry-run` 表示。
- 依存してよいもの: `.amadeus/` 成果物、Issue #259、Issue #277、Domain Map、Context Map、Steering knowledge。
- 後続で再確認が必要になる条件: 出力形式に機械向け JSON が必要になる場合、読み取り対象が大きすぎて段階化が必要になる場合。

## 構成候補

- history input resolver
- history artifact reader
- history extraction rule
- history review result
- no side effect boundary

## データと契約候補

- 入力候補: workspace path、対象 Intent、任意の Issue または PR、`.amadeus/` 成果物集合。
- 出力候補: 再利用判断、未確認事項、繰り返し問題、前段 feedback 候補、昇格候補、後続 Issue 候補、後続 Intent 候補、不採用メモ。
- 状態候補: 読み取り済み、分析済み、入力不足、対象なし。
- 事前条件候補: `.amadeus/` の steering layer または Intent layer が存在する。
- 事後条件候補: 分析結果と根拠が返る。
- 不変条件候補: `amadeus-history-review` は成果物更新、Issue 作成、Intent Record 作成、自動昇格を行わない。

## 検証観点

- skill 本文に読み取り対象が含まれている。
- skill 本文に抽出項目が含まれている。
- skill 本文に副作用の禁止が含まれている。
- source skill と昇格先成果物が同期されている。
- text contract が主要な責務境界を検出できる。

## Bolt 分割方針

- B001 で `amadeus-history-review` の内部 skill を追加し、source skill、昇格先成果物、text contract を整える。

## Construction への引き継ぎ

- Domain Design で確定する事項: なし。
- Logical Design で確定する事項: 読み取り対象の必須範囲と推奨範囲。
- 実装時に確認する事項: skill 本文と昇格先成果物の同期、text contract の追加範囲。
- 検証時に確定する事項: promote-skill、validator、関連 eval の実行結果。
