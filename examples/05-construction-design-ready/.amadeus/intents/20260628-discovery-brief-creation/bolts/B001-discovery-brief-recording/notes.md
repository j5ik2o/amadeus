# Construction ノート

## 実行方針

- B001 は Discovery Brief 記録だけを扱う。
- R001 と UC001 を満たすため、入力テーマ、確認した前提、判定、判定理由を記録する。
- Intent 候補提示、候補判断、推奨次アクションの提示は B002 に委ねる。
- 実装時は Markdown 成果物の保存形式と編集単位を最初に確定し、その後に記録項目と責務境界の確認へ進める。

## 対象タスク

| タスク | 状態 | 方針 | 証拠 |
|---|---|---|---|
| T001 | 未着手 | Discovery Brief の Markdown 保存形式を確定する。 | 未登録 |
| T002 | 未着手 | 入力テーマ、確認した前提、未確認事項を分けて記録する。 | 未登録 |
| T003 | 未着手 | 判定と判定理由を記録し、判定理由なしの確定扱いを避ける。 | 未登録 |
| T004 | 未着手 | Discovery の責務境界と validator 入口を確認する。 | 未登録 |

## 実装判断

- 作業ツリーには実装コード、テストコード、package 定義がない。
- そのため、B001 の実装対象候補は `.amadeus` 配下の Markdown 成果物である。
- 空欄を使わず `未確認` を明示する既存成果物の規則を維持する。
- B001 の Task は B002 に依存しない。
- B002 は B001 の Discovery Brief 記録結果を前提にする。

## 検証入口

- `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260628-discovery-brief-creation`

## 未確認事項

- Discovery Brief の表示文言は未確認である。
- Discovery Brief 記録時の具体的な対話手順は未確認である。
- 実装コードの配置は、実装対象コードが追加される段階で再確認する。
