# D002: 公開 skill 共通契約

## 背景

Inception D003 は、初期 Construction slice では新しい内部 skill を作らず、公開 `amadeus-*` skill が共有する共通契約として始めると判断している。

## 判断

`amadeus-ideation`、`amadeus-inception`、`amadeus-construction` に `実行時問題報告` 節を追加する。
この節には、報告先分類、最低報告項目、人間承認付き Issue 候補化、秘密情報制約、validator の `pass` と内容承認の違いを含める。

## 理由

実行中に問題や懸念を見つけた agent が、公開入口の skill だけを読んでも同じ判断基準を使えるようにするためである。
内部 skill を増やすより、初回 slice として変更範囲が小さい。

## 影響

- source skill 3件に同じ契約節を追加する。
- 昇格先 skill 3件は promote-skill で同期する。
- 新しい内部 skill は作らない。
