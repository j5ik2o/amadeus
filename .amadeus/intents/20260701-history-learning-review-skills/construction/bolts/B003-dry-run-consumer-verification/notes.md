# Construction ノート

## 実行方針

- B003 は `amadeus-discovery` の説明境界と同期検証だけを扱う。
- `amadeus-discovery dry-run` 本体の候補表示実装は Issue #272 に残す。
- `dry-run` は過去分析と学習分類の consumer であり、分析と分類の owner ではない。

## 対象タスク

| タスク | 状態 | 方針 | 証拠 |
|---|---|---|---|
| T001 | 完了 | discovery skill に dry-run consumer 境界を追記する。 | [test-results.md](test-results.md) |
| T002 | 完了 | promote-skill と text contract で同期を検証する。 | [test-results.md](test-results.md) |

## 実装判断

- `dry-run` を実行モードとして追加しない。
- 今回は Issue #272 の前提となる入力境界だけを `amadeus-discovery` に記録する。

## 検証入口

- `bun run dev-scripts/promote-skill.ts amadeus-discovery --replace`
- `npm run test:it:amadeus-templates`
- `npm run test:it:promote-skill`
- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260701-history-learning-review-skills`

## 未確認事項

なし。
