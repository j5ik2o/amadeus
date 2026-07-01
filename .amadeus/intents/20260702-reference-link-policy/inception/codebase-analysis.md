# 既存コード分析

## 対象コード

- `skills/amadeus-construction/templates/intents/construction/**`
- `.agents/skills/amadeus-construction/templates/intents/construction/**`
- `skills/amadeus-inception/templates/intents/inception/**`
- `.agents/skills/amadeus-inception/templates/intents/inception/**`
- `skills/amadeus-validator/validator/AmadeusValidator.ts`
- `.agents/skills/amadeus-validator/validator/AmadeusValidator.ts`
- `dev-scripts/evals/amadeus-validator/check.ts`
- `examples/**/.amadeus`
- `.amadeus/intents/20260701-self-development-cycle-stage-workspace/**`
- `.amadeus/domain-map.md`
- `.amadeus/context-map.md`

## 既存能力

- validator は Markdown の相対リンクを抽出し、参照先の存在を検査できる。
- validator は一覧表の `詳細` 列、Decision 詳細、Unit 詳細、Bolt 詳細、相対リンクの参照先を検査できる。
- Construction template は Functional Design の `business-rules.md`、`business-logic-model.md`、`domain-entities.md` を持つ。
- Inception template は Requirement、Use Case、Unit、Bolt、traceability、decisions の詳細リンクを持つ。
- 既存の自己開発成果物は `BC001 自己開発運用` を Domain Map の adopted Bounded Context として参照できる。

## 統合点

- 参照リンク化方針は Construction Functional Design template の `根拠`、`対象`、`候補内容` の列に接続できる。
- 参照リンク化方針は Inception、Ideation、Construction の traceability と decisions のリンク表記に接続できる。
- GitHub 上のファイルパスと PR番号、Issue番号は、GitHub URL の外部リンクとして validator のリンク存在検査とは別の検出方針にできる。
- workspace 内成果物のファイルパスは、既存の相対リンク検査へ接続できる。
- eval は、未リンク参照と permalink 条件を固定する検証入口として使える。

## ギャップ

- Functional Design の表セルにある Requirement ID、Unit ID、Bolt ID、Bounded Context ID、Business Rule、Intent Contracts が、常に Markdown リンクになる方針はまだ成果物契約として固定されていない。
- GitHub 上のファイルパスまたはコード参照を commit SHA 付き permalink として扱う条件は、validator または eval の検出対象として未整理である。
- PR番号と Issue番号を対象 repository の URL へリンクする方針は、template と既存成果物へ一貫して反映されていない。
- 未リンク参照を fail、warning、対象外のどれとして扱うかが、参照種別ごとに未整理である。

## リスク

- ID の出現を単純な文字列検出だけで扱うと、本文中の説明、コードブロック、例示、既にリンク済みの表記を誤検出する。
- GitHub permalink 条件をすべての URL に広げると、Issue URL、PR URL、外部 docs URL まで誤って対象になる。
- 既存成果物を一括補修すると、今回の目的を超えて内容変更や整形変更が混入する。
- validator に意味検証を寄せすぎると、人間が判断すべき表示名やリンク粒度まで機械判定してしまう。

## Inception への入力

- 要求は、参照対象、リンク先規則、適用対象、validator 検出境界に分ける。
- User Story は、Maintainer と Reviewer が成果物から根拠へ移動できる価値として扱う。
- Use Case は、Agent が方針を定義し、成果物適用範囲を整理し、検出境界を確認する相互作用に分ける。
- Unit は、参照リンク方針契約と、validator または eval の検出境界に分ける。
- Bolt は、参照対象とリンク先規則、template と既存成果物への適用、validator と eval の検出方針に分ける。

## 証拠

- `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/business-rules.md`
- `skills/amadeus-construction/templates/intents/construction/U001-unit/functional-design/domain-entities.md`
- `skills/amadeus-inception/templates/intents/inception/traceability.md`
- `skills/amadeus-validator/validator/AmadeusValidator.ts`
- `.agents/skills/amadeus-validator/validator/AmadeusValidator.ts`
- `dev-scripts/evals/amadeus-validator/check.ts`
- `.amadeus/intents/20260701-self-development-cycle-stage-workspace/construction/U002-workspace-provenance/functional-design/business-rules.md`
- `.amadeus/intents/20260701-self-development-cycle-stage-workspace/construction/U002-workspace-provenance/functional-design/business-logic-model.md`
- `.amadeus/intents/20260701-self-development-cycle-stage-workspace/construction/U002-workspace-provenance/functional-design/domain-entities.md`
- [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243)
- commit `cd5a09337d7d2410e3fb81fc7e20fc9c90ba73df`

## 鮮度

- analyzedAt: `2026-07-01T17:31:56Z`
- freshness: current

## 未確認事項

- validator で未リンク参照を fail にする範囲と、eval または人間判断に残す範囲は Construction で確定する。
