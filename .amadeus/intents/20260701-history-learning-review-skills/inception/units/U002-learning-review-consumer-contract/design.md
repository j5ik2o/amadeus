# Unit Design Brief

## 概要

この文書は Unit Design Brief である。
Inception では、`amadeus-learning-review` と `dry-run` consumer 境界の課題解決方針を定め、Bolt 分割と Construction へ渡す設計入力だけを扱う。
詳細な Domain Design、Logical Design、実装設計、テスト設計は Construction で確定する。

## 設計戦略

- `amadeus-learning-review` を、過去分析結果と検証結果を学習先へ分類する内部 skill として追加する。
- 分類結果は Issue #259 の分類契約と一致させる。
- `amadeus-learning-review` は質問実行や成果物更新を直接行わず、`amadeus-grilling`、phase skill、後続 Issue 候補、後続 Intent 候補へ渡す。
- `amadeus-discovery dry-run` は分析結果を入力として使える consumer として説明し、過去分析と学習分類を所有しない。
- source skill と昇格先成果物は promote-skill で同期し、text contract または eval で責務境界を確認する。

## 責務境界

- 所有するもの: 学習先分類、分類根拠、戻り先候補、質問候補、consumer 境界、検証観点。
- 所有しないもの: 過去成果物の横断読み取り本体、質問実行、成果物更新、Issue 作成、自動昇格、`dry-run` の候補表示本体。
- 依存してよいもの: `amadeus-history-review`、validator 結果、evaluator 結果、Issue、PR、CI 結果、Issue #259 の分類契約、Skill Contract。
- 後続で再確認が必要になる条件: `amadeus-learning-review` を追加しない判断になる場合、`dry-run` が分析を直接所有する判断になる場合。

## 構成候補

- learning input resolver
- learning classification rule
- grilling handoff candidate
- phase skill routing candidate
- dry-run consumer boundary
- skill synchronization evidence

## データと契約候補

- 入力候補: history review result、validator 結果、evaluator 結果、Issue、PR、CI 結果。
- 出力候補: 学習分類、根拠、戻り先、質問候補、後続 Issue 候補、後続 Intent 候補。
- 状態候補: 分類済み、質問待ち、戻し先あり、後続候補、不採用。
- 事前条件候補: 入力証拠と対象 Intent または対象成果物を追跡できる。
- 事後条件候補: 分類結果と戻り先が説明できる。
- 不変条件候補: `amadeus-learning-review` は成果物更新、Issue 作成、自動昇格を行わない。

## 検証観点

- 分類結果が Issue #259 の分類と一致している。
- validator の `pass` が内容承認ではないことが説明されている。
- Domain Map と Context Map 候補を直接昇格しないことが説明されている。
- `dry-run` が分析結果を入力にできるが分析責務を所有しないことが説明されている。
- source skill と昇格先成果物の同期を promote-skill で確認できる。

## Bolt 分割方針

- B002 で `amadeus-learning-review` の内部 skill を追加する。
- B003 で `dry-run` consumer 境界、`amadeus-discovery` 側の説明、text contract、検証を扱う。

## Construction への引き継ぎ

- Domain Design で確定する事項: なし。
- Logical Design で確定する事項: 分類結果、戻り先、`dry-run` consumer 境界。
- 実装時に確認する事項: `amadeus-learning-review` を独立 skill として追加するか、同等責務を別 skill に統合するか。
- 検証時に確定する事項: promote-skill、text contract、validator、関連 eval の実行結果。
