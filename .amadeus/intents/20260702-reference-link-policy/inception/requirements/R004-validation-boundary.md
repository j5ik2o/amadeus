# R004: 検出境界

## 要求

- 未リンク参照と permalink 条件を validator、eval、人間判断のどれで扱うか説明できる。
- fail、warning、対象外の判断基準を参照種別ごとに整理できる。
- コードブロック、例示、既にリンク済みの表記、参照先が一意でない表記の誤検出を避ける方針を説明できる。

## 受け入れ条件

- validator で検出する対象と、eval または人間判断に残す対象を読める。
- GitHub permalink 条件の検出対象が、GitHub ファイルパスまたはコード参照に限定されていることを読める。
- 未リンク参照の検出が、成果物の内容妥当性承認ではないことを読める。

## 根拠

- [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243)
- [scope.md](../ideation/scope.md)
- [codebase-analysis.md](../codebase-analysis.md)

## 未確認事項

- validator と eval の分担は Construction で確定する。
