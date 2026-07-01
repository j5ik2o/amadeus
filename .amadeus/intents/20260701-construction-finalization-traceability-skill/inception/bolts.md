# ボルト

## 一覧

| 識別子 | 概要 | ユニット | 設計 | 依存 | 詳細 |
|---|---|---|---|---|---|
| B001 | Construction finalization skill guidance を更新する。 | U001 | [design.md](units/U001-finalization-skill-guidance/design.md) | なし | [B001-finalization-skill-guidance.md](bolts/B001-finalization-skill-guidance.md) |
| B002 | traceability template、example、source skill と昇格先成果物の整合を確認する。 | U002 | [design.md](units/U002-traceability-template-alignment/design.md) | B001 | [B002-template-and-example-alignment.md](bolts/B002-template-and-example-alignment.md) |

## 依存関係

| ボルト | 依存 | 理由 |
|---|---|---|
| B001 | なし | guidance 更新は template と example の整合確認の前提であるため。 |
| B002 | B001 | template と example は、採用済み guidance を基準に確認するため。 |
