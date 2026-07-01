# R003 Grilling Handoff Contract

## 要求

`amadeus-grilling` に渡す一問、確認理由、推奨回答、推奨理由、反映先候補を定義できる。

## 背景

decision review 自体が質問を実行すると、`amadeus-grilling` の質問作法と Grilling Decision Trail の責務が重複する。
decision review は、質問すべき一問を選び、`amadeus-grilling` へ渡すところまでに責務を限定する。

## 受け入れ状態

- `grill_required` の場合に、質問、確認理由、推奨回答、推奨理由、反映先候補を返せる。
- `amadeus-grilling` が質問と回答の記録を担当することを説明できる。
- 回答後に更新する成果物の候補を、phase 成果物の境界内で示せる。

## 対象外

- `amadeus-grilling` の質問作法を全面変更すること。
- Grilling Decision Trail の配置を変更すること。
