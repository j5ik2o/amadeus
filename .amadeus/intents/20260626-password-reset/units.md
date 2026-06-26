# ユニット

## 一覧

| 識別子 | 概要 | 要求 | 詳細 |
|---|---|---|---|
| U001 | システムがパスワード再設定要求を受け付ける | R001 | [U001-password-reset-request.md](units/U001-password-reset-request.md) |
| U002 | システムが再設定トークンで認証情報を更新する | R002 | [U002-credential-update-with-reset-token.md](units/U002-credential-update-with-reset-token.md) |

ユニットはインテント配下の価値単位である。

ボルトはユニットの子に固定せず、ボルト側から対象ユニットを参照する。
