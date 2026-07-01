# ユニット

## 一覧

| 識別子 | 概要 | 要求 | コンテキスト | 依存 | 詳細 |
|---|---|---|---|---|---|
| U001 | decision review の入力証拠、判断ノード、分岐、grilling handoff 契約を扱う。 | R001, R002, R003 | BC001 | なし | [U001-decision-review-gate-contract.md](units/U001-decision-review-gate-contract.md) |
| U002 | 公開 phase skill への共通規則反映と、Skill Contract、validator、evaluator との境界を扱う。 | R004, R005 | BC001 | U001 | [U002-phase-skill-adoption-verification.md](units/U002-phase-skill-adoption-verification.md) |

Unit の `コンテキスト` は Domain Map の `adopted` Bounded Context を参照する。

## 依存関係

| ユニット | 依存 | 理由 |
|---|---|---|
| U001 | なし | decision review の判断ゲート契約が全体の前提であるため。 |
| U002 | U001 | 公開 phase skill 反映と検証境界は、判断ゲート契約を前提にするため。 |
