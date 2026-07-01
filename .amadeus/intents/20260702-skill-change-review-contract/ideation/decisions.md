# Ideation 判断

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | skill 変更のレビュー支援契約を Ideation から Inception へ進める。 | accepted | D002 | [D001-complete-ideation.md](decisions/D001-complete-ideation.md) |
| D002 | behavioral eval の必須化を非採用にし、レビュー支援の運用契約を採用する。 | accepted | なし | [D002-review-support-over-automation.md](decisions/D002-review-support-over-automation.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | D002 | 運用契約の採用判断が、対象境界と対象外を確定する前提になるため。 |
| D002 | なし | 2026-07-02 の grilling session で確定した判断を Ideation の範囲判断として記録するため。 |
