# 追跡

## 要求からの追跡

| 要求 | アクター | ストーリー | ユースケース | ユニット | ボルト | タスク |
|---|---|---|---|---|---|---|
| R001 | ACT001 | S001 | UC001 | U001 | B001 | T001, T002, T003 |
| R002 | ACT001 | S002 | UC002 | U002 | B002 | T004, T005, T006 |

## 背景からの追跡

| 目的 | アクター | 外部システム | 要求 |
|---|---|---|---|
| OBJ001 | ACT001, ACT002, ACT003 | EXT001 | R001 |
| OBJ001 | ACT001, ACT002 | なし | R002 |

## ボルトからの追跡

| ボルト | ユニット | 要求 |
|---|---|---|
| B001 | U001 | R001 |
| B002 | U002 | R002 |

## ドメインモデルからの追跡

| 種別 | 対象 | 要求 | ユースケース | 定義元 |
|---|---|---|---|---|
| 概念 | アカウント | R001, R002 | UC001, UC002 | [domain/model.md](domain/model.md) |
| 概念 | アカウント識別子 | R001 | UC001 | [domain/model.md](domain/model.md) |
| 概念 | 認証情報 | R002 | UC002 | [domain/model.md](domain/model.md) |
| 概念 | 再設定トークン | R001, R002 | UC001, UC002 | [domain/model.md](domain/model.md) |
| 概念 | 再設定手段 | R001 | UC001 | [domain/model.md](domain/model.md) |
| 事前条件 | PRE001 | R001 | UC001 | [domain/contracts.md](domain/contracts.md) |
| 事前条件 | PRE002 | R001 | UC001 | [domain/contracts.md](domain/contracts.md) |
| 事前条件 | PRE003 | R002 | UC002 | [domain/contracts.md](domain/contracts.md) |
| 事前条件 | PRE004 | R002 | UC002 | [domain/contracts.md](domain/contracts.md) |
| 不変条件 | INV001 | R002 | UC002 | [domain/contracts.md](domain/contracts.md) |
| 不変条件 | INV002 | R001, R002 | UC002 | [domain/contracts.md](domain/contracts.md) |
| 不変条件 | INV003 | R002 | UC002 | [domain/contracts.md](domain/contracts.md) |
| 不変条件 | INV004 | R002 | UC002 | [domain/contracts.md](domain/contracts.md) |
| 不変条件 | INV005 | R002 | UC002 | [domain/contracts.md](domain/contracts.md) |
| 不変条件 | INV006 | R001 | UC001 | [domain/contracts.md](domain/contracts.md) |
| 事後条件 | POST001 | R001 | UC001 | [domain/contracts.md](domain/contracts.md) |
| 事後条件 | POST002 | R001 | UC001 | [domain/contracts.md](domain/contracts.md) |
| 事後条件 | POST003 | R002 | UC002 | [domain/contracts.md](domain/contracts.md) |
| 事後条件 | POST004 | R002 | UC002 | [domain/contracts.md](domain/contracts.md) |
| 事後条件 | POST005 | R002 | UC002 | [domain/contracts.md](domain/contracts.md) |

## 依存関係からの追跡

依存関係は、成果物の対応関係とは別に追跡する。
依存は順序や前提を示すが、各成果物が何を作るか、何を確認するかの説明の代わりにはならない。

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260626-password-reset | なし | 単独で成立するパスワード再設定の目的であり、先行インテントの成果を前提にしない。 | [intents.md](../../intents.md) |
| 要求 | R001 | なし | パスワード再設定要求の入口であり、先行要求の成立を前提にしない。 | [requirements.md](requirements.md) |
| 要求 | R002 | R001 | 認証情報更新は、R001 が成立させる再設定トークン発行を前提にする。 | [requirements.md](requirements.md) |
| ユーザーストーリー | S001 | なし | パスワード再設定要求の入口であり、先行ストーリーの達成を前提にしない。 | [user-stories.md](user-stories.md) |
| ユーザーストーリー | S002 | S001 | 認証情報更新は、S001 で得られる再設定トークンを利用者が受け取ることを前提にする。 | [user-stories.md](user-stories.md) |
| ユースケース | UC001 | なし | パスワード再設定要求の入口であり、先行ユースケースの完了を前提にしない。 | [use-cases.md](use-cases.md) |
| ユースケース | UC002 | UC001 | 認証情報更新は、UC001 で発行された再設定トークンを利用者が受け取ることを前提にする。 | [use-cases.md](use-cases.md) |
| ユニット | U001 | なし | パスワード再設定要求の入口であり、先行ユニットの価値を前提にしない。 | [units.md](units.md) |
| ユニット | U002 | U001 | 認証情報更新は、U001 が成立させる再設定トークン発行を前提にする。 | [units.md](units.md) |
| ボルト | B001 | なし | パスワード再設定要求の入口であり、先行ボルトの成果を前提にしない。 | [bolts.md](bolts.md) |
| ボルト | B002 | B001 | 認証情報更新は、B001 が定義する再設定トークン発行の成果を前提にする。 | [bolts.md](bolts.md) |
| タスク | B001/T001 | なし | パスワード再設定要求の入力定義から開始できる。 | [bolts/B001-password-reset-request-flow/tasks.md](bolts/B001-password-reset-request-flow/tasks.md) |
| タスク | B001/T002 | B001/T001 | 再設定トークン発行の振る舞いは、入力定義を前提にする。 | [bolts/B001-password-reset-request-flow/tasks.md](bolts/B001-password-reset-request-flow/tasks.md) |
| タスク | B001/T003 | B001/T001, B001/T002 | 存在有無を推測できない応答の検証は、入力定義とトークン発行の振る舞いを前提にする。 | [bolts/B001-password-reset-request-flow/tasks.md](bolts/B001-password-reset-request-flow/tasks.md) |
| タスク | B002/T004 | B001/T002 | 再設定トークン検証の条件定義は、再設定トークン発行の振る舞いを前提にする。 | [bolts/B002-credential-update-flow/tasks.md](bolts/B002-credential-update-flow/tasks.md) |
| タスク | B002/T005 | B002/T004 | 認証情報更新の振る舞いは、再設定トークン検証条件を前提にする。 | [bolts/B002-credential-update-flow/tasks.md](bolts/B002-credential-update-flow/tasks.md) |
| タスク | B002/T006 | B002/T004, B002/T005 | 再設定トークン消費後の再利用不可検証は、検証条件と認証情報更新の振る舞いを前提にする。 | [bolts/B002-credential-update-flow/tasks.md](bolts/B002-credential-update-flow/tasks.md) |
| 判断 | D001 | なし | ボルト配置の基本方針であり、先行判断の採用を前提にしない。 | [decisions.md](decisions.md) |
