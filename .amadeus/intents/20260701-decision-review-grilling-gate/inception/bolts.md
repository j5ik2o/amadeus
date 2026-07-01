# ボルト

## 一覧

| 識別子 | 概要 | ユニット | 要求 | 設計 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| B001 | decision review の内部 skill 契約を定義する。 | U001 | R001, R002, R003 | [design.md](units/U001-decision-review-gate-contract/design.md) | なし | [B001-decision-review-internal-contract.md](bolts/B001-decision-review-internal-contract.md) |
| B002 | 公開 phase skill の起動時判断へ decision review 規則を反映する。 | U002 | R004 | [design.md](units/U002-phase-skill-adoption-verification/design.md) | B001 | [B002-phase-skill-entry-integration.md](bolts/B002-phase-skill-entry-integration.md) |
| B003 | Skill Contract、validator、evaluator、eval の責務境界を確認する。 | U001, U002 | R005 | [U001 design](units/U001-decision-review-gate-contract/design.md), [U002 design](units/U002-phase-skill-adoption-verification/design.md) | B001, B002 | [B003-verification-contract-alignment.md](bolts/B003-verification-contract-alignment.md) |

## 依存関係

| ボルト | 依存 | 理由 |
|---|---|---|
| B001 | なし | decision review の内部契約が後続反映の前提であるため。 |
| B002 | B001 | 公開 phase skill 反映は、内部契約を入力にするため。 |
| B003 | B001, B002 | 検証境界の確認は、内部契約と phase skill 反映の両方を前提にするため。 |

## 未確認事項

- なし。
