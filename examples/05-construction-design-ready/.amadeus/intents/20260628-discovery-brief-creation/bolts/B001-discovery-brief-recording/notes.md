# Construction ノート

## 実行方針

- B001 は Discovery Brief 記録を実装可能な Task 集合へ分解する。
- 実装前に、Discovery Brief の必須項目、判定と理由の対応、責務境界、B002 への参照項目を順に固める。
- 対象 workspace は例示成果物中心であり、実装コードは存在しない。
- そのため、後続の実装では `.amadeus/discoveries/*/brief.md` の構造と Amadeus 成果物の契約を基準にする。
- この段階では、実装コード、テストコード、`test-results.md`、PR 記録を作らない。

## 対象タスク

| タスク | 状態 | 方針 | 証拠 |
|---|---|---|---|
| T001 | 未着手 | Discovery Brief の必須記録項目をそろえる | 未登録 |
| T002 | 未着手 | 判定、判定理由、推奨次アクションの対応を記録する | 未登録 |
| T003 | 未着手 | Discovery Brief の責務境界を固定する | 未登録 |
| T004 | 未着手 | 確認状態と後続参照を整理する | 未登録 |

## 実装判断

- Discovery Brief は Intent 化前の判断記録として扱う。
- B001 は R001 と UC001 だけを対象にする。
- Intent 候補提示は B002 の責務であるため、B001 では候補そのものの提示を実装対象にしない。
- Requirement、Use Case、Unit、Bolt、Task の定義は Discovery Brief の記録対象に含めない。

## 検証入口

- 後続の検証では、T001 から T004 までの証拠を `test-results.md` に記録する。
- 構造成果物の検証入口は `bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . 20260628-discovery-brief-creation` である。

## 未確認事項

- 保存操作、UI 表現、具体的なファイル更新処理は後続の実装段階で確定する。
- 詳細なモデルと契約条件は Construction 以降で確認する。
