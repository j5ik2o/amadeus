# U001: history review contract

## ユニット

- `amadeus-history-review` の読み取り専用分析契約を定義する。

## 対象要求

- R001
- R002

## 価値境界

- `.amadeus/` の過去成果物を横断して読み、分析結果を返す。
- 成果物更新、Issue 作成、Intent Record 作成、自動昇格は扱わない。
- `amadeus-learning-review` と `dry-run` が参照できる分析結果を作る。

## 検証観点

- 読み取り対象と抽出項目が skill 本文から確認できる。
- 副作用を持たないことが skill 本文から確認できる。
- Domain Map と Context Map に候補を直接載せないことが説明されている。

## 未確認事項

- 出力形式を Markdown だけにするか、機械向け JSON を併用するかは Construction で確認する。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-history-review/SKILL.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.agents/skills/amadeus-history-review/SKILL.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `dev-scripts/evals/amadeus-templates/check.ts` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U001-history-review-contract/design.md)
