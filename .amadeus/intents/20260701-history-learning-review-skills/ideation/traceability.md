# 追跡

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| Intent | 20260701-history-learning-review-skills | [20260701-history-learning-review-skills.md](../../20260701-history-learning-review-skills.md) | Inception の要求分析で参照する。 |
| Issue | #277 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/277) | Requirement、Acceptance、Use Case、Unit、Bolt の根拠にする。 |
| 先行 Intent | 20260701-feedback-learning-loop | [state.json](../../20260701-feedback-learning-loop/state.json) | Issue #259 の学習分類契約を内部 skill の入力にする。 |
| 関連 Issue | #272 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/272) | `dry-run` が分析結果を入力にできる責務境界の根拠にする。 |
| 対象境界 | `.amadeus/` 過去分析と学習分類の内部 skill | [scope.md](scope.md) | Inception の Requirement、Use Case、Unit、Bolt の対象と対象外の制約にする。 |
| 実行制御 | refactor、stage 省略なし | [scope.md](scope.md) | Inception から Construction へ進める前提にする。 |
| 成果物深度 | standard | [scope.md](scope.md) | 内部 skill の責務差分、出力、副作用の禁止、検証観点を分解する入力にする。 |
| 検証戦略 | standard | [scope.md](scope.md) | source skill、昇格先成果物、eval、validator の確認を PR 準備条件にする。 |
| Mock | 初期確認 | [initial-confirmation.puml](mocks/initial-confirmation.puml) | Inception で過去分析、学習分類、`dry-run` 入力の関係を確認する例にする。 |
| 状態 | Ideation completed | [state.json](../state.json) | Inception へ進める前提にする。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260701-history-learning-review-skills | 20260701-feedback-learning-loop | Issue #277 は、Issue #259 の学習分類契約を内部 skill として具体化するため。 | [intents.md](../../../intents.md) |
| Issue | #277 | #259 | Issue #259 では内部 skill 候補を初期完了条件に含めなかったため、#277 で前提補修として扱う。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/259) |
| Issue | #277 | #272 | Issue #272 の `dry-run` が過去分析結果を入力にできる前提を作るため。 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/272) |
| 外部システム | EXT001 GitHub | なし | Issue、PR、CI 結果、後続 Issue 候補を追跡の根拠に使うため。 | [external-systems.md](../../../steering/external-systems.md) |
| アクター | ACT001 Maintainer | なし | 内部 skill の追加範囲、統合判断、昇格候補を承認するため。 | [actors.md](../../../steering/actors.md) |

## 受け入れ条件への対応

| 受け入れ条件 | Ideation での扱い | Inception への引き渡し |
|---|---|---|
| `amadeus-history-review` の追加 | scope の SC-IN-001 に記録した。 | 入力対象、抽出項目、出力形式を要求化する。 |
| 過去成果物の横断分析責務 | scope の SC-IN-001 と ideation の初期モックに記録した。 | 読み取り対象と抽出観点を具体化する。 |
| 副作用を行わないこと | scope の SC-IN-002 に記録した。 | acceptance に成果物更新、Issue 作成、Intent Record 作成、自動昇格の禁止を落とす。 |
| `amadeus-learning-review` の追加または追加しない理由 | scope の Inception 引き継ぎに記録した。 | 内部 skill 分割または統合判断を decisions に残す。 |
| 責務差分 | scope の SC-IN-003 と mock に記録した。 | `history-review` と `learning-review` の入力、出力、呼び出し順序を定義する。 |
| Issue #259 の分類との整合 | scope の SC-IN-004 に記録した。 | 分類結果を要求と acceptance に落とす。 |
| Issue #272 の `dry-run` との境界 | scope の SC-IN-005 に記録した。 | `dry-run` は分析結果を入力にするだけで、分析責務を所有しないことを明記する。 |
| `skills/` と `.agents/skills/` の同期 | scope の SC-IN-006 に記録した。 | Construction の完了条件に promote-skill と検証結果を含める。 |
| eval または text contract | scope の SC-IN-006 と ideation の未確定事項に記録した。 | 必要な評価観点を Bolt に分ける。 |

## 逆方向 feedback

Ideation で見つかった不足は、Inception 開始時の decision review で再確認する。

Inception 以降で `amadeus-history-review`、`amadeus-learning-review`、`amadeus-discovery dry-run` の責務境界が不足すると分かった場合は、後段成果物だけを補修せず、Ideation の該当成果物へ戻す。
