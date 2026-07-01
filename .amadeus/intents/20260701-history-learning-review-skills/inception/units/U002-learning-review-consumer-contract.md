# U002: learning review consumer contract

## ユニット

- `amadeus-learning-review` と `dry-run` consumer 境界、同期検証を定義する。

## 対象要求

- R003
- R004
- R005

## 価値境界

- `amadeus-history-review` の分析結果と検証結果を学習先へ分類する。
- `dry-run` が分析結果を入力にできるが、分析と分類を所有しないことを説明する。
- source skill と昇格先成果物、eval または text contract の同期を検証する。

## 検証観点

- `amadeus-learning-review` の分類結果が Issue #259 の分類と一致している。
- `amadeus-grilling` と phase skill への戻り先が説明されている。
- `dry-run` の consumer 境界が説明されている。
- promote-skill と text contract の証拠を残せる。

## 未確認事項

- `amadeus-learning-review` を独立 skill にするか、統合責務として扱うかは Construction 前に再確認する。
- `dry-run` 側の説明追加をこの Intent に含めるか Issue #272 に残すかは Construction で確認する。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-learning-review/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-learning-review/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `skills/amadeus-discovery/SKILL.md` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `.agents/skills/amadeus-discovery/SKILL.md` | 未確認 | なし | 未確認 |
| IT005 | amadeus-dlc/amadeus | `dev-scripts/evals/amadeus-templates/check.ts` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U002-learning-review-consumer-contract/design.md)
