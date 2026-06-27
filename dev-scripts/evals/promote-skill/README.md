# promote-skill evals

## 昇格条件

`dev-scripts/promote-skill.ts` は、次を満たすことを確認する。

- Bun で TypeScript として実行できる。
- 既存の昇格先がある場合、`--replace` なしの実コピーでは失敗する。
- `--dry-run` では既存の昇格先があってもコピー対象と skipped を確認できる。
- 通常の Amadeus skill は `SKILL.md` を昇格し、同梱 `templates/` がある場合は `templates/` も昇格する。
- `evals/` は skipped にする。
- `amadeus-intent-validator` は `SKILL.md`、`references/`、`validator/` を昇格し、`evals/` を skipped にする。
- 全 Amadeus skill を一時ディレクトリへ昇格できる。
- 一時昇格結果に `evals/`、`tests/`、`.venv/`、`scripts/ci/`、`justfile` などの開発用ファイルが混ざらない。
- 一時昇格結果と現行 `.agents/skills/amadeus-*` に差分がない。
- 既存昇格先に開発用ファイルが残っている場合は失敗する。
- `git diff --check` が成功する。

## 手動 eval 状態

検証日: 2026-06-27

| ケース | 状態 | 確認内容 | 証拠 |
|---|---|---|---|
| `bun-runtime` | 完了 | スクリプトが Bun で実行できる。 | `bun run dev-scripts/promote-skill.ts amadeus-grilling --dry-run` が `dry-run: ok`。 |
| `dry-run-existing-promoted-skill` | 完了 | 既存昇格先がある `amadeus-grilling` でも `--dry-run` は成功し、`evals` を skipped にする。 | `bun run dev-scripts/promote-skill.ts amadeus-grilling --dry-run` が `dry-run: ok`。 |
| `template-runtime-files` | 完了 | テンプレートを持つ skill は `SKILL.md` と `templates/` をコピー対象にする。 | `bun run dev-scripts/promote-skill.ts amadeus-steering --dry-run` が `entries: SKILL.md, templates`。 |
| `validator-runtime-files` | 完了 | `amadeus-intent-validator` は `SKILL.md`、`references/`、`validator/` をコピー対象にする。 | `bun run dev-scripts/promote-skill.ts amadeus-intent-validator --dry-run` が `entries: SKILL.md, references, validator`。 |
| `existing-destination-requires-replace` | 完了 | 既存昇格先がある実コピーは `--replace` なしで失敗する。 | `bun run dev-scripts/promote-skill.ts amadeus-grilling` が `promoted skill already exists` で失敗。 |
| `all-amadeus-temp-promotion` | 完了 | 全 Amadeus skill を一時ディレクトリへ昇格し、開発用ファイル混入と現行 `.agents` 差分がない。 | 一時ディレクトリ昇格検証が `all amadeus promotion: ok`。 |
| `disallowed-file-detection` | 完了 | 昇格先に `evals/` が残っている場合は失敗する。 | 一時昇格先に `evals/` を置いた `--dry-run` が `disallowed promoted files remain` で失敗。 |

## 再実行コマンド

```sh
npm run test:it:promote-skill
```

個別に確認する場合は次を実行する。

```sh
bun run dev-scripts/promote-skill.ts amadeus-grilling --dry-run
bun run dev-scripts/promote-skill.ts amadeus-steering --dry-run
bun run dev-scripts/promote-skill.ts amadeus-intent-validator --dry-run

bun run dev-scripts/promote-skill.ts amadeus-grilling >/tmp/promote-existing.out 2>/tmp/promote-existing.err
test "$?" -ne 0

bash -lc '
set -euo pipefail
mapfile -t skills < <(find skills -maxdepth 1 -mindepth 1 -type d -name "amadeus-*" -exec basename {} \; | sort)
tmp=$(mktemp -d "${TMPDIR:-/tmp}/amadeus-promote-all.XXXXXX")
root="$tmp/.agents/skills"
for skill in "${skills[@]}"; do
  bun run dev-scripts/promote-skill.ts "$skill" --agents-root "$root" > "$tmp/$skill.log"
done
test -z "$(find "$root" \( -name dev-scripts -o -name evals -o -name eval-runs -o -name tmp -o -name benchmarks -o -name review-output -o -name tests -o -name .venv -o -name .pytest_cache -o -name __pycache__ -o -name justfile -o -path "*/scripts/ci" \) -print)"
for skill in "${skills[@]}"; do
  diff -qr "$root/$skill" ".agents/skills/$skill" > "$tmp/$skill.diff" || true
done
test -z "$(find "$tmp" -name "*.diff" -type f -size +0c -print)"
rm -rf "$tmp"
'

bash -lc '
tmp=$(mktemp -d "${TMPDIR:-/tmp}/amadeus-promote-violation.XXXXXX")
mkdir -p "$tmp/.agents/skills/amadeus-grilling/evals"
bun run dev-scripts/promote-skill.ts amadeus-grilling --dry-run --agents-root "$tmp/.agents/skills" > "$tmp/out" 2> "$tmp/err"
code=$?
rm -rf "$tmp"
test "$code" -ne 0
'

git diff --check
```
