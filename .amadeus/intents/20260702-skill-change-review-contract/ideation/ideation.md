# Ideation

## 実現可能性

| 観点 | 状態 | メモ |
|---|---|---|
| 技術 | feasible | 変更対象は `steering/policies.md` の変更種別表、`development.md` の PR 準備条件、README の整合確認だけであり、既存の文書構造へ条件を追加する形で扱える。 |
| 運用 | feasible | 挙動差分要約と skill-forge 確認は、既存の PR 説明と README の推奨を必須条件へ格上げする形であり、新しい作業手順を増やさない。 |
| セキュリティ | feasible | 追加する記録は PR 説明と Intent 成果物内の記述であり、秘密情報や認証情報の保存を前提にしない。 |
| 依存 | feasible | Issue #298 の確定判断、Git Branching Policy の例外記録の型、agent-instruction-rules の方針を根拠にできる。 |

## 体制

| 役割 | 種別 | 関心 |
|---|---|---|
| Maintainer | 判断者 | 必須条件の強度、例外運用の妥当性、stage0 採用判断を承認する。 |
| Agent | 実行者 | skill 変更 PR の作成時に、挙動差分要約と skill-forge 確認結果を PR 説明へ記録する。 |
| Reviewer | 参照者 | 挙動差分要約から skill 変更の影響を判断し、粒度制約が守られているかを確認する。 |
| Validator | 構造検出者 | 更新された Intent 成果物、リンク、状態を検出する。 |
| Evaluator | 品質評価者 | 変更種別表の記述が agent-instruction-rules の方針と矛盾しないかを確認する候補になる。 |

## 初期モック

| モック | 目的 | ファイル |
|---|---|---|
| 初期確認 | skill 変更 PR の作成から、挙動差分要約の記録、skill-forge 確認、レビュー、merge、stage0 採用判断までの流れを示す。 | [initial-confirmation.puml](mocks/initial-confirmation.puml) |

## 未確定事項

- 挙動差分要約を固定の観点リストにするか、自由記述にするかは Inception で判断する。
- skill-forge 確認の記録形式として、PR 説明のどこに何を書くかは Inception で判断する。
- 粒度制約の例外条件を、skill 変更と example 再生成が不可分な場合などへどこまで広げるかは Inception で判断する。
- 緊急修正時の例外運用の記録先は Inception で判断する。

## 学習候補

- skill 本文の変更はテストで落ちないため、レビュー判断に必要な情報を PR 説明側で構造化する必要がある。
- 既存の推奨を必須条件へ格上げする場合は、推奨を書いた文書と必須条件を書く文書の整合を同じ変更で確認する必要がある。
- レビュー単位を小さく保つ粒度制約は、Git Branching Policy の branch 分離と例外記録の型に揃えると再利用しやすい。
