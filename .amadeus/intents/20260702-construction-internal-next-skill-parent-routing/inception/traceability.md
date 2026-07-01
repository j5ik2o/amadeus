# 追跡

## 要求からの追跡

| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト |
|---|---|---|---|---|---|
| R001 | ACT002 Agent | S001 | UC001, UC002 | U001 | B001 |
| R002 | ACT002 Agent | S001 | UC001, UC003 | U001 | B002 |
| R003 | ACT002 Agent | S001, S002 | UC001, UC002, UC003, UC004 | U001 | B001, B002, B003 |
| R004 | ACT002 Agent | S001, S002 | UC001, UC002, UC003, UC004 | U001 | B001, B002, B003 |
| R005 | ACT001 Maintainer | S002 | UC002, UC003, UC004 | U001 | B003 |

## 対象境界からの追跡

| 対象境界 | 要求 | ユーザーストーリー | ユースケース | ユニット | ボルト | 扱い |
|---|---|---|---|---|---|---|
| SC-IN-001 | R001 | S001 | UC001, UC002 | U001 | B001 | 実装後の親 skill 経由検証として扱う。 |
| SC-IN-002 | R002 | S001 | UC001, UC003 | U001 | B002 | 検証後の親 skill 経由ファイナライズとして扱う。 |
| SC-IN-003 | R003 | S001, S002 | UC001, UC002, UC003, UC004 | U001 | B001, B002, B003 | 内部 skill 直接利用条件として扱う。 |
| SC-IN-004 | R004 | S001, S002 | UC001, UC002, UC003, UC004 | U001 | B001, B002, B003 | Construction 完了までの順序として扱う。 |
| SC-IN-005 | R005 | S002 | UC004 | U001 | B003 | 周辺 skill と source skill / 昇格先成果物の整合確認として扱う。 |

## 背景からの追跡

| 目的 | アクター | 外部システム | 要求 |
|---|---|---|---|
| Construction 内部 skill の `次の skill` 欄から、親 skill 経由で継続する目的を読み取れるようにする。 | ACT001 Maintainer, ACT002 Agent, ACT003 Reviewer | EXT001 GitHub | R001, R002, R003, R004, R005 |
| `test-results.md` 作成後に止まり、traceability finalization を忘れるリスクを減らす。 | ACT002 Agent | なし | R002, R004 |

## ボルトからの追跡

| ボルト | ユニット | 要求 |
|---|---|---|
| B001 | U001 | R001, R003, R004 |
| B002 | U001 | R002, R003, R004 |
| B003 | U001 | R003, R004, R005 |

## 設計からの追跡

| 設計 | ユニット | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| [design.md](units/U001-construction-next-skill-guidance/design.md) | U001 | R001, R002, R003, R004, R005 | UC001, UC002, UC003, UC004 | B001, B002, B003 |

## 既存コード分析からの追跡

| 分析 | 要求 | ユースケース | ユニット | ボルト | 設計 | 入力 |
|---|---|---|---|---|---|---|
| [codebase-analysis.md](codebase-analysis.md) | R001, R003, R004 | UC001, UC002 | U001 | B001 | [design.md](units/U001-construction-next-skill-guidance/design.md) | 実装後に親 skill を検証目的で呼ぶ案内と直接委譲条件。 |
| [codebase-analysis.md](codebase-analysis.md) | R002, R003, R004 | UC001, UC003 | U001 | B002 | [design.md](units/U001-construction-next-skill-guidance/design.md) | 検証後に親 skill をファイナライズ目的で呼ぶ案内と直接委譲条件。 |
| [codebase-analysis.md](codebase-analysis.md) | R003, R004, R005 | UC004 | U001 | B003 | [design.md](units/U001-construction-next-skill-guidance/design.md) | source skill、昇格先成果物、周辺 skill の整合確認。 |

## ユニットからの追跡

| ユニット | コンテキスト | 要求 | ユースケース | ボルト |
|---|---|---|---|---|
| U001 | BC001 | R001, R002, R003, R004, R005 | UC001, UC002, UC003, UC004 | B001, B002, B003 |

## ドメインモデルからの追跡

| 種別 | 対象 | 要求 | ユースケース | 定義元 |
|---|---|---|---|---|
| サブドメイン | SD001 自己開発運用 | R001, R002, R003, R004, R005 | UC001, UC002, UC003, UC004 | [domain-map.md](../../../domain-map.md) |
| 境界づけられたコンテキスト | BC001 自己開発運用 | R001, R002, R003, R004, R005 | UC001, UC002, UC003, UC004 | [domain-map.md](../../../domain-map.md) |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260702-construction-internal-next-skill-parent-routing | 20260701-construction-finalization-traceability-skill | Issue #274 は、Construction finalization を忘れないための次工程案内を扱い、Issue #245 の追跡要件と同じ公開入口契約を前提にするため。 | [intents.md](../../../intents.md) |
| 要求 | R001 | なし | 実装後の継続目的が、後続案内の前提であるため。 | [requirements.md](requirements.md) |
| 要求 | R002 | R001 | 検証後のファイナライズ案内は、実装後に検証へ進む流れを前提にするため。 | [requirements.md](requirements.md) |
| 要求 | R003 | R001, R002 | 直接呼び出し条件は、親 skill 経由の継続目的を前提に説明するため。 | [requirements.md](requirements.md) |
| 要求 | R004 | R001, R002, R003 | Construction 完了条件は、実装、検証、ファイナライズの順序と直接委譲条件を前提にするため。 | [requirements.md](requirements.md) |
| 要求 | R005 | R001, R002, R003, R004 | source skill と昇格先成果物の整合確認は、採用する案内内容を前提にするため。 | [requirements.md](requirements.md) |
| ユーザーストーリー | S001 | なし | Agent の次工程判断価値を表すため。 | [user-stories.md](user-stories.md) |
| ユーザーストーリー | S002 | S001 | Maintainer の整合確認は Agent が読む案内内容を前提にするため。 | [user-stories.md](user-stories.md) |
| ユースケース | UC001 | なし | 既存案内の確認が説明更新の前提であるため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC002 | UC001 | 実装後案内は現状の `次の skill` 欄を確認してから更新するため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC003 | UC001, UC002 | 検証後案内は現状確認と実装後案内の表現方針を前提に更新するため。 | [use-cases.md](use-cases.md) |
| ユースケース | UC004 | UC002, UC003 | 整合レビューは主要対象 skill の更新結果を前提にするため。 | [use-cases.md](use-cases.md) |
| ユニット | U001 | なし | この Intent は単一の価値境界を扱うため。 | [units.md](units.md) |
| ボルト | B001 | なし | 実装後案内は最初の更新対象であるため。 | [bolts.md](bolts.md) |
| ボルト | B002 | B001 | B001 で採用した表現方針を前提にそろえるため。 | [bolts.md](bolts.md) |
| ボルト | B003 | B001, B002 | 整合確認は主要対象2 skill の案内更新を前提にするため。 | [bolts.md](bolts.md) |
| 判断 | D001 | なし | Inception の所有境界を固定するため。 | [decisions.md](decisions.md) |
| 判断 | D002 | D001 | BC001 を採用済みコンテキストとして参照するため。 | [decisions.md](decisions.md) |
| 判断 | D003 | D001, D002 | Unit と Bolt の粒度を固定するため。 | [decisions.md](decisions.md) |
