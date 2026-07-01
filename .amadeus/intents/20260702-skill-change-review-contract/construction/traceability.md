# Construction 追跡

## Task Generation からの追跡

| Evidence | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| [tasks.md](bolts/B001-policies-review-support-contract/tasks.md) | B001/T001, B001/T002 | `.amadeus/steering/policies.md` | [test-results.md](bolts/B001-policies-review-support-contract/test-results.md) | 未作成 | implemented |
| [tasks.md](bolts/B002-development-and-readme-alignment/tasks.md) | B002/T001, B002/T002 | `.amadeus/development.md`, `README.md`, `README.ja.md` | [test-results.md](bolts/B002-development-and-readme-alignment/test-results.md) | 未作成 | implemented |

## Construction からの追跡

| ボルト | タスク | 証拠 | 状態 |
|---|---|---|---|
| B001 | B001/T001, B001/T002 | [test-results.md](bolts/B001-policies-review-support-contract/test-results.md) | implemented |
| B002 | B002/T001, B002/T002 | [test-results.md](bolts/B002-development-and-readme-alignment/test-results.md) | implemented |

## Deployment Unit からの追跡

| Deployment Unit | Task | 実装 | 検証 | PR | 状態 |
|---|---|---|---|---|---|
| `.amadeus/steering/policies.md` | B001/T001, B001/T002 | 変更種別表へ挙動差分要約と skill-forge 確認の記録を追加し、判断基準へ粒度制約と例外一般則を追加 | [B001 test-results](bolts/B001-policies-review-support-contract/test-results.md) | 未作成 | implemented |
| `.amadeus/development.md` | B002/T001 | PR 準備条件から skill 変更時の追加条件へ追跡できる記述を追加 | [B002 test-results](bolts/B002-development-and-readme-alignment/test-results.md) | 未作成 | implemented |
| `README.md`, `README.ja.md` | B002/T002 | skill-forge 確認を必須（must）と記録条件が分かる記述へ書き換え、定義元として policies を参照 | [B002 test-results](bolts/B002-development-and-readme-alignment/test-results.md) | 未作成 | implemented |
