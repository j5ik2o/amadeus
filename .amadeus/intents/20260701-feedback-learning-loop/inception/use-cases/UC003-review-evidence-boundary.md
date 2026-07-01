# UC003: 証拠と decision review の境界を確認する

## システム境界

- ACT003 Reviewer が、validator、evaluator、decision review、学習分類の責務が混ざっていないか確認する。

## 事前条件

- 発見または学習候補に、validator 結果、evaluator 結果、review comment、phase 成果物のいずれかの根拠が含まれている。
- Issue #257 の decision review が関連論点として参照されている。

## 基本フロー

1. Reviewer は、validator 結果を構造検出として扱っているか確認する。
2. Reviewer は、evaluator 結果を品質評価として扱っているか確認する。
3. Reviewer は、再利用可能な知見だけが学習候補として扱われているか確認する。
4. Reviewer は、Issue #257 の decision review が質問起動条件を扱い、この Intent が分類先を扱うことを確認する。
5. 境界が混ざっている場合、Reviewer は現在 Intent 修正または後続 Issue 候補として分類する。

## 代替フロー

- validator の `pass` を内容承認として扱っている場合は、現在 Intent の修正対象に戻す。
- decision review の起動条件が未確定の場合は、Issue #257 の成果物を参照する後続確認事項として残す。

## 事後条件

- validator、evaluator、learning candidate、decision review の責務が分けられている。
- Issue #257 と Issue #259 の責務境界が traceability と decisions に残っている。

## BCE候補

| 種別 | 候補 | 責務 |
|---|---|---|
| 境界 | evidence review | 証拠と評価結果を確認対象として受け取る。 |
| 制御 | evidence boundary check | 構造検出、品質評価、学習候補、decision review を分ける。 |
| エンティティ | evidence classification | 証拠種別、判断材料、反映先を保持する。 |

## 責務候補

| 候補 | 判断 | 保持 | 依頼 |
|---|---|---|---|
| validator | 実行時に参照できる構造条件を検出する。 | pass、fail、blocked と不足内容。 | 内容承認は人間判断へ渡す。 |
| evaluator | 成果物内容の説明不足や論理不整合を評価する。 | 評価結果と根拠。 | 学習候補化は Maintainer 判断へ渡す。 |
| decision review | 判断ノードの不明瞭さと質問要否を判断する。 | 再評価した判断ノード。 | 分類先判断は learning loop へ渡す。 |
