# R003 auto 判定の再開規則

## 要求

merge 後に `amadeus-construction` を再実行するだけで、判断なしに finalization へ入れる。

## 背景

現状の auto 判定表には merge 後の再実行を finalization へ導く行がなく、refine の行に吸われる。
再開規則が決定論的な行として存在すれば、監視できないハーネスでも人間は再実行の一言だけで済む。

## 受け入れ条件

- `amadeus-construction` の auto 判定表に、R001 の判定規則に該当する場合は finalization を選ぶ行が追加されている。
- 追加行の条件が、既存の refine と repair の行と排他的に読める。
- Decision Review の入力証拠の列挙に、同梱スクリプトの検出結果が追加されている。
- 判定に必要な入力がそろわない場合の既定（通常判定へ戻る）が読める。

## 依存

- R001
- R002

## 対応する対象境界

- SC-IN-001
- SC-IN-003

## 未確認事項

- なし。
