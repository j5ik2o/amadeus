# R004 追跡と文書整合

## 要求

development.md の PR 準備条件から skill 変更時の追加条件を追跡でき、README の記述が policies の必須条件と矛盾しない。

## 背景

PR 準備条件は「変更種別ごとの必須条件が満たされている」という形で変更種別表を参照している。
必須条件を強化した場合、参照元の development.md と、推奨を記述している README（英語、日本語）の整合を同じ変更で確認しないと、文書間の矛盾が生まれる。

## 受け入れ条件

- `development.md` の PR 準備条件から、skill 変更時の追加条件（挙動差分要約、skill-forge 確認、粒度制約）へ追跡できる。
- `README.md` と `README.ja.md` の skill-forge 記述が、policies の必須条件と矛盾しない。
- 追加した記述が agent-instruction-rules の方針（肯定形を先に書き、禁止事項は失敗確認後に限る）と矛盾しない。

## 依存

- R001
- R002
- R003

## 対応する対象境界

- SC-IN-005
- SC-IN-006

## 未確認事項

- README の推奨記述を推奨のまま残して policies を必須の定義元にするか、README 側も必須と書き換えるかは Construction の文書変更で確定する。
