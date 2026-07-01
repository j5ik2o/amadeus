# R001: 過去成果物の読み取り専用分析

## 要求

- `amadeus-history-review` は、`.amadeus/` の過去成果物を横断して読む内部 skill として定義されている。
- `amadeus-history-review` は、成果物更新、GitHub Issue 作成、Intent Record 作成、Domain Map、Context Map、Steering knowledge への自動昇格を行わない。
- 読み取り対象には Discovery、Intent、grillings、decisions、traceability、学習候補、未確認事項、notes、test-results、pr、Steering knowledge、Domain Map、Context Map が含まれる。

## 受け入れ条件

- `amadeus-history-review` の入力対象が skill 本文で説明されている。
- `amadeus-history-review` が読み取り専用であることが説明されている。
- `amadeus-history-review` が自動更新と自動昇格を行わないことが説明されている。

## 根拠

- [Issue #277](https://github.com/amadeus-dlc/amadeus/issues/277)
- [Issue #259](https://github.com/amadeus-dlc/amadeus/issues/259)
- [scope.md](../../ideation/scope.md)

## 未確認事項

- 読み取り対象のうち、初期 Construction で必須にする範囲と推奨にする範囲は Construction で確認する。
