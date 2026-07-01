# R004: `dry-run` の入力境界

## 要求

- `amadeus-discovery dry-run` は、必要に応じて `amadeus-history-review` または `amadeus-learning-review` の結果を入力にできる。
- `dry-run` は、過去分析そのものや学習分類そのものを所有しない。
- `dry-run` は、Intent 候補、分類、根拠、未確認事項、推奨次アクションの表示に集中する。

## 受け入れ条件

- `dry-run` と `amadeus-history-review` の責務差分が説明されている。
- `dry-run` と `amadeus-learning-review` の責務差分が説明されている。
- `dry-run` が `.amadeus/` を更新しない読み取り専用 mode であることと矛盾しない。

## 根拠

- [Issue #272](https://github.com/amadeus-dlc/amadeus/issues/272)
- [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277)
- [traceability.md](../../ideation/traceability.md)

## 未確認事項

- `amadeus-discovery` 本文への説明追加をこの Intent の Construction に含めるか Issue #272 に残すかは Construction で確認する。
