# D002: BC001 自己開発運用の参照

## 背景

Domain Map には `BC001 自己開発運用` が adopted Bounded Context として登録されている。

Issue #277 は、Amadeus 本体の自己開発における `.amadeus/` 成果物、内部 skill、eval、昇格先成果物、GitHub Issue の扱いを対象にしている。

## 判断

U001 と U002 のコンテキストは `BC001 自己開発運用` とする。

新しい Bounded Context は採用しない。

## 理由

この Intent は、新しいドメイン境界ではなく、既存の自己開発運用の中で過去分析と学習分類の作業契約を追加する。

そのため、既存の adopted Bounded Context を参照するのが自然である。

## 影響

Domain Map と Context Map は更新しない。

Construction で新しい境界が必要だと分かった場合は、現在 Intent に混ぜず、後続 Issue または後続 Intent 候補として扱う。
