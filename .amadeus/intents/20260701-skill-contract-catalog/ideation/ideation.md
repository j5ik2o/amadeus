# Ideation

## 実現可能性

| 観点 | 状態 | メモ |
|---|---|---|
| 技術 | feasible | 既存の `amadeus-contracts`、`contracts:generate`、`contracts:check`、validator 生成物の構成を拡張して定義できる。 |
| 運用 | feasible | 代表 skill から始めるため、全 skill 一括移行を避けられる。 |
| セキュリティ | feasible | Skill Contract は実行契約の記述と生成物であり、秘密情報や外部連携の追加を前提にしない。 |
| 依存 | feasible | Issue #257 と Issue #259 に依存する補助 skill の入力契約として利用できる。 |

## 体制

| 役割 | 種別 | 関心 |
|---|---|---|
| Maintainer | 判断者 | Skill Contract の項目、生成物、代表 skill 範囲を承認する。 |
| Agent | 実行者 | `amadeus-contracts` の型と catalog を作り、生成物と検証入口をそろえる。 |
| Reviewer | 参照者 | `SKILL.md` と生成物の内容がずれていないか確認する。 |
| Validator | 構造検出者 | 生成物の存在、リンク、契約構造、状態を検出する。 |
| Evaluator | 品質評価者 | skill 実行結果が Skill Contract に沿っているかを評価する入口候補になる。 |

## 初期モック

| モック | 目的 | ファイル |
|---|---|---|
| 初期確認 | Skill Contract の定義元、生成物、参照先、利用者を確認する。 | [initial-confirmation.puml](mocks/initial-confirmation.puml) |

## 未確定事項

- Skill Contract の最小型をどこまで広げるかは Inception で判断する。
- `references/skill-contract.md` を必須生成物にするか、別の生成物名にするかは Inception で判断する。
- validator と evaluator のどちらを初期参照入口にするかは Inception で判断する。
- 代表 skill 5件を一つの Bolt で扱うか、契約型、生成物、参照入口で分割するかは Inception で判断する。

## 学習候補

- skill 実行契約は `SKILL.md` だけに閉じず、機械的に参照できる契約として扱う。
- `references/` 配下の契約は手書きではなく生成物として扱う。
- decision review と learning review は、自然文から推測せず Skill Contract を入力にする方向で整理する。
- validator の `pass` は内容承認ではないため、Skill Contract でも構造検出と品質評価を分ける。
