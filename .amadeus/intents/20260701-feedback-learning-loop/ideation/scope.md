# スコープ

## 対象境界

### 対象

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-IN-001 | 後段から前段への feedback loop を定義する。 | [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259) | 採用 |
| SC-IN-002 | 完了済み Intent から次 Intent へ再利用する学習の抽出と分類を定義する。 | [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259) | 採用 |
| SC-IN-003 | 現在 Intent の前段成果物、現在 phase、Steering knowledge、Domain Map、Context Map、後続 Issue、後続 Intent、不採用へ分類する。 | [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259) | 採用 |
| SC-IN-004 | `学習候補`、`traceability.md`、`decisions.md`、`.amadeus/steering/knowledge.md` の役割を分ける。 | [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259) | 採用 |
| SC-IN-005 | validator と evaluator の結果を構造検出、品質評価、学習候補に分類する。 | [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259) | 採用 |
| SC-IN-006 | Issue #257 の decision review と grilling 起動条件に接続するが、この Intent の責務へ混ぜない。 | [Issue #257](https://github.com/amadeus-dlc/amadeus/issues/257) | 採用 |

### 対象外

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-OUT-001 | モデル自体の重み更新を扱う。 | [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259) | 採用 |
| SC-OUT-002 | 外部の学習基盤やデータベースを導入する。 | [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259) | 採用 |
| SC-OUT-003 | Operation phase を全面設計する。 | [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259) | 採用 |
| SC-OUT-004 | 完了済み Intent 成果物を一括移行する。 | [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259) | 採用 |
| SC-OUT-005 | validator を意味検証エンジンへ拡張する。 | [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259) | 採用 |
| SC-OUT-006 | 初期 Ideation で後続 phase の詳細成果物や実装を作る。 | [amadeus-ideation](../../../.agents/skills/amadeus-ideation/SKILL.md) | 採用 |

## 実行制御

| 項目 | 値 | 理由 |
|---|---|---|
| 実行スコープ | refactor | 既存の phase と成果物を増やす前に、後段 feedback と Intent 横断学習の契約を整理するため。 |
| 省略 stage | なし | feedback 条件、学習分類、skill 連携、検証方針を Inception で分解し、Construction で反映する必要があるため。 |

## 成果物深度

| 項目 | 値 | 理由 |
|---|---|---|
| 深度 | standard | 前段成果物への戻し先、学習先分類、成果物責務を追跡できる粒度が必要であるため。 |

## 検証戦略

| 項目 | 値 | 理由 |
|---|---|---|
| 戦略 | standard | validator、diff check、必要な typecheck で、成果物構造と後続 stage への引き継ぎを確認するため。 |

## Inception への引き継ぎ

- 後段 phase が前段成果物へ戻る条件を要求として定義する。
- feedback 先ごとに使う phase skill または内部 stage skill を定義する。
- Intent 横断の学習先分類を要求またはユースケースとして具体化する。
- `学習候補`、`traceability.md`、`decisions.md`、`.amadeus/steering/knowledge.md` の責務差を acceptance へ落とす。
- validator と evaluator の結果を、構造検出、品質評価、学習候補に分ける。
- Issue #257 は decision review の起動条件として参照し、この Intent では学習分類と feedback 先を扱う。
