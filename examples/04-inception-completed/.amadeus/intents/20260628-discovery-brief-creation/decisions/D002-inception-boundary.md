# D002: Inception 分解境界判断

## 背景

- Inception では Discovery Brief 記録と Intent 候補提示を要求候補として扱う。
- Story 候補は、利用者が Discovery Brief を読み、最初の Intent 候補を選べることである。
- Use Case 候補は、入力テーマと判断を記録すること、Intent 候補を確認することである。
- Unit 候補は、Discovery Brief 記録と Intent 候補提示である。
- Bolt 候補は、B001 Discovery Brief 記録と B002 Intent 候補提示である。

## 判断

- 採用。
- R001、R002、S001、UC001、UC002、U001、U002、B001、B002 の分解境界を固定する。
- U001 と U002 は BC001 Discovery 支援を参照する。

## 理由

- 要求は Discovery Brief 記録と Intent 候補提示の2件に分かれ、後者は前者を根拠にする。
- ユーザーストーリーは利用者の一連の判断価値として S001 にまとめることが自然である。
- ユースケースは記録と候補確認の相互作用が異なるため UC001 と UC002 に分ける。
- Unit と Bolt は Construction へ渡せる実施境界として、Discovery Brief 記録と Intent 候補提示に分ける。

## 影響

- Inception では `tasks.md` を作らない。
- Construction では B001 と B002 を根拠に Task 化する。
- DM001 Discovery Brief は BC001 の `models.md` と `models/DM001-discovery-brief.md` に定義し、契約条件は BC001 の `contracts.md` に未確認事項として残す。
