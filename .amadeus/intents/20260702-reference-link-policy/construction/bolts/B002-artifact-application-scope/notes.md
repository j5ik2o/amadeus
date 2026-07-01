# Construction ノート

## 実行方針

- B002 は参照リンク化方針の適用成果物範囲を扱う。
- source skill と昇格先成果物は、昇格スクリプトで同期する。
- existing `.amadeus/` 成果物は、内容意味を変えずに PR番号参照のリンク化だけを代表補修する。
- example snapshot は、手作業で部分補修せず、source skill と validator の契約が揃った後の再生成対象として扱う。
- validator と eval の未リンク検出境界は B003 へ残す。

## 対象タスク

| タスク | 状態 | 方針 | 証拠 |
|---|---|---|---|
| T001 | 完了 | Inception template に参照リンク適用範囲を追加し、昇格先成果物へ反映する。 | `skills/amadeus-inception/templates/intents/inception/traceability.md`、`.agents/skills/amadeus-inception/templates/intents/inception/traceability.md` |
| T002 | 完了 | 既存成果物の PR番号参照を GitHub Pull Request URL へリンク化する。 | `.amadeus/intents/20260701-self-development-cycle-stage-workspace/construction/traceability.md` |
| T003 | 完了 | example snapshot は再生成対象として扱い、B002 では直接変更しない。 | [D003](../../decisions/D003-artifact-application-scope.md) |

## 実装判断

- B002 では `examples/**/.amadeus` を直接変更しない。
- example snapshot を部分的に手作業更新すると、source skill から生成できる成果物かどうかを確認できなくなるためである。
- PR URL は未作成のため、`pr.md` は作成していない。

## 検証入口

- `bun run dev-scripts/promote-skill.ts amadeus-inception --replace`
- `npm run test:it:promote-skill`
- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260702-reference-link-policy`
- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260701-self-development-cycle-stage-workspace`
- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts .`
- `git diff --check`

## 未確認事項

- example snapshot の再生成は、B003 の validator と eval 検出境界が確定した後に実施する。
