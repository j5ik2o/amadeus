# Unit Design Brief

## 概要

この文書は Unit Design Brief である。
Inception では、参照リンク化方針契約の課題解決方針を定め、Bolt 分割と Construction へ渡す設計入力だけを扱う。
詳細な Domain Design、Logical Design、実装設計、テスト設計は Construction で確定する。

## 設計戦略

- 参照先が一意に決まる ID と成果物名を、Markdown リンクとして扱う方針を固定する。
- workspace 内成果物、GitHub ファイルパス、PR番号、Issue番号のリンク先規則を分ける。
- Functional Design だけに限定せず、template、traceability、decisions、example、既存成果物への適用範囲を整理する。
- 内容変更、Unit と Bolt の再分割、Domain Map と Context Map の採用判断変更、machine-readable evidence の導入は対象外にする。

## 責務境界

- 所有するもの: 参照リンク化対象、リンク先規則、適用成果物範囲、対象外制約。
- 所有しないもの: validator の具体検出仕様、eval 実装、既存成果物の意味変更、詳細な Domain Model。
- 依存してよいもの: Issue #243、Discovery、Ideation、Construction template、Inception template、既存 `.amadeus/` 成果物、EXT001 GitHub。
- 後続で再確認が必要になる条件: GitHub permalink 条件が PR URL や Issue URL へ誤って広がる場合。

## 構成候補

- Reference Link Target: Requirement ID、Unit ID、Bolt ID、Bounded Context ID などの参照対象を扱う。
- Link Target Rule: 相対 Markdown リンク、GitHub permalink、PR URL、Issue URL を扱う。
- Artifact Application Scope: template、example、traceability、decisions、既存成果物への適用範囲を扱う。
- Exclusion Rule: 参照先が一意でない表記や内容変更を対象外として扱う。

## データと契約候補

- 入力候補: 参照種別、表示文字列、参照先成果物、対象 repository、commit SHA、対象成果物種別。
- 出力候補: 参照リンク化方針、リンク先規則、適用成果物範囲、対象外一覧。
- 状態候補: 未整理、採用候補、採用済み、対象外。
- 事前条件候補: 参照先が一意に決まるか、または対象外理由を説明できる。
- 事後条件候補: 成果物から参照先へ移動でき、対象外も説明できる。
- 不変条件候補: GitHub 上のファイルパスまたはコード参照は、branch URL ではなく commit SHA 付き permalink として扱う。

## 検証観点

- 参照リンク化対象と対象外が Issue #243 と矛盾しない。
- workspace 内成果物と GitHub URL の使い分けが読める。
- template と既存成果物の適用範囲が、内容変更を含まない。

## Bolt 分割方針

- B001 で参照リンク化対象とリンク先規則を扱う。
- B002 で template、example、既存成果物への適用範囲を扱う。

## Construction への引き継ぎ

- Domain Design で確定する事項: `BC001 自己開発運用` 内の成果物参照方針として扱う範囲を確認する。
- Logical Design で確定する事項: 参照種別ごとのリンク先解決順序と表示形式を確定する。
- 実装時に確認する事項: source skill と昇格先成果物の同期は既存の昇格手順に従う。
- 検証時に確定する事項: 既存成果物への適用範囲とリンク切れが validator で確認できること。
