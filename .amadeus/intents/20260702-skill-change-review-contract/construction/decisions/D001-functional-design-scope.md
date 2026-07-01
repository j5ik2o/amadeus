# D001: Functional Design scope

## 背景

Intent `20260702-skill-change-review-contract` の Unit は U001 の1件であり、変更対象は steering policies、development、README の文書だけである。

## 判断

- U001 の Functional Design を `requirement: required` とし、core 3 文書（business-logic-model、business-rules、domain-entities）を作る。
- UI 構成はないため `frontendSurface: absent` とし、`frontend-components.md` は作らない。
- 対象解決元は `state.json.construction.targetBolts`（B001、B002）である。

## 理由

レビュー支援契約は PR 説明の記録構造と判断規則を持ち、Bolt の文書変更が同じ規則を参照するため、Functional Design を契約の管理元にする価値がある。

## 影響

- B001 と B002 の Task Generation は、U001 の Functional Design と Unit Design Brief を根拠にする。
- construction/grillings の G001（README の必須化）は business-rules の BR006 に反映済みである。
