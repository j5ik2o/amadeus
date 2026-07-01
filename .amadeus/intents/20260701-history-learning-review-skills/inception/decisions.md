# 判断

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Inception の境界を固定する。 | 採用 | なし | [D001-inception-boundary.md](decisions/D001-inception-boundary.md) |
| D002 | Unit のコンテキストとして BC001 自己開発運用を参照する。 | 採用 | D001 | [D002-bc001-self-development-governance.md](decisions/D002-bc001-self-development-governance.md) |
| D003 | `amadeus-history-review` と `amadeus-learning-review` を分けて扱う。 | 採用 | D001 | [D003-split-history-and-learning-review.md](decisions/D003-split-history-and-learning-review.md) |
| D004 | Unit と Bolt を過去分析、学習分類、consumer 境界と検証に分ける。 | 採用 | D003 | [D004-unit-bolt-granularity.md](decisions/D004-unit-bolt-granularity.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Inception 成果物の対象境界を固定する判断であるため。 |
| D002 | D001 | 対象境界が確定してから既存 Bounded Context の参照を判断するため。 |
| D003 | D001 | Inception 境界の中で内部 skill の責務分割を判断するため。 |
| D004 | D003 | skill 責務の分割を Unit と Bolt の粒度へ反映するため。 |

## 採用した判断

- Issue #277 は、Issue #259 の学習分類契約を内部 skill として具体化する作業として扱う。
- `amadeus-history-review` は `.amadeus/` 過去成果物の読み取り専用分析を所有する。
- `amadeus-learning-review` は分析結果や検証結果の学習先分類を所有する。
- Issue #272 の `dry-run` は分析結果を入力にできる consumer として扱い、過去分析と学習分類を所有しない。
- Unit は U001 と U002 に分け、Bolt は B001、B002、B003 に分ける。
- すべての Unit は Domain Map の `BC001 自己開発運用` を参照する。

## 置き換えられた判断

なし。

## 再確認条件

- `amadeus-learning-review` を追加しない判断になった場合。
- `amadeus-history-review` と `amadeus-learning-review` を統合する判断になった場合。
- `dry-run` 側が過去分析を直接所有する判断になった場合。
- Domain Map または Context Map への候補抽出を自動昇格として扱う要件が追加された場合。
