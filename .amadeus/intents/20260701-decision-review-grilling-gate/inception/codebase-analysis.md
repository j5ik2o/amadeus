# 既存コード分析

## 対象コード

- `skills/amadeus-ideation/SKILL.md`
- `skills/amadeus-inception/SKILL.md`
- `skills/amadeus-construction/SKILL.md`
- `.agents/skills/amadeus-ideation/SKILL.md`
- `.agents/skills/amadeus-inception/SKILL.md`
- `.agents/skills/amadeus-construction/SKILL.md`
- `skills/amadeus-grilling/SKILL.md`
- `.agents/skills/amadeus-grilling/SKILL.md`
- `amadeus-contracts/catalog/skill-contract.ts`
- `amadeus-contracts/catalog/skills.ts`
- `amadeus-contracts/generated/skills.json`
- `skills/amadeus-validator/validator/generated/skill-contracts.ts`
- `.agents/skills/amadeus-validator/validator/generated/skill-contracts.ts`
- `skills/amadeus-validator/SKILL.md`
- `.agents/skills/amadeus-validator/SKILL.md`
- `dev-scripts/evals/amadeus-validator/check.ts`
- `.amadeus/domain-map.md`

## 既存能力

- 公開 phase skill は `auto`、`guided`、`refine`、`repair` の実行モードを持つ。
- 公開 phase skill は、判断材料が足りない場合に `amadeus-grilling` で一問ずつ確認する方針を持つ。
- 公開 phase skill は、実行時問題報告で `upstream_feedback_required`、`current_phase_update_required`、`follow_up_issue_candidate` などの分類を持つ。
- `amadeus-grilling` は、質問作法と Grilling Decision Trail の記録構造を定義している。
- Skill Contract catalog は、`decision-review` を consumer として扱い、phase skill の前提、不変条件、事後条件、読み取り境界、書き込み境界を生成物へ出力できる。
- validator は、成果物構造、リンク、識別子、状態、Grilling Decision Trail の構造を検出できる。
- `.amadeus/domain-map.md` には `BC001 自己開発運用` が `adopted` として存在する。

## 統合点

- `skills/amadeus-decision-review/SKILL.md` と `.agents/skills/amadeus-decision-review/SKILL.md` を内部 skill 候補として扱う。
- 公開 phase skill の起動時判定へ、decision review を共通前処理として接続する。
- `amadeus-grilling` へ渡す一問、確認理由、推奨回答、推奨理由、反映先候補を decision review の出力として整理する。
- Skill Contract の `consumerReferences`、`grillingConditions`、`feedbackConditions` を decision review の入力候補として使う。
- validator と evaluator は、decision review の結果を内容承認として扱わず、構造検出と品質評価の候補として分ける。

## ギャップ

- phase skill 起動時に、既存成果物と現在参照できる証拠から decision tree を再評価する共通契約がない。
- `amadeus-grilling` を起動すべき不明瞭ノードと、質問せず進めるノードの分類が標準化されていない。
- `repair` で解くべき構造問題と、人間判断が必要な不明瞭ノードの境界が明文化されていない。
- `follow_up_issue_candidate` として報告すべき成果物境界外の懸念を、decision review の戻り値として扱う契約がない。
- Skill Contract と decision review の接続は consumer 参照として存在するが、phase skill 起動時の実行順序にはまだ反映されていない。

## リスク

- decision review 自体が質問すると、質問作法と記録責務が `amadeus-grilling` と重複する。
- validator の `pass` を質問不要の根拠として扱うと、構造検出と判断ゲートが混ざる。
- 初期対象を全 skill へ広げると、契約範囲と検証範囲が大きくなりすぎる。
- Discovery、Event Storming、Steering まで同時に含めると、Issue #257 の初回 Construction slice が大きくなる。

## Inception への入力

- Requirement は、入力証拠、判断ノード分類、grilling handoff、phase skill 反映、検証境界に分ける。
- User Story は、Maintainer が質問要否と通常処理への分岐をレビューできる価値として扱う。
- Use Case は、decision tree 再評価、grilling handoff、phase skill 反映確認に分ける。
- Unit は、decision review gate contract と phase skill integration の2つに分ける。
- Bolt は、内部 skill 契約、公開 phase skill 反映、検証と Skill Contract 整合の3つに分ける。
- 初期対象 phase skill は `amadeus-ideation`、`amadeus-inception`、`amadeus-construction` に限定する。

## 証拠

- `skills/amadeus-ideation/SKILL.md`
- `skills/amadeus-inception/SKILL.md`
- `skills/amadeus-construction/SKILL.md`
- `.agents/skills/amadeus-ideation/SKILL.md`
- `.agents/skills/amadeus-inception/SKILL.md`
- `.agents/skills/amadeus-construction/SKILL.md`
- `skills/amadeus-grilling/SKILL.md`
- `.agents/skills/amadeus-grilling/SKILL.md`
- `amadeus-contracts/catalog/skill-contract.ts`
- `amadeus-contracts/catalog/skills.ts`
- `skills/amadeus-validator/validator/generated/skill-contracts.ts`
- `.agents/skills/amadeus-validator/validator/generated/skill-contracts.ts`
- `.amadeus/domain-map.md`
- commit `b29debbeac7ea8b8808f329a755e39e745dfd81a`

## 鮮度

- analyzedAt: `2026-07-01T13:33:53Z`
- freshness: current

## 未確認事項

- なし。
