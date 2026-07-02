# G001: 入力テーマ選定と Intent 分割方針

## 概要

- 状態: completed
- 対象: Discovery
- 反映先: [20260702-phase-cycle-deterministic-contract.md](../20260702-phase-cycle-deterministic-contract.md)

## 確定判断

| ID | 判断 | 状態 | 反映先 | 置き換え先 |
|---|---|---|---|---|
| GD001 | Discovery の入力テーマを Issue #314（phase cycle の決定論的契約）にする。#315 と #316 は今回の対象外にする。 | active | [20260702-phase-cycle-deterministic-contract.md](../20260702-phase-cycle-deterministic-contract.md) | なし |
| GD002 | 子 Issue #306（skill 側のゲート契約）と #307（validator 側の evidence 検査）を 1 つの Intent に統合する。 | active | [20260702-phase-cycle-deterministic-contract.md](../20260702-phase-cycle-deterministic-contract.md) | なし |
| GD003 | 新規 Intent 候補のうち、最初に Ideation へ進める recommended 候補を #306+#307 の統合 Intent にする。依存順は #306+#307 → #311 → #310 とする。 | active | [20260702-phase-cycle-deterministic-contract.md](../20260702-phase-cycle-deterministic-contract.md) | なし |

## 質問記録

### Q001

- 確定判断: GD001
- 確認したいこと: `self-development` Discovery の入力テーマとして、epic Issue #314、#315、#316 のどれを扱うか。
- 確認が必要な理由: 3 つの epic はそれぞれ独立したテーマであり、1 つの Discovery に混ぜられない。入力テーマが確定しないと Discovery の判定を作れない。
- 推奨回答: #314 を扱う。
- 推奨理由: epic 本文に「この親 Issue を 1 つの Discovery の入力として扱う」と明記済みであり、子 Issue #309 の Intent が Inception 完了で cycle が先行している。#315 の検査責務境界の整理は #307 の確定を待っており、cycle 往復コストの削減は以後すべての Intent に効く。
- ユーザー回答: #314 を扱う。

### Q002

- 確定判断: GD002
- 確認したいこと: 子 Issue #306 と #307 を 1 つの Intent に統合するか、子 Issue と 1:1 の別 Intent にするか。
- 確認が必要な理由: Discovery の Intent 候補の分割方針に直結し、後続の Ideation 回数が変わる。epic 本文は「同じゲート契約の両面。#306 を先に確定する」と依存を明記している。
- 推奨回答: 1 Intent に統合する。
- 推奨理由: 契約定義（skill）と検査（validator）を別 Intent に分けると、契約形式の合意を 2 回やり直すリスクがある。cycle 往復コスト削減という epic の目的とも整合し、Intent 内で Unit や Bolt を分ければ段階実装は可能である。
- ユーザー回答: 1 Intent に統合する。

### Q003

- 確定判断: GD003
- 確認したいこと: 新規 Intent 候補（#306+#307 統合、#310、#311）のうち、最初に Ideation へ進める recommended 候補をどれにするか。
- 確認が必要な理由: `multi_intent` 判定では recommended を 1 件だけ選ぶことが Gate 条件である。
- 推奨回答: #306+#307 のゲート契約 Intent を recommended にする。
- 推奨理由: epic の根本課題（進行判断が裁量で変わる）を直接解消する中核であり、ゲート契約で定まる evidence の形式は #311 の `state.json` 雛形に含めるフィールドの前提になる。epic #315 の検査責務境界の整理も #307 の確定を待っている。
- ユーザー回答: #306+#307 のゲート契約 Intent を recommended にする。
