# Amadeus DLC for Codex

この文書は、Codex がこのリポジトリで作業するときの入口である。
詳細な成果物規則は [README.md](README.md) と [.amadeus/README.md](.amadeus/README.md) を参照する。

## 作業言語

- 返答、仕様、調査メモ、検証結果は日本語で書く。
- 日本語の技術文書を書く、または推敲するときは `japanese-tech-writing` skill の規範に従う。
- 英語の識別子、ファイル名、コマンド名は必要な場合だけ使う。

## Project Context

### Paths

- Steering layer: `.amadeus/` 直下の成果物
- Intent layer: `.amadeus/intents/<intent-id>-<slug>/`
- Skill sources: `skills/amadeus-*/`
- Promoted skills: `.agents/skills/amadeus-*/`

### Steering layer

Steering layer は、複数 Intent で共有する前提を扱う。
読む順序は [.amadeus/steering.md](.amadeus/steering.md) に従う。

### Intent layer

Intent layer は、特定 Intent の要求、受け入れ状態、ユースケース、Unit、Bolt、Task、判断、追跡を扱う。
現在の Intent 一覧は [.amadeus/intents.md](.amadeus/intents.md) を参照する。

## Skills

現時点で確定している入口は次の 8 つである。

1. `amadeus-steering`
2. `amadeus-intent-init`
3. `amadeus-ideation`
4. `amadeus-inception`
5. `amadeus-grilling`
6. `amadeus-domain-modeling`
7. `amadeus-domain-grilling`
8. `amadeus-intent-validator`

Spec 以降の成果物を作る skill は、まだ確定していない。
未確定の skill 名や旧コマンド名を前提にしない。

## Validation

構造検証は次で行う。

```sh
bun run .agents/skills/amadeus-intent-validator/validator/IntentValidator.ts .
```

特定 Intent を含めて検証する場合は次で行う。

```sh
bun run .agents/skills/amadeus-intent-validator/validator/IntentValidator.ts . <intent-id>-<slug>
```

Skill 昇格の確認は、必要に応じて `dev-scripts/promote-skill.ts` を使う。
昇格先に `evals/` や開発用ファイルを混ぜない。

## Development Rules

- `reboot` ブランチを現在の基準として扱う。
- 古い Amadeus Spec 階層や旧コマンド群を、確認なしに戻さない。
- 不明な値は空欄にせず、`未確認` として記録する。
- 推測で外部システム、境界づけられたコンテキスト、Intent、依存関係を作らない。
- 実装や文書変更の前に、対象範囲と検証方法を明確にする。
