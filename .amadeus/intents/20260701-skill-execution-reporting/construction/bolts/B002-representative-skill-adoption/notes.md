# Construction ノート

## 実行方針

- B002 は、B001 で追加した source skill の報告契約を昇格先 skill と eval へ反映する。
- 昇格先 skill は手動同期せず、`dev-scripts/promote-skill.ts --replace` を使う。
- eval は `dev-scripts/evals/amadeus-templates/check.ts` を対象にする。

## 対象タスク

| タスク | 状態 | 方針 | 証拠 |
|---|---|---|---|
| T001 | 完了 | source skill を昇格先 skill へ反映する。 | [test-results.md](test-results.md) |
| T002 | 完了 | amadeus templates eval の text contract を更新する。 | [test-results.md](test-results.md) |

## 実装判断

- `amadeus-discovery` と `amadeus-validator` は初回反映対象外にした。
- 理由は、今回の代表対象が phase 公開入口3件であり、全 skill への一括反映は Issue #248 の初回 Construction slice として大きすぎるためである。
- `llm-templates` eval は、実行結果の構造期待を主に扱うため今回は更新しない。
- 報告契約の存在確認は `amadeus-templates` eval の text contract で十分に確認できる。

## 検証入口

- `npm run typecheck`
- `npm run test:it:amadeus-templates`
- `npm run test:it:promote-skill`
- `npm run diff:check`
- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260701-skill-execution-reporting`

## 未確認事項

なし。
