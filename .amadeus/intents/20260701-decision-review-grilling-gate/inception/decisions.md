# 判断

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Inception では decision review gate 契約と phase skill 反映境界を定義し、実装詳細は Construction に渡す。 | 採用 | なし | [D001-inception-boundary.md](decisions/D001-inception-boundary.md) |
| D002 | 対象ユニットは `BC001 自己開発運用` に属するものとして扱う。 | 採用 | D001 | [D002-bc001-self-development-governance.md](decisions/D002-bc001-self-development-governance.md) |
| D003 | `amadeus-decision-review` を初期の内部 skill 候補として扱う。 | 採用 | D001, D002 | [D003-internal-decision-review-skill.md](decisions/D003-internal-decision-review-skill.md) |
| D004 | Unit は2件、Bolt は3件に分けて Construction の実行粒度を固定する。 | 採用 | D001, D002, D003 | [D004-unit-bolt-granularity.md](decisions/D004-unit-bolt-granularity.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Inception の所有境界を固定するため。 |
| D002 | D001 | Inception の所有境界に合わせて Unit のコンテキストを採用するため。 |
| D003 | D001, D002 | 採用した境界内で decision review の共有単位を固定するため。 |
| D004 | D001, D002, D003 | 内部 skill 候補と phase skill 反映範囲に合わせて Construction の実行粒度を固定するため。 |

## Inception Decision Gate

| 観点 | 状態 | 根拠 |
|---|---|---|
| 境界 | passed | Inception の成果物は要求、受け入れ状態、ユースケース、ユニット、ボルト、追跡、判断に限定した。 |
| ドメイン参照 | passed | 採用済みの `BC001 自己開発運用` を参照し、新しい Domain Map 候補を作らない。 |
| 実装粒度 | passed | Construction で実装できる単位として B001、B002、B003 を定義した。 |
