# R004: source skill と昇格先成果物の整合

## 要求

- source skill と昇格先成果物は、同じ Construction finalization traceability 契約を説明する。

## 受け入れ条件

- `skills/amadeus-construction/SKILL.md` と `.agents/skills/amadeus-construction/SKILL.md` の該当説明が整合している。
- `skills/amadeus-construction-traceability-finalization/SKILL.md` と `.agents/skills/amadeus-construction-traceability-finalization/SKILL.md` の該当説明が整合している。
- template または example を更新対象に含めるかを確認し、対象に含めない場合は理由が追跡できる。
- validator の成果物契約は変更対象外として扱われている。

## 根拠

- [Issue #245](https://github.com/amadeus-dlc/amadeus/issues/245)
- [steering/policies.md](../../../../steering/policies.md)
- [codebase-analysis.md](../codebase-analysis.md)

## 未確認事項

- 昇格手段と provenance の記録先は Construction で確定する。
