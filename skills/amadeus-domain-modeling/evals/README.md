# amadeus-domain-modeling evals

## 昇格条件

`amadeus-domain-modeling` は、次を満たした場合だけ `.agents/skills/amadeus-domain-modeling/` へコピー昇格できる。

- 未確定語は `.amadeus/intents/<intent-id>-<slug>/domain-notes.md` に候補として記録する。
- 確定した共有用語だけを `.amadeus/glossary.md` に追加する。
- Intent 固有のモデルと契約は `.amadeus/intents/<intent-id>-<slug>/domain/**` に反映する。
- モデル要素や契約 ID が変わる場合は、対象 Intent の `traceability.md` も整合させる。
- 全体モデルへの昇格が明示された場合だけ `.amadeus/domain/**` を更新する。
- 曖昧語や衝突語は、この skill 自体が既存の Amadeus 成果物と照合し、必要な確認を行う。
- 確定した用語、モデル、契約、ドメイン判断は、その場で該当する Amadeus 成果物へ記録する。
- `CONTEXT.md` と `docs/adr/**` を更新しない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- `/amadeus-grilling` を内部で呼び出す前提にしない。
- `evals.json` が JSON として解釈できる。
- `git diff --check` が成功する。

昇格時は symlink ではなくコピーにする。
昇格コピー対象は `SKILL.md` だけである。
`evals/` は開発用なので昇格先へコピーしない。

## 手動 eval 状態

| ケース | 状態 | 確認内容 | 証拠 |
|---|---|---|---|
| `capture-unresolved-term` | 完了 | 未確定語を domain-notes.md にだけ記録する。 | `/tmp/amadeus-domain-modeling-eval.766VOu/capture-unresolved-term/repo` |
| `promote-shared-glossary-term` | 完了 | 確定共有用語を glossary.md に追加し、CONTEXT.md は触らない。 | `/tmp/amadeus-domain-modeling-eval.766VOu/promote-shared-glossary-term/repo` |
| `promote-intent-model-element` | 完了 | Intent 側 domain model と traceability.md だけを更新し、全体昇格は明示がある場合に限る。 | `/tmp/amadeus-domain-modeling-eval.766VOu/promote-intent-model-element/repo` |
| `missing-amadeus-root` | 完了 | `.amadeus/` がなければ停止し、amadeus-steering を案内する。 | `/tmp/amadeus-domain-modeling-eval.766VOu/missing-amadeus-root/output.md` |

## 再実行コマンド

```sh
bun -e 'JSON.parse(await Bun.file("skills/amadeus-domain-modeling/evals/evals.json").text()); console.log("evals.json: ok")'
rg -n 'docs/ai-dlc|repo root の scripts|\.agents/rules|\.\./' skills/amadeus-domain-modeling/SKILL.md || true
git diff --check
```
