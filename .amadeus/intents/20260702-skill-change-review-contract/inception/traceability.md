# 追跡

## 要求からの追跡

| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト |
|---|---|---|---|---|---|
| R001 | ACT002 Agent, ACT003 Reviewer | S001 | UC001, UC002 | U001 | B001 |
| R002 | ACT002 Agent, ACT003 Reviewer | S001 | UC001, UC002 | U001 | B001 |
| R003 | ACT002 Agent, ACT003 Reviewer, ACT001 Maintainer | S001, S002 | UC001, UC002, UC003 | U001 | B001 |
| R004 | ACT002 Agent, ACT003 Reviewer | なし | UC002 | U001 | B002 |

R004 は文書間の整合制約であり、Reviewer が整合の取れた契約文書を参照できるという UC002 の前提を支える要求として追跡する。

## 対象境界からの追跡

| 対象境界 | 要求 | ユーザーストーリー | ユースケース | ユニット | ボルト | 扱い |
|---|---|---|---|---|---|---|
| SC-IN-001 | R001 | S001 | UC001, UC002 | U001 | B001 | 挙動差分要約を変更種別「skill 変更」の必須条件として定義する。 |
| SC-IN-002 | R002 | S001 | UC001, UC002 | U001 | B001 | skill-forge 確認の実施と記録を必須条件として定義する。 |
| SC-IN-003 | R003 | S001, S002 | UC001, UC002, UC003 | U001 | B001 | skill 変更 PR の粒度制約の既定を定義する。 |
| SC-IN-004 | R003 | S002 | UC001, UC003 | U001 | B001 | 例外を Git Branching Policy の例外記録と同じ型で定義する。 |
| SC-IN-005 | R004 | なし | UC002 | U001 | B002 | development.md の PR 準備条件から追加条件へ追跡できるようにする。 |
| SC-IN-006 | R004 | なし | UC002 | U001 | B002 | README（英語、日本語）の記述と policies の整合を確認する。 |

## 背景からの追跡

| 背景 | 追跡先 | 根拠 |
|---|---|---|
| Issue #298 | R001, R002, R003, R004 | 2026-07-02 の grilling session の確定判断を steering policy へ契約化する入力であるため。 |
| 既存 Ideation scope | SC-IN-001 から SC-IN-006 | Inception の要求境界を Ideation の採用境界から引き継ぐため。 |
| Git Branching Policy | R003 | 例外記録の型（理由と後続確認先）を再利用するため。 |
| README（英語、日本語） | R002, R004 | skill-forge 確認観点の定義元であり、整合確認の対象であるため。 |
| [G001](grillings/G001-review-support-contract-format.md) | R001, R002, R003 | 記録形式の確定判断（固定3観点、固定見出し、不可分判定の一般則）を反映するため。 |

## ボルトからの追跡

| ボルト | ユニット | 要求 | 受け入れ状態 | Construction での主な成果 |
|---|---|---|---|---|
| B001 | U001 | R001, R002, R003 | R001, R002, R003 | `steering/policies.md` にレビュー支援契約の本文を定義する。 |
| B002 | U001 | R004 | R004 | `development.md` の PR 準備条件へ反映し、README との整合を確認する。 |

## 設計からの追跡

| 設計 | ユニット | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| [design.md](units/U001-skill-change-review-contract/design.md) | U001 | R001, R002, R003, R004 | UC001, UC002, UC003 | B001, B002 |

## 既存コード分析からの追跡

| 分析 | 要求 | ユースケース | ユニット | ボルト | 設計 | 入力 |
|---|---|---|---|---|---|---|
| [codebase-analysis.md](codebase-analysis.md) | R001 | UC001, UC002 | U001 | B001 | [design.md](units/U001-skill-change-review-contract/design.md) | 変更種別表は必須条件を1行で表現できる構造を持つ。 |
| [codebase-analysis.md](codebase-analysis.md) | R002 | UC001, UC002 | U001 | B001 | [design.md](units/U001-skill-change-review-contract/design.md) | README の確認観点を記録項目として再利用できる。 |
| [codebase-analysis.md](codebase-analysis.md) | R003 | UC001, UC002, UC003 | U001 | B001 | [design.md](units/U001-skill-change-review-contract/design.md) | 例外記録は Git Branching Policy の型を再利用でき、不可分判定の語彙が不足している。 |
| [codebase-analysis.md](codebase-analysis.md) | R004 | UC002 | U001 | B002 | [design.md](units/U001-skill-change-review-contract/design.md) | development.md は変更種別表への参照を既に持ち、README は英語と日本語の2つが整合対象である。 |

## ユニットからの追跡

| ユニット | コンテキスト | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| U001 | BC001 | R001, R002, R003, R004 | UC001, UC002, UC003 | B001, B002 |

## ドメインモデルからの追跡

| 種別 | 対象 | 要求 | ユースケース | 定義元 |
|---|---|---|---|---|
| サブドメイン | SD001 自己開発運用 | R001, R002, R003, R004 | UC001, UC002, UC003 | [domain-map.md](../../../domain-map.md) |
| 境界づけられたコンテキスト | BC001 自己開発運用 | R001, R002, R003, R004 | UC001, UC002, UC003 | [domain-map.md](../../../domain-map.md) |

Inception では詳細な Domain Model を作らない。

Domain Map と Context Map は、採用済みの Bounded Context と依存関係の参照元として使う。

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| 要求 | R001 | なし | 挙動差分要約は他の条件に依存せず定義できるため。 | [requirements.md](requirements.md) |
| 要求 | R002 | なし | skill-forge 確認の記録は他の条件に依存せず定義できるため。 | [requirements.md](requirements.md) |
| 要求 | R003 | なし | 粒度制約と例外一般則は他の条件に依存せず定義できるため。 | [requirements.md](requirements.md) |
| 要求 | R004 | R001, R002, R003 | 追跡と文書整合は、必須条件の内容が確定した後で対応付けるため。 | [requirements.md](requirements.md) |
| ユーザーストーリー | S001 | なし | Reviewer のレビュー判断価値を単独で表すため。 | [user-stories.md](user-stories.md) |
| ユーザーストーリー | S002 | なし | Maintainer の例外承認価値を単独で表すため。 | [user-stories.md](user-stories.md) |
| ユースケース | UC001 | なし | 記録の作成はレビューと承認の前提になるため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC002 | UC001 | レビューは、記録された PR 説明を入力にするため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC003 | UC001 | 例外承認は、例外の理由と後続確認先の記録を入力にするため。 | [use-cases.md](use-cases.md) |
| ユニット | U001 | なし | レビュー支援契約の定義と文書整合を単一の価値単位として扱うため。 | [units.md](units.md) |
| ボルト | B001 | なし | 契約本文の確定が、参照と整合確認の前提であるため。 | [bolts.md](bolts.md) |
| ボルト | B002 | B001 | PR 準備条件と README の整合は、policies の契約本文が確定してから行うため。 | [bolts.md](bolts.md) |
| 判断 | D001 | なし | Inception の所有境界を固定するため。 | [decisions.md](decisions.md) |
| 判断 | D002 | D001 | BC001 を参照して Unit のコンテキストを確定するため。 | [decisions.md](decisions.md) |
| 判断 | D003 | D001 | User Stories の要否と分解粒度の例外は Inception の成果物境界に関わるため。 | [decisions.md](decisions.md) |
| Context Map | BC001 | なし | 採用済みまたは廃止済みのコンテキスト間依存は存在しないため。 | [context-map.md](../../../context-map.md) |

## Inception Gate

| 観点 | 状態 | 根拠 |
|---|---|---|
| 要求追跡 | passed | R001 から R004 までを story、use case、unit、bolt に対応付けた。 |
| 対象境界追跡 | passed | SC-IN-001 から SC-IN-006 までを要求と bolt に対応付けた。 |
| ドメイン参照 | passed | Unit の context は Domain Map の adopted Bounded Context である BC001 を参照する。 |
| 依存関係 | passed | Unit と Bolt の依存を明示し、Context Map に未登録依存がないことを確認した。 |
