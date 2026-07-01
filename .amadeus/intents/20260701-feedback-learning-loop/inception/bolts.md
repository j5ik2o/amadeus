# ボルト

## 一覧

| 識別子 | 概要 | ユニット | 設計 | 依存 | 詳細 |
|---|---|---|---|---|---|
| B001 | 前段 feedback routing 契約を phase skill に定義する。 | U001 | [design.md](units/U001-feedback-routing-contract/design.md) | なし | [B001-feedback-routing-contract.md](bolts/B001-feedback-routing-contract.md) |
| B002 | Intent 横断 learning promotion 契約と成果物責務を定義する。 | U002 | [design.md](units/U002-learning-promotion-contract/design.md) | B001 | [B002-learning-promotion-contract.md](bolts/B002-learning-promotion-contract.md) |

## 依存関係

| ボルト | 依存 | 理由 |
|---|---|---|
| B001 | なし | 前段 feedback と現在 phase 修正の分類が、横断学習の昇格判断の前提であるため。 |
| B002 | B001 | Intent 横断学習の昇格は、現在 Intent 内で扱う発見を除外した後に判断するため。 |
