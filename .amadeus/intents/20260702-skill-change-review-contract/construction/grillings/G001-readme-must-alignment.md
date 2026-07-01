# G001: README の必須化

## 概要

- 状態: completed
- 対象: Intent
- 反映先: [business-rules.md](U001-skill-change-review-contract/functional-design/business-rules.md)

## 確定判断

| ID | 判断 | 状態 | 反映先 | 置き換え先 |
|---|---|---|---|---|
| GD001 | README（英語、日本語）は skill-forge 確認が必須（must）であることが分かる記述へ書き換え、必須条件の詳細は steering policies を定義元として参照する。 | active | [business-rules.md](U001-skill-change-review-contract/functional-design/business-rules.md) | なし |

## 質問記録

### Q001

- 確定判断: GD001
- 確認したいこと: README の skill-forge 推奨記述を、推奨のまま残すか、必須であることが分かる記述へ書き換えるか。
- 確認が必要な理由: B002 の完了条件「README の記述が policies の必須条件と矛盾しない」を満たす方法が2つあり、R004 の未確認事項として Construction へ引き継がれたため。
- 推奨回答: 必須が分かる記述へ書き換え、詳細の定義元として steering policies を参照する。
- 推奨理由: README は入口文書であり、推奨のまま残すと「README では任意、policies では必須」という強度の食い違いが文書間指示のずれを作るため。
- ユーザー回答: b。skill-forge を使うのは must。
