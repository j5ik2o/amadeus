---
name: amadeus-intent-init
description: Amadeus steering layer が存在する workspace で、新しい Intent の入れ物だけを初期化する。`.amadeus/intents.md` への登録、`.amadeus/intents/<intent-id>/intent.md`、`state.json` の作成が必要な場面では必ず使う。Ideation、requirements、use-cases、units、bolts、domain model を作るための skill ではない。
---

# amadeus-intent-init

## 目的

新しい Intent の最低限の入れ物を作る。

この skill は steering layer の上に、1つの Intent を登録するだけである。
Ideation、要求、ユースケース、ユニット、ボルト、タスク、ドメインモデルは作らない。

この skill は開発中スキルとして扱う。
eval と手動レビューを通るまで、昇格済み skill として扱わない。

## 前提

`.amadeus/` の steering layer が存在することを前提にする。

少なくとも次が存在しない場合は、作業を止めて `amadeus-steering` を案内する。

- `.amadeus/README.md`
- `.amadeus/steering.md`
- `.amadeus/objective.md`
- `.amadeus/actors.md`
- `.amadeus/glossary.md`
- `.amadeus/domain/subdomains.md`
- `.amadeus/domain/bounded-contexts.md`
- `.amadeus/intents.md`

この skill は、欠けている steering layer 成果物を作らない。

## 入力

- 検証対象の作業ディレクトリ。
- Intent の題材または目的。
- Intent ID。未指定なら、現在日付と題材から `YYYYMMDD-<slug>` を提案する。
- 依存する既存 Intent。なければ `なし`。
- 実行モード。指定がなければ `guided` にする。

Intent ID は、`.amadeus/intents.md` の `識別子` と同じ値にする。
既存 Intent ID と重複してはいけない。

## 実行モード

### `guided`

既定モード。
作成前に、Intent 登録に必要な不足だけを質問する。

質問は `/amadeus-grilling` を使って行う。
複数の論点が残っている場合でも、一度に並べず一問ずつ質問する。
質問総数は最大4つにする。
既存資料や会話から分かることは質問しない。

質問候補は次である。

- Intent の目的は何か。
- Intent ID は提案どおりでよいか。
- 依存する既存 Intent はあるか。
- `intent.md` の成功条件や範囲に最低限入れる制約はあるか。

Intent ID が未指定の場合は、質問の前に提案 ID と理由を示す。
提案 ID は `YYYYMMDD-<slug>` にする。
`<slug>` は英小文字、数字、ハイフンだけで書く。

質問した場合は、その場で成果物を作らず、ユーザーの回答を待つ。
回答を受け取ってから Intent の入れ物を作る。

### `scaffold-only`

ユーザーが明示した場合だけ使う。
質問せず、与えられた情報だけで Intent の入れ物を作る。

Intent ID を決められない場合は作業を止める。
Intent ID なしで `未確認` のディレクトリ名を作らない。

不足している目的、成功条件、範囲は `未確認` として `intent.md` に残す。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>/intent.md`
- `.amadeus/intents/<intent-id>/state.json`

`state.json` は次の形にする。

```json
{
  "intent": "<intent-id>",
  "phase": "initialized",
  "status": "in_progress",
  "initialized": {
    "status": "completed",
    "createdArtifacts": [
      "intent.md",
      "state.json"
    ],
    "next": "ideation"
  }
}
```

`initialized` は、Intent が登録済みで、まだ Ideation 成果物を持たない状態である。

## `intent.md`

`intent.md` は次の見出しを持つ。

- `目的`
- `成功条件`
- `範囲`

分からない項目は空欄にせず、`未確認` と書く。

`範囲` では、分かっている場合だけ含めるもの、含めないものを書く。
まだ分からない場合は、次のように書く。

```md
## 範囲

含めるもの:

- 未確認

含めないもの:

- 未確認
```

## `intents.md`

`intents.md` の `一覧` に、対象 Intent の行を1つ追加する。

| 列 | 書き方 |
|---|---|
| `識別子` | `<intent-id>` |
| `概要` | Intent の目的を短く書く。未確認なら `未確認` と書く。 |
| `依存` | 依存する Intent ID、または `なし`。 |
| `詳細` | `[<intent-id>/intent.md](intents/<intent-id>/intent.md)` |

`依存関係` に、対象 Intent の依存行を1つ追加する。

| 列 | 書き方 |
|---|---|
| `インテント` | `<intent-id>` |
| `依存` | 依存する Intent ID、または `なし`。 |
| `理由` | 依存理由。依存がなければ単独で成立する理由を書く。未確認なら `未確認` と書く。 |

既存行は並べ替えない。
既存の Intent ID、依存、詳細リンクを書き換えない。

## 検証

作成後に次を確認する。

1. `state.json` が JSON として解釈できる。
2. `.amadeus/intents.md` に追加した詳細リンクが存在する。
3. 昇格済みの `amadeus-execution-validator` が使える場合は、全体成果物を検証する。
4. 昇格済みの `amadeus-execution-validator` が `initialized` phase に対応している場合は、対象 Intent ID を指定して検証する。

## 禁止事項

- `.amadeus/` の steering layer を作らない。
- `scope.md`、`ideation.md`、`traceability.md`、`decisions.md`、`mocks/` を作らない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- `domain/**` を作らない。
- Intent ID を重複させない。
- 既存の Intent 行を根拠なく変更しない。
- 依存先が存在しない Intent ID を書かない。
- repo の開発用文書や開発用スクリプトを実行時参照として書かない。

## 次の skill

- Intent の Ideation 成果物を作る場合: `amadeus-intent-ideation`
- steering layer が不足している場合: `amadeus-steering`
- 成果物の構造を検証する場合: `amadeus-execution-validator`
