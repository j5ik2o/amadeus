# Ideation Traceability

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| 対象 | Discovery Brief の成果物境界 | [scope.md](scope.md) | Inception の Requirement 候補へ渡す |
| 実現可能性 | Markdown と state.json による構造化 | [ideation.md](ideation.md) | Unit の価値境界へ渡す |
| 初期モック | Discovery 判定と推奨候補の確認 | [mocks/initial-confirmation.puml](mocks/initial-confirmation.puml) | Use Case の相互作用へ渡す |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| Intent | 20260628-discovery-brief-creation | なし | Discovery Brief 作成は単独で成立する | [intent.md](intent.md) |
| Mock | initial-confirmation | scope.md, ideation.md | 対象と初期モックの判断を反映するため | [mocks/initial-confirmation.puml](mocks/initial-confirmation.puml) |
