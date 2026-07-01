# G001: Issue #233 引き継ぎ範囲

## 概要

- 状態: completed
- 対象: Intent
- 反映先: [scope.md](scope.md)、[ideation.md](ideation.md)、[traceability.md](traceability.md)、[decisions.md](decisions.md)

## 確定判断

| ID | 判断 | 状態 | 反映先 | 置き換え先 |
|---|---|---|---|---|
| GD001 | Issue #233 へ渡す対象は、stage 判定と build workspace / target workspace の対応記録に限定する。 | active | [scope.md](scope.md)、[ideation.md](ideation.md)、[traceability.md](traceability.md)、[decisions.md](decisions.md) | なし |

## 質問記録

### Q001

- 確定判断: GD001
- 確認したいこと: `20260629-self-dev-steering-layer` の未確定事項から、次の Issue #233 に渡す対象を stage 判定と build workspace / target workspace の対応記録に限定してよいか。
- 確認が必要な理由: 既存の未確定事項には、`CONTEXT.md` への stage 語彙追加、example snapshot の provenance、host environment の assets と target artifacts の assets の混入検出も含まれており、Issue #233 の範囲が広がる可能性があるため。
- 推奨回答: はい。Issue #233 は、stage0、stage1、stage2 の判定方針と、build workspace / target workspace の対応をどの成果物に記録するかに限定する。`CONTEXT.md` への stage 語彙追加、example snapshot provenance、host environment assets 混入検出は別 Issue または後続 Intent に残す。
- 推奨理由: `scope.md` は `CONTEXT.md` への stage0、stage1、stage2 の追加を対象外にしており、`ideation.md` の未確定事項も広がっているため。Issue #233 の範囲を2点に絞ると、Inception に渡す判断が小さくなり、guided の判断履歴として記録しやすい。
- ユーザー回答: そのとおり。
