# Business Rules

## 目的

学習候補の昇格先と、成果物ごとの責務を明確にする。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | `ideation/ideation.md` の `学習候補` は、対象 Intent 内で見つかった初期候補を置く。 | R004, UC002 | accepted |
| BR002 | phase の `traceability.md` は、採用済み成果物と証拠の前後関係を追跡する。 | R004, UC003 | accepted |
| BR003 | phase の `decisions.md` は、採用、非採用、上書き、再確認対象の判断を記録する。 | R004, UC003 | accepted |
| BR004 | `.amadeus/steering/knowledge.md` は、複数 Intent で再利用する知見の索引を扱う。 | R003, R004 | accepted |
| BR005 | Domain Map と Context Map は候補を扱わず、承認済みの `adopted` と `retired` の現在の索引だけを扱う。 | R003, R004 | accepted |
| BR006 | validator の結果は構造検出であり、evaluator の結果は品質評価である。どちらも自動的には学習採用にしない。 | R005, UC003 | accepted |

## 例外

| 条件 | 扱い | 根拠 |
|---|---|---|
| 学習候補が単一 Intent の事情に閉じる。 | Steering knowledge、Domain Map、Context Map へ昇格しない。 | R003 |
| Domain Map または Context Map へ反映する候補が未承認である。 | phase 成果物内に候補として残し、Domain Map または Context Map へは書かない。 | R004 |

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | 学習候補には根拠成果物、発生 phase、影響範囲がある。 | R003 | accepted |
| POST001 | 事後条件 | 採用先、非採用理由、または後続化理由が記録される。 | R003, R004 | accepted |
| INV001 | 不変条件 | Domain Map と Context Map は候補置き場ではない。 | R004 | accepted |
| INV002 | 不変条件 | validator または evaluator の検出だけで、Steering knowledge へ自動昇格しない。 | R005 | accepted |

## 未確認事項

なし。
