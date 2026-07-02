# 要求

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| R001 | merge 済み未 finalize の Intent を、成果物と state だけから判定できる。 | 採用済み | なし | [R001-offline-unfinalized-judgment.md](requirements/R001-offline-unfinalized-judgment.md) |
| R002 | 同梱スクリプトで未 finalize の Intent を列挙でき、配布先ユーザー環境で動作する。 | 採用済み | R001 | [R002-bundled-detection-script.md](requirements/R002-bundled-detection-script.md) |
| R003 | merge 後に `amadeus-construction` を再実行するだけで、判断なしに finalization へ入れる。 | 採用済み | R001, R002 | [R003-auto-resume-rule.md](requirements/R003-auto-resume-rule.md) |
| R004 | 検出スクリプトの検証が先行して存在し、source skill と昇格先成果物が同期されている。 | 採用済み | R002, R003 | [R004-verification-and-promotion.md](requirements/R004-verification-and-promotion.md) |

## 依存関係

| 要求 | 依存 | 理由 |
|---|---|---|
| R001 | なし | 判定規則は他の条件に依存せず定義できるため。 |
| R002 | R001 | 検出スクリプトは判定規則を実装するため。 |
| R003 | R001, R002 | 再開規則は判定規則を参照し、検出結果を入力証拠にするため。 |
| R004 | R002, R003 | 検証と昇格同期は、スクリプトと skill 本文の変更を対象にするため。 |

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
| Ideation scope との対応 | passed | SC-IN-001 から SC-IN-005 までを R001 から R004 に対応付けた。 |
| 対象外の維持 | passed | dev-scripts 配置、merge イベント監視、自動 merge、完了済み Intent の遡及修正を要求に含めていない。 |
| 依存関係 | passed | 判定規則、スクリプト、統合、検証の順に依存を整理した。 |
| 検証可能性 | passed | 各要求は skill 本文の差分、スクリプトの実行結果、eval、promote 同期から検証できる。 |

## 未確認事項

- なし。
