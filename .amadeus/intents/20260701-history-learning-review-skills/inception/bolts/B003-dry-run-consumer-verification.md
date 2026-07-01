# B003: dry-run consumer verification

## 概要

- `amadeus-discovery dry-run` が分析結果を入力にできる責務境界と、skill 同期検証を整える。

## 対象ユニット

- U002

## 設計

- [U002 Unit Design](../units/U002-learning-review-consumer-contract/design.md)

## 完了条件

- `amadeus-discovery` が必要に応じて分析結果を入力にできることを説明している、または Issue #272 に残す判断が `decisions.md` に記録されている。
- `dry-run` が過去分析と学習分類を所有しないことが説明されている。
- source skill と昇格先成果物が promote-skill で同期されている。
- text contract または関連 eval が `history-review`、`learning-review`、`dry-run` 境界を検出できる。
- validator と必要な標準検証が pass している。

## 依存

- B002

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-discovery/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-discovery/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `dev-scripts/evals/amadeus-templates/check.ts` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `dev-scripts/promote-skill.ts` | 未確認 | なし | 未確認 |

## 未確認事項

- `amadeus-discovery` 側の変更をこの Intent で行うか、Issue #272 の Construction に残すかは Construction で確認する。
