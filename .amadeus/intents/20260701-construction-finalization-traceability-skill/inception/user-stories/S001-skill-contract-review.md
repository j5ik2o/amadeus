# S001: skill 契約整合レビュー

## ストーリー

Maintainer として、Construction finalization skill と validator の成果物契約が一致していることを確認したい。
それにより、agent が完了済み Construction の traceability 表を見落とさずに最終化できる。

## 対象要求

- R001
- R002
- R003
- R004

## 価値

- PR review 時に、skill 説明と validator 要件のずれを検出しやすくなる。
- source skill と昇格先成果物の対応が追跡できる。
- template または example の更新要否を同じ作業範囲で判断できる。

## 受け入れ観点

- `Construction からの追跡` 表が必要であることを skill から読める。
- 必須列を skill から読める。
- `Task Generation からの追跡` だけでは不足することを skill から読める。
- source skill と昇格先成果物の差分を確認できる。

## 未確認事項

- なし。
