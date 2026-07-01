# R005: 検証結果と decision review の境界

## 要求

- validator と evaluator の結果を、構造検出、品質評価、学習候補に分類し、Issue #257 の decision review と責務を分けられる。

## 受け入れ条件

- validator の結果は、成果物が実行時に参照できる最低限の構造条件を満たすかの検出として扱える。
- evaluator の結果は、成果物内容の説明不足、論理不整合、判断品質の評価として扱える。
- validator または evaluator の結果から再利用可能な知見が得られる場合だけ、学習候補として分類できる。
- Issue #257 の decision review は、現在参照できる証拠から判断ノードを再評価し、質問が必要かを決める責務として説明されている。
- この Intent は、decision review の結果として得た発見をどの feedback 先または学習先へ分類するかを扱う責務として説明されている。

## 根拠

- Issue #259 の受け入れ条件。
- Issue #257 の目的と受け入れ条件。
- `ideation/scope.md` の SC-IN-005 と SC-IN-006。

## 未確認事項

- Issue #257 が先に Construction まで進んだ場合は、decision review の確定語彙に合わせて表現を更新する。
