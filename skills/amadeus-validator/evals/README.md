# amadeus-validator evals

## 昇格条件

`amadeus-validator` は、次を満たすことを確認する。

- 配布先ユーザー環境で動く実行時 validator として扱う。
- repo root の `scripts/**` や package scripts を実行時検証入口にしない。
- skill 同梱の `validator/AmadeusValidator.ts` を実行入口にする。
- Bun と TypeScript だけで検証する。
- 対象 Intent ディレクトリ名が未指定の場合、全体成果物だけを検証する。
- 対象 Intent ディレクトリ名が指定された場合、全体成果物に加えて対象 Intent を検証する。
- `.amadeus/intents.md` の Intent 識別子が `YYYYMMDD-<slug>` 形式で、詳細リンクのディレクトリ名と一致することを検証する。
- `.amadeus/discoveries.md` と各 Discovery のモジュールファイル、`state.json` の対応を検証する。
- Discovery の `state.json.decision` と `Discovery のモジュールファイル` の `判定` が一致することを検証する。
- Discovery が `gate: passed` の場合、判定別の構造条件を検証する。
- Ideation 段階では、後続段階の成果物欠落を不足にしない。
- Inception 段階では、`state.json` の `ideation` と `inception` の状態契約を検証する。
- Inception 段階では Unit のモジュールファイルとモジュールディレクトリ配下の `design.md` を検証する。
- Inception 段階では Bounded Context のモジュールファイルとモジュールディレクトリ配下の `models.md`、`contracts.md` を検証する。
- Inception 段階では Bolt 配下の `design.md` を禁止する。
- `codebase-analysis.md` が存在する場合、または `state.json.inception.requiredArtifacts` に含まれる場合、必須見出しを検証する。
- `codebase-analysis.md` が存在せず、`state.json.inception.requiredArtifacts` にも含まれない場合は不足にしない。
- `traceability.md` の `既存コード分析からの追跡` が、`分析`、`要求`、`ユースケース`、`ユニット`、`ボルト`、`設計`、`入力` の列を持つことを検証する。
- `traceability.md` の `設計からの追跡` にある `設計` が同じ行の Unit 配下 `design.md` を指すことを検証する。
- `traceability.md` の `既存コード分析からの追跡` にある `要求`、`ユースケース`、`ユニット`、`ボルト` が対応する index に存在することを検証する。
- `traceability.md` の `既存コード分析からの追跡` にある `分析` が `codebase-analysis.md`、`設計` が同じ行の Unit 配下 `design.md` を指すことを検証する。
- Bolt 配下の `tasks.md` が存在する場合、各 Task が `作業`、`要求`、`ユースケース`、`依存`、`設計根拠`、`証拠` を持つことを検証する。
- Inception phase では、Bolt 配下に `tasks.md` が存在しないことを検証する。
- Construction 段階では、対象 Bolt の `tasks.md`、`state.json.construction.bolts[].taskGeneration`、Task Generation evidence、`Task Generation からの追跡` を検証する。
- `evals.json` が JSON として解釈できる。
- `git diff --check` が成功する。

## 手動 eval 状態

検証日: 2026-06-28

| ケース | 状態 | 確認内容 | 証拠 |
|---|---|---|---|
| `workspace-only-validation` | 完了 | Intent ディレクトリ名未指定時は全体成果物だけを検証する。 | `bun run skills/amadeus-validator/validator/AmadeusValidator.ts examples/01-discovery-completed` が `pass`。 |
| `ideation-intent-validation` | 完了 | Ideation 段階では Inception 以降の欠落を不足にしない。 | `bun run skills/amadeus-validator/validator/AmadeusValidator.ts examples/02-ideation-completed 20260628-discovery-brief-creation` が `pass`。 |
| `inception-state-validation` | 完了 | Inception 段階の `state.json` が状態契約を満たす。 | `bun run skills/amadeus-validator/validator/AmadeusValidator.ts examples/03-inception-completed 20260628-discovery-brief-creation` が `pass`。一時コピーで Construction の requiredBoltArtifacts を不足させると `fail`。 |
| `runtime-only-dependency` | 完了 | Bun と TypeScript だけで検証する。 | `bun --version` が成功。 |
| `unit-design-required` | 完了 | Unit のモジュールファイルとモジュールディレクトリ配下の `design.md` が存在し、必須見出しに本文がある。 | 一時コピーで Unit の `詳細` を `units/<unit-id>-<slug>/unit.md` へ変更すると `fail`。 |
| `bounded-context-module-required` | 完了 | Bounded Context のモジュールファイルが存在し、目的、責務、外部境界、関連成果物を持つ。 | 一時コピーで Bounded Context のモジュールファイルを削除すると `fail`。 |
| `bolt-design-forbidden` | 完了 | Bolt 配下に `design.md` を置かない。 | `dev-scripts/evals/amadeus-validator/check.ts` の一時 workspace 検査で確認する。 |
| `codebase-analysis-headings` | 完了 | `codebase-analysis.md` は条件付き成果物である。 | `examples/03-inception-completed` では存在せず、requiredArtifacts にも含まれないため不足にしない。 |
| `codebase-analysis-traceability-columns` | 完了 | `既存コード分析からの追跡` が必須列を持つ。 | `examples/03-inception-completed` の空表が `pass`。 |
| `design-traceability-links` | 完了 | `設計からの追跡` の `設計` が同じ行の Unit Design Brief を指す。 | 一時コピーで `設計` を別 Unit の `design.md` に変更すると `fail`。 |
| `design-traceability-ids` | 完了 | `設計からの追跡` の ID が対応する index に存在する。 | 一時コピーで `要求` を `R999` に変更すると `fail`。 |
| `construction-task-generation-ready` | 完了 | Task Generation ready 時点で `tasks.md`、Bolt 単位の Task Generation 状態、`Task Generation からの追跡` がある。 | `examples/04-construction-design-ready` が `pass`。一時コピーで Task Generation evidence、Task Generation 追跡を壊すと `fail`。 |
| `construction-traceability` | 完了 | Construction 完了時は `Construction からの追跡` が証拠追跡行を持つ。 | 一時コピーで空表にすると `fail`。 |
| `task-contract-validation` | 完了 | Construction の Bolt 配下 `tasks.md` の Task が必須項目を持つ。 | 一時コピーで `T001` の `要求`、`ユースケース`、`依存` を壊すと `fail`。 |
| `intent-directory-name-validation` | 完了 | Intent 識別子、詳細リンク、ディレクトリ名が `YYYYMMDD-<slug>` 形式で一致する。 | `examples/02-ideation-completed` 以降の snapshot が `pass`。 |
| `discovery-layer-validation` | 完了 | Discovery 一覧、`Discovery のモジュールファイル`、`state.json` の対応と gate 条件を検証する。 | 一時コピーで `state.json.decision` と `Discovery のモジュールファイル` の `判定` を不一致にすると `fail`。 |

## 再実行コマンド

```sh
bun -e 'JSON.parse(await Bun.file("skills/amadeus-validator/evals/evals.json").text()); console.log("evals.json: ok")'
cmp -s skills/amadeus-validator/SKILL.md .agents/skills/amadeus-validator/SKILL.md && echo "SKILL.md: identical"
cmp -s skills/amadeus-validator/validator/AmadeusValidator.ts .agents/skills/amadeus-validator/validator/AmadeusValidator.ts && echo "AmadeusValidator.ts: identical"
bun run skills/amadeus-validator/validator/AmadeusValidator.ts examples/01-discovery-completed
bun run skills/amadeus-validator/validator/AmadeusValidator.ts examples/02-ideation-completed 20260628-discovery-brief-creation
bun run skills/amadeus-validator/validator/AmadeusValidator.ts examples/03-inception-completed 20260628-discovery-brief-creation
bun run skills/amadeus-validator/validator/AmadeusValidator.ts examples/04-construction-design-ready 20260628-discovery-brief-creation
bun run dev-scripts/evals/amadeus-validator/check.ts
git diff --check
```
