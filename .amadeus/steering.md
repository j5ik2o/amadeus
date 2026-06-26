# Steering

## 役割

Steering は、Amadeus DLC 全体の目的、語彙、アクター、外部システム、ドメインモデルを読むための入口である。

`.amadeus/` 直下の成果物を steering layer として扱う。
`intents/` 配下は、個別 Intent の要求、契約、追跡、実装単位を扱う execution layer として扱う。

## 対象成果物

| 成果物 | 役割 |
|---|---|
| [knowledge.md](knowledge.md) | 継続的に参照する背景知識と前提を扱う。 |
| [policies.md](policies.md) | 守る方針、禁止事項、判断基準を扱う。 |
| [objective.md](objective.md) | 全体の目的、期待価値、成功指標を扱う。 |
| [actors.md](actors.md) | 要求の根拠や相互作用に登場する人の役割を扱う。 |
| [external-systems.md](external-systems.md) | システム外部の連携先と接点を扱う。 |
| [glossary.md](glossary.md) | 確定済みの用語定義、避ける語、禁止ワードを扱う。 |
| [domain-model.md](domain-model.md) | 全体の概念関係、不変条件、ライフサイクル、集約候補を扱う。 |
| [intents.md](intents.md) | Intent 一覧と Intent 間の依存関係を扱う。 |

## 読む順序

1. [knowledge.md](knowledge.md) で背景知識と前提を確認する。
2. [policies.md](policies.md) で守る方針と禁止事項を確認する。
3. [objective.md](objective.md) で全体目的を確認する。
4. [glossary.md](glossary.md) で用語と避ける語を確認する。
5. [actors.md](actors.md) と [external-systems.md](external-systems.md) で境界の外側を確認する。
6. [domain-model.md](domain-model.md) で全体の概念関係を確認する。
7. [intents.md](intents.md) で対象 Intent と依存関係を確認する。

## Intent Layer へ進む基準

次のどれかに該当する場合は、`intents/<intent-id>/` 配下へ進む。

- 特定 Intent の要求、契約、受け入れ状態を確認する。
- 特定 Intent のユーザーストーリー、ユースケース、ユニット、ボルト、タスクを確認する。
- 特定 Intent の概念関係や契約を確認する。
- 特定 Intent の判断や追跡表を確認する。

## 責務境界

Steering layer は、複数 Intent で共有する前提を扱う。

Intent layer は、特定 Intent の成果物と検証状態を扱う。

Intent 固有の発見が複数 Intent で共有される前提になった場合は、`.amadeus/` 直下の該当成果物へ昇格する。
