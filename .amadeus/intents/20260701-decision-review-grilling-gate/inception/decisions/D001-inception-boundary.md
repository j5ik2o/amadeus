# D001 Inception Boundary

## 状態

accepted

## 文脈

Issue #257 は、phase skill 起動時に decision tree を再評価し、必要な場合だけ `amadeus-grilling` へ handoff する判断ゲートを求めている。
一方で、Inception は実装詳細や後続 phase の成果物を作る場ではない。

## 判断

Inception では decision review gate の要求、受け入れ状態、ユースケース、ユニット、ボルト、追跡、判断を定義する。
内部 skill の具体的な本文、phase skill の編集、validator や evaluator の変更は Construction で扱う。

## 根拠

- Ideation scope は、初期 Ideation で後続 phase の詳細成果物や実装を作ることを対象外にしている。
- Inception skill は、要求と実施単位を確定し、Construction へ渡す役割を持つ。
- 実装をここで混ぜると、Bolt の検証単位が不明確になる。

## 影響

- Construction は B001、B002、B003 の順に実装できる。
- Inception の gate は、成果物整合性と追跡可能性で判定する。
- 詳細な Domain Model は作らず、Domain Map と Context Map を参照する。
