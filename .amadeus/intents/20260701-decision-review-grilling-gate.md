# Decision Review Grilling Gate

## 目標プロファイル

| フィールド | 値 | 説明 |
|---|---|---|
| goalType | technical | Amadeus DLC の phase skill 起動時判断を標準化する技術目標である。 |
| scope | refactor | 既存の phase skill、Skill Contract、grilling、validator を前提に、decision tree 再評価と質問起動条件を整理する Intent である。 |
| labels | decision-review, grilling, phase-skill, traceability, self-development | decision review、grilling、phase skill、追跡、自己開発を表す。 |

## 目的

Amadeus DLC に、phase skill 起動時の decision tree 再評価と `amadeus-grilling` 起動条件を定義する。

この Intent は [Issue #257](https://github.com/amadeus-dlc/amadeus/issues/257) を根拠にする。

現在の phase skill は、不足判断がある場合に `amadeus-grilling` を使う方針を持っている。
一方で、成果物に未決事項が明記されていなくても、現在参照できる証拠に照らすと判断を再確認すべき場合がある。

この Intent では、phase skill 起動時に decision tree を構築し、既存成果物、Issue、PR、作業ツリー、validator 結果、Skill Contract、信頼できる参照元から判断ノードを再評価する方針を整理する。
また、不明瞭な判断ノードが見つかった場合に、`amadeus-grilling` へ渡す一問と反映先候補を選ぶ条件を明確にする。

## 成功条件

- phase skill の共通契約として、実行時の decision tree 再評価が整理されている。
- 明示的な未決事項がない場合でも、不明瞭な判断ノードがあれば `amadeus-grilling` を起動する条件を定義できる。
- 不明瞭な判断ノードがない場合は、質問せずに通常処理、補修、検証へ進む条件を定義できる。
- 構造補修で解ける問題、成果物境界外の判断、後続 Issue 候補にすべき懸念を区別できる。
- Ideation、Inception、Construction の公開 phase skill が同じ判断規則を参照できる。
- `amadeus-decision-review` を内部 skill として扱うかどうかを Inception で判断できる。

## 範囲

含めるもの:

- phase skill 起動時の decision tree 構築と再評価条件。
- 不明瞭な判断ノードの分類。
- `amadeus-grilling` を起動すべき条件と、質問せず進める条件。
- `repair` で足りる問題、後続 Issue 候補にすべき懸念、現在 phase で扱う判断の区別。
- `amadeus-decision-review` を内部 skill として扱う案。
- Ideation、Inception、Construction の公開 phase skill で共通参照する判断規則。

含めないもの:

- 各 phase の成果物構造の再設計。
- Grilling Decision Trail の配置変更。
- validator の網羅的な意味検証。
- 既存 Intent 成果物の一括移行。
- `amadeus-grilling` 自体の質問作法の全面変更。
- Inception の前に要求、ユースケース、Unit、Bolt、Task、実装を作ること。

## 現在の phase

Ideation を開始する。

Inception では、decision review の責務、入力証拠、戻り値、phase skill からの呼び出し構造、Skill Contract との接続を要求として具体化する。
