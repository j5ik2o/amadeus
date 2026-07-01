# Unit Design Brief: Construction 内部 skill 次工程案内

## 概要

この文書は U001 の Unit Design Brief である。

Inception では、Construction 内部 skill の次工程案内を親 skill 経由の継続として整理し、Construction で Task 化するための入力を扱う。

詳細な文面、検証方法、実装手順は Construction で確定する。

## 設計戦略

`amadeus-construction` を公開入口として扱う契約を基準にし、内部 skill の `次の skill` 欄では次工程へ進む目的を親 skill 呼び出しとして示す。

一方で、親 skill から明示的に委譲されている場合だけ内部 skill を直接呼ぶ条件を残す。

これにより、実装後は検証、検証後は traceability finalization へ進む順序を、内部 skill の案内から読み取れるようにする。

## 責務境界

所有するもの:

- `amadeus-construction-implementation-execution` の次工程案内。
- `amadeus-construction-verification-hardening` の次工程案内。
- 内部 skill 直接利用条件の説明。
- source skill と昇格先成果物の整合確認。
- 周辺 Construction 内部 skill の確認。

所有しないもの:

- Construction の stage 構造変更。
- 内部 skill の責務変更。
- 成果物レイアウト変更。
- validator の変更。
- Construction 各工程の一括自動実行追加。

依存してよいもの:

- `amadeus-construction` の公開入口契約。
- Domain Map の BC001 自己開発運用。
- steering policy の source skill と昇格先成果物の扱い。

後続で再確認が必要になる条件:

- 周辺 skill に同じ誤読余地があり、主要2 skill だけでは受け入れ条件を満たせない場合。
- source skill と昇格先成果物の同期手段が現在の方針とずれる場合。

## 構成候補

| 構成候補 | 役割 |
|---|---|
| 実装後案内 | 実装後は親 skill を検証目的で呼ぶことを示す。 |
| 検証後案内 | 検証後は親 skill をファイナライズ目的で呼ぶことを示す。 |
| 直接委譲条件 | 内部 skill を直接呼ぶ条件を親 skill から明示的に委譲された場合へ限定する。 |
| 整合確認 | source skill、昇格先成果物、周辺 skill の案内を確認する。 |

## データと契約候補

| 種別 | 候補 |
|---|---|
| 入力候補 | Issue #274、Ideation 成果物、`amadeus-construction`、対象 Construction 内部 skill。 |
| 出力候補 | 更新済み source skill、昇格先成果物、Construction の検証結果、PR 記録。 |
| 状態候補 | 要求の採用済み、Construction Task の完了、受け入れ状態の検証済み。 |
| 事前条件候補 | Inception gate が passed である。 |
| 事後条件候補 | 親 skill 経由の継続目的と直接委譲条件を skill から読める。 |
| 不変条件候補 | 内部 skill の責務と Construction の stage 構造を変えない。 |

## 検証観点

- 対象 skill の `次の skill` 欄に、親 skill 経由の目的がある。
- 対象 skill の `次の skill` 欄に、直接委譲条件がある。
- `amadeus-construction` の公開入口契約と矛盾しない。
- source skill と昇格先成果物の説明が整合している。
- 周辺 skill の確認結果が記録されている。

## Bolt 分割方針

- B001 は実装後案内を扱う。
- B002 は検証後案内を扱う。
- B003 は source skill、昇格先成果物、周辺 skill の整合確認を扱う。

## Construction への引き継ぎ

- Functional Design では、詳細な文面方針と検証観点を確定する。
- Task Generation では、対象 skill ごとに文面更新と整合確認を Task 化する。
- 実装では、source skill を更新し、必要な手順で昇格先成果物へ反映する。
- 検証では、対象 Intent validator、必要な typecheck、diff check、文面確認を実行する。
