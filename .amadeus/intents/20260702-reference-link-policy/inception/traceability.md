# 追跡

## 要求からの追跡

| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト |
|---|---|---|---|---|---|
| R001 | ACT001 Maintainer, ACT002 Agent | S001 | UC001 | U001 | B001 |
| R002 | ACT002 Agent | S001 | UC001 | U001 | B001 |
| R003 | ACT002 Agent, ACT003 Reviewer | S001 | UC002 | U001 | B002 |
| R004 | ACT001 Maintainer, ACT003 Reviewer | S001 | UC003 | U002 | B003 |

## 対象境界からの追跡

| 対象境界 | 要求 | ユーザーストーリー | ユースケース | ユニット | ボルト | 扱い |
|---|---|---|---|---|---|---|
| SC-IN-001 | R001 | S001 | UC001 | U001 | B001 | 参照 ID を Markdown リンクとして扱う方針にする。 |
| SC-IN-002 | R001, R002 | S001 | UC001 | U001 | B001 | PR番号、Issue番号、ファイルパス、成果物名のリンク先規則として扱う。 |
| SC-IN-003 | R002 | S001 | UC001 | U001 | B001 | GitHub ファイルパスまたはコード参照の permalink 条件として扱う。 |
| SC-IN-004 | R002 | S001 | UC001 | U001 | B001 | workspace 内成果物への相対 Markdown リンク規則として扱う。 |
| SC-IN-005 | R003 | S001 | UC002 | U001 | B002 | template、validator、eval、example、既存成果物への適用範囲として扱う。 |
| SC-IN-006 | R004 | S001 | UC003 | U002 | B003 | 未リンク参照の検出対象と対象外として扱う。 |

## 背景からの追跡

| 目的 | アクター | 外部システム | 要求 |
|---|---|---|---|
| Amadeus 成果物に記載する ID、PR番号、Issue番号、ファイルパス、成果物名を、参照先へ移動できる Markdown リンクとして扱う。 | ACT001 Maintainer, ACT002 Agent, ACT003 Reviewer | EXT001 GitHub | R001, R002, R003, R004 |
| Task 生成、実装判断、review、traceability 確認時に、根拠へたどれる状態にする。 | ACT001 Maintainer, ACT003 Reviewer | EXT001 GitHub | R001, R002, R004 |

## ボルトからの追跡

| ボルト | ユニット | 要求 |
|---|---|---|
| B001 | U001 | R001, R002 |
| B002 | U001 | R003 |
| B003 | U002 | R004 |

## 設計からの追跡

| 設計 | ユニット | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| [design.md](units/U001-reference-link-contract/design.md) | U001 | R001, R002, R003 | UC001, UC002 | B001, B002 |
| [design.md](units/U002-validation-boundary/design.md) | U002 | R004 | UC003 | B003 |

## 既存コード分析からの追跡

| 分析 | 要求 | ユースケース | ユニット | ボルト | 設計 | 入力 |
|---|---|---|---|---|---|---|
| [codebase-analysis.md](codebase-analysis.md) | R001, R002, R003 | UC001, UC002 | U001 | B001, B002 | [design.md](units/U001-reference-link-contract/design.md) | Construction template、Inception template、既存 `.amadeus/` 成果物から参照リンク化方針と適用範囲の入力を渡す。 |
| [codebase-analysis.md](codebase-analysis.md) | R004 | UC003 | U002 | B003 | [design.md](units/U002-validation-boundary/design.md) | validator の相対リンク検査と eval の既存観点から検出境界の入力を渡す。 |

## ユニットからの追跡

| ユニット | コンテキスト | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| U001 | BC001 | R001, R002, R003 | UC001, UC002 | B001, B002 |
| U002 | BC001 | R004 | UC003 | B003 |

## ドメインモデルからの追跡

| 種別 | 対象 | 要求 | ユースケース | 定義元 |
|---|---|---|---|---|
| サブドメイン | SD001 自己開発運用 | R001, R002, R003, R004 | UC001, UC002, UC003 | [domain-map.md](../../../domain-map.md) |
| 境界づけられたコンテキスト | BC001 自己開発運用 | R001, R002, R003, R004 | UC001, UC002, UC003 | [domain-map.md](../../../domain-map.md) |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260702-reference-link-policy | 20260701-self-development-cycle-stage-workspace | 既存の自己開発成果物を観察例にし、自己開発 cycle と workspace 対応記録を前提にするため。 | [intents.md](../../../intents.md) |
| 要求 | R001 | なし | リンク化対象の参照種別が、リンク先規則と適用範囲の前提であるため。 | [requirements.md](requirements.md) |
| 要求 | R002 | R001 | リンク先規則は、リンク化対象として採用した参照種別ごとに定義するため。 | [requirements.md](requirements.md) |
| 要求 | R003 | R001, R002 | 適用範囲は、リンク化対象とリンク先規則を前提に整理するため。 | [requirements.md](requirements.md) |
| 要求 | R004 | R001, R002, R003 | 検出境界は、対象参照、リンク先規則、適用成果物を前提に判断するため。 | [requirements.md](requirements.md) |
| ユーザーストーリー | S001 | なし | Maintainer が参照リンク化方針と検出境界を確認できる価値を表すため。 | [user-stories.md](user-stories.md) |
| ユースケース | UC001 | なし | 参照リンク化対象とリンク先規則は、適用範囲と検出境界の前提であるため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC002 | UC001 | 成果物への適用範囲は、参照リンク化対象とリンク先規則を前提にするため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC003 | UC001, UC002 | 検出境界は、参照リンク化対象、リンク先規則、適用成果物を前提にするため。 | [use-cases.md](use-cases.md) |
| ユニット | U001 | なし | 参照リンク化方針と適用成果物範囲が、検出境界の前提であるため。 | [units.md](units.md) |
| ユニット | U002 | U001 | validator と eval の検出境界は、参照リンク化方針と適用範囲を前提にするため。 | [units.md](units.md) |
| ボルト | B001 | なし | 参照リンク化対象とリンク先規則は、適用範囲と検出境界の前提であるため。 | [bolts.md](bolts.md) |
| ボルト | B002 | B001 | 成果物への適用範囲は、参照リンク化対象とリンク先規則を前提にするため。 | [bolts.md](bolts.md) |
| ボルト | B003 | B001, B002 | 検出境界は、参照リンク化対象、リンク先規則、適用成果物を前提にするため。 | [bolts.md](bolts.md) |
| 判断 | D001 | なし | Inception の所有境界を固定するため。 | [decisions.md](decisions.md) |
| 判断 | D002 | D001 | Unit のコンテキストに採用済み BC001 を使うため。 | [decisions.md](decisions.md) |
| 判断 | D003 | D001, D002 | Unit と Bolt の粒度を固定するため。 | [decisions.md](decisions.md) |
