# Construction Notes

## 対象タスク

- B003/T001
- B003/T002

## 実行方針

- consumer 参照入口は Skill Contract catalog と生成物で扱う。
- validator は構造検出、evaluator は品質評価入力として分ける。
- #257 と #259 の全実装は今回の対象外にする。

## 作業順序

1. catalog に consumer 参照情報を含める。
2. Markdown と TypeScript 生成物へ consumer 参照情報を出力する。
3. eval で consumer 参照情報の存在を確認する。
4. typecheck と contract check で参照入口を確認する。

## Task Generation Gate

- 状態: passed
- 承認根拠: ユーザーが Construction への option 1 を選択し、B001 から B003 の実行を承認した。

## 未確認事項

なし。
