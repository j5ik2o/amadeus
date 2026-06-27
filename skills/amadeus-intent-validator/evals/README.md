# amadeus-intent-validator evals

## 昇格条件

`amadeus-intent-validator` は、次を満たすことを確認する。

- 配布先ユーザー環境で動く実行時 validator として扱う。
- repo root の `scripts/**` や `pnpm test` を実行時検証入口にしない。
- skill 同梱の `validator/IntentValidator.ts` を実行入口にする。
- Bun と TypeScript だけで検証する。
- 対象 Intent ディレクトリ名が未指定の場合、全体成果物だけを検証する。
- 対象 Intent ディレクトリ名が指定された場合、全体成果物に加えて対象 Intent を検証する。
- `.amadeus/intents.md` の Intent 識別子が `YYYYMMDD-<slug>` 形式で、詳細リンクのディレクトリ名と一致することを検証する。
- Initialized または Ideation 段階では、後続段階の成果物欠落を不足にしない。
- Inception 段階では、`state.json` の `ideation` と `inception` の状態契約を検証する。
- Inception 段階で Bolt 配下に `tasks.md` がある場合、同じ Bolt 配下の `design.md` を検証する。
- `codebase-analysis.md` が存在する場合、または `state.json.inception.requiredArtifacts` に含まれる場合、必須見出しを検証する。
- `codebase-analysis.md` が存在せず、`state.json.inception.requiredArtifacts` にも含まれない場合は不足にしない。
- `traceability.md` の `既存コード分析からの追跡` が、`分析`、`要求`、`ユースケース`、`ユニット`、`ボルト`、`設計`、`入力` の列を持つことを検証する。
- `traceability.md` の `既存コード分析からの追跡` にある `要求`、`ユースケース`、`ユニット`、`ボルト` が対応する index に存在することを検証する。
- `traceability.md` の `既存コード分析からの追跡` にある `分析` が `codebase-analysis.md`、`設計` が同じ行の Bolt 配下 `design.md` を指すことを検証する。
- Bolt 配下の `tasks.md` では、各 Task が `作業`、`要求`、`ユースケース`、`依存`、`証拠` を持つことを検証する。
- `evals.json` が JSON として解釈できる。
- `git diff --check` が成功する。

## 手動 eval 状態

検証日: 2026-06-27

| ケース | 状態 | 確認内容 | 証拠 |
|---|---|---|---|
| `workspace-only-validation` | 完了 | Intent ディレクトリ名未指定時は全体成果物だけを検証する。 | `bun run skills/amadeus-intent-validator/validator/IntentValidator.ts .` が `pass`。 |
| `ideation-intent-validation` | 完了 | Ideation 段階では Inception 以降の欠落を不足にしない。 | `bun run skills/amadeus-intent-validator/validator/IntentValidator.ts . 20260627-risk-aware-reset-support` が `pass`。 |
| `inception-state-validation` | 完了 | Inception 段階の `state.json` が状態契約を満たす。 | `bun run skills/amadeus-intent-validator/validator/IntentValidator.ts . 20260626-password-reset` が `pass`。一時コピーで `inception.requiredBoltArtifacts` を削除すると `fail`。 |
| `runtime-only-dependency` | 完了 | Bun と TypeScript だけで検証する。 | `bun --version` が成功。 |
| `bolt-design-before-task` | 完了 | Bolt 配下の `design.md` が `tasks.md` の入力として存在する。 | 一時コピーで `bolts/B001-password-reset-request-flow/design.md` を削除すると `fail`。 |
| `codebase-analysis-headings` | 完了 | `codebase-analysis.md` が条件付き成果物として必須見出しを持つ。 | 通常検証が `pass`。一時コピーで `## 対象コード` を変更すると `fail`。 |
| `codebase-analysis-traceability-columns` | 完了 | `既存コード分析からの追跡` が必須列を持つ。 | 一時コピーで `分析` 列名を変更すると `fail`。 |
| `codebase-analysis-traceability-ids` | 完了 | `既存コード分析からの追跡` の ID が対応する index に存在する。 | 一時コピーで `要求` を `R999` に変更すると `fail`。 |
| `codebase-analysis-traceability-links` | 完了 | `既存コード分析からの追跡` のリンクが所定の成果物を指す。 | 一時コピーで `分析` を `wrong.md` に変更すると `fail`。 |
| `task-contract-validation` | 完了 | Bolt 配下 `tasks.md` の Task が必須項目を持つ。 | 一時コピーで `T001` の `作業` を削除すると `fail`。 |
| `intent-directory-name-validation` | 完了 | Intent 識別子、詳細リンク、ディレクトリ名が `YYYYMMDD-<slug>` 形式で一致する。 | 一時コピーで詳細リンクを `intents/20260626-password/intent.md` に変更すると `fail`。 |

## 再実行コマンド

```sh
bun -e 'JSON.parse(await Bun.file("skills/amadeus-intent-validator/evals/evals.json").text()); console.log("evals.json: ok")'
cmp -s skills/amadeus-intent-validator/SKILL.md .agents/skills/amadeus-intent-validator/SKILL.md && echo "SKILL.md: identical"
cmp -s skills/amadeus-intent-validator/validator/IntentValidator.ts .agents/skills/amadeus-intent-validator/validator/IntentValidator.ts && echo "IntentValidator.ts: identical"
bun run skills/amadeus-intent-validator/validator/IntentValidator.ts .
bun run skills/amadeus-intent-validator/validator/IntentValidator.ts . 20260626-password-reset
bun run skills/amadeus-intent-validator/validator/IntentValidator.ts . 20260627-risk-aware-reset-support
git diff --check
```
