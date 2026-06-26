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

| ケース | 状態 | 確認内容 | 証拠 |
|---|---|---|---|
| `one-question-with-recommendation` | 未実施 | 一問だけ出し、推奨回答と理由を添える。 | 未登録 |
| `inspect-before-asking` | 未実施 | 読めば分かることを質問しない。 | 未登録 |
| `do-not-update-before-answer` | 未実施 | 質問が必要なターンでは成果物を更新しない。 | 未登録 |

## 再実行コマンド

```sh
ruby -rjson -e 'JSON.parse(File.read("skills/amadeus-grilling/evals/evals.json")); puts "evals.json: ok"'
cmp -s skills/amadeus-grilling/SKILL.md .agents/skills/amadeus-grilling/SKILL.md && echo "SKILL.md: identical"
git diff --check
```
