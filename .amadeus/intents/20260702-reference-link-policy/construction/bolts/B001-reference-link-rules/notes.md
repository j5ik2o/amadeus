# Construction ノート

## 実行方針

- B001 は参照リンク化対象とリンク先規則だけを扱う。
- template、example、既存成果物への広範な適用範囲は B002 へ残す。
- validator と eval の検出境界は B003 へ残す。
- source skill の変更は `dev-scripts/promote-skill.ts` で `.agents/skills` へ昇格する。

## 対象タスク

| タスク | 状態 | 方針 | 証拠 |
|---|---|---|---|
| T001 | 完了 | Functional Design template で参照表記を分類し、参照リンク化対象の Domain Entity を読めるようにする。 | `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-logic-model.md`、`skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/domain-entities.md` |
| T002 | 完了 | Functional Design template で workspace 内成果物、GitHub permalink、PR番号、Issue番号のリンク先規則を読めるようにする。 | `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-rules.md` |

## 実装判断

- B001 では Construction template の core 3 文書に、参照リンク方針を成果物へ残すための最小構造を追加する。
- PR URL は未作成のため、`pr.md` は作成していない。

## 検証入口

- `bun run dev-scripts/promote-skill.ts amadeus-construction --replace`
- `npm run test:it:promote-skill`
- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260702-reference-link-policy`
- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts .`
- `git diff --check`

## 未確認事項

- 同一ファイル内アンカーを必須にする範囲は B002 以降で確定する。
