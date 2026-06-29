# Validator Domain Model

## 目的

Validator Domain Model は、Amadeus 成果物を文字列ではなく Typed Document として扱うための基盤である。

Validator は Markdown を直接検証するのではなく、`MarkdownDocument` に parse し、さらに成果物種別ごとの Typed Document へ変換してから CheckResult を作る。

## 基本構造

検証の流れは次である。

```text
Markdown text
  -> MarkdownDocument
  -> Typed Document
  -> Amadeus DLC Contract Catalog
  -> CheckResult[]
  -> Report Formatter
```

`MarkdownDocument` は、見出し、セクション、表、本文を持つ構文モデルである。

Typed Document は、`UnitIndex`、`BusinessLogicModel`、`BusinessRules`、`DomainEntities`、`FrontendComponents` のような成果物種別ごとの意味モデルである。

Typed Document は `validate()` を持たない。
検証は Catalog と Stage Contract を適用する側が行う。

## Functional Design State

`ConstructionFunctionalDesignState` は、`state.json.construction.functionalDesign` を表す Validator の domain model である。

`FunctionalDesignUnitState` は、Unit ごとの要否、進行状態、frontend surface の判定、対象解決元、実行モードだけを持つ。

`FunctionalDesignUnitState` は `artifacts`、`required`、`surfaces`、`gate` を持たない。
成果物の必須性、条件付き成果物、path、見出し、表構造は Amadeus DLC Contract Catalog から導出する。

`FunctionalDesignGateResult` は保存値ではない。
Validator は `FunctionalDesignStatus` と Catalog に基づく成果物検証から gate result を導出する。

`targetSource` は対象 Unit の解決元だけを表す。
`runMode` は初回実行か再実行かだけを表す。
由来と実行契機を同じ値に混ぜない。

`frontendSurface: "absent"` は Unit 全体の skip を意味しない。
この値は `frontend-components.md` の条件付き requirement だけに影響する。

## Domain Primitive

Domain Primitive は、不変条件を持つ値だけに使う。

対象は次である。

- `RequirementId`
- `StoryId`
- `UseCaseId`
- `UnitId`
- `BoltId`
- `ArtifactPath`
- `DocumentTitle`
- `SectionTitle`
- `TableColumnName`
- `RuleId`

本文、説明、未確認事項、調査メモ、自由記述の段落は `string` のまま扱う。
これらは不変条件よりも文脈と内容が重要であり、個別 primitive にすると境界が増えすぎるためである。

## ParseResult

`ParseResult<TDocument>` は、partial な Typed Document と `CheckResult[]` を同時に返す。

文書の一部が壊れていても、読める範囲は Typed Document に残す。
壊れている箇所は `CheckResult` の `fail`、`blocked`、または `skipped` として返す。

## CheckResult

`CheckResult` は、表示文ではなく構造化された検証結果である。

保持する値は次である。

- `result`
- `target`
- `condition`
- `evidence`

`result` は `pass`、`fail`、`blocked`、`skipped` のいずれかである。

Report Formatter は `CheckResult` を日本語の表示へ変換する。
表示用の文言を Typed Document や Catalog の契約として扱わない。
