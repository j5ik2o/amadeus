# D003 Internal Decision Review Skill

## 状態

accepted

## 文脈

Ideation の引き継ぎでは、`amadeus-decision-review` を内部 skill として定義する案と、公開 phase skill の共通節として定義する案が残っていた。
Issue #257 は、複数の phase skill で同じ判断規則を使えることを求めている。

## 判断

`amadeus-decision-review` を初期の内部 skill 候補として扱う。
公開 phase skill は、この内部 skill の契約を起動時判断の共通前処理として参照する。

## 根拠

- 判断規則を phase skill ごとに重複させると、分岐や handoff の差異が生まれる。
- `amadeus-grilling` は質問を担当し、decision review は質問要否と handoff 内容の選定に限定できる。
- Skill Contract catalog は `decision-review` を consumer として扱える。

## 影響

- B001 は内部 skill 契約の定義を扱う。
- B002 は公開 phase skill からの参照を扱う。
- B003 は Skill Contract、validator、evaluator、eval との境界を扱う。
