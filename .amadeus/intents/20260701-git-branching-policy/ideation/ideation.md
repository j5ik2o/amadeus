# Ideation

## 実現可能性

| 観点 | 状態 | メモ |
|---|---|---|
| 技術 | feasible | 既存の `.amadeus/steering/policies.md` と `.amadeus/steering/policies/` に、概要と個別 policy を追加できる。 |
| 運用 | feasible | 既存の AGENTS.md にある branch prefix、PR 監視、merge 人間委譲と矛盾しない責務分担として整理できる。 |
| セキュリティ | feasible | GitHub 権限や branch protection の変更を対象外にするため、権限設定の変更を伴わない。 |
| 依存 | feasible | Issue #254 と既存の stage と workspace 対応記録を根拠に Inception へ進められる。 |

## 体制

| 役割 | 種別 | 関心 |
|---|---|---|
| Maintainer | 判断者 | branch 戦略、merge 委譲、例外扱い、policy 採用を判断する。 |
| Agent | 実行者 | policy に従い branch 作成、`origin/main` 追従、PR 作成前検証、merge 後処理を実行または報告する。 |
| Reviewer | 参照者 | PR と Intent が policy に沿っているか確認する。 |
| Validator または Evaluator | 検証対象 | 成果物から検出できる違反と、人間判断に残す違反の境界を扱う。 |

## 初期モック

| モック | 目的 | ファイル |
|---|---|---|
| 初期確認 | Issue から branch を作り、PR を出し、merge 後に次作業へ移る判断点を確認する。 | [initial-confirmation.puml](mocks/initial-confirmation.puml) |

## 未確定事項

- `1 Issue 1 branch` を原則にするか、複数 PR に分ける例外をどう表現するかは Inception で確定する。
- `origin/main` に追従するタイミングと、rebase、merge commit、fast-forward の扱いは Inception で整理する。
- docs-only や緊急修正の例外を policy に含めるかは Inception で判断する。
- validator または evaluator で検出する違反の範囲は Inception で整理する。

## 学習候補

- AGENTS.md の Git 操作指示と `.amadeus/steering/policies/**` の責務差を確認する。
- 既存 Intent の PR 作成、merge 後ブランチ切り替え、`origin/main` 追従の記録を確認する。
- branch 戦略を traceability と acceptance から参照する最小形式を確認する。
