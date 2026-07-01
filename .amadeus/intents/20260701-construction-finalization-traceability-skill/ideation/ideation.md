# Ideation

## 実現可能性

| 観点 | 状態 | メモ |
|---|---|---|
| 技術 | feasible | PR #244 で `Construction からの追跡` 表を追加すると validator が pass することを確認済みである。 |
| 運用 | feasible | skill 変更の完了条件は steering policy にあり、source skill、昇格先成果物、検証結果を追跡できる。 |
| セキュリティ | feasible | skill 文書と `.amadeus/` 成果物の補正が中心であり、秘密情報や外部認証情報を追加しない。 |
| 依存 | feasible | 先行 Intent `20260701-self-development-cycle-stage-workspace` の Construction 最終化で見つかった差分を根拠にできる。 |

## 体制

| 役割 | 種別 | 関心 |
|---|---|---|
| Maintainer | 判断者 | skill 説明と validator 要件のずれが解消されたことを確認できること。 |
| Agent | 作成者 | Construction finalization で必要な追跡表を見落とさず成果物へ反映できること。 |
| Reviewer | 参照者 | Issue、Intent、PR、validator 結果、skill 差分の対応関係を追えること。 |

## 初期モック

| モック | 目的 | ファイル |
|---|---|---|
| 初期確認 | skill 説明から `Construction からの追跡` 表要件を読み取れるかを確認する。 | [initial-confirmation.puml](mocks/initial-confirmation.puml) |

## 未確定事項

- `amadeus-construction` と `amadeus-construction-traceability-finalization` の両方に同じ粒度で表要件を書くか。
- source skill と昇格先成果物を同じ PR で更新するか。
- template または example の `construction/traceability.md` を更新対象に含めるか。

## 学習候補

- validator の表列要件を skill 説明へ漏れなく反映する書き方。
- Construction の完了状態と traceability 表の必須条件の対応。
- source skill、昇格先成果物、example のどこまでを同じ Intent の Construction で扱うか。
