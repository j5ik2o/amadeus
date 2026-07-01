# Ideation

## 実現可能性

| 観点 | 状態 | メモ |
|---|---|---|
| 技術 | feasible | 対象は skill 文書の `次の skill` 欄の補正であり、既存の Construction stage 構造を変えずに対応できる。 |
| 運用 | feasible | source skill と昇格先成果物を対象にし、既存の昇格手順と検証入口で確認できる。 |
| セキュリティ | feasible | skill 文書と `.amadeus/` 成果物の補正が中心であり、秘密情報や外部認証情報を追加しない。 |
| 依存 | feasible | `amadeus-construction` の公開入口契約と、Construction finalization の追跡要件を前提にできる。 |

## 体制

| 役割 | 種別 | 関心 |
|---|---|---|
| Maintainer | 判断者 | 内部 skill の案内が公開入口契約と矛盾しないことを確認できること。 |
| Agent | 作成者 | 実装後、検証後、ファイナライズ後の進め方を取り違えずに作業できること。 |
| Reviewer | 参照者 | Issue、Intent、skill 差分、検証結果の対応関係を追えること。 |

## 初期モック

| モック | 目的 | ファイル |
|---|---|---|
| 初期確認 | 内部 skill の `次の skill` 欄から、親 skill 経由で次工程へ進む流れを読み取れるかを確認する。 | [initial-confirmation.puml](mocks/initial-confirmation.puml) |

## 未確定事項

- `amadeus-construction-bolt-preparation` と `amadeus-construction-functional-design` の `次の skill` 欄も同じ表現方針へそろえるか。
- `amadeus-construction-traceability-finalization` の `次の skill` 欄に、Construction 全体の完了確認として親 skill へ戻る目的を補足するか。
- source skill と昇格先成果物を同じ PR で更新するか。

## 学習候補

- 公開入口と内部 skill の関係を、次工程案内で誤読しにくくする書き方。
- Construction の途中 stage 完了と Construction 全体完了を区別する説明。
- source skill と昇格先成果物の案内文を同じ Intent でどう追跡するか。
