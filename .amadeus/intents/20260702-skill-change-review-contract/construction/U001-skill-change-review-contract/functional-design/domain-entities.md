# Domain Entities

## 目的

skill 変更レビュー支援契約で扱う概念を Functional Design の Domain Model として整理する。

Functional Design は詳細な Domain Model と Intent Contracts の管理元である。

## Domain Entity

| 識別子 | 名前 | 責務 | 関連 |
|---|---|---|---|
| DE001 | Behavior Diff Summary | 挙動差分の3観点と自由記述の補足を表す。 | DE004 |
| DE002 | Skill Forge Check Record | skill-forge で確認した観点と確認結果を表す。 | DE004 |
| DE003 | Granularity Exception Record | 粒度制約の例外の理由と後続確認先を表す。 | DE004 |
| DE004 | Skill Change Required Conditions | 変更種別「skill 変更」の必須条件の定義元を表す。 | DE001, DE002, DE003 |

## 関係

Skill Change Required Conditions は、Behavior Diff Summary、Skill Forge Check Record、Granularity Exception Record の記録条件を定義する。

Behavior Diff Summary と Skill Forge Check Record は、Reviewer のレビュー判断の入力になる。

Granularity Exception Record は、Maintainer の例外妥当性判断の入力になる。

## Domain Map と Context Map への反映候補

| 対象 | 種別 | 候補内容 | 承認後の扱い | 根拠 |
|---|---|---|---|---|
| なし | なし | 新しい Bounded Context やコンテキスト間依存は追加しない。 | Domain Map と Context Map は更新しない。 | U001 は BC001 内のレビュー支援契約を扱うため。 |

## 未確認事項

なし。
