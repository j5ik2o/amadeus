# ユースケース

## 一覧

| 識別子 | アクター | 外部システム | ストーリー | 要求 | 依存 | 詳細 |
|---|---|---|---|---|---|---|
| UC001 | ACT002 Agent | なし | S001 | R001, R002, R005 | なし | [UC001-classify-downstream-finding.md](use-cases/UC001-classify-downstream-finding.md) |
| UC002 | ACT001 Maintainer | EXT001 GitHub | S001 | R002, R003, R004 | UC001 | [UC002-review-cross-intent-learning.md](use-cases/UC002-review-cross-intent-learning.md) |
| UC003 | ACT003 Reviewer | なし | S001 | R004, R005 | UC001, UC002 | [UC003-review-evidence-boundary.md](use-cases/UC003-review-evidence-boundary.md) |

## 依存関係

| ユースケース | 依存 | 理由 |
|---|---|---|
| UC001 | なし | 後段発見の分類が、横断学習レビューと証拠境界レビューの前提であるため。 |
| UC002 | UC001 | Intent 横断の昇格判断は、現在 Intent 内の扱いが分類済みであることを前提にするため。 |
| UC003 | UC001, UC002 | 証拠境界レビューは、feedback 先と学習先の分類結果を前提にするため。 |
