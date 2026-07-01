# 追跡

## 要求からの追跡

| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト |
|---|---|---|---|---|---|
| R001 | ACT002 Agent | S001 | UC001 | U001 | B001 |
| R002 | ACT002 Agent, ACT001 Maintainer | S001 | UC001, UC002 | U001 | B001 |
| R003 | ACT001 Maintainer | S001 | UC002 | U002 | B002 |
| R004 | ACT001 Maintainer, ACT003 Reviewer | S001 | UC002, UC003 | U002 | B002 |
| R005 | ACT003 Reviewer | S001 | UC001, UC003 | U001, U002 | B001, B002 |

## 対象境界からの追跡

| 対象境界 | 要求 | ユーザーストーリー | ユースケース | ユニット | ボルト | 扱い |
|---|---|---|---|---|---|---|
| SC-IN-001 | R001, R002, R005 | S001 | UC001 | U001 | B001 | 後段から前段への feedback routing として扱う。 |
| SC-IN-002 | R002, R003 | S001 | UC001, UC002 | U001, U002 | B001, B002 | 完了済み Intent から再利用する学習の抽出と分類として扱う。 |
| SC-IN-003 | R002, R003 | S001 | UC001, UC002 | U001, U002 | B001, B002 | 現在 Intent 修正、現在 phase 修正、Steering knowledge、Domain Map、Context Map、後続 Issue、後続 Intent、不採用への分類として扱う。 |
| SC-IN-004 | R004 | S001 | UC002, UC003 | U002 | B002 | `学習候補`、`traceability.md`、`decisions.md`、`.amadeus/steering/knowledge.md` の責務分離として扱う。 |
| SC-IN-005 | R005 | S001 | UC001, UC003 | U001, U002 | B001, B002 | validator と evaluator の結果分類として扱う。 |
| SC-IN-006 | R005 | S001 | UC003 | U001, U002 | B001, B002 | Issue #257 の decision review と学習分類の責務境界として扱う。 |

## 背景からの追跡

| 目的 | アクター | 外部システム | 要求 |
|---|---|---|---|
| 後段 phase で見つかった前段成果物の不整合、不足、古い判断を、後段成果物だけで吸収せず適切な前段へ戻す。 | ACT002 Agent, ACT003 Reviewer | なし | R001, R002, R005 |
| 完了済み Intent から次 Intent へ再利用する学習を抽出し、横断 knowledge または後続化へ分類する。 | ACT001 Maintainer, ACT002 Agent | EXT001 GitHub | R002, R003, R004 |
| validator と evaluator の結果を内容承認と混同せず、構造検出、品質評価、学習候補として扱う。 | ACT003 Reviewer | なし | R005 |
| Issue #257 の decision review と接続しつつ、同一責務に混ぜない。 | ACT001 Maintainer, ACT003 Reviewer | EXT001 GitHub | R005 |

## ボルトからの追跡

| ボルト | ユニット | 要求 |
|---|---|---|
| B001 | U001 | R001, R002, R005 |
| B002 | U002 | R003, R004, R005 |

## 設計からの追跡

| 設計 | ユニット | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| [design.md](units/U001-feedback-routing-contract/design.md) | U001 | R001, R002, R005 | UC001, UC003 | B001 |
| [design.md](units/U002-learning-promotion-contract/design.md) | U002 | R003, R004, R005 | UC002, UC003 | B002 |

## 既存コード分析からの追跡

| 分析 | 要求 | ユースケース | ユニット | ボルト | 設計 | 入力 |
|---|---|---|---|---|---|---|
| [codebase-analysis.md](codebase-analysis.md) | R001, R002, R005 | UC001, UC003 | U001 | B001 | [design.md](units/U001-feedback-routing-contract/design.md) | phase skill、内部 stage skill、実行時問題報告契約、Issue #257 の境界を入力にする。 |
| [codebase-analysis.md](codebase-analysis.md) | R003, R004, R005 | UC002, UC003 | U002 | B002 | [design.md](units/U002-learning-promotion-contract/design.md) | Steering knowledge、Domain Map、Context Map、validator/evaluator の責務境界を入力にする。 |

## ユニットからの追跡

| ユニット | コンテキスト | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| U001 | BC001 | R001, R002, R005 | UC001, UC003 | B001 |
| U002 | BC001 | R003, R004, R005 | UC002, UC003 | B002 |

## ドメインモデルからの追跡

| 種別 | 対象 | 要求 | ユースケース | 定義元 |
|---|---|---|---|---|
| サブドメイン | SD001 自己開発運用 | R001, R002, R003, R004, R005 | UC001, UC002, UC003 | [domain-map.md](../../../domain-map.md) |
| 境界づけられたコンテキスト | BC001 自己開発運用 | R001, R002, R003, R004, R005 | UC001, UC002, UC003 | [domain-map.md](../../../domain-map.md) |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260701-feedback-learning-loop | 20260701-skill-execution-reporting | Issue #259 は、Issue #248 の実行時問題報告を入力にして、後段 feedback と Intent 横断学習の扱いを標準化するため。 | [intents.md](../../../intents.md) |
| Issue | #259 | #248 | 実行時問題報告を学習ループの入力として扱うため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/259) |
| Issue | #259 | #257 | decision review と接続しつつ責務を分けるため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/257) |
| 要求 | R001 | なし | 前段へ戻す条件が他の分類の前提であるため。 | [requirements.md](requirements.md) |
| 要求 | R002 | R001 | 現在 Intent の前段修正と現在 phase 修正の区別には、前段へ戻す条件が必要であるため。 | [requirements.md](requirements.md) |
| 要求 | R003 | R002 | 昇格判断は、現在 Intent 内で直す対象を除外した後に行うため。 | [requirements.md](requirements.md) |
| 要求 | R004 | R002, R003 | 成果物責務の分離は、分類と昇格先判断を前提にするため。 | [requirements.md](requirements.md) |
| 要求 | R005 | R001, R002, R003, R004 | 検証結果と decision review の境界は、feedback 先と学習先の分類を前提にするため。 | [requirements.md](requirements.md) |
| ユーザーストーリー | S001 | なし | Maintainer の分類承認価値を表すため。 | [user-stories.md](user-stories.md) |
| ユースケース | UC001 | なし | 後段発見の分類が後続判断の前提であるため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC002 | UC001 | 横断学習の昇格判断は、現在 Intent 内の分類を前提にするため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC003 | UC001, UC002 | 証拠境界レビューは、feedback 先と学習先の分類結果を前提にするため。 | [use-cases.md](use-cases.md) |
| ユニット | U001 | なし | feedback routing が横断 learning promotion の前提であるため。 | [units.md](units.md) |
| ユニット | U002 | U001 | 横断 learning promotion は、現在 Intent 内で扱う発見を除外した後に判断するため。 | [units.md](units.md) |
| ボルト | B001 | なし | 前段 feedback routing の契約が、横断学習の分類契約の前提であるため。 | [bolts.md](bolts.md) |
| ボルト | B002 | B001 | 横断 learning promotion は、feedback routing の分類結果を前提にするため。 | [bolts.md](bolts.md) |
| 判断 | D001 | なし | Inception の所有境界を固定するため。 | [decisions.md](decisions.md) |
| 判断 | D002 | D001 | BC001 を採用済みコンテキストとして参照するため。 | [decisions.md](decisions.md) |
| 判断 | D003 | D001, D002 | Issue #257 と Issue #259 の責務境界を固定するため。 | [decisions.md](decisions.md) |
| 判断 | D004 | D001, D002, D003 | Unit と Bolt の粒度を固定するため。 | [decisions.md](decisions.md) |
