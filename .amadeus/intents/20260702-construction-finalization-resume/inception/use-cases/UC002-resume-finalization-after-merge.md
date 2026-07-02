# UC002 merge 後に finalization を再開する

## ユースケース

Agent が merge 後に `amadeus-construction` を再実行し、検出結果と再開規則に従って finalization へ入る。

## アクター

- ACT002 Agent

## 外部システム

- なし

## 事前条件

- 実装 PR が merge され、基準 branch 由来の checkout で作業している。
- auto 判定表に再開規則が定義されている。

## 基本フロー

1. Agent は、対象 Intent を指定して `amadeus-construction` を再実行する。
2. Agent は、同梱スクリプトの検出結果を Decision Review の入力証拠として読む。
3. auto 判定は、対象 Intent が実装済みかつ検証済みで、`pr.md` がなく `construction.gate` が `passed` でないことを確認する。
4. auto 判定は finalization を選び、Agent は追跡と状態確定（pr.md、traceability、acceptance、state）を実行する。

## 代替フロー

| 条件 | 扱い |
|---|---|
| 対象 Intent が未 finalize の条件を満たさない。 | 既存の auto 判定（guided、refine、repair）へ戻る。 |
| 作業中 branch で未 finalize 状態に見える。 | 基準 branch 由来でないため再開規則を適用せず、通常の Construction 継続として扱う。 |

## 対応要求

- R001
- R002
- R003

## 未確認事項

- なし。
