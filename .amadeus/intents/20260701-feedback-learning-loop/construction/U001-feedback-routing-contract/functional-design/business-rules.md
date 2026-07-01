# Business Rules

## 目的

後段発見を扱う分類と戻り先を、phase skill が同じ基準で判断できるようにする。

## 業務ルール

| 識別子 | 規則 | 根拠 | 状態 |
|---|---|---|---|
| BR001 | 前段成果物の不足または矛盾が現在の成功条件を妨げる場合は、`upstream_feedback_required` に分類する。 | R001, UC001 | accepted |
| BR002 | 現在 phase の成果物または実装だけで解消できる発見は、`current_phase_update_required` に分類する。 | R002, UC001 | accepted |
| BR003 | 現在 Intent の成功条件に不要な発見は、現在成果物へ混ぜず、後続 Issue 候補または後続 Intent 候補として報告する。 | R002, UC001 | accepted |
| BR004 | GitHub Issue を作成するのは、人間が Issue 化を承認した場合だけである。 | R002, UC001 | accepted |
| BR005 | Issue #257 の decision review は、意思決定の再確認要否を扱う。#259 の feedback learning loop は、発見をどの成果物または後続作業へ送るかを扱う。 | R005, UC003 | accepted |

## 例外

| 条件 | 扱い | 根拠 |
|---|---|---|
| 発見が軽い感想、一時メモ、すでに解消した局所的な気づきである。 | `no_learning_action` として扱い、成果物へ混ぜない。 | R002 |
| 発見が判断材料不足で分類できない。 | `amadeus-grilling` で確認する。 | R001, R005 |

## Intent Contracts

| 識別子 | 種別 | 条件 | 根拠 | 状態 |
|---|---|---|---|---|
| PRE001 | 事前条件 | 発見には対象 Intent、phase、stage、Unit、Bolt の分かる範囲が添えられている。 | R001 | accepted |
| POST001 | 事後条件 | 報告には分類、影響範囲、推奨戻り先、根拠となる成果物 path、PR URL、Issue URL、検証結果が含まれる。 | R001, R002 | accepted |
| INV001 | 不変条件 | validator の `pass` は構造条件の充足であり、内容承認として扱わない。 | R005 | accepted |
| INV002 | 不変条件 | evaluator の結果は品質評価であり、採用先は phase skill または人間判断で分類する。 | R005 | accepted |

## 未確認事項

なし。
