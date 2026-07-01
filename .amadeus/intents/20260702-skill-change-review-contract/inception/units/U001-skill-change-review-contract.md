# U001 skill 変更レビュー支援契約

## ユニット

skill 変更 PR のレビュー判断を支える記録契約を steering policy として定義し、関連文書の整合を保つ Unit である。

## 対象要求

- R001
- R002
- R003
- R004

## 価値境界

この Unit は、挙動差分要約、skill-forge 確認の記録、粒度制約と例外一般則という3つの記録契約と、その定義元である `steering/policies.md`、参照元である `development.md` と README（英語、日本語）の整合を扱う。

skill 本文そのものの変更、behavioral eval の実装、README の skill 一覧再構成、stage0 採用判断の変更は扱わない。

## 検証観点

- `steering/policies.md` の変更種別表から、3つの必須条件を確認できる。
- `development.md` の PR 準備条件から、skill 変更時の追加条件へ追跡できる。
- README（英語、日本語）の記述が policies と矛盾しない。
- 記述が agent-instruction-rules の方針（肯定形を先に書く）に沿っている。
- 対象 Intent が validator で pass する。

## 未確認事項

- README の推奨記述を推奨のまま残すか、必須と書き換えるかは Construction で確定する。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `.amadeus/steering/policies.md` | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `.amadeus/development.md` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `README.md`, `README.ja.md` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U001-skill-change-review-contract/design.md)
