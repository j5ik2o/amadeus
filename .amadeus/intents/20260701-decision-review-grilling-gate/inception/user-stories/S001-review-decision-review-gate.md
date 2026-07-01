# S001 Review Decision Review Gate

## ストーリー

Maintainer として、phase skill が質問すべき時と質問せず進む時を証拠付きでレビューしたい。
それにより、成果物に未決事項が明記されていない場合でも、gate、traceability、次 phase への引き継ぎに影響する判断を見落とさないようにしたい。

## 対象要求

- R001
- R002
- R003
- R004
- R005

## 受け入れ状態

- decision review が読んだ証拠と判断ノードを確認できる。
- `grill_required`、`no_grill`、`repair_only`、`follow_up_issue_candidate` の理由を確認できる。
- `amadeus-grilling` へ渡す一問と反映先候補を確認できる。

## 根拠

Issue #257 は、明示的な未決事項がなくても不明瞭な判断ノードを見落とさないことを求めている。
