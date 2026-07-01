# UC001: traceability 契約を特定する

## システム境界

- Agent が既存 skill、validator eval、template、example を読み、Construction finalization の traceability 契約を特定する。

## 事前条件

- Issue #245 と Ideation 成果物が存在する。
- source skill と昇格先成果物を読める。
- validator eval を読める。

## 基本フロー

1. Agent は `amadeus-construction` と `amadeus-construction-traceability-finalization` の説明を読む。
2. Agent は validator eval にある `Construction からの追跡` 表の要求を読む。
3. Agent は template と example の `construction/traceability.md` を確認する。
4. Agent は skill 説明で不足している表要件と必須列を整理する。
5. Agent は `Task Generation からの追跡` と `Construction からの追跡` の役割差を整理する。

## 代替フロー

- template または example がすでに契約と一致している場合は、更新対象から外し、理由を traceability または decision に残す。

## 事後条件

- Construction で更新する対象と、更新しない対象の理由が判断できる。

## BCE候補

| 種別 | 候補 | 責務 |
|---|---|---|
| 境界 | Construction finalization skill | 完了時の traceability 表要件を agent に伝える。 |
| 制御 | Traceability contract check | validator と skill 説明のずれを確認する。 |
| エンティティ | Traceability Table Requirement | 表見出し、必須列、状態条件を保持する。 |

## 責務候補

| 候補 | 判断 | 保持 | 依頼 |
|---|---|---|---|
| Contract Identification | 採用 | 必須表、必須列、対象外 | validator と template の確認 |
