# UC001 未 finalize の Intent を検出する

## ユースケース

Agent が同梱スクリプトを実行し、対象 workspace の未 finalize の Intent を列挙する。

## アクター

- ACT002 Agent

## 外部システム

- なし

## 事前条件

- 対象 workspace が基準 branch 由来の checkout である。
- `.amadeus/intents/` 配下の成果物と `state.json` を読める。
- 検出スクリプトが検証（eval）で確認され、昇格先成果物として同期されている。

## 基本フロー

1. Agent は、対象 workspace を指定して同梱スクリプトを実行する。
2. スクリプトは、各 Intent の `state.json` と Bolt 成果物を読み、実装済みかつ検証済みで `pr.md` がなく `construction.gate` が `passed` でない Intent を列挙する。
3. Agent は、検出結果を後続の判断（UC002）の入力証拠として扱う。

## 代替フロー

| 条件 | 扱い |
|---|---|
| 未 finalize の Intent が存在しない。 | 検出なしとして報告し、通常の判定へ戻る。 |
| 対象 workspace に `.amadeus/intents/` がない。 | 対象外として報告し、処理を終える。 |

## 対応要求

- R001
- R002
- R004

## 未確認事項

- なし。
