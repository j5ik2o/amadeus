# U001 finalization 再開契約

## ユニット

merge 後の Construction finalization を、セッションをまたいでも決定論的に再開、検出できる契約を `amadeus-construction` に持たせる Unit である。

## 対象要求

- R001
- R002
- R003
- R004

## 価値境界

この Unit は、オフラインの未 finalize 判定規則、同梱スクリプトによる検出、auto 判定と Decision Review への統合、検証と昇格同期を扱う。

merge イベントの監視、finalization の自動 merge、完了済み Intent の遡及修正は扱わない。

## 検証観点

- 基準 branch 由来の checkout で、未 finalize の Intent を同梱スクリプトが列挙できる。
- auto 判定表の再開規則が既存の行と排他的に読める。
- 検出スクリプトの eval が実装前に失敗した記録があり、repo の標準検証から実行される。
- 昇格先成果物に evals が混入せず、source と promote 手順で同期されている。
- 対象 Intent が validator で pass する。

## 未確認事項

- 検出スクリプトの出力形式と終了コードの最終仕様は Construction で確定する。

## 実装対象

| 識別子 | repository | path | branch | PR | CI |
|---|---|---|---|---|---|
| IT001 | amadeus-dlc/amadeus | `skills/amadeus-construction/scripts/`（新設） | 未確認 | なし | 未確認 |
| IT002 | amadeus-dlc/amadeus | `skills/amadeus-construction/evals/` | 未確認 | なし | 未確認 |
| IT003 | amadeus-dlc/amadeus | `skills/amadeus-construction/SKILL.md`, `.agents/skills/amadeus-construction/**` | 未確認 | なし | 未確認 |
| IT004 | amadeus-dlc/amadeus | `package.json` | 未確認 | なし | 未確認 |

## 関連成果物

- [design.md](U001-finalization-resume-contract/design.md)
