# amadeus-intent-init evals

## 昇格条件

`amadeus-intent-init` は、次を満たした場合だけ `.agents/skills/amadeus-intent-init/` へコピー昇格できる。

- `guided` は、最大4問の質問を出し、質問したターンでは成果物を作らず回答待ちにする。
- `scaffold-only` は、Intent ディレクトリ名が決まっている場合だけ成果物を作る。
- `scaffold-only` は、`.amadeus/intents.md`、`intent.md`、`state.json` だけを作る。
- `scaffold-only` は、`scope.md`、`ideation.md`、`traceability.md`、`decisions.md`、`mocks/`、`requirements.md`、`use-cases.md`、`units.md`、`bolts.md`、`domain/**` を作らない。
- steering layer が不足している場合は作業を止め、`amadeus-steering` を案内する。
- Intent ディレクトリ名が重複している場合は作業を止め、既存成果物を変更しない。
- 依存先 Intent が存在しない場合は作業を止める。
- 作成後に `state.json` が JSON として解釈できる。
- 作成後に全体成果物の Intent Validator が pass する。
- Intent Validator が `initialized` phase に対応している場合は、対象 Intent ディレクトリ名を指定した検証も pass する。
- skill 本文が repo の開発用文書や開発用スクリプトを実行時参照にしない。
- `evals.json` が JSON として解釈できる。
- `git diff --check` が成功する。

昇格時は symlink ではなくコピーにする。
昇格コピー対象は `SKILL.md` だけである。
`evals/` は開発用なので昇格先へコピーしない。

## 手動 eval 状態

| ケース | 状態 | 確認内容 | 証拠 |
|---|---|---|---|
| `guided` | 完了 | 提案ディレクトリ名と理由を示し、質問3件で回答待ちにする。成果物は作らない。 | `/tmp/amadeus-intent-init-guided.skY5Wn/guided-eval-output.md` |
| `scaffold-only` | 完了 | Intent 入れ物だけを作り、Ideation 以降の成果物を作らない。全体成果物の Intent Validator が pass する。 | `/tmp/amadeus-intent-init-scaffold-only.ko6gBx` |
| steering 不足 | 完了 | `.amadeus/` がない場合は `amadeus-steering` を案内して止める。Intent ディレクトリは作らない。 | `/tmp/amadeus-intent-init-missing-steering.ajmIow/missing-steering-eval-output.md` |
| 重複 Intent ディレクトリ名 | 完了 | 既存成果物を変更せず止める。`intents.md` は未変更で、新しい重複ディレクトリも作らない。 | `/tmp/amadeus-intent-init-duplicate.TPOTQW/duplicate-eval-output.md` |
| 依存先 Intent 不在 | 完了 | 依存先 Intent が存在しない場合は既存成果物を変更せず止める。対象 Intent ディレクトリも作らない。 | `/tmp/amadeus-intent-init-missing-dependency.bwdi84/missing-dependency-eval-output.md` |

## 再実行コマンド

```sh
ruby -rjson -e 'JSON.parse(File.read("skills/amadeus-intent-init/evals/evals.json")); puts "evals.json: ok"'
rg -n 'docs/|scripts/|\.agents/rules|CONTEXT\.md|\.\./' skills/amadeus-intent-init/SKILL.md || true
git diff --check
```
