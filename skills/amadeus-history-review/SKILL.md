---
name: amadeus-history-review
description: >-
  Amadeus の内部 skill。`.amadeus/` の過去成果物、Issue、PR、CI 結果を読み取り専用で分析し、
  再利用判断、未確認事項、繰り返し問題、後続候補を抽出する。成果物更新や Issue 作成は行わず、
  必要に応じて `amadeus-learning-review` または `amadeus-discovery dry-run` へ渡す分析結果を返す。
---

# amadeus-history-review

## 目的

`.amadeus/` の過去成果物を読み取り専用で横断分析し、現在の判断に使える再利用情報と不足情報を返す。

この skill は過去分析の入口である。
成果物を更新せず、GitHub Issue を作成せず、Intent Record を作成せず、Domain Map と Context Map へ自動昇格しない。

## 入力

- 検証対象の作業ディレクトリ。
- 対象 Intent または対象テーマ。
- 任意の Issue、PR、CI 結果。
- `.amadeus/` の steering layer。
- `.amadeus/` の Intent layer。
- 直近の validator 結果または eval 結果。

入力が不足する場合は、不足項目を分析結果の未確認事項へ残す。
不足を理由に成果物を推測で作らない。

## 読み取り対象

優先して読む成果物:

- `.amadeus/README.md`
- `.amadeus/steering.md`
- `.amadeus/steering/objective.md`
- `.amadeus/steering/product.md`
- `.amadeus/steering/tech.md`
- `.amadeus/steering/structure.md`
- `.amadeus/glossary.md`
- `.amadeus/domain-map.md`
- `.amadeus/context-map.md`
- `.amadeus/intents.md`
- `.amadeus/intents/**/state.json`
- `.amadeus/intents/**/ideation/ideation.md`
- `.amadeus/intents/**/ideation/traceability.md`
- `.amadeus/intents/**/inception/requirements.md`
- `.amadeus/intents/**/inception/traceability.md`
- `.amadeus/intents/**/construction/**`

必要な場合だけ読む補助情報:

- GitHub Issue。
- PR とレビューコメント。
- CI 結果。
- validator 結果。
- evaluator 結果。
- Skill Contract。

## 抽出結果

分析結果は次の項目に分ける。

| 項目 | 内容 | 主な渡し先 |
|---|---|---|
| 再利用判断 | 既存成果物や判断を現在の作業に再利用できるか。 | phase skill |
| 未確認事項 | 現在の証拠だけでは確定できない事項。 | `amadeus-grilling`、phase skill |
| 繰り返し問題 | 複数の Intent、Issue、PR、CI 結果にまたがる問題。 | `amadeus-learning-review` |
| 前段 feedback 候補 | 現在 Intent の成功条件を妨げる前段成果物の不足や矛盾。 | `amadeus-learning-review` |
| steering knowledge 候補 | steering layer へ反映する可能性がある知識。 | `amadeus-learning-review` |
| Domain Map 候補 | 共有境界として採用検討が必要な内容。 | `amadeus-learning-review` |
| Context Map 候補 | コンテキスト間依存として採用検討が必要な内容。 | `amadeus-learning-review` |
| 後続 Issue 候補 | 現在 Intent の成功条件外だが小さく追跡できる課題。 | 人間判断 |
| 後続 Intent 候補 | 独立した Intent として扱う大きさの課題。 | 人間判断 |
| 不採用メモ | 今回は扱わない理由がある事項。 | phase skill |

Domain Map と Context Map は候補を扱わず、承認済みの `adopted` と `retired` の現在の索引だけを扱う。
そのため、Domain Map 候補と Context Map 候補は分析結果として報告し、Domain Map と Context Map へ自動昇格しない。

## 出力

出力は Markdown の報告として返す。

最低限、次を含める。

- 分析対象。
- 読み取った成果物。
- 抽出結果。
- 根拠。
- 未確認事項。
- 推奨される次の skill。

機械向け JSON が必要な場合は、現在の分析結果に後続 Issue 候補として残す。

## 次の skill

学習先分類が必要な場合は `amadeus-learning-review` へ渡す。

Discovery の候補表示に使う場合は、`amadeus-discovery dry-run` の入力として渡す。
ただし `amadeus-discovery` は過去分析そのものを所有しない。

人間判断が必要な場合は、呼び出し元 phase skill が `amadeus-grilling` へ handoff する。
`amadeus-history-review` は質問を実行しない。

## 境界

所有するもの:

- 読み取り対象の選定。
- 過去成果物の分析。
- 抽出結果の分類前整理。
- 根拠の整理。

所有しないもの:

- 成果物更新。
- GitHub Issue 作成。
- Intent Record 作成。
- PR 作成。
- Domain Map と Context Map への自動昇格。
- 学習先分類の最終判断。
- `amadeus-discovery dry-run` の候補表示本体。
- `amadeus-grilling` の質問実行。

## 検証境界

validator の `pass` は、実行時に参照できる最低限の構造条件を満たすという意味であり、内容承認ではない。
evaluator の結果は品質評価であり、採用先は phase skill または人間判断で分類する。

## 禁止事項

- 成果物を更新しない。
- GitHub Issue を作成しない。
- Intent Record を作成しない。
- Domain Map と Context Map へ自動昇格しない。
- 質問を実行しない。
- 現在 Intent の成功条件外の課題を、現在成果物へ混ぜない。
