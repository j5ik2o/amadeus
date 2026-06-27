# amadeus-domain-grilling evals

## 昇格条件

`amadeus-domain-grilling` は、次を満たした場合だけ `.agents/skills/amadeus-domain-grilling/` へコピー昇格できる。

- `amadeus-grilling` と `amadeus-domain-modeling` の合成入口であることが明確である。
- 質問が必要な場合は一問だけ出し、推奨回答と理由を添える。
- 回答を待つ前に成果物を更新しない。
- ユーザー回答後の記録先は `amadeus-domain-modeling` の規則に従う。
- 独自の成果物構造、用語 ID、モデル ID、契約 ID を作らない。
- `CONTEXT.md` と `docs/adr/**` を更新しない。
- `evals.json` が JSON として解釈できる。
- `git diff --check` が成功する。

昇格時は symlink ではなくコピーにする。
昇格コピー対象は `SKILL.md` だけである。
`evals/` は開発用なので昇格先へコピーしない。

## 手動 eval 状態

| ケース | 状態 | 確認内容 | 証拠 |
|---|---|---|---|
| `ask-one-domain-question` | 完了 | 一問だけ出し、推奨回答と理由、回答後の更新候補を示す。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-domain-grilling-eval.20260627-73956-n06har/ask-one-domain-question/checks.md` |
| `do-not-update-before-answer` | 完了 | 質問が必要なターンでは成果物を更新しない。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-domain-grilling-eval.20260627-73956-n06har/do-not-update-before-answer/checks.md` |
| `update-after-answer` | 完了 | 回答後は domain-modeling の更新先規則に従う。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-domain-grilling-eval.20260627-73956-n06har/update-after-answer/checks.md` |

## 再実行コマンド

```sh
bun -e 'JSON.parse(await Bun.file("skills/amadeus-domain-grilling/evals/evals.json").text()); console.log("evals.json: ok")'
cmp -s skills/amadeus-domain-grilling/SKILL.md .agents/skills/amadeus-domain-grilling/SKILL.md && echo "SKILL.md: identical"
git diff --check
```
