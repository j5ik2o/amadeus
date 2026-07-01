# Construction ノート

## 実行方針

- B001 は `amadeus-construction-implementation-execution` の `次の skill` 欄だけを更新する。
- source skill を先に更新し、既存の昇格手順で昇格先成果物へ反映する。
- `amadeus-construction-verification-hardening` の更新は B002 に残す。
- 周辺 skill の確認は B003 に残す。

## 対象タスク

| タスク | 状態 | 方針 | 証拠 |
|---|---|---|---|
| T001 | 完了 | source skill の `次の skill` 欄を更新する。 | `skills/amadeus-construction-implementation-execution/SKILL.md` |
| T002 | 完了 | `dev-scripts/promote-skill.ts` で昇格先成果物へ反映する。 | `.agents/skills/amadeus-construction-implementation-execution/SKILL.md` |

## 実装判断

- 実装後案内は親 skill 経由を先に書き、内部 skill 直接利用条件を後に書く。
- 実装実行 skill の成果物境界、手順、禁止事項は変更しない。
- `dev-scripts/promote-skill.ts amadeus-construction-implementation-execution --replace` で昇格先成果物へ反映した。

## 検証入口

- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260702-construction-internal-next-skill-parent-routing`
- `npm run typecheck`
- `npm run test:it:promote-skill`
- `npm run diff:check`

## 未確認事項

- なし。
