# D004: Unit と Bolt の粒度判断

## 背景

Issue #277 の受け入れ条件は、過去分析 skill、学習分類 skill、`dry-run` consumer 境界、source skill と昇格先成果物の同期、eval または text contract に分かれている。

一方で、Construction では source skill 追加、promote-skill、text contract、validator を確認しながら進める必要がある。

## 判断

Unit は次の2つに分ける。

- U001: `amadeus-history-review` の読み取り専用分析契約。
- U002: `amadeus-learning-review` と `dry-run` consumer 境界、同期検証。

Bolt は次の3つに分ける。

- B001: `amadeus-history-review` 内部 skill。
- B002: `amadeus-learning-review` 内部 skill。
- B003: `dry-run` consumer 境界と検証契約。

## 理由

過去分析は学習分類の入力になるため、B001 を先に扱う。

学習分類は `dry-run` consumer 境界の前提になるため、B002 を B003 の前に扱う。

この順序にすると、Issue #272 に戻る前に前提補修の完了条件を確認しやすい。

## 影響

Construction では、B001、B002、B003 の順で進める。

`dry-run` の本体実装は Issue #272 に残す。
