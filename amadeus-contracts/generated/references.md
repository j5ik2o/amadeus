# Amadeus DLC Contract Catalog Reference

この文書は `amadeus-contracts/catalog/**` から生成する。
直接編集せず、Catalog を更新してから `npm run contracts:generate` を実行する。

## Artifact Contracts

### inception.units.index

- path: `inception/units.md`
- documentType: `UnitIndex`
- requiredHeadings: `一覧`, `依存関係`

- table `一覧`: `識別子`, `概要`, `要求`, `コンテキスト`, `依存`, `詳細`
- table `依存関係`: `ユニット`, `依存`, `理由`

### functional-design.business-logic-model

- path: `construction/<unit-id>-<slug>/functional-design/business-logic-model.md`
- documentType: `FunctionalDesignBusinessLogicModel`
- requiredHeadings: `目的`, `対象 Unit`, `業務ロジック`, `入力`, `出力`, `未確認事項`


### functional-design.business-rules

- path: `construction/<unit-id>-<slug>/functional-design/business-rules.md`
- documentType: `FunctionalDesignBusinessRules`
- requiredHeadings: `目的`, `業務ルール`, `例外`, `未確認事項`

- table `業務ルール`: `識別子`, `規則`, `根拠`, `状態`

### functional-design.domain-entities

- path: `construction/<unit-id>-<slug>/functional-design/domain-entities.md`
- documentType: `FunctionalDesignDomainEntities`
- requiredHeadings: `目的`, `Domain Entity`, `関係`, `未確認事項`

- table `Domain Entity`: `識別子`, `名前`, `責務`, `関連`

### functional-design.frontend-components

- path: `construction/<unit-id>-<slug>/functional-design/frontend-components.md`
- documentType: `FunctionalDesignFrontendComponents`
- requiredHeadings: `目的`, `UI 構成`, `状態`, `未確認事項`

- table `UI 構成`: `識別子`, `名前`, `責務`, `状態`

## Functional Design

Functional Design は Construction の `3.1 Functional Design` で扱う。
Execution は `CONDITIONAL` である。
必要性は `state.json.construction.functionalDesign` で表す。
成果物の必須性は Catalog から導出する。

### Core Artifacts

- `business-logic-model.md`: functionalDesign.requirement == required
- `business-rules.md`: functionalDesign.requirement == required
- `domain-entities.md`: functionalDesign.requirement == required

### Conditional Artifacts

- `frontend-components.md`: `frontendSurface: present` の場合に必須である。

### Gate Result

- `not_started` -> `not_ready`
- `in_progress` -> `not_ready`
- `ready_for_approval` -> `waiting_approval`
- `passed` -> `passed`
- `failed` -> `failed`
- `skipped` -> `skipped`
- `blocked` -> `blocked`

## Task Generation

Task Generation は Construction の `3.2 Bolt Preparation` で扱う。
`TaskGenerationGateResult` は state に保存せず、status と evidence 検証から導出する。
`ready_for_approval` は人間承認待ちであり、`passed` は人間承認済みである。
Task Generation evidence は Bolt 側 `design.md` を指さない。

### Status

- `not_started` -> `not_ready`
- `in_progress` -> `not_ready`
- `ready_for_approval` -> `waiting_approval`
- `passed` -> `passed`
- `failed` -> `failed`
- `blocked` -> `blocked`

### Evidence Kinds

- `functional_design`
- `unit_design_brief`
- `bolt_module`
- `tasks`
- `notes`
- `approval`
