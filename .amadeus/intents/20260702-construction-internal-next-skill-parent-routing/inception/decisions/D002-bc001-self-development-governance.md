# D002: BC001 自己開発運用の参照

## 背景

この Intent は、Amadeus 本体の skill 変更を自己開発用 `.amadeus/` で管理する作業である。

Domain Map には BC001 自己開発運用が adopted として登録されている。

## 判断

Unit のコンテキストとして BC001 自己開発運用を参照する。

## 理由

対象は Amadeus 本体の source skill、昇格先成果物、stage 前提、PR 準備を扱う自己開発運用の範囲に入る。

新しい Bounded Context を採用する必要はない。

## 影響

Domain Map と Context Map は更新しない。

Construction では BC001 の範囲で Functional Design と Task Generation を進める。
