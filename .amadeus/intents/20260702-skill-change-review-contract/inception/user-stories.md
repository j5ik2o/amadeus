# ユーザーストーリー

## 一覧

| 識別子 | アクター | 概要 | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|
| S001 | ACT003 Reviewer | Reviewer が、生の diff を読み解く前に、PR 説明の記録から skill 変更の影響と確認済み観点を把握できる。 | R001, R002 | なし | [S001-reviewer-impact-judgment.md](user-stories/S001-reviewer-impact-judgment.md) |
| S002 | ACT001 Maintainer | Maintainer が、粒度制約の例外が使われた PR で、記録から例外の妥当性を判断できる。 | R003 | なし | [S002-maintainer-exception-judgment.md](user-stories/S002-maintainer-exception-judgment.md) |

## 依存関係

| ユーザーストーリー | 依存 | 理由 |
|---|---|---|
| S001 | なし | Reviewer のレビュー判断価値を単独で表すため。 |
| S002 | なし | Maintainer の例外承認価値を単独で表すため。 |
