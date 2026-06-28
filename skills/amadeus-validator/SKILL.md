---
name: amadeus-validator
description: >-
  配布先ユーザー環境で Amadeus の実行時構造を検証する。`.amadeus/` 成果物、Discovery、Intent、
  domain/bounded-contexts.md、Upstream/Downstream、組織パターン、統合パターン、codebase-analysis.md、Construction 成果物を、
  repo root の開発用 scripts に依存せず確認したいときに使う。
---

# amadeus-validator

## 目的

配布先ユーザー環境で、Amadeus 成果物が実行時に参照できる最低限の構造条件を満たしているか確認する。

この skill は Amadeus Validator の入口である。
Development Validator としての repo root の package scripts や `scripts/**` ではない。

## 実行時依存

- Bun。
- TypeScript 実行は Bun に任せる。

Bun が使えない場合は `blocked` として報告する。
検証のために依存パッケージをインストールしない。

## 入力

- 検証対象の作業ディレクトリ。
- 必要に応じて、対象 Intent ディレクトリ名。

対象 Intent ディレクトリ名が指定されない場合は、全体成果物を検証する。
対象 Intent ディレクトリ名が指定された場合は、全体成果物に加えて `.amadeus/intents/<intent-id>-<slug>/` を検証する。

## 読む参照元

次の順で読む。

1. `CONTEXT.md`
2. `.amadeus/README.md`
3. `.amadeus/intents.md`
4. `.amadeus/discoveries.md`
5. `.amadeus/discoveries/*/brief.md`
6. `.amadeus/discoveries/*/state.json`
7. `.amadeus/domain/subdomains.md`
8. `.amadeus/domain/bounded-contexts.md`
9. `.amadeus/intents/<intent-id>-<slug>/intent.md`。対象 Intent ディレクトリ名が指定された場合だけ読む。
10. `.amadeus/intents/<intent-id>-<slug>/state.json`。対象 Intent ディレクトリ名が指定された場合だけ読む。
11. `.amadeus/intents/<intent-id>-<slug>/requirements.md`。対象 Intent ディレクトリ名が指定され、Initialized または Ideation 段階ではない場合だけ読む。
12. `.amadeus/intents/<intent-id>-<slug>/acceptance.md`。対象 Intent ディレクトリ名が指定され、Initialized または Ideation 段階ではない場合だけ読む。
13. `.amadeus/intents/<intent-id>-<slug>/traceability.md`。対象 Intent ディレクトリ名が指定された場合だけ読む。
14. `.amadeus/intents/<intent-id>-<slug>/domain/subdomains.md`。対象 Intent ディレクトリ名が指定され、Initialized または Ideation 段階ではない場合だけ読む。
15. `.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts.md`。対象 Intent ディレクトリ名が指定され、Initialized または Ideation 段階ではない場合だけ読む。
16. `.amadeus/intents/<intent-id>-<slug>/codebase-analysis.md`。対象 Intent ディレクトリ名が指定され、Initialized または Ideation 段階ではなく、ファイルが存在する場合、または `state.json.inception.requiredArtifacts` に含まれる場合だけ読む。
17. `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/design.md`。対象 Intent が Construction 段階で、`state.json.construction.requiredBoltArtifacts` に含まれる場合だけ読む。
18. `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/notes.md`。対象 Intent が Construction 段階で、`state.json.construction.requiredBoltArtifacts` に含まれる場合だけ読む。
19. `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/test-results.md`。対象 Intent が Construction 段階で、`state.json.construction.requiredBoltArtifacts` に含まれる場合だけ読む。
20. `.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/pr.md`。対象 Intent が Construction 段階で、ファイルが存在する場合、または `state.json.construction.requiredBoltArtifacts` に含まれる場合だけ読む。

存在しない参照元がある場合は、存在しない事実を結果に含める。
存在しない参照元を推測で補完しない。

## 検証範囲

少なくとも次を確認する。

- Amadeus の成果物ルートが `.amadeus/` である。
- `.amadeus/README.md` が存在する。
- `.amadeus/discoveries.md` が存在する。
- `.amadeus/discoveries.md` の一覧と各 Discovery の `brief.md`、`state.json` が対応している。
- Discovery の `state.json.phase`、`status`、`gate`、`decision` が許可値である。
- Discovery の `state.json.decision` と `brief.md` の `判定` が一致する。
- Discovery が `gate: passed` の場合、判定別の構造条件を満たす。
- `.amadeus/intents.md` が存在する。
- `.amadeus/domain/subdomains.md` が存在する。
- `.amadeus/domain/bounded-contexts.md` が存在する。
- `.amadeus` の index 系成果物が、[artifacts validation](references/artifacts.md) の条件を満たす。
- 対象 Intent ディレクトリ名が指定された場合、`.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts.md` が存在する。
- 対象 Intent ディレクトリ名が指定され、`.amadeus/intents/<intent-id>-<slug>/state.json` の `phase` が `initialized` の場合、Initialized 段階の成果物契約として検証する。
- Initialized 段階の Intent では、`scope.md`、`ideation.md`、`traceability.md`、`decisions.md`、`mocks/`、`requirements.md`、`acceptance.md`、`use-cases.md`、`units.md`、`bolts.md`、`domain/**` は後続段階で作る成果物として扱い、欠落を不足にしない。
- 対象 Intent ディレクトリ名が指定され、`.amadeus/intents/<intent-id>-<slug>/state.json` の `phase` が `ideation` の場合、Ideation 段階の成果物契約として検証する。
- Ideation 段階の Intent では、`requirements.md`、`acceptance.md`、`use-cases.md`、`units.md`、`bolts.md`、`domain/**` は Inception 以降で作る成果物として扱い、欠落を不足にしない。
- 対象 Intent ディレクトリ名が指定され、`.amadeus/intents/<intent-id>-<slug>/state.json` の `phase` が `inception` の場合、Inception 段階の状態契約として検証する。
- 対象 Intent ディレクトリ名が指定され、`.amadeus/intents/<intent-id>-<slug>/state.json` の `phase` が `construction` の場合、Construction 段階の状態契約として検証する。
- Construction 段階の Intent では、`state.json.construction.targetBolts` が `bolts.md` の既存 Bolt ID を参照する。
- Construction 段階の Intent では、`state.json.construction.bolts[]` が対象 Bolt の Design Gate、Task plan、evidence を持つ。
- Construction 段階の Intent では、`state.json.construction.requiredArtifacts` と `state.json.construction.requiredBoltArtifacts` の相対パスが存在する。
- Construction 段階の Intent では、`design.md`、`notes.md`、`test-results.md`、任意の `pr.md` の必須見出しを検証する。
- Construction 段階の Intent では、Design Gate が `ready` または `passed` の場合に `traceability.md` の `Construction Design からの追跡` を検証する。
- 対象 Intent ディレクトリ名が指定され、`.amadeus/intents/<intent-id>-<slug>/codebase-analysis.md` が存在する場合、必須見出しを検証する。
- 対象 Intent ディレクトリ名が指定され、`.amadeus/intents/<intent-id>-<slug>/state.json` の `inception.requiredArtifacts` に `codebase-analysis.md` が含まれる場合、存在と必須見出しを検証する。
- `codebase-analysis.md` は条件付き成果物であるため、存在せず、`inception.requiredArtifacts` にも含まれない場合は不足にしない。
- 対象 Intent ディレクトリ名が指定された場合、対象 Intent の index 系成果物が、[artifacts validation](references/artifacts.md) の条件を満たす。
- 対象 Intent ディレクトリ名が指定された場合、対象 Intent の `traceability.md` にある `既存コード分析からの追跡` の表列を検証する。
- 対象 Intent ディレクトリ名が指定された場合、対象 Intent の `traceability.md` にある `既存コード分析からの追跡` の ID が対応する index に存在する。
- 対象 Intent ディレクトリ名が指定された場合、対象 Intent の `traceability.md` にある `既存コード分析からの追跡` の `分析` と `設計` が所定の成果物を指す。
- 対象 Intent ディレクトリ名が指定された場合、対象 Intent の `traceability.md` に出る ID が対応する index または定義元に存在する。
- 対象 Intent ディレクトリ名が指定された場合、対象 Intent の `traceability.md` に出る DDD 要素 ID が、`BCnnn/DMnnn/<ddd-element-id>` の正規形で定義元に存在する。
- 対象 Intent ディレクトリ名が指定された場合、`bolts.md` の `ユニット` が既存 Unit を参照する。
- 対象 Intent ディレクトリ名が指定された場合、複数 Unit を参照する Bolt の `bolt.md` に `複数 Unit を扱う理由` 見出しと本文が存在する。
- 対象 Intent ディレクトリ名が指定され、Bolt 配下の `tasks.md` が存在する場合、Task が `作業`、`要求`、`ユースケース`、`依存`、`設計根拠`、`証拠` を持つ。
- Inception phase の Intent では、Bolt 配下に `tasks.md` が存在しない。
- `traceability.md` の `境界` は ID 化せず、`domain/bounded-contexts.md` の `外部境界` 表にある名前として存在する。
- `domain/bounded-contexts.md` が、[bounded-contexts validation](references/bounded-contexts.md) の条件を満たす。

## 検証手順

次の順で検証する。

1. Bun が使えるか確認する。
2. 対象 Intent ディレクトリ名を確定する。
   - ユーザーが Intent ディレクトリ名を指定した場合は、そのディレクトリ名だけを対象 Intent にする。
   - Intent ディレクトリ名が指定されていない場合は、全体成果物だけを検証する。
   - `.amadeus/intents.md` から勝手に全 Intent を検証対象に増やさない。
3. skill 同梱の `validator/AmadeusValidator.ts` を実行する。

全体成果物だけを検証する場合:

```sh
bun run <skill-dir>/validator/AmadeusValidator.ts <workdir>
```

対象 Intent ディレクトリ名も検証する場合:

```sh
bun run <skill-dir>/validator/AmadeusValidator.ts <workdir> <intent-id>-<slug>
```

`AmadeusValidator.ts` は、内部で検査台帳を作り、`pass`、`fail`、`blocked` の判定と不足内容を日本語 Markdown で出力する。
この出力を最終報告の基準にする。

## 判定

判定は `pass`、`fail`、`blocked` のいずれかで出す。

`pass` は、検証対象が実行時に参照できる最低限の構造条件を満たしていることを示す。
`fail` は、成果物の矛盾または必須項目の欠落を示す。
`blocked` は、検証対象や判断材料が不足していることを示す。

`pass` だけで gate を通過した扱いにしない。
`waived` を検証結果にしない。

## 出力

日本語で次の形にまとめる。

```md
# Amadeus Validator 結果

## 判定

pass | fail | blocked

## 検査サマリ

| 検査カテゴリ | pass | fail | blocked |
|---|---:|---:|---:|
| <カテゴリ> | <件数> | <件数> | <件数> |

## 確認対象

| 対象カテゴリ | 件数 |
|---|---:|
| <カテゴリ> | <件数> |

### <対象カテゴリ>

- <確認したファイル>

## 満たしている条件

- <条件>

## 検査対象外

- <機械検査の対象外にした項目。なければ「なし」>

## 不足または矛盾

- <不足または矛盾。なければ「なし」>

## 次に使う Amadeus skill

- <推奨する次の skill。なければ「なし」>
```

## 禁止事項

- repo root の `scripts/**` を Amadeus Validator の格納先や実行入口として扱わない。
- repo root の package scripts を配布先ユーザー環境の検証入口として扱わない。
- skill 同梱の `validator/AmadeusValidator.ts` 以外を実行時検証入口にしない。
- 検証のために依存パッケージをインストールしない。
- Installer の接続、配布単位、インストール後の実行順序を決めない。
- Intent 状態や成果物状態を変更しない。
- 親参照や欠落ファイルを推測で補完しない。
