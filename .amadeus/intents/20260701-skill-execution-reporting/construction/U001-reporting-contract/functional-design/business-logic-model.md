# Business Logic Model

## 目的

skill 実行中に見つかった問題や懸念を、現在の Intent 成果物へ混ぜず、判断可能な報告として扱えるようにする。

## 対象 Unit

U001 reporting contract。

## 業務ロジック

skill 実行時問題報告は、現在の Intent 対象、後続 Issue 候補、報告不要の3分類で扱う。

現在の Intent 対象に含めるのは、その問題や懸念が対象境界、Requirement、Use Case、Unit、Bolt、Task、Functional Design のいずれかへ直接追跡でき、現在の成功条件を満たすために必要な場合だけである。

後続 Issue 候補にするのは、現在の Intent の成功条件には不要だが、Amadeus の skill、template、validator、eval、example、docs、運用に影響する場合である。
この場合、agent は作業報告で Issue 候補として提示し、人間が承認した場合だけ GitHub Issue を作成する。

報告不要にするのは、軽い感想、一時的な作業メモ、すでに解消した局所的な気づき、現在の判断に影響しない観察である。

## 入力

- Issue #248。
- `inception/requirements.md`。
- `inception/units/U001-reporting-contract/design.md`。
- `skills/amadeus-ideation/SKILL.md`。
- `skills/amadeus-inception/SKILL.md`。
- `skills/amadeus-construction/SKILL.md`。

## 出力

- 公開 skill 3件の `実行時問題報告` 節。
- 報告先分類。
- 最低報告項目。
- 人間承認付き Issue 候補化の制約。

## 未確認事項

なし。
