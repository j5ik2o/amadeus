# U001: feedback routing contract

## ユニット

- 後段発見を前段 feedback、現在 phase 修正、後続 Issue、後続 Intent、不採用へ分類する契約を扱う。

## 対象要求

- R001
- R002
- R005

## 価値境界

- この Unit は、後段 phase または検証結果から得た発見を、どの成果物と skill へ渡すかを決める。
- この Unit は、個別成果物の内容更新そのものは所有しない。
- この Unit は、Issue #257 の decision review が質問要否を決めた後の分類先を扱う。

## 検証観点

- Construction から Inception へ戻す条件が説明されている。
- Inception から Ideation へ戻す条件が説明されている。
- 現在 phase 修正、後続 Issue、後続 Intent、不採用との分類差が説明されている。
- validator と evaluator の結果を内容承認として扱っていない。

## 未確認事項

- 各 phase skill に置く具体的な文言と、内部 stage skill への委譲表は Construction で確定する。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-ideation/SKILL.md`, `skills/amadeus-inception/SKILL.md`, `skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-ideation/SKILL.md`, `.agents/skills/amadeus-inception/SKILL.md`, `.agents/skills/amadeus-construction/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `dev-scripts/evals/llm-templates/check.ts`, `dev-scripts/evals/amadeus-templates/check.ts` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U001-feedback-routing-contract/design.md)
