# R005: source skill と昇格先成果物の整合確認

## 要求

source skill と昇格先成果物が同じ次工程案内を説明し、周辺の Construction 内部 skill も同じ誤読余地がないか確認されている。

## 根拠

- [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274)
- [scope.md](../../ideation/scope.md) の SC-IN-005
- [codebase-analysis.md](../codebase-analysis.md)

## 受け入れ状態

- `skills/amadeus-construction-implementation-execution/SKILL.md` と `.agents/skills/amadeus-construction-implementation-execution/SKILL.md` の対象説明が整合している。
- `skills/amadeus-construction-verification-hardening/SKILL.md` と `.agents/skills/amadeus-construction-verification-hardening/SKILL.md` の対象説明が整合している。
- `amadeus-construction-bolt-preparation`、`amadeus-construction-functional-design`、`amadeus-construction-traceability-finalization` の `次の skill` 欄に同じ誤読余地がないか確認されている。

## 対象外

- validator の変更。
- 成果物レイアウトの変更。
