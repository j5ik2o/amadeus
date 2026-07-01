# R005 Validation And Contract Boundary

## 要求

validator、evaluator、Skill Contract と decision review の責務境界を説明できる。

## 背景

validator は成果物構造を検出し、Skill Contract は skill 実行契約を機械的に参照できる形で提供する。
decision review は、現在の証拠に照らして判断ノードを再評価する判断ゲートである。

## 受け入れ状態

- validator の `pass` を質問不要または内容承認として扱わないことを説明できる。
- Skill Contract は decision review の入力証拠であり、decision review の結果そのものではないことを説明できる。
- evaluator で扱うべき品質評価を、初期 Construction に含めるか後続に切るか判断できる。

## 対象外

- validator を網羅的な意味検証へ拡張すること。
- 初期版で evaluator を必須 gate にすること。
