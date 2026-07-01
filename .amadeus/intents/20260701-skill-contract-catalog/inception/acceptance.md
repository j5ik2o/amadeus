# 受け入れ状態

## 要求状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 検証済み | [B001 test-results](../construction/bolts/B001-skill-contract-catalog-model/test-results.md), [B001 PR](../construction/bolts/B001-skill-contract-catalog-model/pr.md) |
| R002 | 検証済み | [B001 test-results](../construction/bolts/B001-skill-contract-catalog-model/test-results.md), [B001 PR](../construction/bolts/B001-skill-contract-catalog-model/pr.md) |
| R003 | 検証済み | [B002 test-results](../construction/bolts/B002-skill-contract-generation-and-drift/test-results.md), [B002 PR](../construction/bolts/B002-skill-contract-generation-and-drift/pr.md) |
| R004 | 検証済み | [B002 test-results](../construction/bolts/B002-skill-contract-generation-and-drift/test-results.md), [B002 PR](../construction/bolts/B002-skill-contract-generation-and-drift/pr.md) |
| R005 | 検証済み | [B001 test-results](../construction/bolts/B001-skill-contract-catalog-model/test-results.md), [B001 PR](../construction/bolts/B001-skill-contract-catalog-model/pr.md), [B002 test-results](../construction/bolts/B002-skill-contract-generation-and-drift/test-results.md), [B002 PR](../construction/bolts/B002-skill-contract-generation-and-drift/pr.md), [B003 test-results](../construction/bolts/B003-skill-contract-consumer-integration/test-results.md), [B003 PR](../construction/bolts/B003-skill-contract-consumer-integration/pr.md) |

## 状態ルール

- `提案` は要求案が記録された状態である。
- `採用済み` は Inception で扱う要求として合意された状態である。
- `充足済み` は実装証拠が登録された状態である。
- `検証済み` は人間承認を含む確認が済んだ状態である。
