# スコープ

## 対象境界

### 対象

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-IN-001 | `amadeus-contracts` に Skill Contract の型と catalog を追加する方針を定義する。 | [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263) | 採用 |
| SC-IN-002 | 代表 skill の事前条件、不変条件、事後条件、読み取り境界、書き込み境界、委譲先、grilling 条件、feedback 条件を契約対象にする。 | [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263) | 採用 |
| SC-IN-003 | `skills/amadeus-*/references/skill-contract.md` または同等の生成物を生成参照できるようにする。 | [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263) | 採用 |
| SC-IN-004 | `contracts:generate` と `contracts:check` で生成物の作成とずれ検出を扱う。 | [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263) | 採用 |
| SC-IN-005 | validator または evaluator が Skill Contract を参照する入口を定義する。 | [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263) | 採用 |
| SC-IN-006 | Issue #257 の decision review と Issue #259 の learning review が Skill Contract を入力にできる設計へ接続する。 | [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263) | 採用 |

### 対象外

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-OUT-001 | 全 skill へ一括適用する。 | [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263) | 採用 |
| SC-OUT-002 | 既存 `SKILL.md` を全面再構成する。 | [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263) | 採用 |
| SC-OUT-003 | validator を意味検証エンジンへ拡張する。 | [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263) | 採用 |
| SC-OUT-004 | TypeScript 契約から skill 本文を完全生成する。 | [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263) | 採用 |
| SC-OUT-005 | 各 skill の `references/` に手書き契約を置く。 | [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263) | 採用 |
| SC-OUT-006 | 初期 Ideation で後続 phase の詳細成果物や実装を作る。 | [amadeus-ideation](../../../.agents/skills/amadeus-ideation/SKILL.md) | 採用 |

## 実行制御

| 項目 | 値 | 理由 |
|---|---|---|
| 実行スコープ | refactor | 既存の `amadeus-contracts` と代表 skill を前提に、skill 実行契約の管理元と生成参照を整理するため。 |
| 省略 stage | なし | Skill Contract の型、生成物、検証入口、代表 skill 適用を Inception で分解し、Construction で反映する必要があるため。 |

## 成果物深度

| 項目 | 値 | 理由 |
|---|---|---|
| 深度 | standard | Skill Contract の契約要素、生成物、参照入口、代表 skill の適用範囲を追跡できる粒度が必要であるため。 |

## 検証戦略

| 項目 | 値 | 理由 |
|---|---|---|
| 戦略 | standard | typecheck、contracts:generate、contracts:check、validator または evaluator の入口確認で、生成物と契約参照の整合を確認するため。 |

## Inception への引き継ぎ

- Skill Contract の TypeScript 型に含める項目を要求として定義する。
- 最初の代表 skill を `amadeus-ideation`、`amadeus-inception`、`amadeus-construction`、`amadeus-grilling`、`amadeus-validator` に限定する。
- `references/skill-contract.md` を生成物として扱うか、同等の生成物にするかを判断する。
- validator または evaluator が参照する生成物の入口を整理する。
- `SKILL.md` と生成物の不整合を検出する方法を定義する。
- Issue #257 と Issue #259 の補助 skill が参照する契約入力を整理する。
