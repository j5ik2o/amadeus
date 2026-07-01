# Unit Design Brief

## 概要

この文書は Unit Design Brief である。
Inception では、Unit の課題解決方針を定め、Bolt 分割と Construction へ渡す設計入力だけを扱う。
詳細な Domain Design、Logical Design、実装設計、テスト設計は Construction で確定する。

## 設計戦略

- 後段発見を、前段 feedback、現在 phase 修正、後続 Issue、後続 Intent、不採用へ分類する共通契約として定義する。
- 前段成果物へ戻す場合は、対象成果物を所有する phase skill または内部 stage skill を使う。
- 現在 phase 内の補修で解ける場合は、現在 phase の repair または該当内部 stage skill へ渡す。
- 人間判断が必要な場合は、`amadeus-grilling` に一問だけ渡す。

## 責務境界

- 所有するもの: 後段発見の分類、前段へ戻す条件、現在 phase 修正との区別、後続化との区別。
- 所有しないもの: Steering knowledge、Domain Map、Context Map への昇格条件の詳細、個別成果物の内容更新、実装手順。
- 依存してよいもの: `traceability.md`、`decisions.md`、phase skill、内部 stage skill、Issue #257 の decision review。
- 後続で再確認が必要になる条件: Issue #257 の成果物が先に確定し、decision review の起動順序が変わる場合。

## 構成候補

- feedback 分類契約。
- 前段成果物 routing 表。
- 現在 phase 修正と後続化の分類ルール。
- `amadeus-grilling` への質問委譲条件。

## データと契約候補

- 入力候補: 発見元 phase、stage、成果物、検証結果、review comment、関連 Issue、関連 PR。
- 出力候補: `upstream_feedback_required`、`current_phase_update_required`、`follow_up_issue_candidate`、`follow_up_intent_candidate`、`no_learning_action`。
- 状態候補: 分類済み、質問待ち、反映済み、後続化候補、不採用。
- 事前条件候補: 対象 Intent と発見元の成果物が追跡できること。
- 事後条件候補: 分類結果と反映先が成果物または作業報告に残ること。
- 不変条件候補: 前段成果物の不整合を後段成果物だけで隠さないこと。

## 検証観点

- skill 契約から、前段へ戻す条件と現在 phase で直す条件を読める。
- phase skill または内部 stage skill の戻し先が説明されている。
- 現在 Intent 対象外の改善は後続 Issue または後続 Intent 候補として分けられる。
- validator の `pass` を内容承認として扱わない説明が残っている。

## Bolt 分割方針

- B001 で、前段 feedback routing の共通契約を source skill と昇格先 skill に反映する。

## Construction への引き継ぎ

- Domain Design で確定する事項: なし。
- Logical Design で確定する事項: 分類契約をどの skill 節へ置くか。
- 実装時に確認する事項: source skill と昇格先 skill の同期、eval での期待文言。
- 検証時に確定する事項: validator、typecheck、関連 eval、diff check の結果。
