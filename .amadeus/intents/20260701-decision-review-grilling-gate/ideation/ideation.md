# Ideation

## 実現可能性

| 観点 | 状態 | メモ |
|---|---|---|
| 技術 | feasible | 既存の公開 phase skill、`amadeus-grilling`、Skill Contract 生成物、validator 結果を入力にして判断規則を定義できる。 |
| 運用 | feasible | phase skill 起動時の前処理として扱えば、ユーザーが別コマンドを手動起動する負担を増やさずに導入できる。 |
| セキュリティ | feasible | decision review は既存成果物と GitHub 文脈を読む判断ゲートであり、秘密情報の追加保存を前提にしない。 |
| 依存 | feasible | Issue #248、Issue #259、Issue #263 の成果物により、問題報告、学習先分類、Skill Contract 入力の下地がある。 |

## 体制

| 役割 | 種別 | 関心 |
|---|---|---|
| Maintainer | 判断者 | decision review の起動条件と、質問すべき不明瞭ノードの基準を承認する。 |
| Agent | 実行者 | phase skill 起動時に証拠を読み、判断ノードを再評価する。 |
| Reviewer | 参照者 | grilling が必要な場合と不要な場合の分岐が説明できるか確認する。 |
| Validator | 構造検出者 | 成果物構造、リンク、識別子、状態を検出する。 |
| Evaluator | 品質評価者 | decision review の判断根拠が十分かを後段で評価する候補になる。 |

## 初期モック

| モック | 目的 | ファイル |
|---|---|---|
| 初期確認 | phase skill 起動時に、証拠、判断ノード、分岐、grilling 連携を確認する。 | [initial-confirmation.puml](mocks/initial-confirmation.puml) |

## 未確定事項

- `amadeus-decision-review` を新しい内部 skill として追加するか、既存公開 phase skill の共通契約に留めるかは Inception で判断する。
- decision tree のノード識別子や出力形式を Markdown だけにするか、Skill Contract と同じ生成物に接続するかは Inception で判断する。
- 初期適用対象を Ideation、Inception、Construction に限定するか、Discovery、Event Storming、Steering まで含めるかは Inception で判断する。
- evaluator で扱う評価項目を初期 Construction に含めるか、後続 Intent に切るかは Inception で判断する。

## 学習候補

- validator の `pass` は、decision review で質問不要と判断したことを意味しない。
- decision review は質問する skill ではなく、`amadeus-grilling` に渡すべき一問を選ぶ判断ゲートとして扱う。
- 明示的な未決事項がなくても、現在参照できる証拠で判断を説明できない場合は不明瞭ノードとして扱う。
- 構造補修で解ける問題と、人間判断が必要な不明瞭ノードを分ける。
