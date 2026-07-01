# D001 Complete Ideation

## 状態

accepted。

## 背景

Issue #263 は、skill 実行契約を `SKILL.md` の自然文だけに置かず、`amadeus-contracts` の型と生成物として扱うことを求めている。

Issue #257 の decision review と Issue #259 の learning review は、skill 実行契約を安定して参照する必要がある。

## 判断

Skill Contract Catalog の Ideation を完了し、Inception へ進める。

Inception では、対象境界、実行スコープ、成果物深度、検証戦略、代表 skill、生成物、参照入口を確認する。

## 根拠

- [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263)
- [scope.md](../scope.md)
- [ideation.md](../ideation.md)
- [initial-confirmation.puml](../mocks/initial-confirmation.puml)

## 影響

Inception では、Skill Contract の型、生成物、代表 skill、validator または evaluator の参照入口、decision review と learning review への接続を要求として具体化する。

この判断だけでは、実装、TypeScript 型、生成物、validator、evaluator は変更しない。
