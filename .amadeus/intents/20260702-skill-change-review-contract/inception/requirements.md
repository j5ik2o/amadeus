# 要求

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| R001 | 変更種別「skill 変更」の PR 説明で、挙動差分の要約を固定の3観点から確認できる。 | 採用済み | なし | [R001-behavior-diff-summary.md](requirements/R001-behavior-diff-summary.md) |
| R002 | skill 変更 PR の説明で、skill-forge による確認の実施と結果を固定見出しから確認できる。 | 採用済み | なし | [R002-skill-forge-check-record.md](requirements/R002-skill-forge-check-record.md) |
| R003 | skill 変更 PR が skill 変更だけで構成されることを既定とし、例外の判定と記録の基準を policies から確認できる。 | 採用済み | なし | [R003-single-change-type-pr.md](requirements/R003-single-change-type-pr.md) |
| R004 | development.md の PR 準備条件から skill 変更時の追加条件を追跡でき、README の記述が policies と矛盾しない。 | 採用済み | R001, R002, R003 | [R004-traceability-and-doc-alignment.md](requirements/R004-traceability-and-doc-alignment.md) |

## 依存関係

| 要求 | 依存 | 理由 |
|---|---|---|
| R001 | なし | 挙動差分要約は他の条件に依存せず定義できるため。 |
| R002 | なし | skill-forge 確認の記録は他の条件に依存せず定義できるため。 |
| R003 | なし | 粒度制約と例外一般則は他の条件に依存せず定義できるため。 |
| R004 | R001, R002, R003 | 追跡と文書整合は、必須条件の内容が確定した後で対応付けるため。 |

## 受け入れ状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 採用済み | 未登録 |
| R002 | 採用済み | 未登録 |
| R003 | 採用済み | 未登録 |
| R004 | 採用済み | 未登録 |

## Requirements Review Gate

| 観点 | 状態 | 根拠 |
|---|---|---|
| Ideation scope との対応 | passed | SC-IN-001 から SC-IN-006 までを R001 から R004 に対応付けた。 |
| 対象外の維持 | passed | behavioral eval の必須化、skill と validator と example の実装変更、README の skill 一覧再構成、stage0 採用判断の自動化を要求に含めていない。 |
| 依存関係 | passed | 必須条件3件を独立に定義し、追跡と文書整合だけが3件の確定に依存する形に整理した。 |
| 検証可能性 | passed | 各要求は policies、development、README の文書差分と整合確認から検証できる。 |

## 未確認事項

- なし。
