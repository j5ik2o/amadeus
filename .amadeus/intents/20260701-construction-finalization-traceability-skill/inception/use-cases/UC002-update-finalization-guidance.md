# UC002: finalization guidance を更新する

## システム境界

- Agent が特定した契約に基づき、Construction finalization skill の説明を更新する。

## 事前条件

- UC001 で `Construction からの追跡` 表要件、必須列、Task Generation 表との違いが整理されている。

## 基本フロー

1. Agent は `amadeus-construction` の検証説明へ、完了済み Construction の追跡表要件を追加する。
2. Agent は `amadeus-construction-traceability-finalization` の手順へ、`Construction からの追跡` 表の作成または補修を追加する。
3. Agent は source skill と昇格先成果物の同じ箇所に契約を反映する。
4. Agent は template または example の更新要否を確認する。
5. Agent は対象 Intent の validator と標準検証を実行する。

## 代替フロー

- source skill だけを更新し、昇格先成果物を更新しない場合は、昇格を別 Bolt に分ける理由を残す。

## 事後条件

- skill 説明から、完了済み Construction に必要な追跡表と必須列を判断できる。

## BCE候補

| 種別 | 候補 | 責務 |
|---|---|---|
| 境界 | Skill Documentation | agent が実行時に読む手順を提供する。 |
| 制御 | Guidance Update | source skill と昇格先成果物の整合を保つ。 |
| エンティティ | Skill Contract Text | 表要件、必須列、対象外を表す。 |

## 責務候補

| 候補 | 判断 | 保持 | 依頼 |
|---|---|---|---|
| Guidance Synchronization | 採用 | source skill と昇格先成果物の対応 | template と example の確認 |
