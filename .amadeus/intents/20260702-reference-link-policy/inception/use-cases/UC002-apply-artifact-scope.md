# UC002: 成果物適用範囲を整理する

## システム境界

- Agent が参照リンク化規則をもとに、template、example、traceability、decisions、既存成果物への適用範囲を整理する。

## 事前条件

- UC001 で参照リンク化対象とリンク先規則が整理されている。
- source skill、昇格先成果物、example、既存 `.amadeus/` 成果物の境界を読める。

## 基本フロー

1. Agent は Construction Functional Design template の `根拠`、`対象`、`候補内容` の列を確認する。
2. Agent は Inception、Ideation、Construction の traceability と decisions の参照表記を確認する。
3. Agent は source skill と昇格先成果物の同期対象を整理する。
4. Agent は example と既存成果物の補修範囲を整理する。
5. Agent は内容変更と参照リンク化の境界を Inception 成果物へ記録する。

## 代替フロー

- 既存成果物の補修が大きくなる場合は、Construction で Bolt を分ける。

## 事後条件

- 参照リンク化方針をどの成果物へ適用するかを後続 stage へ渡せる。

## BCE候補

| 種別 | 候補 | 責務 |
|---|---|---|
| 境界 | Artifact Scope | 参照リンク化方針の適用成果物を扱う。 |
| 制御 | Application Scope Decision | template、example、既存成果物の適用範囲を判断する。 |
| エンティティ | Linkable Artifact | 方針適用対象の Markdown 成果物を表す。 |

## 責務候補

| 候補 | 判断 | 保持 | 依頼 |
|---|---|---|---|
| Artifact Scope | 採用候補 | 対象成果物、対象外、同期範囲 | Validator Boundary に検出対象を渡す |
| Linkable Artifact | 採用候補 | 成果物種別、対象列、参照種別 | Construction Functional Design に具体化を委ねる |
