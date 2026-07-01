# D002: BC001 自己開発運用を参照する

## 背景

この Intent は、Amadeus 本体の自己開発で使う phase skill、validator、eval、steering knowledge、Domain Map、Context Map の扱いを標準化する。

Domain Map には、`BC001 自己開発運用` が adopted として登録されている。

## 判断

Unit の `コンテキスト` は `BC001` を参照する。

新規 Bounded Context は採用しない。
Domain Map と Context Map は、この Inception では更新しない。

## 理由

後段 feedback と Intent 横断学習は、Amadeus 本体の自己開発 cycle、stage 判定、workspace 対応記録、skill 運用に関わる。
これは既存の `BC001 自己開発運用` の責務と一致する。

## 影響

`inception.gate` は、Domain Map の adopted Bounded Context を参照しているため `passed` にできる。

Construction で新しい domain 境界が必要だと分かった場合は、現在 Intent に混ぜず、後続 Issue または後続 Intent 候補として扱う。
