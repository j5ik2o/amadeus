# Steering

## 役割

- Amadeus 本体開発で共有する目的、方針、知識、用語、アクター、外部システム、ドメイン境界を扱う。
- build workspace、host environment、target workspace、target artifacts の分離方針を扱う。
- stage0、stage1、stage2 の初期方針と、次回 stage0 採用条件を扱う。

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
- `development.md`
- `domain-map.md`
- `context-map.md`
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
9. `steering/knowledge.md`
10. `steering/policies.md`
11. `development.md`
12. `domain-map.md`
13. `context-map.md`
14. `discoveries.md`
15. `intents.md`

## Intent Layer へ進む基準

- 対応する GitHub Issue が存在する。
- Intent の目的、範囲、完了条件が GitHub Issue と steering layer から追跡できる。
- skill、validator、example、docs のどの変更種別を扱うかが明示されている。
- build workspace と target workspace の扱いが明示されている。
- 開発手順のどの段階にいるかが説明できる。

## 責務境界

- Steering layer は複数 Intent で共有する前提を扱う。
- 個別 Intent の要求、ユースケース、Unit、Bolt、Task は Intent layer で扱う。
- 初回導入では、skill、validator、example、ハーネスの実装変更を扱わない。
