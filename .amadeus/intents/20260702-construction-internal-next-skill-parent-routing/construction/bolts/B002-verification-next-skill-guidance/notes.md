# Construction ノート

## 実行方針

- B002 は `amadeus-construction-verification-hardening` の `次の skill` 欄だけを更新する。
- source skill を先に更新し、既存の昇格手順で昇格先成果物へ反映する。
- 周辺 skill の確認は B003 に残す。

## 対象タスク

| タスク | 状態 | 方針 | 証拠 |
|---|---|---|---|
| T001 | 完了 | source skill の `次の skill` 欄を更新する。 | `skills/amadeus-construction-verification-hardening/SKILL.md` |
| T002 | 完了 | `dev-scripts/promote-skill.ts` で昇格先成果物へ反映する。 | `.agents/skills/amadeus-construction-verification-hardening/SKILL.md` |

## 実装判断

- 検証後案内は親 skill 経由を先に書き、内部 skill 直接利用条件を後に書く。
- 検証と堅牢化 skill の成果物境界、手順、禁止事項は変更しない。
- `dev-scripts/promote-skill.ts amadeus-construction-verification-hardening --replace` で昇格先成果物へ反映した。

## 検証入口

- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260702-construction-internal-next-skill-parent-routing`
- `npm run typecheck`
- `npm run test:it:promote-skill`
- `npm run test:e2e:construction:internal:verification-hardening:initial:mock`
- `npm run diff:check`

## 未確認事項

- なし。
