# 追跡

## 要求からの追跡

| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト |
|---|---|---|---|---|---|
| R001 | ACT002 Agent | なし | UC001, UC002 | U001 | B001 |
| R002 | ACT002 Agent | なし | UC001, UC002 | U001 | B001 |
| R003 | ACT002 Agent | なし | UC002 | U001 | B002 |
| R004 | ACT002 Agent | なし | UC001 | U001 | B001, B002 |

## 対象境界からの追跡

| 対象境界 | 要求 | ユーザーストーリー | ユースケース | ユニット | ボルト | 扱い |
|---|---|---|---|---|---|---|
| SC-IN-001 | R001, R003 | なし | UC001, UC002 | U001 | B001, B002 | オフラインの判定規則を定義し、auto 判定の再開行として追加する。 |
| SC-IN-002 | R002 | なし | UC001 | U001 | B001 | 未 finalize 検出を同梱スクリプトとして実装する。 |
| SC-IN-003 | R003 | なし | UC002 | U001 | B002 | 検出結果を Decision Review の入力証拠として参照する。 |
| SC-IN-004 | R004 | なし | UC001 | U001 | B001 | 先に失敗する eval を追加してから実装する。 |
| SC-IN-005 | R004 | なし | UC001 | U001 | B002 | source skill と昇格先成果物を promote 手順で同期する。 |

## 背景からの追跡

| 背景 | 追跡先 | 根拠 |
|---|---|---|
| Issue #309 | R001, R002, R003, R004 | merge 後の finalization の再開と検出を求める入力であるため。 |
| Issue #298 | R004 | skill 変更 PR に適用するレビュー支援契約の定義元であるため。 |
| 既存 Ideation scope | SC-IN-001 から SC-IN-005 | Inception の要求境界を Ideation の採用境界から引き継ぐため。 |
| [G001](grillings/G001-offline-merge-judgment.md) | R001 | merge 済み判定をオフラインで行う確定判断を反映するため。 |
| Ideation D002 | R002 | 同梱スクリプト配置の確定判断を反映するため。 |

## ボルトからの追跡

| ボルト | ユニット | 要求 | 受け入れ状態 | Construction での主な成果 |
|---|---|---|---|---|
| B001 | U001 | R001, R002, R004 | R001, R002, R004 | 検出スクリプトと eval を実装する（eval 先行）。 |
| B002 | U001 | R003, R004 | R003, R004 | auto 判定の再開行と Decision Review 記述を更新し、promote で同期する。 |

## 設計からの追跡

| 設計 | ユニット | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| [design.md](units/U001-finalization-resume-contract/design.md) | U001 | R001, R002, R003, R004 | UC001, UC002 | B001, B002 |

## 既存コード分析からの追跡

| 分析 | 要求 | ユースケース | ユニット | ボルト | 設計 | 入力 |
|---|---|---|---|---|---|---|
| [codebase-analysis.md](codebase-analysis.md) | R001 | UC001, UC002 | U001 | B001 | [design.md](units/U001-finalization-resume-contract/design.md) | state.json と Bolt 成果物に未 finalize を判定できる情報が揃っている。 |
| [codebase-analysis.md](codebase-analysis.md) | R002 | UC001 | U001 | B001 | [design.md](units/U001-finalization-resume-contract/design.md) | scripts/ は昇格対象であり、検出スクリプトは新設になる。 |
| [codebase-analysis.md](codebase-analysis.md) | R003 | UC002 | U001 | B002 | [design.md](units/U001-finalization-resume-contract/design.md) | auto 判定表は行を追加でき、既存の refine 行との排他性に注意が必要である。 |
| [codebase-analysis.md](codebase-analysis.md) | R004 | UC001 | U001 | B001, B002 | [design.md](units/U001-finalization-resume-contract/design.md) | evals/ は昇格除外であり、eval は source 側に置ける。 |

## ユニットからの追跡

| ユニット | コンテキスト | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| U001 | BC001 | R001, R002, R003, R004 | UC001, UC002 | B001, B002 |

## ドメインモデルからの追跡

| 種別 | 対象 | 要求 | ユースケース | 定義元 |
|---|---|---|---|---|
| サブドメイン | SD001 自己開発運用 | R001, R002, R003, R004 | UC001, UC002 | [domain-map.md](../../../domain-map.md) |
| 境界づけられたコンテキスト | BC001 自己開発運用 | R001, R002, R003, R004 | UC001, UC002 | [domain-map.md](../../../domain-map.md) |

Inception では詳細な Domain Model を作らない。

Domain Map と Context Map は、採用済みの Bounded Context と依存関係の参照元として使う。

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| 要求 | R001 | なし | 判定規則は他の条件に依存せず定義できるため。 | [requirements.md](requirements.md) |
| 要求 | R002 | R001 | 検出スクリプトは判定規則を実装するため。 | [requirements.md](requirements.md) |
| 要求 | R003 | R001, R002 | 再開規則は判定規則を参照し、検出結果を入力証拠にするため。 | [requirements.md](requirements.md) |
| 要求 | R004 | R002, R003 | 検証と昇格同期は、スクリプトと skill 本文の変更を対象にするため。 | [requirements.md](requirements.md) |
| ユースケース | UC001 | なし | 未 finalize の検出は、再開の入力になるため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC002 | UC001 | 再開規則は、検出結果を入力証拠として使うため。 | [use-cases.md](use-cases.md) |
| ユニット | U001 | なし | 再開規則、検出手段、検証を単一の価値単位として扱うため。 | [units.md](units.md) |
| ボルト | B001 | なし | 検出スクリプトの存在と契約が、skill 本文からの参照の前提であるため。 | [bolts.md](bolts.md) |
| ボルト | B002 | B001 | auto 判定と Decision Review 記述は、検出スクリプトの path と入出力契約を参照するため。 | [bolts.md](bolts.md) |
| 判断 | D001 | なし | Inception の所有境界を固定するため。 | [decisions.md](decisions.md) |
| 判断 | D002 | D001 | BC001 を参照して Unit のコンテキストを確定するため。 | [decisions.md](decisions.md) |
| 判断 | D003 | D001 | User Stories の要否と分解粒度の例外は Inception の成果物境界に関わるため。 | [decisions.md](decisions.md) |
| Context Map | BC001 | なし | 採用済みまたは廃止済みのコンテキスト間依存は存在しないため。 | [context-map.md](../../../context-map.md) |

## Inception Gate

| 観点 | 状態 | 根拠 |
|---|---|---|
| 要求追跡 | passed | R001 から R004 までを use case、unit、bolt に対応付けた。 |
| 対象境界追跡 | passed | SC-IN-001 から SC-IN-005 までを要求と bolt に対応付けた。 |
| ドメイン参照 | passed | Unit の context は Domain Map の adopted Bounded Context である BC001 を参照する。 |
| 依存関係 | passed | Unit と Bolt の依存を明示し、Context Map に未登録依存がないことを確認した。 |
