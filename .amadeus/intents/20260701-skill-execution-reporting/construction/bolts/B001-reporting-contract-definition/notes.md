# Construction ノート

## 実行方針

- B001 は source skill の報告契約定義だけを扱う。
- 対象は `skills/amadeus-ideation/SKILL.md`、`skills/amadeus-inception/SKILL.md`、`skills/amadeus-construction/SKILL.md` に限定する。
- `amadeus-discovery` と `amadeus-validator` は初回対象外にし、必要なら後続 Issue 候補として扱う。

## 対象タスク

| タスク | 状態 | 方針 | 証拠 |
|---|---|---|---|
| T001 | 完了 | 公開 skill 3件に報告先分類を追加する。 | [test-results.md](test-results.md) |
| T002 | 完了 | 最低報告項目と検証境界を追加する。 | [test-results.md](test-results.md) |

## 実装判断

- 共通契約は各公開 skill の `検証` と `禁止事項` の間に配置した。
- これは、成果物更新後の検証と、混入禁止の判断をつなぐ位置として読めるためである。
- 新しい内部 skill は作らず、共通契約の文言を公開 skill に直接置いた。

## 検証入口

- `npm run typecheck`
- `npm run test:it:amadeus-templates`
- `npm run test:it:promote-skill`
- `npm run diff:check`
- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260701-skill-execution-reporting`

## 未確認事項

なし。
