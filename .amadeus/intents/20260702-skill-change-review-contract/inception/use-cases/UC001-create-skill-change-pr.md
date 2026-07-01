# UC001 skill 変更 PR を作成する

## ユースケース

Agent が skill 変更 PR を作成するとき、レビュー判断に必要な記録を PR 説明に残し、粒度制約を確認する。

## アクター

- ACT002 Agent

## 外部システム

- EXT001 GitHub

## 事前条件

- skill 変更が対象 Intent と GitHub Issue に対応している。
- `steering/policies.md` の変更種別表を参照できる。
- skill-forge を利用できる。

## 基本フロー

1. Agent は、変更が skill 変更だけで構成されているか確認する。
2. Agent は、source skill を変更し、昇格先成果物を同じ PR で同期する。
3. Agent は、skill-forge で skill 境界、trigger description、本文指示、eval coverage を確認する。
4. Agent は、PR 説明に挙動差分の3観点（変わる判断、変わる成果物構造、影響する後続 phase）を記録する。
5. Agent は、PR 説明の固定見出し「skill-forge 確認」に、確認した観点と確認結果を記録する。
6. Agent は、GitHub に PR を作成する。

## 代替フロー

| 条件 | 扱い |
|---|---|
| 他の変更種別が混ざっており、分割しても各 PR 単独で検証が pass する。 | PR を変更種別ごとに分割する。 |
| 分割するとどちらかの PR 単独で検証が fail する。 | 例外として同一 PR に含め、理由と後続確認先を PR 説明に記録する。 |

## 対応要求

- R001
- R002
- R003

## 未確認事項

- なし。
