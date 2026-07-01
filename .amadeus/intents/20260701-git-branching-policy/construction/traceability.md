# Construction 追跡

## Task Generation からの追跡

| Evidence | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| [B001 tasks](bolts/B001-policy-placement/tasks.md) | B001/T001, B001/T002, B001/T003 | `.amadeus/steering/policies.md`, `.amadeus/steering/policies/git-branching.md`, `.amadeus/steering/policies/README.md` | [B001 test-results](bolts/B001-policy-placement/test-results.md) | [PR #260](bolts/B001-policy-placement/pr.md) | verified |
| [B002 tasks](bolts/B002-branch-lifecycle-rules/tasks.md) | B002/T001, B002/T002, B002/T003 | `.amadeus/steering/policies/git-branching.md` | [B002 test-results](bolts/B002-branch-lifecycle-rules/test-results.md) | [PR #260](bolts/B002-branch-lifecycle-rules/pr.md) | verified |
| [B003 tasks](bolts/B003-policy-reference-validation/tasks.md) | B003/T001, B003/T002, B003/T003 | `.amadeus/steering/policies/git-branching.md`, `construction/traceability.md` | [B003 test-results](bolts/B003-policy-reference-validation/test-results.md) | [PR #260](bolts/B003-policy-reference-validation/pr.md) | verified |

## Construction からの追跡

| ボルト | タスク | 証拠 | 状態 |
|---|---|---|---|
| B001 | B001/T001, B001/T002, B001/T003 | [B001 test-results](bolts/B001-policy-placement/test-results.md)、[PR #260](bolts/B001-policy-placement/pr.md)、`.amadeus/steering/policies.md`、`.amadeus/steering/policies/git-branching.md`、`.amadeus/steering/policies/README.md` | verified |
| B002 | B002/T001, B002/T002, B002/T003 | [B002 test-results](bolts/B002-branch-lifecycle-rules/test-results.md)、[PR #260](bolts/B002-branch-lifecycle-rules/pr.md)、`.amadeus/steering/policies/git-branching.md` | verified |
| B003 | B003/T001, B003/T002, B003/T003 | [B003 test-results](bolts/B003-policy-reference-validation/test-results.md)、[PR #260](bolts/B003-policy-reference-validation/pr.md)、[Git Branching Policy](../../../steering/policies/git-branching.md) | verified |

## Deployment Unit からの追跡

| Deployment Unit | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| `.amadeus/steering/policies.md` | B001/T001 | Git ブランチ戦略 policy の概要と導線を追加 | [B001 test-results](bolts/B001-policy-placement/test-results.md) | [PR #260](bolts/B001-policy-placement/pr.md) | verified |
| `.amadeus/steering/policies/README.md` | B001/T003 | 登録済み policy 一覧を追加 | [B001 test-results](bolts/B001-policy-placement/test-results.md) | [PR #260](bolts/B001-policy-placement/pr.md) | verified |
| `.amadeus/steering/policies/git-branching.md` | B001/T002, B002/T001, B002/T002, B002/T003, B003/T001, B003/T002 | Git ブランチ戦略、branch lifecycle、policy 参照、検出境界を追加 | [B001 test-results](bolts/B001-policy-placement/test-results.md)、[B002 test-results](bolts/B002-branch-lifecycle-rules/test-results.md)、[B003 test-results](bolts/B003-policy-reference-validation/test-results.md) | [PR #260](bolts/B001-policy-placement/pr.md)、[PR #260](bolts/B002-branch-lifecycle-rules/pr.md)、[PR #260](bolts/B003-policy-reference-validation/pr.md) | verified |
| `construction/traceability.md` | B003/T003 | Git ブランチ戦略 policy への参照を記録 | [B003 test-results](bolts/B003-policy-reference-validation/test-results.md) | [PR #260](bolts/B003-policy-reference-validation/pr.md) | verified |

## policy 参照

| policy | 参照元 | 用途 |
|---|---|---|
| [Git Branching Policy](../../../steering/policies/git-branching.md) | B003/T003 | Intent traceability から参照する Git ブランチ戦略 policy として扱う。 |
