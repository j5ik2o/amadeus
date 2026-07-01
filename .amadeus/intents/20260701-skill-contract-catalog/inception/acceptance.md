# 受け入れ状態

## 要求状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 充足済み | [B001 test-results](../construction/bolts/B001-skill-contract-catalog-model/test-results.md) |
| R002 | 充足済み | [B001 test-results](../construction/bolts/B001-skill-contract-catalog-model/test-results.md) |
| R003 | 充足済み | [B002 test-results](../construction/bolts/B002-skill-contract-generation-and-drift/test-results.md) |
| R004 | 充足済み | [B002 test-results](../construction/bolts/B002-skill-contract-generation-and-drift/test-results.md) |
| R005 | 充足済み | [B001 test-results](../construction/bolts/B001-skill-contract-catalog-model/test-results.md), [B002 test-results](../construction/bolts/B002-skill-contract-generation-and-drift/test-results.md), [B003 test-results](../construction/bolts/B003-skill-contract-consumer-integration/test-results.md) |

## 状態ルール

- `提案` は要求案が記録された状態である。
- `採用済み` は Inception で扱う要求として合意された状態である。
- `充足済み` は実装証拠が登録された状態である。
- `検証済み` は人間承認を含む確認が済んだ状態である。
