# 判断

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Inception の対象境界を Amadeus 成果物の参照リンク化方針に固定する | 採用 | なし | [D001-inception-boundary.md](decisions/D001-inception-boundary.md) |
| D002 | BC001 自己開発運用を参照する | 採用 | D001 | [D002-bc001-self-development-governance.md](decisions/D002-bc001-self-development-governance.md) |
| D003 | Unit と Bolt を方針契約、適用範囲、検出境界に分ける | 採用 | D001, D002 | [D003-unit-bolt-granularity.md](decisions/D003-unit-bolt-granularity.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Issue #243 と Ideation の対象境界に従って Inception 境界を固定するため。 |
| D002 | D001 | Inception 境界に合わせて Unit のコンテキストを採用済み Bounded Context へ接続するため。 |
| D003 | D001, D002 | 採用した境界づけられたコンテキスト内で Unit と Bolt の粒度を固定するため。 |
