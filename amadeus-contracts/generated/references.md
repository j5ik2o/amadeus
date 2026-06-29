# Amadeus DLC Contract Catalog Reference

この文書は `amadeus-contracts/catalog/**` から生成する。
直接編集せず、Catalog を更新してから `npm run contracts:generate` を実行する。

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
