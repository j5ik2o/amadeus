# G001: merge 済み判定の証拠

## 概要

- 状態: completed
- 対象: Intent
- 反映先: [requirements.md](requirements.md)

## 確定判断

| ID | 判断 | 状態 | 反映先 | 置き換え先 |
|---|---|---|---|---|
| GD001 | merge 済み判定は成果物と state だけで行う。基準 branch 由来の checkout に、実装済みかつ検証済みで pr.md がなく gate が passed でない Intent が存在すれば merge 済み未 finalize と判定する。GitHub 照会は補強用途に留め、必須にしない。 | active | [R001-offline-unfinalized-judgment.md](requirements/R001-offline-unfinalized-judgment.md) | なし |

## 質問記録

### Q001

- 確定判断: GD001
- 確認したいこと: 再開規則の「実装 PR が merge 済み」という条件を、成果物と state だけで判定するか、GitHub への照会も許容するか。
- 確認が必要な理由: 検出スクリプトの実行環境の前提を決める判断であり、R001 の受け入れ条件を規定するため。
- 推奨回答: 成果物と state だけで判定する。merge されていなければ未 finalize 状態が基準 branch に存在し得ないため、checkout 自体が merge の証拠になる。
- 推奨理由: D002（同梱スクリプト配置）と同じ原理で、配布先ユーザー環境には gh や認証がない前提に立つべきであり、オフラインで決定論的に判定できるため。
- ユーザー回答: 推奨のとおり。
