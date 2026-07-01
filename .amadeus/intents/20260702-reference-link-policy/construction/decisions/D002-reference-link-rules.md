# D002: 参照リンク化対象とリンク先規則

## 状態

active

## 文脈

Issue #243 は、特定ファイルの特定項目に限らず、ID、PR番号、ファイルパスなどをリンクにする方針を求めている。

GitHub 上のファイルパスは、branch URL ではなく permalink である必要がある。

## 判断

参照リンク化対象とリンク先規則は、Construction template の Functional Design core 3 文書へ記録する。

source skill を変更した後、`dev-scripts/promote-skill.ts` で `.agents/skills/amadeus-construction` へ反映する。

## 根拠

- [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243)
- [R001](../../inception/requirements/R001-reference-targets.md)
- [R002](../../inception/requirements/R002-link-target-rules.md)
- [B001](../../inception/bolts/B001-reference-link-rules.md)

## 結果

B001 は Construction template に、参照リンク化対象、workspace 内成果物の相対リンク規則、GitHub permalink 規則、PR URL 規則、Issue URL 規則を追加する。

B002 は適用成果物範囲、B003 は validator と eval の検出境界を扱う。
