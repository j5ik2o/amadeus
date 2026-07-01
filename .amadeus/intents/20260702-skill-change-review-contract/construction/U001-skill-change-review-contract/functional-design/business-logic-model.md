# Business Logic Model

## 目的

skill 変更 PR のレビュー判断に必要な記録を、PR 説明の固定構造として扱えるようにする。

## 対象 Unit

U001 skill change review contract。

## 業務ロジック

| 識別子 | ロジック | 入力 | 出力 | 根拠 |
|---|---|---|---|---|
| BL001 | skill 変更 PR の作成時に、挙動差分の3観点（変わる判断、変わる成果物構造、影響する後続 phase）を PR 説明へ記録する。 | skill 変更差分、変更前後の skill の判断と成果物構造 | Behavior Diff Summary | R001, UC001 |
| BL002 | skill-forge で確認した観点と結果を、PR 説明の固定見出し「skill-forge 確認」へ記録する。 | skill-forge の確認結果 | Skill Forge Check Record | R002, UC001 |
| BL003 | PR が skill 変更だけで構成されているかを判定し、不可分な場合だけ例外として扱う。 | PR の変更差分、変更種別表 | Granularity Judgment | R003, UC001 |
| BL004 | 例外時に理由と後続確認先を PR 説明へ記録する。 | Granularity Judgment | Exception Record | R003, UC001, UC003 |
| BL005 | Reviewer は記録と変更差分を突き合わせて影響を判断し、記録不足の PR を差し戻す。 | Behavior Diff Summary、Skill Forge Check Record、変更差分 | Review Judgment | R001, R002, UC002 |

## 入力

| 入力 | 説明 | 根拠 |
|---|---|---|
| skill 変更差分 | source skill と昇格先成果物の変更内容。 | R001 |
| 変更種別表 | `steering/policies.md` の変更種別ごとの完了条件。 | R003 |
| skill-forge 確認観点 | skill 境界、trigger description、本文指示、eval coverage、存在する場合は Codex metadata。 | R002 |
| 例外記録の型 | Git Branching Policy の例外記録（理由と後続確認先）。 | R003 |

## 出力

| 出力 | 説明 | 利用先 |
|---|---|---|
| Behavior Diff Summary | 挙動差分の3観点と自由記述の補足。 | Reviewer のレビュー判断 |
| Skill Forge Check Record | 確認した観点と確認結果の記録。 | Reviewer のレビュー判断 |
| Exception Record | 例外の理由と後続確認先の記録。 | Maintainer の例外妥当性判断 |
| Review Judgment | レビュー開始、差し戻し、例外承認の判断。 | merge 判断 |

## 未確認事項

なし。
