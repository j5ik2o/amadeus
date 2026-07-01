# R001: 参照リンク化対象

## 要求

- 参照先が一意に決まる ID と成果物名を Markdown リンクとして扱う。
- Requirement ID、User Story ID、Use Case ID、Unit ID、Unit Design Brief、Bolt ID、Bounded Context ID、Business Rule、Intent Contracts、Decision ID、Task ID を対象候補として説明できる。
- ID だけの表示と表示名込みのリンクのどちらを使うかを、参照先と読みやすさの観点で判断できる。

## 受け入れ条件

- Functional Design、traceability、decisions、template、example に現れる参照 ID の対象範囲を読める。
- 同一ファイル内参照と別ファイル参照を分けて説明できる。
- 参照先が一意に決まらない語や説明文を、機械的なリンク化対象外として読める。

## 根拠

- [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243)
- [scope.md](../ideation/scope.md)
- [codebase-analysis.md](../codebase-analysis.md)

## 未確認事項

- Business Rule と Intent Contracts の同一ファイル内アンカーを必須にする範囲は Construction で確定する。
