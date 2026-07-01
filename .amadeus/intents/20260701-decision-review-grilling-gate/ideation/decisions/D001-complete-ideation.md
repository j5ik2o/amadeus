# D001 Complete Ideation

## 状態

accepted。

## 背景

Issue #257 は、phase skill 起動時に既存成果物と現在参照できる証拠から decision tree を再評価することを求めている。

成果物に未決事項が明記されていない場合でも、状況変化、証拠不足、複数分岐、gate や traceability への影響がある場合は、不明瞭な判断ノードとして扱う必要がある。

Issue comment では、`amadeus-decision-review` を内部 skill として定義し、`amadeus-grilling` に渡す一問と反映先候補を選ぶ案が提示されている。

## 判断

Decision Review Grilling Gate の Ideation を完了し、Inception へ進める。

この Intent では、decision tree 再評価と grilling 起動条件を Amadeus DLC の phase skill 共通契約として扱う。
Inception では、`amadeus-decision-review` を内部 skill として定義するかどうか、入力証拠、戻り値、phase skill 反映範囲を具体化する。

## 根拠

- [Issue #257](https://github.com/amadeus-dlc/amadeus/issues/257)
- [Issue comment](https://github.com/amadeus-dlc/amadeus/issues/257#issuecomment-4853559512)
- [scope.md](../scope.md)
- [ideation.md](../ideation.md)
- [initial-confirmation.puml](../mocks/initial-confirmation.puml)

## 影響

Inception では、decision review の要求、受け入れ状態、ユースケース、Unit、Bolt を整理する。

Construction では、必要に応じて公開 phase skill、内部 skill、Skill Contract、template、eval、validator または evaluator を更新する。

## 再確認条件

- `amadeus-decision-review` を内部 skill にせず、公開 phase skill の共通節だけで扱う判断に変わる場合。
- Skill Contract の入力項目が decision review に足りない場合。
- validator と evaluator の責務境界が Inception で変わる場合。
- 初期適用対象を Ideation、Inception、Construction 以外へ広げる場合。
