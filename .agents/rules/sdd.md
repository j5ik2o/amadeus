# Amadeus Artifact Rules

このルールは、Amadeus DLC の成果物を作るときに適用する。

## 対象

- Steering layer: `.amadeus/` 直下の成果物
- Intent layer: `.amadeus/intents/<intent-id>-<slug>/`
- Skill sources: `skills/amadeus-*/`
- Promoted skills: `.agents/skills/amadeus-*/`

## 言語

- `.amadeus/**/*.md`、`skills/**/*.md`、`.agents/skills/**/*.md` は日本語で書く。
- 英語で下書きしてから日本語へ翻訳しない。
- `.kiro/specs/**/*.md` と `openspec/**/*.md` を作る場合も日本語で書く。

## Amadeus DLC の基準

- 現時点の確定入口は `README.md` に書かれた 9 skill だけである。
- Construction は、Inception で定義した Bolt と Task を実装、検証、証拠化する phase として扱う。
- Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は、対応が確定するまで固定しない。
- 新しい成果物を作る前に、既存の `.amadeus/README.md`、`.amadeus/steering.md`、対象 Intent の `state.json` を読む。
- 不明な値は空欄にせず、`未確認` と書く。
- 推測で外部システム、境界づけられたコンテキスト、Intent、依存関係を作らない。

## 生成前チェック

- 同じ段階の既存成果物を読み、見出し、表、識別子、語彙を合わせる。
- 対象範囲と責任境界を明確にする。
- Intent、Requirement、Story、Use Case、Unit、Bolt、Task が常に 1:1 になる場合は、粒度不足を疑う。
- それでも自然な粒度であれば、例外理由を `traceability.md` または `decisions.md` に残す。

## 検証

成果物構造は次で検証する。

```sh
ruby .agents/skills/amadeus-intent-validator/validator/IntentValidator.rb .
```

特定 Intent も検証する場合は次で検証する。

```sh
ruby .agents/skills/amadeus-intent-validator/validator/IntentValidator.rb . <intent-id>-<slug>
```

`pass` は、実行時に参照できる最低限の構造条件を満たすという意味である。
内容妥当性の承認や gate 通過そのものではない。
