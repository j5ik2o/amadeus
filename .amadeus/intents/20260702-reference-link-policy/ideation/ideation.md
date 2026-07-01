# Ideation

## 実現可能性

| 観点 | 状態 | メモ |
|---|---|---|
| 技術 | feasible | Markdown リンク、相対リンク、GitHub URL、commit SHA 付き permalink は既存の成果物と validator のリンク検査に接続できる。 |
| 運用 | feasible | Issue #243 に対象、対象外、受け入れ条件があり、Inception で適用範囲を分解できる。 |
| セキュリティ | feasible | 参照リンク化は権限設定や秘密情報の扱いを変更しない。外部 repository 参照は完全な URL または repository が分かる表記に限定する。 |
| 依存 | feasible | 既存の [20260701-self-development-cycle-stage-workspace](../../20260701-self-development-cycle-stage-workspace.md) を観察例にし、自己開発 cycle と workspace 対応記録の前提を使える。 |

## 体制

| 役割 | 種別 | 関心 |
|---|---|---|
| Maintainer | 判断者 | 参照リンク化方針、validator 判定、既存成果物への適用範囲を判断する。 |
| Agent | 実行者 | template、validator、eval、example、既存成果物へ方針を反映する。 |
| Reviewer | 参照者 | ID、PR番号、Issue番号、ファイルパス、成果物名から根拠へ移動できるか確認する。 |
| Validator または Evaluator | 検証対象 | 未リンク参照、壊れた相対リンク、GitHub permalink 条件のうち、機械的に検出する範囲を扱う。 |

## 初期モック

| モック | 目的 | ファイル |
|---|---|---|
| 初期確認 | 参照種別ごとに、表記、リンク先、検出方針を確認する。 | [initial-confirmation.puml](mocks/initial-confirmation.puml) |

## 未確定事項

- ID だけの表示にするか、表示名込みのリンクにするかは Inception で整理する。
- 同一ファイル内参照をアンカーリンクにする範囲は Inception で整理する。
- Domain Map の Bounded Context 参照をどの粒度のリンクにするかは Inception で整理する。
- validator で fail、warning、対象外のどれとして扱うかは Inception で整理する。
- 既存成果物を一括補修する範囲は Inception で整理する。

## 学習候補

- Functional Design だけでなく、traceability、decisions、template、example に同じ参照リンク化方針を適用できるか確認する。
- GitHub 上のファイルパスを branch URL ではなく commit SHA 付き permalink として扱う検出条件を確認する。
- workspace 内成果物の相対 Markdown リンクと、GitHub URL の使い分けを確認する。
