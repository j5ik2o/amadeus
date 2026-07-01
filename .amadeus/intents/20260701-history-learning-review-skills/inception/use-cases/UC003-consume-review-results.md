# UC003: 分析結果を `dry-run` と検証に渡す

## システム境界

- Agent は `amadeus-discovery dry-run` が分析結果を入力にできるよう、責務境界を確認する。
- Agent は source skill、昇格先成果物、eval または text contract の同期と検証を確認する。

## 事前条件

- `amadeus-history-review` または `amadeus-learning-review` の責務が定義されている。
- `dry-run` は `.amadeus/` を更新しない候補表示 mode として扱われている。

## 基本フロー

1. Agent は `dry-run` が必要に応じて分析結果を入力にできることを確認する。
2. Agent は `dry-run` が過去分析と学習分類を所有しないことを確認する。
3. Agent は `dry-run` の表示対象を Intent 候補、分類、根拠、未確認事項、推奨次アクションに限定する。
4. Agent は追加した source skill を promote-skill で昇格先成果物へ反映する方針を確認する。
5. Agent は text contract または関連 eval で責務境界を検出できることを確認する。

## 代替フロー

- `dry-run` 側への説明追加を Issue #272 に残す場合、この Intent の Construction では内部 skill と検証観点だけを扱う。
- `amadeus-learning-review` を追加しない場合、同等責務を持つ内部 skill を追加しない理由を判断に残し、`dry-run` が参照する入力を再確認する。

## 事後条件

- `dry-run` と内部 skill の責務境界が説明できる。
- source skill、昇格先成果物、eval または text contract の検証方針が追跡できる。

## BCE候補

| 種別 | 候補 | 責務 |
|---|---|---|
| 境界 | dry-run consumer | 分析結果を候補表示の入力として受け取る。 |
| 制御 | skill synchronization check | source skill、昇格先成果物、text contract の整合を確認する。 |
| エンティティ | verification evidence | promote-skill、eval、validator の証拠を保持する。 |

## 責務候補

| 候補 | 判断 | 保持 | 依頼 |
|---|---|---|---|
| `amadeus-discovery dry-run` | 分析結果を入力として表示へ使う。 | Intent 候補、根拠、未確認事項。 | 過去分析と学習分類を内部 skill に依頼する。 |
