# D002: BC001 自己開発運用参照

## 背景

- Domain Map は `BC001 自己開発運用` を adopted Bounded Context として持つ。
- 参照リンク化方針は、Amadeus 本体の自己開発成果物、skill、validator、example、docs を扱う。
- 今回の Intent は、自己開発 cycle と workspace 対応記録の後続 Intent である。

## 判断

- Unit の `コンテキスト` は `BC001 自己開発運用` を参照する。
- 新しい Bounded Context は作らない。

## 理由

- 参照リンク化方針は、自己開発運用における成果物の追跡可能性と参照移動性を扱う。
- 既存の adopted Bounded Context である `BC001` の責務範囲に収まるため、新規 Boundary を採用する必要はない。

## 影響

- `units.md` の `コンテキスト` は `BC001` にする。
- Inception gate は、Domain Map の adopted `BC001` を参照する前提で `passed` にできる。
- Domain Map と Context Map は更新しない。
