# amadeus-grilling evals

## 昇格条件

`amadeus-grilling` は、次を満たすことを確認する。

- 質問を一問ずつ出す。
- 各質問に推奨回答と理由を添える。
- 回答を待つ前に次の質問へ進まない。
- コードベースや `.amadeus/` 成果物を読めば分かることは質問しない。
- 質問が必要なターンでは成果物を更新しない。
- `evals.json` が JSON として解釈できる。
- `git diff --check` が成功する。

## 手動 eval 状態

検証日: 2026-06-27

| ケース | 状態 | 確認内容 | 証拠 |
|---|---|---|---|
| `one-question-with-recommendation` | 完了 | 一問だけ出し、推奨回答と理由を添える。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-grilling-eval.20260627-T2yNAn/one-question-with-recommendation/checks.md` |
| `inspect-before-asking` | 完了 | 読めば分かることを質問しない。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-grilling-eval.20260627-T2yNAn/inspect-before-asking/checks.md` |
| `do-not-update-before-answer` | 完了 | 質問が必要なターンでは成果物を更新しない。 | `/var/folders/3s/p2xl_vd524b4lk78cb6fz5nh0000gn/T/amadeus-grilling-eval.20260627-T2yNAn/do-not-update-before-answer/checks.md` |

## 再実行コマンド

```sh
bun -e 'JSON.parse(await Bun.file("skills/amadeus-grilling/evals/evals.json").text()); console.log("evals.json: ok")'
cmp -s skills/amadeus-grilling/SKILL.md .agents/skills/amadeus-grilling/SKILL.md && echo "SKILL.md: identical"
git diff --check
```
