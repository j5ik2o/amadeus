# ユニット

## 一覧

| 識別子 | 概要 | 要求 | コンテキスト | 依存 | 詳細 |
|---|---|---|---|---|---|
| U001 | 後段発見を前段 feedback、現在 phase 修正、後続化へ振り分ける契約を扱う。 | R001, R002, R005 | BC001 | なし | [U001-feedback-routing-contract.md](units/U001-feedback-routing-contract.md) |
| U002 | Intent 横断学習の昇格先と成果物責務の分離を扱う。 | R003, R004, R005 | BC001 | U001 | [U002-learning-promotion-contract.md](units/U002-learning-promotion-contract.md) |

Unit の `コンテキスト` は Domain Map の `adopted` Bounded Context を参照する。

## 依存関係

| ユニット | 依存 | 理由 |
|---|---|---|
| U001 | なし | 後段発見の分類が、横断学習の昇格判断の前提であるため。 |
| U002 | U001 | Steering knowledge、Domain Map、Context Map への昇格は、現在 Intent 内で扱うべき事項を除外した後に判断するため。 |
