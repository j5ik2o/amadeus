# スコープ

## 対象境界

### 対象

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-IN-001 | phase skill 起動時に decision tree を構築し、現在参照できる証拠から判断ノードを再評価する。 | [Issue #257](https://github.com/amadeus-dlc/amadeus/issues/257) | 採用 |
| SC-IN-002 | 不明瞭な判断ノードを、grill_required、no_grill、repair_only、follow_up_issue_candidate のような処理分岐へ分類する。 | [Issue comment](https://github.com/amadeus-dlc/amadeus/issues/257#issuecomment-4853559512) | 採用 |
| SC-IN-003 | `amadeus-grilling` は質問を担当し、decision review は一問、確認理由、推奨回答、推奨理由、反映先候補を選ぶ責務に限定する。 | [Issue comment](https://github.com/amadeus-dlc/amadeus/issues/257#issuecomment-4853559512) | 採用 |
| SC-IN-004 | validator の構造検出と decision review の判断ゲートを分ける。 | [Issue comment](https://github.com/amadeus-dlc/amadeus/issues/257#issuecomment-4853559512) | 採用 |
| SC-IN-005 | Ideation、Inception、Construction の公開 phase skill が同じ判断規則を参照できるようにする。 | [Issue #257](https://github.com/amadeus-dlc/amadeus/issues/257) | 採用 |
| SC-IN-006 | Skill Contract と既存成果物を decision review の入力証拠として使う方針を整理する。 | [20260701-skill-contract-catalog](../../20260701-skill-contract-catalog.md) | 採用 |

### 対象外

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-OUT-001 | 各 phase の成果物構造を再設計する。 | [Issue #257](https://github.com/amadeus-dlc/amadeus/issues/257) | 採用 |
| SC-OUT-002 | Grilling Decision Trail の配置を変更する。 | [Issue #257](https://github.com/amadeus-dlc/amadeus/issues/257) | 採用 |
| SC-OUT-003 | validator を網羅的な意味検証へ拡張する。 | [Issue #257](https://github.com/amadeus-dlc/amadeus/issues/257) | 採用 |
| SC-OUT-004 | 既存 Intent 成果物を一括移行する。 | [Issue #257](https://github.com/amadeus-dlc/amadeus/issues/257) | 採用 |
| SC-OUT-005 | `amadeus-grilling` の質問作法そのものを全面変更する。 | [Issue comment](https://github.com/amadeus-dlc/amadeus/issues/257#issuecomment-4853559512) | 採用 |
| SC-OUT-006 | 初期 Ideation で後続 phase の詳細成果物や実装を作る。 | [amadeus-ideation](../../../.agents/skills/amadeus-ideation/SKILL.md) | 採用 |

## 実行制御

| 項目 | 値 | 理由 |
|---|---|---|
| 実行スコープ | refactor | 既存の phase skill と補助 skill の起動判断を、共通契約として整理するため。 |
| 省略 stage | なし | decision review の責務、入力、戻り値、phase skill 反映を Inception と Construction で分解する必要があるため。 |

## 成果物深度

| 項目 | 値 | 理由 |
|---|---|---|
| 深度 | standard | 判断ノード、証拠、分岐、grilling 連携、validator との違いを追跡できる粒度が必要であるため。 |

## 検証戦略

| 項目 | 値 | 理由 |
|---|---|---|
| 戦略 | standard | phase skill の文書契約、Skill Contract 参照、validator との責務分離、template または eval の確認が必要になるため。 |

## Inception への引き継ぎ

- `amadeus-decision-review` を内部 skill として定義するか、公開 phase skill の共通節として定義するかを判断する。
- decision review の入力証拠を、既存成果物、Issue、PR、作業ツリー、validator 結果、Skill Contract、信頼できる参照元に分けて定義する。
- decision review の戻り値を、`grill_required`、`no_grill`、`repair_only`、`follow_up_issue_candidate` などの処理分岐として要求化する。
- `amadeus-grilling` に渡す一問、確認理由、推奨回答、推奨理由、反映先候補の最小項目を定義する。
- validator の `pass` と decision review の判断結果を混同しない説明を acceptance に落とす。
- Ideation、Inception、Construction の公開 phase skill で共通規則を参照する範囲を決める。
