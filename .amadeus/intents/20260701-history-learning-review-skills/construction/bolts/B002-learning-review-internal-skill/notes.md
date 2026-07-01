# Construction ノート

## 実行方針

- B002 は `amadeus-learning-review` の追加、昇格、text contract 追加だけを扱う。
- 分類契約は Issue #259 の分類と合わせる。
- 質問実行は `amadeus-grilling` に委譲し、この skill では handoff を返す。

## 対象タスク

| タスク | 状態 | 方針 | 証拠 |
|---|---|---|---|
| T001 | 完了 | source skill を追加する。 | [test-results.md](test-results.md) |
| T002 | 完了 | promote-skill と text contract で同期を検証する。 | [test-results.md](test-results.md) |

## 実装判断

- `amadeus-learning-review` は独立した内部 skill として追加する。
- `amadeus-decision-review` へ統合すると、意思決定再評価と学習先分類の責務が混ざるため、今回は分ける。

## 検証入口

- `bun run dev-scripts/promote-skill.ts amadeus-learning-review`
- `npm run test:it:amadeus-templates`
- `npm run test:it:promote-skill`
- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260701-history-learning-review-skills`

## 未確認事項

なし。
