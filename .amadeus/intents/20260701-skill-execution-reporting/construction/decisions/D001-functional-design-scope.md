# D001: Functional Design 境界

## 背景

Inception は、skill 実行時問題報告の契約定義と代表 skill 反映を Unit と Bolt に分けている。

## 判断

Functional Design は、報告先分類、最低報告項目、人間承認付き Issue 候補化、代表 skill 反映、eval 整合に限定する。

## 理由

今回の Construction は、Amadeus の公開 skill と eval の文書契約を整える作業である。
新しい共有境界、コンテキスト間依存、実行時依存は追加しない。

## 影響

- Domain Map と Context Map は更新しない。
- frontend-components.md は作らない。
- Spec、`.kiro/specs/**`、`openspec/**` は作らない。
