# Steering Layer

## 役割

この layer は、Amadeus の使い方を示す例示 workspace 全体の前提を扱います。

## 対象成果物

- [objective.md](objective.md)
- [actors.md](actors.md)
- [external-systems.md](external-systems.md)
- [glossary.md](glossary.md)
- [knowledge.md](knowledge.md)
- [policies.md](policies.md)
- [domain/subdomains.md](domain/subdomains.md)
- [domain/bounded-contexts.md](domain/bounded-contexts.md)
- [discoveries.md](discoveries.md)
- [intents.md](intents.md)

## 読む順序

1. 目的とアクターを読む。
2. 制約と既知の知識を読む。
3. Discovery 一覧で入力テーマの分解状態を読む。
4. Intent 一覧で初期化済み Intent を読む。

## Intent Layer へ進む基準

Discovery で Intent 候補が整理され、最初に進める候補が1件に決まった場合に Intent Layer へ進みます。

## 責務境界

Steering layer は個別 Intent の Requirement、Use Case、Unit、Bolt、Task を作りません。
