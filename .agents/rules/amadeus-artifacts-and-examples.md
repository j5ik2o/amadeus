# Amadeus Artifact Rules

このルールは、Amadeus DLC の成果物を作るときに適用する。

## 対象

- Steering layer: 対象 workspace の `.amadeus/` 直下の成果物
- Intent layer: 対象 workspace の `.amadeus/intents/<intent-id>-<slug>/`
- Examples: repo 内の `examples/`
- Skill sources: `skills/amadeus-*/`
- Promoted skills: `.agents/skills/amadeus-*/`

## Skill 昇格

`skills/amadeus-*/` を `.agents/skills/amadeus-*/` へ反映する場合は、必ず `dev-scripts/promote-skill.ts` を使う。
手動の `cp`、`rsync`、エディタ操作で昇格先を直接同期しない。

既存の昇格先を更新する場合は、次を使う。

```sh
bun run dev-scripts/promote-skill.ts <skill-name> --replace
```

昇格後は、少なくとも次を実行する。

```sh
npm run test:it:promote-skill
```

## 言語

- `.amadeus/**/*.md`、`skills/**/*.md`、`.agents/skills/**/*.md` は日本語で書く。
- 英語で下書きしてから日本語へ翻訳しない。
- `.kiro/specs/**/*.md` と `openspec/**/*.md` を作る場合も日本語で書く。

## Amadeus DLC の基準

- 現時点の確定入口は `README.md` に書かれた skill だけである。
- Construction は、Inception で定義した Bolt と Task を実装、検証、証拠化する phase として扱う。
- Spec、`.kiro/specs/**`、`openspec/**`、Operation 成果物は、対応が確定するまで固定しない。
- 新しい成果物を作る前に、対象 workspace の `.amadeus/README.md`、`.amadeus/steering.md`、対象 Intent の `state.json` を読む。
- 不明な値は空欄にせず、`未確認` と書く。
- 推測で外部システム、境界づけられたコンテキスト、Intent、依存関係を作らない。

## 生成前チェック

- 同じ段階の既存成果物を読み、見出し、表、識別子、語彙を合わせる。
- 対象範囲と責任境界を明確にする。
- Intent、Requirement、Story、Use Case、Unit、Bolt、Task が常に 1:1 になる場合は、粒度不足を疑う。
- それでも自然な粒度であれば、例外理由を `traceability.md` または `decisions.md` に残す。

## Examples

`examples/` は、実際の skill で生成できる Amadeus 成果物だけを置く。

新しい example を追加または更新する場合は、対象 phase の skill を実際に使って成果物を生成する。
実際の skill では生成できない Markdown ファイル群を、手作業の理想形として `examples/` に置かない。

example を補修する場合も、skill の成果物境界、見出し、state.json、traceability、validator 契約に合わせる。
skill が生成できない構造が必要になった場合は、example だけを直さず、先に skill、template、validator、eval の契約を直す。

`examples/` は、読者向けの説明ではなく、skill の実行結果として成立する snapshot である。
そのため、example の正しさは validator と eval で確認する。

example は、生成に使った source skill の `skills/**/SKILL.md` と md5 を `examples/skill-provenance.json` に記録する。
上流 phase の skill が snapshot に含まれる場合は、その skill も累積して記録する。
source skill を変更した場合は、該当 example を再生成するか、stale ではない理由を確認して `examples/skill-provenance.json` を更新する。

## 検証

repo 全体の標準検証は次で実行する。

```sh
npm run test:all
```

`npm run test:all` は `validate:all` を含む。
そのため、`examples/` の workspace 検証と Intent 検証も標準検証で実行される。

成果物構造を個別に確認する場合は次で検証する。

```sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts <workspace>
```

特定 Intent も検証する場合は次で検証する。

```sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts <workspace> <intent-id>-<slug>
```

`examples/` を追加または更新した場合は、repo root の wrapper だけでなく、必要に応じて `.agents/skills/amadeus-validator/validator/AmadeusValidator.ts` を直接実行する。
wrapper が対象 example をまだ網羅していない場合でも、直接 validator で対象 workspace と対象 Intent を検証する。

example の検証は、少なくとも次の観点を含める。

- `examples/skill-provenance.json` の md5 が、現在の `skills/**/SKILL.md` と一致する。
- workspace 全体が validator で `pass` する。
- 対象 Intent がある場合は、Intent 指定でも validator で `pass` する。
- example を支える template、skill、validator、eval の契約が同じ成果物名と同じ構造を参照する。

`pass` は、実行時に参照できる最低限の構造条件を満たすという意味である。
内容妥当性の承認や gate 通過そのものではない。
