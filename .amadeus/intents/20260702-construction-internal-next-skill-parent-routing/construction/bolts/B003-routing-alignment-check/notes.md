# Construction ノート

## 実行方針

- B003 は B001 と B002 の対象外だった周辺 Construction 内部 skill の案内を確認する。
- `next skill` と同等の次工程案内に、内部 skill 直行の誤読余地が残る場合は親 skill 経由へ更新する。
- source skill を先に更新し、既存の昇格手順で昇格先成果物へ反映する。

## 対象タスク

| タスク | 状態 | 方針 | 証拠 |
|---|---|---|---|
| T001 | 完了 | 周辺 skill の次工程案内を確認し、必要な箇所を更新する。 | `skills/amadeus-construction-functional-design/SKILL.md`, `skills/amadeus-construction-bolt-preparation/SKILL.md`, `skills/amadeus-construction-traceability-finalization/SKILL.md` |
| T002 | 完了 | `dev-scripts/promote-skill.ts` で昇格先成果物へ反映する。 | `.agents/skills/amadeus-construction-functional-design/SKILL.md`, `.agents/skills/amadeus-construction-bolt-preparation/SKILL.md`, `.agents/skills/amadeus-construction-traceability-finalization/SKILL.md` |
| T003 | 完了 | 整合確認の判断を traceability と decision に記録する。 | `construction/decisions/D002-surrounding-skill-routing-alignment.md` |

## 実装判断

- `amadeus-construction-functional-design` は Bolt Preparation への継続を、親 skill の Bolt 実行準備目的として案内する。
- `amadeus-construction-bolt-preparation` は実装実行への継続を、親 skill の実装実行目的として案内する。
- `amadeus-construction-traceability-finalization` の `次の skill` 欄は内部 skill 直行を案内していないため、更新しない。
- `amadeus-construction-traceability-finalization` の `test-results.md` 不足時案内は検証工程への戻りを示すため、親 skill の検証目的へ更新する。

## 検証入口

- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260702-construction-internal-next-skill-parent-routing`
- `npm run typecheck`
- `npm run lint:check`
- `npm run contracts:check`
- `npm run test:it:promote-skill`
- `npm run test:e2e:construction:internal:initial:all:mock`
- `npm run diff:check`

## 未確認事項

- なし。
