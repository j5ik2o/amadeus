# Construction Notes

## 対象タスク

- B001/T001
- B001/T002

## 実行方針

- Skill Contract 型を最小構造で追加する。
- 初期対象 skill は5件に限定する。
- `SKILL.md` の全面再構成は行わない。
- 後方互換維持用の旧経路は追加しない。

## 作業順序

1. `skill-contract.ts` で型を定義する。
2. `skills.ts` で代表 skill catalog を定義する。
3. catalog の公開口を更新する。
4. typecheck で型制約を確認する。

## Task Generation Gate

- 状態: passed
- 承認根拠: ユーザーが Construction への option 1 を選択し、B001 から B003 の実行を承認した。

## 未確認事項

なし。
