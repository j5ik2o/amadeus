# Knowledge

## 役割

Knowledge は、Amadeus DLC を進めるために継続的に参照する背景知識と前提を扱う。

判断や実装手順ではなく、作業者が前提として理解しておくべき知識を置く。

## 前提

- Amadeus DLC は、Intent から Unit を導き、Unit を Bolt で実装と検証へ進める。
- Requirement は Intent を検証可能な要求へ落とした中間契約である。
- User Story は、Requirement をユーザー価値の単位で表す必要がある場合だけ作る。
- Use Case は、アクターまたは外部システムとシステムの相互作用手順を叙述する。
- Task は Bolt 配下の具体作業であり、Use Case の子ではない。
- Domain Model は全体の概念関係を扱い、Intent Domain Model は特定 Intent の概念関係を扱う。
- Intent Bounded Context は、Unit を切る時に参照する境界づけられたコンテキスト、責務、外部境界を扱う。
- Intent Contracts は、特定 Intent で守る事前条件、不変条件、事後条件を扱う。

## レイヤー

| レイヤー | 役割 |
|---|---|
| Steering layer | 複数 Intent で共有する目的、語彙、アクター、外部システム、全体ドメインモデルを扱う。 |
| Intent layer | 特定 Intent の要求、契約、追跡、ユニット、ボルト、タスク、判断を扱う。 |

## 参照順序

作業前に次の順で参照する。

1. [steering.md](steering.md)
2. [policies.md](policies.md)
3. [glossary.md](glossary.md)
4. [domain-model.md](domain-model.md)
5. [intents.md](intents.md)
