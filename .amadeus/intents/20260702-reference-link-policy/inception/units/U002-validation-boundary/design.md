# Unit Design Brief

## 概要

この文書は Unit Design Brief である。
Inception では、未リンク参照と permalink 条件の検出境界の課題解決方針を定め、Bolt 分割と Construction へ渡す設計入力だけを扱う。
詳細な Domain Design、Logical Design、実装設計、テスト設計は Construction で確定する。

## 設計戦略

- validator で検出する対象を、構造的に判定できる未リンク参照とリンク切れに限定する。
- eval は、validator だけでは誤検出しやすい表示形式や permalink 条件の品質確認に使う候補として扱う。
- 人間判断は、参照先が一意でない表記、説明文、例示、コードブロック、対象外表記に残す。
- validator の pass は内容承認ではなく、参照できる構造条件として扱う。

## 責務境界

- 所有するもの: 未リンク参照の検出候補、permalink 条件の検出候補、fail、warning、対象外の判断境界。
- 所有しないもの: 参照リンク方針そのものの採用判断、template 適用範囲、成果物内容の承認。
- 依存してよいもの: U001 の参照リンク方針、validator の既存リンク検査、eval、Issue #243。
- 後続で再確認が必要になる条件: validator の検出がコードブロックや例示を誤って fail にする場合。

## 構成候補

- Link Detection Candidate: 未リンク参照または permalink 条件の検出候補を扱う。
- Exclusion Filter: コードブロック、例示、既にリンク済み表記、参照先不明表記を除外する。
- Detection Severity Rule: fail、warning、対象外を分ける。
- Evaluation Supplement: validator では扱いにくい品質条件を eval に渡す。

## データと契約候補

- 入力候補: 対象成果物、参照種別、Markdown セル、本文ブロック、リンク有無、URL 種別。
- 出力候補: validator 判定、eval 判定、人間判断対象、対象外理由。
- 状態候補: 検出対象、warning 候補、対象外、未確認。
- 事前条件候補: U001 の参照リンク方針と適用成果物範囲が採用済みである。
- 事後条件候補: 検出対象と対象外が成果物から追跡できる。
- 不変条件候補: validator の判定を内容妥当性の承認として扱わない。

## 検証観点

- validator で検出する範囲と、eval または人間判断に残す範囲が分かれている。
- GitHub permalink 条件が、GitHub ファイルパスまたはコード参照に限定されている。
- 既存の相対リンク検査と矛盾しない。

## Bolt 分割方針

- B003 で validator、eval、人間判断の検出境界を扱う。

## Construction への引き継ぎ

- Domain Design で確定する事項: `BC001 自己開発運用` 内の検出境界として扱う範囲を確認する。
- Logical Design で確定する事項: 未リンク参照の抽出条件、除外条件、判定の粒度を確定する。
- 実装時に確認する事項: validator 変更は先に失敗する eval または検証を追加してから行う。
- 検証時に確定する事項: 誤検出と対象外を代表ケースで確認する。
