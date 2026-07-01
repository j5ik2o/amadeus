# 受け入れ状態

## 要求状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 検証済み | [B001 test-results](../construction/bolts/B001-decision-review-internal-contract/test-results.md), [B003 test-results](../construction/bolts/B003-verification-contract-alignment/test-results.md), [PR #275](https://github.com/amadeus-dlc/amadeus/pull/275) |
| R002 | 検証済み | [B001 test-results](../construction/bolts/B001-decision-review-internal-contract/test-results.md), [PR #275](https://github.com/amadeus-dlc/amadeus/pull/275) |
| R003 | 検証済み | [B001 test-results](../construction/bolts/B001-decision-review-internal-contract/test-results.md), [B002 test-results](../construction/bolts/B002-phase-skill-entry-integration/test-results.md), [PR #275](https://github.com/amadeus-dlc/amadeus/pull/275) |
| R004 | 検証済み | [B002 test-results](../construction/bolts/B002-phase-skill-entry-integration/test-results.md), [PR #275](https://github.com/amadeus-dlc/amadeus/pull/275) |
| R005 | 検証済み | [B003 test-results](../construction/bolts/B003-verification-contract-alignment/test-results.md), [PR #275](https://github.com/amadeus-dlc/amadeus/pull/275) |

## 状態ルール

- `提案` は要求案が記録された状態である。
- `採用済み` は Inception で扱う要求として合意された状態である。
- `充足済み` は実装証拠が登録された状態である。
- `検証済み` は人間承認を含む確認が済んだ状態である。
