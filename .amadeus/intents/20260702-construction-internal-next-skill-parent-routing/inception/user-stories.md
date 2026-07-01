# ユーザーストーリー

## 一覧

| 識別子 | アクター | 概要 | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|
| S001 | ACT002 Agent | Construction 内部 skill の処理後に、親 skill 経由で次工程へ進む判断ができる。 | R001, R002, R003, R004 | なし | [S001-agent-next-step-routing.md](user-stories/S001-agent-next-step-routing.md) |
| S002 | ACT001 Maintainer | Construction 内部 skill の案内が公開入口契約と整合していることを確認できる。 | R003, R004, R005 | S001 | [S002-maintainer-routing-review.md](user-stories/S002-maintainer-routing-review.md) |

## 依存関係

| ユーザーストーリー | 依存 | 理由 |
|---|---|---|
| S001 | なし | Agent の次工程判断が、この Intent の主要な利用者価値であるため。 |
| S002 | S001 | Maintainer の整合確認は、Agent が読む案内内容を前提にするため。 |
