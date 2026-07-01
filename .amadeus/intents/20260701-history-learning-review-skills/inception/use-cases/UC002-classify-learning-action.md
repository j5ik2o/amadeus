# UC002: 学習先を分類する

## システム境界

- Agent は `amadeus-learning-review` を使い、過去分析結果、validator 結果、evaluator 結果、Issue、PR、CI 結果を学習先へ分類する。
- `amadeus-learning-review` は分類と戻り先を返すが、成果物更新や Issue 作成を直接行わない。

## 事前条件

- `amadeus-history-review` の分析結果、または validator、evaluator、Issue、PR、CI のいずれかの入力がある。
- Issue #259 の分類契約を参照できる。

## 基本フロー

1. Agent は入力証拠の種類と根拠を確認する。
2. `amadeus-learning-review` は入力が現在 phase 修正、上流戻し、Steering knowledge 候補、Domain Map 候補、Context Map 候補、後続 Issue 候補、後続 Intent 候補、非採用のどれに当たるかを分類する。
3. 分類に人間判断が必要な場合、`amadeus-learning-review` は `amadeus-grilling` へ渡す質問候補を返す。
4. 成果物更新が必要な場合、`amadeus-learning-review` は対象 phase skill または内部 stage skill を戻り先として返す。
5. 後続化が必要な場合、`amadeus-learning-review` は GitHub Issue 候補または Ideation 入力候補として返す。

## 代替フロー

- validator 結果だけでは内容承認に足りない場合、構造検出として分類し、人間判断または phase skill へ渡す。
- Domain Map または Context Map 候補の場合、候補を直接書き込まず、承認済み stage 成果物へ渡す候補として返す。

## 事後条件

- 学習先分類と根拠が説明できる。
- 成果物更新、Issue 作成、自動昇格は行われていない。

## BCE候補

| 種別 | 候補 | 責務 |
|---|---|---|
| 境界 | learning review | 分析結果や検証結果を分類対象として受け取る。 |
| 制御 | learning classification | Issue #259 の分類契約に従って学習先を決める。 |
| エンティティ | learning action | 分類、根拠、戻り先、質問候補を保持する。 |

## 責務候補

| 候補 | 判断 | 保持 | 依頼 |
|---|---|---|---|
| `amadeus-learning-review` | 学習先分類と戻り先を決める。 | 分類結果、根拠、質問候補。 | 質問を `amadeus-grilling`、更新を phase skill へ渡す。 |
