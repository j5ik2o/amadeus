# D003: 参照リンク化方針の適用成果物範囲

## 状態

active

## 文脈

B002 は、source skill、昇格先成果物、example snapshot、既存 `.amadeus/` 成果物の扱いを整理する。

Issue #243 は、特定の Functional Design だけでなく、記載されるファイルや項目に寄らず ID、PR番号、ファイルパスなどをリンクにすることを求めている。

## 判断

Inception template の `traceability.md` と `decisions.md` に、参照リンク化対象の適用範囲を追加する。

source skill を変更した後、`dev-scripts/promote-skill.ts` で `.agents/skills/amadeus-inception` へ反映する。

既存 `.amadeus/` 成果物は、内容意味を変えずに参照リンク化だけを補修する。

example snapshot は、手作業で部分補修せず、source skill と validator の契約が揃った後の再生成対象として扱う。

## 根拠

- [Issue #243](https://github.com/amadeus-dlc/amadeus/issues/243)
- [R003](../../inception/requirements/R003-artifact-application-scope.md)
- [B002](../../inception/bolts/B002-artifact-application-scope.md)
- [U001 Functional Design](../U001-reference-link-contract/functional-design/business-rules.md)

## 結果

B002 は、Inception template、昇格先成果物、代表的な既存成果物、example snapshot の扱いを区別して記録する。

B002 では example snapshot を直接変更しない。
