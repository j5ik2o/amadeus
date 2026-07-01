# D002: BC001 自己開発運用参照判断

## 背景

- Domain Map は `BC001 自己開発運用` を採用済み Bounded Context として持つ。
- Issue #245 は Amadeus 本体の自己開発における skill 変更、validator 要件、PR 証拠を扱う。

## 判断

- この Intent の Unit は `BC001 自己開発運用` を参照する。
- 新しい Bounded Context は採用しない。
- Domain Map と Context Map は更新しない。

## 理由

- `BC001 自己開発運用` は stage 判定、stage0 採用判断、build workspace / target workspace 対応記録を扱う採用済み境界である。
- skill 説明と validator 要件のずれを解消する作業は、自己開発運用の範囲に収まる。
- 新しい境界候補を追加しなくても Unit のコンテキストを説明できる。

## 影響

- `inception/units.md` の `コンテキスト` は `BC001` を参照する。
- Inception gate は、Domain Map への新規反映なしで `passed` にできる。
