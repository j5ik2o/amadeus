# D001: Inception 境界判断

## 背景

- [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243) は、Amadeus 成果物に記載する ID、PR番号、Issue番号、ファイルパス、成果物名をリンクとして扱う方針を目的にしている。
- Ideation では、参照リンク化対象、GitHub permalink 方針、workspace 内相対リンク、適用範囲、validator の扱いを Inception へ渡している。
- 対象外として、Functional Design の内容変更、Unit と Bolt の再分割、Domain Map と Context Map の採用判断変更、machine-readable evidence の導入が示されている。

## 判断

- Inception の対象境界を Amadeus 成果物の参照リンク化方針に固定する。
- 要求、User Story、Use Case、Unit、Bolt は、参照リンク化対象、リンク先規則、適用範囲、検出境界に限定する。

## 理由

- Issue #243 の目的は参照リンク化方針であり、既存 Functional Design の内容変更や Unit 再分割ではない。
- template、validator、eval、example、既存成果物に影響するが、同じ方針の適用先として追跡できる。

## 影響

- Construction では template、validator、eval、example、既存成果物への適用を主な対象にする。
- Domain Map と Context Map の採用判断は対象外のまま扱う。
- 詳細な Domain Model は Construction の Functional Design で扱う。
