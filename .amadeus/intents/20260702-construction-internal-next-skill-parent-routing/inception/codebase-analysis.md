# 既存コード分析

## 対象コード

- `skills/amadeus-construction/SKILL.md`
- `skills/amadeus-construction-implementation-execution/SKILL.md`
- `skills/amadeus-construction-verification-hardening/SKILL.md`
- `skills/amadeus-construction-bolt-preparation/SKILL.md`
- `skills/amadeus-construction-functional-design/SKILL.md`
- `skills/amadeus-construction-traceability-finalization/SKILL.md`
- `.agents/skills/amadeus-construction/SKILL.md`
- `.agents/skills/amadeus-construction-implementation-execution/SKILL.md`
- `.agents/skills/amadeus-construction-verification-hardening/SKILL.md`
- `.agents/skills/amadeus-construction-bolt-preparation/SKILL.md`
- `.agents/skills/amadeus-construction-functional-design/SKILL.md`
- `.agents/skills/amadeus-construction-traceability-finalization/SKILL.md`

## 既存能力

- `amadeus-construction` は Construction の公開入口であり、Functional Design、Bolt 実行準備、実装、検証、追跡と状態確定を内部 skill へ順に委譲する契約を持つ。
- `amadeus-construction-implementation-execution` は実装実行だけを扱い、検証結果、traceability、state.json、PR 記録を更新しない境界を持つ。
- `amadeus-construction-verification-hardening` は検証と堅牢化だけを扱い、traceability、acceptance、decisions、state.json、PR 記録を更新しない境界を持つ。
- `amadeus-construction-traceability-finalization` は追跡と状態確定を扱い、Construction 完了に必要な tasks、acceptance、traceability、decisions、state.json を更新する境界を持つ。
- source skill と昇格先成果物は、同じ skill 本文を対象にできる構造である。

## 統合点

- `amadeus-construction-implementation-execution` の `次の skill` 欄に、実装後は親 skill を検証目的で呼ぶ説明を追加できる。
- `amadeus-construction-verification-hardening` の `次の skill` 欄に、検証後は親 skill をファイナライズ目的で呼ぶ説明を追加できる。
- 同じ欄で、内部 skill を直接呼ぶ条件を親 skill から明示的に委譲されている場合に限定できる。
- 周辺の Construction 内部 skill は、同じ誤読余地があるかを確認対象にできる。

## ギャップ

- `amadeus-construction-implementation-execution` の `次の skill` 欄は、検証へ進む場合の直接の次 skill と Construction 全体を進める場合の親 skill を並べており、親 skill 経由で継続する目的を読み取りにくい。
- `amadeus-construction-verification-hardening` の `次の skill` 欄は、追跡と状態確定へ進む場合の直接の次 skill と Construction 全体を進める場合の親 skill を並べており、ファイナライズを親 skill 経由で進める目的を読み取りにくい。
- 実装完了だけでは Construction 完了ではなく、検証と traceability finalization が必要であることを `次の skill` 欄から読み取りにくい。
- 周辺の Construction 内部 skill も同じ表現方針で確認する必要がある。

## リスク

- 内部 skill を直接呼ぶ案内だけを強めると、公開入口である `amadeus-construction` の順序制御を迂回する誤読が残る。
- 実装後または検証後の継続目的を書かない場合、`test-results.md` を作った時点で止まり、traceability finalization の更新が漏れる可能性がある。
- source skill だけを更新し、昇格先成果物を更新しない場合、host environment で使われる skill と target artifacts がずれる。
- 周辺 skill の `次の skill` 欄を確認しない場合、同じ誤読余地が残る可能性がある。

## Inception への入力

- 要求は、実装後の親 skill 経由検証、検証後の親 skill 経由ファイナライズ、内部 skill 直接利用条件、Construction 完了条件、source skill と昇格先成果物の整合確認に分ける。
- User Story は、Agent が次工程を取り違えない価値と、Maintainer が公開入口契約との整合を確認できる価値に分ける。
- Use Case は、既存案内確認、実装後案内更新、検証後案内更新、整合レビューに分ける。
- Unit は、Construction 内部 skill の次工程案内を扱う1つの価値単位にする。
- Bolt は、implementation execution guidance、verification hardening guidance、surrounding and promotion alignment に分ける。

## 証拠

- `skills/amadeus-construction/SKILL.md`
- `skills/amadeus-construction-implementation-execution/SKILL.md`
- `skills/amadeus-construction-verification-hardening/SKILL.md`
- `skills/amadeus-construction-bolt-preparation/SKILL.md`
- `skills/amadeus-construction-functional-design/SKILL.md`
- `skills/amadeus-construction-traceability-finalization/SKILL.md`
- `.agents/skills/amadeus-construction/SKILL.md`
- `.agents/skills/amadeus-construction-implementation-execution/SKILL.md`
- `.agents/skills/amadeus-construction-verification-hardening/SKILL.md`
- commit `cd5a09337d7d2410e3fb81fc7e20fc9c90ba73df`

## 鮮度

- analyzedAt: `2026-07-01T16:13:18Z`
- freshness: current

## 未確認事項

- 周辺の Construction 内部 skill の `次の skill` 欄を同じ PR で更新する必要があるかは、Construction で実差分を確認して決める。
