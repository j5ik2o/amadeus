# Construction Notes

## 対象タスク

- B002/T001
- B002/T002

## 実行方針

- 生成対象は `dev-scripts/amadeus-contracts.ts` に集約する。
- `references/skill-contract.md` は手書きしない。
- `contracts:check` と contract eval で欠落と差分を検出する。

## 作業順序

1. Skill Contract 生成 content を追加する。
2. 生成対象 path を追加する。
3. eval の追跡対象を更新する。
4. `contracts:generate` を実行する。
5. `contracts:check` と eval を実行する。

## Task Generation Gate

- 状態: passed
- 承認根拠: ユーザーが Construction への option 1 を選択し、B001 から B003 の実行を承認した。

## 未確認事項

なし。
