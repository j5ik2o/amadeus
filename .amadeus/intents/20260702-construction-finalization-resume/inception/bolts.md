# ボルト

## 一覧

| 識別子 | 概要 | ユニット | 要求 | 設計 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| B001 | 未 finalize 検出スクリプトと eval を実装する。 | U001 | R001, R002, R004 | [design.md](units/U001-finalization-resume-contract/design.md) | なし | [B001-detection-script-and-eval.md](bolts/B001-detection-script-and-eval.md) |
| B002 | skill 本文の auto 判定と Decision Review 記述を更新し、promote で同期する。 | U001 | R003, R004 | [design.md](units/U001-finalization-resume-contract/design.md) | B001 | [B002-skill-auto-rule-and-promotion.md](bolts/B002-skill-auto-rule-and-promotion.md) |

## 依存関係

| ボルト | 依存 | 理由 |
|---|---|---|
| B001 | なし | 検出スクリプトの存在と契約が、skill 本文からの参照の前提であるため。 |
| B002 | B001 | auto 判定と Decision Review 記述は、検出スクリプトの path と入出力契約を参照するため。 |

## 未確認事項

- なし。
