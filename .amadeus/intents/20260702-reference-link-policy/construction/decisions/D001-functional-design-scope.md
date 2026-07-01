# D001: Functional Design の対象 Unit

## 状態

active

## 文脈

B001 は、参照リンク化対象とリンク先規則を扱う。

この範囲は U001 参照リンク化方針契約に属し、U002 の validator と eval 境界には踏み込まない。

## 判断

Construction の Functional Design 対象 Unit は U001 に限定する。

Domain Map と Context Map は、既存の BC001 自己開発運用の範囲内に収まるため更新しない。

## 根拠

- [U001 Unit Design](../../inception/units/U001-reference-link-contract/design.md)
- [B001](../../inception/bolts/B001-reference-link-rules.md)
- [domain-map.md](../../../../domain-map.md)
- [context-map.md](../../../../context-map.md)

## 結果

B001 では Functional Design core 3 文書を U001 だけに作成する。

U002 の検証境界は B003 で扱う。
