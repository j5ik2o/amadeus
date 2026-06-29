# Steering

## 役割

- ECサイト構築の Amadeus 成果物で共有する目的、方針、知識、用語、アクター、外部システム、ドメイン境界を扱う。

## 対象成果物

- `README.md`
- `steering/objective.md`
- `steering/product.md`
- `steering/tech.md`
- `steering/structure.md`
- `steering/actors.md`
- `steering/external-systems.md`
- `glossary.md`
- `steering/knowledge.md`
- `steering/knowledge/`
- `steering/policies.md`
- `steering/policies/`
- `domain/subdomains.md`
- `domain/bounded-contexts.md`
- `discoveries.md`
- `intents.md`

## 読む順序

1. `README.md`
2. `steering/objective.md`
3. `steering/product.md`
4. `steering/tech.md`
5. `steering/structure.md`
6. `steering/actors.md`
7. `steering/external-systems.md`
8. `glossary.md`
9. `domain/subdomains.md`
10. `domain/bounded-contexts.md`
11. `discoveries.md`
12. `intents.md`

## Intent Layer へ進む基準

- ECサイト構築の入力テーマが、段階的に扱える Intent 候補へ分けられている。
- 未確認事項が残る場合は、Intent 側で扱う問いとして明示されている。

## 責務境界

- Steering layer は複数 Intent で共有する前提を扱う。
- 個別 Intent の要求、ユースケース、Unit、Bolt、Task は Intent layer で扱う。
