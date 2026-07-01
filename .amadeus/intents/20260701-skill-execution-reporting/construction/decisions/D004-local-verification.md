# D004: ローカル検証結果

## 背景

B001 と B002 の実装は、skill 文書、昇格先 skill、eval の変更で構成される。

## 判断

`typecheck`、`lint:check`、`amadeus-templates` eval、`promote-skill` eval、`diff:check`、対象 Intent validator の結果を Construction 完了証拠として採用する。

## 理由

変更対象は静的文書と eval 契約である。
そのため、型検査、lint、対象 eval、昇格手順、成果物 validator が今回の完了条件に対応する。

## 影響

- PR URL がまだないため `pr.md` は作らない。
- PR 作成後の CI と review comment は PR monitoring で確認する。
