# R002 skill-forge 確認の記録

## 要求

skill 変更 PR の説明で、skill-forge による確認の実施と結果を固定見出し「skill-forge 確認」から確認できる。

## 背景

README（英語、日本語）は skill 変更時の skill-forge 確認を推奨として持つが、記録形式がないため、レビュアーは確認の実施を検証できない。

## 受け入れ条件

- `steering/policies.md` の変更種別「skill 変更」の必須条件に、skill-forge 確認の実施と PR 説明への記録が含まれている。
- 記録形式として、PR 説明の固定見出し「skill-forge 確認」と記載項目（確認した観点、確認結果）が定義されている。
- 確認した観点は README の確認観点（skill 境界、trigger description、本文指示、eval coverage、存在する場合は Codex metadata）と一致し、該当しない観点は「該当なし」と記録できる。
- 確認結果には、問題なし、または見つかった問題と対応を記録できる。

## 依存

なし。

## 対応する対象境界

- SC-IN-002

## 未確認事項

- なし。
