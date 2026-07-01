# 既存コード分析

## 対象コード

- `skills/amadeus-decision-review/SKILL.md`
- `.agents/skills/amadeus-decision-review/SKILL.md`
- `skills/amadeus-discovery/SKILL.md`
- `.agents/skills/amadeus-discovery/SKILL.md`
- `skills/amadeus-ideation/SKILL.md`
- `skills/amadeus-inception/SKILL.md`
- `skills/amadeus-construction/SKILL.md`
- `skills/amadeus-validator/SKILL.md`
- `.agents/skills/amadeus-ideation/SKILL.md`
- `.agents/skills/amadeus-inception/SKILL.md`
- `.agents/skills/amadeus-construction/SKILL.md`
- `.agents/skills/amadeus-validator/SKILL.md`
- `skills/*/references/skill-contract.md`
- `.agents/skills/*/references/skill-contract.md`
- `skills/amadeus-validator/validator/generated/skill-contracts.ts`
- `.agents/skills/amadeus-validator/validator/generated/skill-contracts.ts`
- `dev-scripts/evals/amadeus-templates/check.ts`
- `dev-scripts/evals/llm-templates/check.ts`
- `dev-scripts/promote-skill.ts`
- `.amadeus/steering/knowledge.md`
- `.amadeus/domain-map.md`
- `.amadeus/context-map.md`
- `.amadeus/intents/20260701-feedback-learning-loop/**`
- `.amadeus/intents/20260701-decision-review-grilling-gate/**`

## 既存能力

- `amadeus-decision-review` は、既存成果物、Issue、PR、作業ツリー、validator 結果、Skill Contract、信頼できる参照元を読み、次の処理分岐を返す内部 skill として存在する。
- `amadeus-discovery` は、既存 Discovery と既存 Intent を確認し、必要な場合だけ関連 Intent の `ideation/scope.md`、`inception/requirements.md`、`inception/traceability.md` を読む方針を持つ。
- Ideation、Inception、Construction の公開 phase skill は、実行中に見つけた発見を `current_phase_update_required`、`upstream_feedback_required`、`steering_knowledge_candidate`、`domain_map_candidate`、`context_map_candidate`、`follow_up_issue_candidate`、`follow_up_intent_candidate`、`no_learning_action` へ分類する契約を持つ。
- Skill Contract の参照ファイルには、`learning-review` が `feedbackConditions`、`postconditions`、`consumerReferences` を参照する consumer として記録されている。
- `amadeus-validator` は、validator 結果を phase skill または人間判断で学習先へ分類する説明を持つ。
- `dev-scripts/promote-skill.ts` は、source skill を昇格先成果物へ反映する入口として使える。
- `dev-scripts/evals/amadeus-templates/check.ts` は、source skill と昇格先成果物の text contract を確認する入口として使える。

## 統合点

- `amadeus-history-review` は、`amadeus-decision-review` と同じ内部 skill 形式で追加できる。
- `amadeus-history-review` は、`amadeus-discovery` が現在読む既存 Intent より広い `.amadeus/` 横断分析を担当できる。
- `amadeus-learning-review` は、既存 phase skill の学習分類と Skill Contract の `learning-review` consumer を具体化する入口にできる。
- `amadeus-discovery dry-run` は、`amadeus-history-review` または `amadeus-learning-review` の結果を入力にする説明だけを持ち、過去分析と学習分類の本体を所有しない構造にできる。
- source skill の追加後は `dev-scripts/promote-skill.ts` で `.agents/skills/` に反映し、`npm run test:it:promote-skill` と text contract で同期を確認できる。

## ギャップ

- `skills/amadeus-history-review/SKILL.md` と `.agents/skills/amadeus-history-review/SKILL.md` は存在しない。
- `skills/amadeus-learning-review/SKILL.md` と `.agents/skills/amadeus-learning-review/SKILL.md` は存在しない。
- `amadeus-history-review` の読み取り対象、抽出項目、出力形式、副作用の禁止が skill 本文として定義されていない。
- `amadeus-learning-review` の入力、分類結果、`amadeus-grilling` 連携、phase skill 連携が skill 本文として定義されていない。
- `amadeus-discovery dry-run` が分析結果を入力にできるが、分析責務を所有しないことは Issue #272 にあるが、現行 `amadeus-discovery` にはまだない。
- 追加する内部 skill を text contract で検出する eval 観点がまだない。

## リスク

- `dry-run` に過去分析を直接詰め込むと、候補表示と横断分析の責務が混ざる。
- `amadeus-history-review` が成果物更新や Issue 作成を行うと、読み取り専用の分析入口ではなくなり、Discovery や Ideation の責務と衝突する。
- `amadeus-learning-review` が Domain Map や Context Map へ候補を直接載せると、Domain Map と Context Map は候補を扱わないという契約に反する。
- validator の `pass` を学習先採用の根拠として扱うと、構造検出と内容承認が混ざる。
- source skill と昇格先成果物を手動同期すると、host environment で使う skill と target artifacts の追跡が弱くなる。

## Inception への入力

- Requirement は、過去分析、抽出結果、学習分類、`dry-run` 境界、同期検証に分ける。
- User Story は、Maintainer が内部 skill の追加範囲と責務境界を承認できる価値として扱う。
- Use Case は、過去成果物を分析する流れ、学習先を分類する流れ、`dry-run` が結果を参照する流れに分ける。
- Unit は、`amadeus-history-review` の分析契約と、`amadeus-learning-review` および consumer 境界の2つに分ける。
- Bolt は、内部 skill 追加、学習分類 skill 追加、`dry-run` 境界と検証の3つに分ける。
- 初期 Construction では、source skill を追加してから `dev-scripts/promote-skill.ts` で昇格先成果物へ反映する。

## 証拠

- `skills/amadeus-decision-review/SKILL.md`
- `.agents/skills/amadeus-decision-review/SKILL.md`
- `skills/amadeus-discovery/SKILL.md`
- `.agents/skills/amadeus-discovery/SKILL.md`
- `skills/amadeus-ideation/SKILL.md`
- `skills/amadeus-inception/SKILL.md`
- `skills/amadeus-construction/SKILL.md`
- `skills/amadeus-validator/SKILL.md`
- `dev-scripts/evals/amadeus-templates/check.ts`
- `dev-scripts/evals/llm-templates/check.ts`
- `dev-scripts/promote-skill.ts`
- `.amadeus/intents/20260701-feedback-learning-loop/inception/codebase-analysis.md`
- `.amadeus/intents/20260701-decision-review-grilling-gate/inception/codebase-analysis.md`
- commit `e94a766a87925cd21408e1fae5c40de0968943e4`

## 鮮度

- analyzedAt: `2026-07-01T14:36:51Z`
- freshness: current

## 未確認事項

- `amadeus-history-review` の出力を Markdown だけにするか、機械向け JSON を併用するかは Construction で確認する。
- `amadeus-learning-review` が CI 結果をどの粒度で入力にするかは Construction で確認する。
- `amadeus-discovery` への `dry-run` 境界説明をこの Intent の Construction に含めるか、Issue #272 に残すかは Bolt 実行時に確認する。
