# Ideation

## 実現可能性

| 観点 | 状態 | メモ |
|---|---|---|
| 技術 | feasible | 既存の `amadeus-decision-review`、後段 feedback 契約、Skill Contract、source skill と昇格先成果物の同期手段を参考に内部 skill を追加できる。 |
| 運用 | feasible | `amadeus-history-review` を読み取り専用に限定すれば、Issue #272 の `dry-run` と責務を混ぜずに利用できる。 |
| セキュリティ | feasible | 入力は `.amadeus/` 成果物、Issue、PR、CI 結果であり、秘密情報の追加保存や外部学習基盤を前提にしない。 |
| 依存 | feasible | Issue #259 の分類契約と Issue #277 の受け入れ条件により、過去分析と学習分類の初期境界が説明できる。 |

## 体制

| 役割 | 種別 | 関心 |
|---|---|---|
| Maintainer | 判断者 | 過去分析と学習分類の内部 skill 追加範囲、統合可否、`dry-run` との境界を承認する。 |
| Agent | 実行者 | `.amadeus/` の過去成果物を読み、抽出結果と学習分類を副作用なく返す。 |
| Reviewer | 参照者 | `amadeus-history-review`、`amadeus-learning-review`、`amadeus-discovery dry-run` の責務が混ざっていないか確認する。 |
| Validator | 構造検出者 | 追加した skill、Ideation 成果物、リンク、状態を検出する。 |
| Evaluator | 品質評価者 | 内部 skill の説明が分類契約と矛盾しないかを text contract で確認する候補になる。 |

## 初期モック

| モック | 目的 | ファイル |
|---|---|---|
| 初期確認 | 過去成果物、過去分析、学習分類、`dry-run` 入力の責務境界を確認する。 | [initial-confirmation.puml](mocks/initial-confirmation.puml) |

## 未確定事項

- `amadeus-history-review` と `amadeus-learning-review` を別々の内部 skill として追加するか、一方を統合責務として扱うかは Inception で判断する。
- `amadeus-history-review` の出力形式を Markdown の要約だけにするか、機械向け JSON も含めるかは Inception で判断する。
- `amadeus-learning-review` が CI 結果をどの粒度で入力にするかは Inception で判断する。
- `dry-run` 側に追加する説明を、この Intent の Construction に含めるか Issue #272 に残すかは Inception で判断する。
- text contract を既存 eval に追加するか、新しい評価観点に分けるかは Inception で判断する。

## 学習候補

- 完了済み Issue で候補扱いに留めた内部 skill は、後続 Issue と Intent で明示的に前提補修として扱う。
- `dry-run` は候補表示に集中し、過去分析と学習分類は専用の内部 skill から入力として受け取る構造が望ましい。
- 読み取り専用の内部 skill は、自動更新や自動昇格を行わないことを出力責務と同じ強さで説明する必要がある。
- Domain Map と Context Map は候補を扱わないため、候補抽出結果は承認済み stage 成果物へ渡す前の材料として扱う。
