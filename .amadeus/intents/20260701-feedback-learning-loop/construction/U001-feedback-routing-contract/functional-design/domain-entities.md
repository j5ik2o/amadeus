# Domain Entities

## 目的

後段発見を分類し、戻り先を決めるための概念を定義する。

Functional Design は詳細な Domain Model と Intent Contracts の管理元である。

## Domain Entity

| 識別子 | 名前 | 責務 | 関連 |
|---|---|---|---|
| DE001 | 後段発見 | 後段 phase、validator、evaluator、PR コメント、実行中の観察で見つかった問題または懸念を表す。 | DE002, DE003 |
| DE002 | Feedback 分類 | 発見を `upstream_feedback_required`、`current_phase_update_required`、`follow_up_issue_candidate`、`follow_up_intent_candidate`、`no_learning_action` に分ける。 | DE001 |
| DE003 | 戻り先 | 発見を扱う phase、stage、skill、または後続作業候補を表す。 | DE001, DE002 |
| DE004 | Decision Review 境界 | Issue #257 の decision review と #259 の feedback routing を分離する判断境界を表す。 | DE001 |

## 関係

後段発見は、現在 Intent の成功条件と追跡情報を根拠に Feedback 分類へ変換される。
Feedback 分類が `upstream_feedback_required` の場合は戻り先が上流 phase または stage になる。
Decision Review 境界は、発見が意思決定の再確認要否なのか、成果物または後続作業への振り分けなのかを分ける。

## Domain Map と Context Map への反映候補

| 対象 | 種別 | 候補内容 | 承認後の扱い | 根拠 |
|---|---|---|---|---|
| なし | なし | 新しい Bounded Context やコンテキスト間依存は追加しない。 | Domain Map と Context Map は更新しない。 | U001 は BC001 内の skill 契約を扱うため。 |

## 未確認事項

なし。
