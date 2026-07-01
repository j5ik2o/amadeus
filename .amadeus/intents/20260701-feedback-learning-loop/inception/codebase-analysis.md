# 既存コード分析

## 対象コード

- `skills/amadeus-ideation/SKILL.md`
- `skills/amadeus-inception/SKILL.md`
- `skills/amadeus-construction/SKILL.md`
- `skills/amadeus-validator/SKILL.md`
- `.agents/skills/amadeus-ideation/SKILL.md`
- `.agents/skills/amadeus-inception/SKILL.md`
- `.agents/skills/amadeus-construction/SKILL.md`
- `.agents/skills/amadeus-validator/SKILL.md`
- `skills/amadeus-construction-functional-design/SKILL.md`
- `skills/amadeus-construction-traceability-finalization/SKILL.md`
- `.agents/skills/amadeus-construction-functional-design/SKILL.md`
- `.agents/skills/amadeus-construction-traceability-finalization/SKILL.md`
- `dev-scripts/evals/llm-templates/check.ts`
- `dev-scripts/evals/amadeus-templates/check.ts`
- `dev-scripts/evals/amadeus-validator/check.ts`
- `.amadeus/steering/knowledge.md`
- `.amadeus/steering/policies/git-branching.md`
- `.amadeus/domain-map.md`
- `.amadeus/context-map.md`
- `.amadeus/intents/20260701-feedback-learning-loop/ideation/scope.md`
- `.amadeus/intents/20260701-feedback-learning-loop/ideation/ideation.md`
- `.amadeus/intents/20260701-skill-execution-reporting/inception/codebase-analysis.md`

## 既存能力

- 公開 `amadeus-*` skill は、実行中に見つけた問題や懸念を、現在の Intent 対象、後続 Issue 候補、報告不要に分類する契約を持つ。
- `amadeus-inception` は、Requirements Review Gate と Codebase Analysis Gate を通じて、前段成果物と既存コードの整合を確認する。
- `amadeus-construction-functional-design` と `amadeus-construction-traceability-finalization` は、Domain Map と Context Map へ昇格する候補や採用判断を扱う。
- `amadeus-validator` は、成果物が実行時に参照できる最低限の構造条件を満たすかを検出する。
- `.amadeus/steering/knowledge.md` と `steering/knowledge/` は、Intent 横断で再利用する知識を置く場所として存在する。
- `.amadeus/steering/policies/git-branching.md` は、review comment を現在の Intent で扱うか後続 Issue にするかの考え方を持つ。
- Domain Map と Context Map は、承認済み stage 成果物から昇格した現在像だけを扱う。

## 統合点

- `amadeus-ideation` は、Inception で Ideation の scope、成果物深度、検証戦略の不足が見つかった場合の戻し先になる。
- `amadeus-inception` は、Construction で Requirement、Use Case、Unit、Bolt の不足が見つかった場合の戻し先になる。
- `amadeus-construction` と内部 stage skill は、現在 phase 内の成果物で直せる事項と、前段へ戻す事項を分ける入口になる。
- `amadeus-grilling` は、学習分類や戻し先に人間判断が必要な場合の質問入口になる。
- `amadeus-validator` は構造検出を返し、evaluator は内容品質の評価を返す入口として扱える。
- `dev-scripts/evals/llm-templates/check.ts` と `dev-scripts/evals/amadeus-templates/check.ts` は、skill 契約と昇格先成果物の整合を確認する入口になる。

## ギャップ

- 後段 phase で前段成果物の不整合、不足、古い判断を見つけた場合に、どの phase skill または内部 stage skill へ戻すかが標準化されていない。
- 現在 Intent の前段成果物へ戻す対象、現在 phase 内で直す対象、後続 Issue または後続 Intent に切る対象の分類が、実行時問題報告より広い learning loop として定義されていない。
- 完了済み Intent から抽出した知識を、Steering knowledge、Domain Map、Context Map のどこへ昇格するかの条件が整理されていない。
- `学習候補`、`traceability.md`、`decisions.md`、`.amadeus/steering/knowledge.md` の責務差が、phase skill から参照できる形でまとまっていない。
- validator と evaluator の結果を、構造検出、品質評価、学習候補に分類する条件がまだ共通契約になっていない。
- Issue #257 の decision review と、この Intent の学習分類を同じ責務として混ぜないための起動順序が未定義である。

## リスク

- 後段成果物だけで前段の不整合を吸収すると、traceability と gate の監査可能性が弱くなる。
- 一時的な作業メモまで Steering knowledge や Domain Map に昇格すると、現在像と候補が混ざる。
- Domain Map と Context Map に候補を載せると、adopted と retired だけを扱う契約が崩れる。
- validator の `pass` を内容承認として扱うと、構造検出と人間判断の境界が曖昧になる。
- Issue #257 の decision review と学習分類を同じ機能として扱うと、質問起動条件と学習先分類の責務が混ざる。

## Inception への入力

- Requirement は、前段 feedback 条件、現在 phase 修正と後続化の分類、横断学習の昇格条件、成果物責務、validator と evaluator の扱い、Issue #257 との境界に分ける。
- User Story は、Maintainer が後段発見と Intent 横断学習を承認可能な分類へ分ける価値として扱う。
- Use Case は、後段発見の分類、横断学習の昇格判断、validator または evaluator 結果の扱いを分ける。
- Unit は、前段 feedback routing と、Intent 横断 learning promotion の2つに分ける。
- Bolt は、前段 feedback routing 契約の反映と、横断 learning promotion 契約の反映に分ける。
- 初期 Construction slice では、新しい内部 skill を先に作らず、既存 phase skill と内部 stage skill が参照できる共通契約を定義する。
- `amadeus-learning-review` または `amadeus-feedback-review` の新設は、共通契約の重複や分岐が Construction で大きくなった場合の後続 Issue 候補にする。

## 証拠

- `skills/amadeus-ideation/SKILL.md`
- `skills/amadeus-inception/SKILL.md`
- `skills/amadeus-construction/SKILL.md`
- `skills/amadeus-validator/SKILL.md`
- `.agents/skills/amadeus-ideation/SKILL.md`
- `.agents/skills/amadeus-inception/SKILL.md`
- `.agents/skills/amadeus-construction/SKILL.md`
- `.agents/skills/amadeus-validator/SKILL.md`
- `skills/amadeus-construction-functional-design/SKILL.md`
- `skills/amadeus-construction-traceability-finalization/SKILL.md`
- `dev-scripts/evals/llm-templates/check.ts`
- `dev-scripts/evals/amadeus-templates/check.ts`
- `dev-scripts/evals/amadeus-validator/check.ts`
- `.amadeus/domain-map.md`
- `.amadeus/context-map.md`
- `.amadeus/steering/knowledge.md`
- `.amadeus/steering/policies/git-branching.md`
- `.amadeus/intents/20260701-feedback-learning-loop/ideation/scope.md`
- `.amadeus/intents/20260701-feedback-learning-loop/ideation/ideation.md`
- commit `bd0f8cfc29cbc51328a0d4310b6f8437c5ff0062`

## 鮮度

- analyzedAt: `2026-07-01T11:46:18Z`
- freshness: current

## 未確認事項

- 共通契約を最初に反映する代表 skill の範囲は、Construction で差分規模を見て確定する。
- evaluator の接続先を既存 eval へ置くか、新しい eval 観点を追加するかは、Construction で確認する。
- 専用内部 skill を新設するかは、共通契約の重複が明らかになった場合に後続 Issue 候補として扱う。
