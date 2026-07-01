# D002 BC001 Self Development Governance

## 状態

accepted

## 文脈

decision review は Amadeus 自身の phase skill、validator、Skill Contract、eval の使い方を整理する。
これは利用者向け業務ドメインではなく、Amadeus の自己開発運用に属する判断である。

## 判断

U001 と U002 は `BC001 自己開発運用` に属するものとして扱う。
新しい Bounded Context 候補は作らない。

## 根拠

- Domain Map には `BC001 自己開発運用` が adopted として存在する。
- Context Map には採用済みまたは廃止済みのコンテキスト間依存が未登録である。
- 本 Intent は stage 判定、skill 起動判断、検証境界という自己開発運用の関心を扱う。

## 影響

- Unit の `コンテキスト` は `BC001` を参照する。
- Inception は Domain Map を更新しない。
- Construction で新しい context が必要になった場合は、別 Issue 候補として扱う。
