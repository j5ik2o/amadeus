# U001 Decision Review Gate Contract

## ユニット

decision review の入力証拠、判断ノード、分岐、grilling handoff 契約を扱う。

## 対象要求

- R001
- R002
- R003

## 価値境界

この Unit は、phase skill 起動時に質問が必要かどうかを判断する前処理の契約を扱う。

`amadeus-grilling` の質問実行と記録作法は所有しない。

## 検証観点

- 入力証拠の種類が列挙されている。
- 不明瞭ノードの分類が説明されている。
- `amadeus-grilling` に渡す項目が説明されている。
- `repair_only` と `follow_up_issue_candidate` が質問と混ざっていない。

## 未確認事項

- なし。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-decision-review/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-decision-review/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `amadeus-contracts/catalog/skills.ts` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U001-decision-review-gate-contract/design.md)
