# Unit Design Brief

## 概要

この文書は Unit Design Brief である。
Inception では、skill 変更レビュー支援契約の課題解決方針を定め、Bolt 分割と Construction へ渡す設計入力だけを扱う。
詳細な文書表現、見出し名、実装は Construction で確定する。

## 設計戦略

- 契約の定義元を `steering/policies.md` の変更種別表と判断基準に一元化し、`development.md` と README は参照または整合確認に留める。
- レビュー判断に必要な記録は、PR 説明の固定構造（挙動差分の3観点、固定見出し「skill-forge 確認」）で表現する。
- 例外運用は新しい型を作らず、Git Branching Policy の例外記録（理由と後続確認先）を再利用する。
- 制約は肯定形の判断基準（不可分の定義）を先に示し、禁止形だけの記述にしない。

## 責務境界

- 所有するもの: 変更種別「skill 変更」の必須条件の記述、粒度制約と例外一般則の記述、policies と development と README の整合。
- 所有しないもの: skill 本文の実装変更、behavioral eval、README の skill 一覧再構成、stage0 採用判断の変更。
- 依存してよいもの: Git Branching Policy の例外記録の型、README の skill-forge 確認観点、glossary の stage 語彙と skill 供給元語彙。
- 後続で再確認が必要になる条件: 変更種別の追加、PR 説明の記録構造の変更、記録の機械検査（validator または evaluator）を導入する判断が出た場合。

## 構成候補

- 変更種別必須条件: 挙動差分要約と skill-forge 確認の記録条件を扱う。
- 粒度制約と例外判定: 既定、promote 同期の扱い、不可分判定、例外記録を扱う。
- PR 準備条件参照: development.md から追加条件への追跡を扱う。
- README 整合: 英語と日本語の推奨記述と policies の整合を扱う。

## データと契約候補

- 入力候補: skill 変更 PR、PR 説明、変更差分。
- 出力候補: policies の必須条件記述、PR 説明の記録構造（3観点、固定見出し）。
- 状態候補: 記録あり、記録不足、例外記録あり。
- 事前条件候補: PR の変更種別が判別できる。
- 事後条件候補: Reviewer が PR 説明から変更の影響と確認済み観点を判断できる。
- 不変条件候補: source skill と昇格先成果物の同期は、skill 変更の一部として常に同一 PR に含まれる。

## 検証観点

- policies、development、README の文書差分から受け入れ条件を確認できる。
- 対象 Intent の validator が pass する。
- `npm run test:all` が pass する。
- README（英語、日本語）と policies の突き合わせが同じ PR で確認されている。

## Bolt 分割方針

- B001 で `steering/policies.md` の契約本文（必須条件、粒度制約、例外一般則）を確定する。
- B002 で `development.md` の PR 準備条件への反映と、README（英語、日本語）の整合確認を行う。

## Construction への引き継ぎ

- 文書変更で確定する事項: PR 説明の見出し名の最終表記、変更種別表の必須条件セルの文言。
- README で確定する事項: 推奨記述を推奨のまま残して policies を必須の定義元にするか、README 側も必須と書き換えるか。
- 検証時に確定する事項: 記録の有無を validator または evaluator で検査する必要があるか。必要なら後続 Issue 候補として報告する。
