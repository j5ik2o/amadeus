# R001 Decision Tree Evidence Review

## 要求

phase skill 起動時に、既存成果物と現在参照できる証拠から decision tree を再評価できる。

## 背景

成果物に未決事項が明記されていなくても、Issue、PR、作業ツリー、validator 結果、Skill Contract、信頼できる参照元の更新により、過去の判断が現在も有効とは限らない。

## 受け入れ状態

- 既存成果物、Issue、PR、作業ツリー、validator 結果、Skill Contract、信頼できる参照元を入力証拠として扱える。
- 判断ノードごとに、根拠から一意に分岐を選べるか確認できる。
- 証拠不足、複数分岐、gate や traceability への影響を不明瞭ノードとして扱える。

## 対象外

- 既存 Intent 成果物の一括移行。
- validator による網羅的な意味検証。
