# スコープ

## 対象境界

### 対象

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-IN-001 | `.amadeus/` の過去成果物を横断分析する `amadeus-history-review` を内部 skill として追加する。 | [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277) | 採用 |
| SC-IN-002 | `amadeus-history-review` が成果物更新、Issue 作成、Intent Record 作成、自動昇格を行わない読み取り専用の分析責務を持つことを説明する。 | [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277) | 採用 |
| SC-IN-003 | `amadeus-learning-review` が過去分析結果、validator 結果、evaluator 結果、Issue、PR、CI 結果から学習先を分類する責務を定義する。 | [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277) | 採用 |
| SC-IN-004 | Issue #259 の学習分類と矛盾しない分類結果を内部 skill の出力として扱う。 | [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259) | 採用 |
| SC-IN-005 | Issue #272 の `dry-run` が分析結果を入力にできるが、過去分析と学習分類を所有しない責務境界を定義する。 | [Issue #272](https://github.com/amadeus-dlc/amadeus/issues/272) | 採用 |
| SC-IN-006 | source skill、昇格先成果物、eval または text contract の同期と検証を扱う。 | [steering/policies.md](../../../steering/policies.md) | 採用 |

### 対象外

| 識別子 | 境界 | 根拠 | 状態 |
|---|---|---|---|
| SC-OUT-001 | `amadeus-discovery dry-run` を実装する。 | [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277) | 採用 |
| SC-OUT-002 | Discovery 成果物の構造を変更する。 | [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277) | 採用 |
| SC-OUT-003 | Intent Record を自動作成する。 | [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277) | 採用 |
| SC-OUT-004 | GitHub Issue を自動作成する。 | [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277) | 採用 |
| SC-OUT-005 | Domain Map、Context Map、Steering knowledge へ自動昇格する。 | [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277) | 採用 |
| SC-OUT-006 | 完了済み Intent 成果物を一括移行する。 | [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277) | 採用 |
| SC-OUT-007 | validator を意味検証エンジンへ拡張する。 | [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277) | 採用 |
| SC-OUT-008 | 初期 Ideation で後続 phase の詳細成果物や実装を作る。 | [amadeus-ideation](../../../.agents/skills/amadeus-ideation/SKILL.md) | 採用 |

## 実行制御

| 項目 | 値 | 理由 |
|---|---|---|
| 実行スコープ | refactor | 既存の学習分類契約を内部 skill と検証観点へ具体化し、`dry-run` の前提を補修するため。 |
| 省略 stage | なし | 内部 skill の責務、入力、出力、同期、検証を Inception と Construction で分解する必要があるため。 |

## 成果物深度

| 項目 | 値 | 理由 |
|---|---|---|
| 深度 | standard | 過去分析と学習分類の責務差分、禁止する副作用、`dry-run` との境界、検証観点を追跡できる粒度が必要であるため。 |

## 検証戦略

| 項目 | 値 | 理由 |
|---|---|---|
| 戦略 | standard | source skill、昇格先成果物、promote-skill、text contract、validator、必要な標準検証を確認する必要があるため。 |

## Inception への引き継ぎ

- `amadeus-history-review` の入力対象、抽出項目、出力形式、副作用の禁止を要求として定義する。
- `amadeus-learning-review` の入力、分類結果、質問が必要な場合の `amadeus-grilling` 連携、成果物更新が必要な場合の phase skill 連携を定義する。
- `amadeus-history-review` と `amadeus-learning-review` を分けるか、片方に統合するかを判断する。
- 統合する場合は、同等の責務を持つ内部 skill を追加しない理由を `decisions.md` に残す。
- Issue #272 の `dry-run` は分析結果を入力にできるが、過去分析と学習分類を所有しないことを acceptance に落とす。
- `skills/` と `.agents/skills/` の同期手段、必要な eval または text contract、validator 確認を Construction の完了条件へ渡す。
