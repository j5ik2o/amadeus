# 受け入れ状態

## 要求状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 充足済み | [B001 test-results](../construction/bolts/B001-history-review-internal-skill/test-results.md) |
| R002 | 充足済み | [B001 test-results](../construction/bolts/B001-history-review-internal-skill/test-results.md) |
| R003 | 充足済み | [B002 test-results](../construction/bolts/B002-learning-review-internal-skill/test-results.md) |
| R004 | 充足済み | [B003 test-results](../construction/bolts/B003-dry-run-consumer-verification/test-results.md) |
| R005 | 充足済み | [Construction 追跡](../construction/traceability.md) |

## 状態ルール

- `提案` は要求案が記録された状態である。
- `採用済み` は Inception で扱う要求として合意された状態である。
- `充足済み` は実装証拠が登録された状態である。
- `検証済み` は人間承認を含む確認が済んだ状態である。
- Construction で skill 本文、昇格先成果物、eval、validator の証拠がそろうまでは、要求を `充足済み` または `検証済み` にしない。
