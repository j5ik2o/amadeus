# 既存コード分析

## 対象コード

- `skills/amadeus-construction/SKILL.md`
- `skills/amadeus-construction-traceability-finalization/SKILL.md`
- `.agents/skills/amadeus-construction/SKILL.md`
- `.agents/skills/amadeus-construction-traceability-finalization/SKILL.md`
- `skills/amadeus-construction/templates/intents/construction/traceability.md`
- `.agents/skills/amadeus-construction/templates/intents/construction/traceability.md`
- `dev-scripts/evals/amadeus-validator/check.ts`
- `dev-scripts/evals/llm-templates/check.ts`
- `.amadeus/intents/20260701-self-development-cycle-stage-workspace/construction/traceability.md`

## 既存能力

- validator eval は、完了済み Construction に `Construction からの追跡` 表を要求している。
- `dev-scripts/evals/llm-templates/check.ts` は、Construction 完了の補修例として `Construction からの追跡` 表を追加する処理を持つ。
- Issue #233 の Construction 成果物は、PR #244 後に `Construction からの追跡` 表を持ち、対象 Intent の validator が pass している。
- source skill と昇格先 skill は、Construction の `Task Generation からの追跡` と `Deployment Unit からの追跡` を扱う記述を持つ。

## 統合点

- `amadeus-construction` の検証説明に、完了済み Construction では `Construction からの追跡` 表も必要であることを追加できる。
- `amadeus-construction-traceability-finalization` の手順に、`Construction からの追跡` 表の作成または補修を追加できる。
- source skill と昇格先成果物は、同じ内容を反映する対象として扱える。
- template または example は、validator が期待する追跡表構造とずれる場合に更新対象へ含められる。

## ギャップ

- `amadeus-construction` の検証説明は、`Task Generation からの追跡` を確認することだけを明示している。
- `amadeus-construction-traceability-finalization` の手順は、完了済み Construction に必要な `Construction からの追跡` 表の列を明示していない。
- traceability template は `Task Generation からの追跡` と `Deployment Unit からの追跡` を持つが、`Construction からの追跡` は持たない。
- template eval は、Construction traceability template の期待見出しに `Construction からの追跡` を含めていない。

## リスク

- skill 説明だけを更新し、template または eval のずれを確認しない場合、後続の生成物が validator で fail する可能性が残る。
- template だけを更新し、skill 手順を更新しない場合、agent が最終化時に表の意味を判断しにくい。
- validator の成果物契約を変更してしまうと、Issue #245 の対象外である契約変更になる。

## Inception への入力

- 要求は、完了時表要件、必須列、Task Generation 表との違い、source skill と昇格先成果物の整合に分ける。
- User Story は、Maintainer と Reviewer が skill と validator の契約一致を確認する価値として扱う。
- Use Case は、契約特定、skill guidance 更新、契約整合レビューに分ける。
- Unit は、finalization skill guidance と traceability template alignment に分ける。
- Bolt は、skill guidance 更新と template/example alignment 確認に分ける。

## 証拠

- `skills/amadeus-construction/SKILL.md`
- `skills/amadeus-construction-traceability-finalization/SKILL.md`
- `.agents/skills/amadeus-construction/SKILL.md`
- `.agents/skills/amadeus-construction-traceability-finalization/SKILL.md`
- `dev-scripts/evals/amadeus-validator/check.ts`
- `dev-scripts/evals/llm-templates/check.ts`
- `.amadeus/intents/20260701-self-development-cycle-stage-workspace/construction/traceability.md`
- commit `902340bf4495d1b88682cf52b8a127e34e1399b6`

## 鮮度

- analyzedAt: `2026-07-01T09:23:35Z`
- freshness: current

## 未確認事項

- template と example のどちらを Construction で更新対象に含めるかは、実際の差分と eval 影響を見て確定する。
