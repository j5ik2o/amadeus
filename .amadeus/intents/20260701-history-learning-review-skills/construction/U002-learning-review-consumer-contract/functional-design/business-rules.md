# Business Rules

## 目的

`amadeus-learning-review` と `amadeus-discovery dry-run` の責務境界を定義し、学習分類が成果物更新や Issue 作成へ直接進まないようにする。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | 学習分類は Issue #259 の分類契約に合わせる。 | R003, D003 | accepted |
| BR002 | `amadeus-learning-review` は質問を実行せず、質問が必要な場合は `amadeus-grilling` への handoff を返す。 | R003 | accepted |
| BR003 | `current_phase_update_required` は現在 phase 内で解消できる事項に限る。 | R003 | accepted |
| BR004 | `upstream_feedback_required` は現在 Intent の成功条件を妨げる前段成果物の不足や矛盾に限る。 | R003 | accepted |
| BR005 | `steering_knowledge_candidate`、`domain_map_candidate`、`context_map_candidate` は候補として報告し、直接反映しない。 | R003 | accepted |
| BR006 | `follow_up_issue_candidate` と `follow_up_intent_candidate` は人間承認後の後続作業候補として扱う。 | R003 | accepted |
| BR007 | `amadeus-discovery dry-run` は分析結果を入力にできるが、過去分析と学習分類を所有しない。 | R004 | accepted |
| BR008 | validator の `pass` は内容承認として扱わない。 | R003, R005 | accepted |

## 例外

| 条件 | 扱い | 根拠 |
|---|---|---|
| 分類に必要な根拠が不足している。 | `amadeus-grilling` への handoff を返す。 | R003 |
| 現在 Intent の成功条件外の改善が見つかった。 | 後続 Issue 候補または後続 Intent 候補として扱う。 | R003 |
| `dry-run` 本体の候補表示が必要になった。 | Issue #272 の Construction に残す。 | R004 |

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | 分類対象の入力証拠と対象 Intent または対象成果物を追跡できる。 | R003 | accepted |
| INV001 | 不変条件 | `amadeus-learning-review` は成果物を更新しない。 | R003 | accepted |
| INV002 | 不変条件 | `amadeus-learning-review` は GitHub Issue を作成しない。 | R003 | accepted |
| INV003 | 不変条件 | `amadeus-learning-review` は Domain Map と Context Map へ自動昇格しない。 | R003 | accepted |
| INV004 | 不変条件 | `amadeus-discovery dry-run` は過去分析と学習分類を所有しない。 | R004 | accepted |
| POST001 | 事後条件 | 分類結果、根拠、戻り先が説明できる。 | R003 | accepted |
| POST002 | 事後条件 | source skill、昇格先成果物、text contract の同期を検証できる。 | R005 | accepted |

## 未確認事項

なし。
