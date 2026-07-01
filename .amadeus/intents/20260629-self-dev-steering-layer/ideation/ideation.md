# Ideation

## 実現可能性

| 観点 | 状態 | メモ |
|---|---|---|
| 技術 | feasible | root `.amadeus/` は既存 validator の steering layer 検証対象である。 |
| 運用 | feasible | GitHub Issue を先に作り、Intent 側へ Issue URL を記録する運用で開始できる。 |
| セキュリティ | feasible | 初回導入は文書成果物だけを扱い、秘密情報や外部認証情報を追加しない。 |
| 依存 | feasible | Issue #108 本文を入力として扱い、skill、validator、example の実装変更に依存しない。 |

## 体制

| 役割 | 種別 | 関心 |
|---|---|---|
| Maintainer | 判断者 | 初回導入方針、次回 stage0 採用条件、merge 判断を行う。 |
| Agent | 作成者 | `.amadeus/` と Ideation 成果物を作成し、検証結果を記録する。 |
| Reviewer | 参照者 | Issue、Intent、PR の対応と検証結果を確認する。 |

## 初期モック

| モック | 目的 | ファイル |
|---|---|---|
| 初期確認 | 自己開発の stage 判定と PR 準備の流れを確認する。 | [initial-confirmation.puml](mocks/initial-confirmation.puml) |

## 未確定事項

- stage0、stage1、stage2 を `CONTEXT.md` に追加する必要があるかは、Issue #233 の対象外として後続判断に残す。
- `examples/skill-provenance.json` だけで example snapshot の provenance が足りるか。
- host environment の assets と target artifacts の assets の混入を validator で検出する必要があるか。
- build workspace と target workspace の対応をどの成果物に記録するかは、[Issue #233](https://github.com/amadeus-dlc/amadeus/issues/233) で扱う。

## 学習候補

- GCC の build、host、target の使い分け。
- Rust bootstrap の stage0、stage1、stage2 の扱い。
- Amadeus 自己開発で provenance をどの粒度で記録するか。
