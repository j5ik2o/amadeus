# Unit Design Brief

## 概要

この文書は Unit Design Brief である。
Inception では、Unit の課題解決方針を定め、Bolt 分割と Construction へ渡す設計入力だけを扱う。
詳細な Domain Design、Logical Design、実装設計、テスト設計は Construction で確定する。

## 設計戦略

- `amadeus-construction` には、Construction 全体の検証観点として完了時表要件を追加する。
- `amadeus-construction-traceability-finalization` には、追跡と状態確定の手順として `Construction からの追跡` 表の作成または補修を追加する。
- 必須列を validator の既存契約と同じ `ボルト`、`タスク`、`証拠`、`状態` として扱う。

## 責務境界

- 所有するもの: Construction finalization skill の追跡表 guidance。
- 所有しないもの: validator の成果物契約変更、Issue #233 の成果物再設計。
- 依存してよいもの: Issue #245、PR #244、validator eval、既存 traceability 成果物。
- 後続で再確認が必要になる条件: template または example に同じ表要件を反映する場合。

## 構成候補

- Public Construction Skill Guidance
- Traceability Finalization Procedure
- Completed Construction Trace Table Requirement
- Task Generation Trace Difference

## データと契約候補

- 入力候補: Issue #245、Ideation 成果物、codebase-analysis.md、validator eval。
- 出力候補: source skill と昇格先 skill の説明差分。
- 状態候補: `in_progress`、`completed`、`passed`。
- 事前条件候補: Ideation gate passed、既存 skill と validator eval が読めること。
- 事後条件候補: skill から完了時表要件、必須列、Task Generation 表との違いを判断できること。
- 不変条件候補: validator の成果物契約をこの Unit で変更しないこと。

## 検証観点

- 対象 Intent の validator が pass する。
- `npm run typecheck` が pass する。
- `npm run diff:check` が pass する。
- 必要に応じて `npm run test:all` が pass する。

## Bolt 分割方針

- B001 で Construction finalization skill guidance を更新する。
- B002 は U001 の guidance を前提に、template、example、source skill と昇格先成果物の整合を確認する。

## Construction への引き継ぎ

- Domain Design で確定する事項: なし。
- Logical Design で確定する事項: skill のどの見出しへ表要件を書くか。
- 実装時に確認する事項: source skill と昇格先成果物の差分、template eval の期待見出し。
- 検証時に確定する事項: validator、typecheck、diff check、必要な test all の結果。
