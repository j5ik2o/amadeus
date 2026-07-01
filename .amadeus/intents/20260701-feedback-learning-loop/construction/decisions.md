# Construction Decisions

## 一覧

| 識別子 | 概要 | 状態 | 依存 | 詳細 |
|---|---|---|---|---|
| D001 | Functional Design は feedback routing と learning promotion の契約に限定する。 | accepted | なし | [D001-functional-design-scope.md](decisions/D001-functional-design-scope.md) |
| D002 | 後段発見は上流戻し、現在 phase 修正、横断学習、後続化、非採用へ分類する。 | accepted | D001 | [D002-feedback-routing-classification.md](decisions/D002-feedback-routing-classification.md) |
| D003 | 横断学習は Steering knowledge、Domain Map、Context Map の責務境界を分けて扱う。 | accepted | D002 | [D003-learning-promotion-boundary.md](decisions/D003-learning-promotion-boundary.md) |
| D004 | validator は構造検出、evaluator は品質評価として扱う。 | accepted | D002, D003 | [D004-evidence-boundary.md](decisions/D004-evidence-boundary.md) |

## 依存関係

| 判断 | 依存 | 理由 |
|---|---|---|
| D001 | なし | Construction の設計境界を先に決めるため。 |
| D002 | D001 | 発見分類は Functional Design の対象境界に含まれるため。 |
| D003 | D002 | 横断学習は現在 Intent 内の修正対象を除外した後に判断するため。 |
| D004 | D002, D003 | validator と evaluator の証拠境界は発見分類と昇格判断の両方に影響するため。 |
