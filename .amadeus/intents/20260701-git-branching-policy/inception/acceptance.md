# 受け入れ状態

## 要求状態

| 要求 | 状態 | 証拠 |
|---|---|---|
| R001 | 検証済み | [B001 test-results](../construction/bolts/B001-policy-placement/test-results.md)、[PR #260](../construction/bolts/B001-policy-placement/pr.md)、`.amadeus/steering/policies.md`、`.amadeus/steering/policies/git-branching.md` |
| R002 | 検証済み | [B002 test-results](../construction/bolts/B002-branch-lifecycle-rules/test-results.md)、[PR #260](../construction/bolts/B002-branch-lifecycle-rules/pr.md)、`.amadeus/steering/policies/git-branching.md` |
| R003 | 検証済み | [B001 test-results](../construction/bolts/B001-policy-placement/test-results.md)、[B002 test-results](../construction/bolts/B002-branch-lifecycle-rules/test-results.md)、[PR #260](../construction/bolts/B001-policy-placement/pr.md)、`.amadeus/steering/policies/git-branching.md` |
| R004 | 検証済み | [B003 test-results](../construction/bolts/B003-policy-reference-validation/test-results.md)、[PR #260](../construction/bolts/B003-policy-reference-validation/pr.md)、[construction/traceability.md](../construction/traceability.md)、`.amadeus/steering/policies/git-branching.md` |

## 状態ルール

- `提案` は要求案が記録された状態である。
- `採用済み` は Inception で扱う要求として合意された状態である。
- `充足済み` は実装証拠が登録された状態である。
- `検証済み` は人間承認を含む確認が済んだ状態である。
