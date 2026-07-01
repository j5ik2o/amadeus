# B003 Verification Contract Alignment

## 概要

Skill Contract、validator、evaluator、eval の責務境界を確認する。

## 対象ユニット

- U001
- U002

## 設計

- [U001 design](../units/U001-decision-review-gate-contract/design.md)
- [U002 design](../units/U002-phase-skill-adoption-verification/design.md)

## 複数 Unit を扱う理由

decision review の入力契約は U001 に属し、phase skill 反映と検証境界は U002 に属する。
Skill Contract と validator または evaluator の整合は両方をまたぐため、この Bolt でまとめて確認する。

## 完了条件

- Skill Contract の `decision-review` consumer が、decision review の入力証拠として扱われている。
- validator の `pass` が質問不要や内容承認ではないことが説明されている。
- evaluator の本格実装を初期 Construction に含めるか、後続 Issue 候補にするかを判断できる。
- template eval または contract eval で確認する項目が整理されている。

## 依存

- B001
- B002

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `amadeus-contracts/catalog/skills.ts` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `skills/amadeus-validator/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `.agents/skills/amadeus-validator/SKILL.md` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `dev-scripts/evals/amadeus-templates/check.ts` | 未確認 | なし | 未確認 |

## 未確認事項

- evaluator の品質評価実装は、初期 Construction では後続候補にする可能性がある。
