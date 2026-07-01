# 判断

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Inception の対象境界を後段 feedback と Intent 横断学習契約に固定する。 | 採用 | なし | [D001-inception-boundary.md](decisions/D001-inception-boundary.md) |
| D002 | BC001 自己開発運用を参照する。 | 採用 | D001 | [D002-bc001-self-development-governance.md](decisions/D002-bc001-self-development-governance.md) |
| D003 | Issue #257 の decision review と Issue #259 の learning loop 分類を分ける。 | 採用 | D001, D002 | [D003-decision-review-boundary.md](decisions/D003-decision-review-boundary.md) |
| D004 | Unit と Bolt を feedback routing と learning promotion に分ける。 | 採用 | D001, D002, D003 | [D004-unit-bolt-granularity.md](decisions/D004-unit-bolt-granularity.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Issue #259 と Ideation の対象境界に従って Inception 境界を固定するため。 |
| D002 | D001 | Inception 境界に合わせて Unit のコンテキストを採用済み Bounded Context に接続するため。 |
| D003 | D001, D002 | 対象境界の中で、Issue #257 と Issue #259 の責務を混ぜないため。 |
| D004 | D001, D002, D003 | 採用した責務境界に合わせて Unit と Bolt の粒度を固定するため。 |
