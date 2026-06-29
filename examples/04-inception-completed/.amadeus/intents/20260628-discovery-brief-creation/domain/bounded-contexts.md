# 境界づけられたコンテキスト

## 範囲

この文書は、`20260628-discovery-brief-creation` インテントで Unit を切る時に参照する境界づけられたコンテキストを扱う。

全体の境界づけられたコンテキストは、[../../../domain/bounded-contexts.md](../../../domain/bounded-contexts.md) を参照する。

## コンテキスト

| 識別子 | 名前 | サブドメイン | 役割 | モデル | 契約 |
|---|---|---|---|---|---|
| BC001 | Discovery 支援 | SD001 | 入力テーマを Discovery Brief と Intent 候補へ整理する利用支援を扱う。 | [models.md](bounded-contexts/BC001-discovery-support/models.md) | [contracts.md](bounded-contexts/BC001-discovery-support/contracts.md) |

## コンテキスト間の依存

| Downstream | Upstream | 依存内容 | 組織パターン | 統合パターン | 状態 |
|---|---|---|---|---|---|
| BC001 | なし | この Intent では単一コンテキスト内で Discovery 支援を扱う。 | 該当なし | 該当なし | 依存なしとして確認済み。 |

## 外部境界

| コンテキスト | 名前 | 役割 | 根拠 |
|---|---|---|---|
| BC001 | Discovery Brief 確認境界 | 利用者へ Discovery Brief の記録内容を提示する。 | UC001 が入力テーマと判断の記録確認を扱うため。 |
| BC001 | Intent 候補確認境界 | 利用者へ Intent 候補、候補判断、推奨次アクションを提示する。 | UC002 が Intent 候補確認を扱うため。 |

## Unit 分割への入力

| Unit | コンテキスト | 境界 | 分割理由 |
|---|---|---|---|
| U001 | BC001 | Discovery Brief 確認境界 | 入力テーマと判断の記録を独立した価値単位として扱うため。 |
| U002 | BC001 | Intent 候補確認境界 | Discovery Brief を根拠に候補提示と最初の候補確認を扱うため。 |

## 境界外

- Intent 初期化の自動実行。
- Requirement、Use Case、Unit、Bolt、Task を Discovery phase で作ること。
- Construction の証拠化。

## 未確認事項

- DM001 Discovery Brief は [models.md](bounded-contexts/BC001-discovery-support/models.md) と [DM001-discovery-brief.md](bounded-contexts/BC001-discovery-support/models/DM001-discovery-brief.md) に定義済みである。
- Intent 候補の並び順や推奨理由の詳細な評価基準は [R002-intent-candidate-presentation.md](../requirements/R002-intent-candidate-presentation.md) に未確認事項として残す。
- BC001 の詳細な契約条件は [contracts.md](bounded-contexts/BC001-discovery-support/contracts.md) に未確認事項として残す。
