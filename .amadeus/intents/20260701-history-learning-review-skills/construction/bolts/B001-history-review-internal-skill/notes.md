# Construction ノート

## 実行方針

- B001 は `amadeus-history-review` の追加、昇格、text contract 追加だけを扱う。
- 既存成果物の自動更新や Issue 作成は行わない。
- 分析結果の学習分類は B002 の `amadeus-learning-review` に委譲する。

## 対象タスク

| タスク | 状態 | 方針 | 証拠 |
|---|---|---|---|
| T001 | 完了 | source skill を追加する。 | [test-results.md](test-results.md) |
| T002 | 完了 | promote-skill と text contract で同期を検証する。 | [test-results.md](test-results.md) |

## 実装判断

- 出力形式は Markdown の報告契約として定義する。
- 機械向け JSON は今回の成功条件に含めず、必要になった場合は後続候補にする。

## 検証入口

- `bun run dev-scripts/promote-skill.ts amadeus-history-review`
- `npm run test:it:amadeus-templates`
- `npm run test:it:promote-skill`
- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260701-history-learning-review-skills`

## 未確認事項

なし。
