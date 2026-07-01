# `.amadeus/` 過去分析と学習分類の内部 skill

## 目標プロファイル

| フィールド | 値 | 説明 |
|---|---|---|
| goalType | technical | Amadeus の内部 skill と学習分類の実行契約を追加する技術目標である。 |
| scope | refactor | 既存の後段 feedback と Intent 横断学習の契約を前提に、内部 skill と検証観点を追加する Intent である。 |
| labels | history-review, learning-review, internal-skill, discovery, self-development | 過去分析、学習分類、内部 skill、Discovery 連携、自己開発を表す。 |

## 目的

`.amadeus/` の過去成果物を横断分析する内部 skill と、分析結果を学習先へ分類する内部 skill を追加する。

この Intent は [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277) を根拠にする。

Issue #259 では、後段 feedback と Intent 横断の学習ループを Amadeus DLC に定義した。
ただし、`amadeus-history-review` と `amadeus-learning-review` の skill 本体は作られていない。

Issue #272 の `amadeus-discovery dry-run` は、過去分析結果を入力にできる必要がある。
この Intent では、`dry-run` に過去分析と学習分類の責務を混ぜず、専用の内部 skill として切り出す。

## 成功条件

- `amadeus-history-review` の内部 skill が追加されている。
- `amadeus-history-review` が `.amadeus/` の過去成果物を横断分析する責務を説明している。
- `amadeus-history-review` が成果物更新、Issue 作成、Intent Record 作成、自動昇格を行わないことを説明している。
- `amadeus-learning-review` の内部 skill が追加されている、または同等の責務を持つ内部 skill を追加しない理由が `decisions.md` に記録されている。
- `amadeus-history-review` と `amadeus-learning-review` の責務差分が説明されている。
- `amadeus-learning-review` の分類結果が Issue #259 の学習分類と矛盾しない。
- Issue #272 の `dry-run` が分析結果を入力にできるが、過去分析と学習分類を所有しないことが説明されている。
- `skills/` と `.agents/skills/` の同期方針に従っている。
- 必要な eval または text contract が追加または更新されている。

## 範囲

含めるもの:

- `amadeus-history-review` の内部 skill。
- `amadeus-learning-review` の内部 skill、または追加しない判断と代替責務。
- `.amadeus/` の過去成果物を読む対象範囲。
- 完了済み Intent、未完了 Intent、Discovery、判断、追跡、未確認事項、検証結果、PR 記録から抽出する観点。
- 学習先分類として `current_phase_update_required`、`upstream_feedback_required`、`steering_knowledge_candidate`、`domain_map_candidate`、`context_map_candidate`、`follow_up_issue_candidate`、`follow_up_intent_candidate`、`no_learning_action` を扱うこと。
- Issue #272 の `dry-run` が分析結果を入力にできる責務境界。
- source skill、昇格先成果物、eval または text contract の更新。

含めないもの:

- Issue #272 の `amadeus-discovery dry-run` 実装。
- Discovery 成果物の構造変更。
- Intent Record の自動作成。
- GitHub Issue の自動作成。
- Domain Map、Context Map、Steering knowledge への自動昇格。
- 完了済み Intent 成果物の一括移行。
- validator を意味検証エンジンへ拡張すること。
- Inception の前に要求、ユースケース、Unit、Bolt、Task、実装を作ること。

## 現在の phase

Ideation を開始する。

Inception では、過去分析 skill、学習分類 skill、`dry-run` との境界、検証観点、同期方針を要求として具体化する。
