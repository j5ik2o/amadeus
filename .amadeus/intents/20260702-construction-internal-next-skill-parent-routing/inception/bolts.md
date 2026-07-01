# ボルト

## 一覧

| 識別子 | 概要 | ユニット | 設計 | 依存 | 詳細 |
|---|---|---|---|---|---|
| B001 | implementation execution の実装後案内を更新する。 | U001 | [design.md](units/U001-construction-next-skill-guidance/design.md) | なし | [B001-implementation-next-skill-guidance.md](bolts/B001-implementation-next-skill-guidance.md) |
| B002 | verification hardening の検証後案内を更新する。 | U001 | [design.md](units/U001-construction-next-skill-guidance/design.md) | B001 | [B002-verification-next-skill-guidance.md](bolts/B002-verification-next-skill-guidance.md) |
| B003 | source skill、昇格先成果物、周辺 Construction 内部 skill の整合を確認する。 | U001 | [design.md](units/U001-construction-next-skill-guidance/design.md) | B001, B002 | [B003-routing-alignment-check.md](bolts/B003-routing-alignment-check.md) |

## 依存関係

| ボルト | 依存 | 理由 |
|---|---|---|
| B001 | なし | 実装後案内は、親 skill 経由の継続説明の最初の対象であるため。 |
| B002 | B001 | 検証後案内は、B001 で採用した表現方針を前提にそろえるため。 |
| B003 | B001, B002 | 整合確認は、主要対象2 skill の案内更新を前提にするため。 |
