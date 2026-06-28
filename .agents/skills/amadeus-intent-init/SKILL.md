---
name: amadeus-intent-init
description: >-
  Amadeus steering layer が存在する workspace で、新しい Intent の入れ物だけを初期化する。`.amadeus/intents.md` への登録、
  `.amadeus/intents/<intent-id>-<slug>/intent.md`、`state.json` の作成が必要な場面では必ず使う。Ideation、requirements、use-cases、
  units、bolts、domain model を作るための skill ではない。
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
- Discovery Brief。Discovery から Intent を作る場合だけ指定する。
- Intent ディレクトリ名。未指定なら、現在日付と題材から `YYYYMMDD-<slug>` を提案する。
- 依存する既存 Intent。なければ `なし`。
- 実行モード。指定がなければ `guided` にする。

Intent ディレクトリ名は、`.amadeus/intents.md` の `識別子` と同じ値にする。
既存 Intent ディレクトリ名と重複してはいけない。

入力テーマが巨大または曖昧で、単一 Intent として扱えるか判断できない場合は、作業を止めて `amadeus-discovery` を案内する。
自動で Discovery を開始しない。

Discovery Brief が指定された場合は、先に対象 Discovery の `state.json` を読む。
`gate` が `passed` でない場合は停止する。
`decision` が `single_intent` の場合は `Intent Draft` を入力にする。
`decision` が `multi_intent` の場合は `recommended` の Intent 候補だけを入力にする。
待機候補を直接 Intent 化しない。

## テンプレート

Intent の入れ物を新規作成する場合は、テンプレートを使う。

優先順位は次である。

1. `.amadeus/settings/templates/intents/initialized/`
2. この skill に同梱された `templates/intents/initialized/`

`.amadeus/settings/templates/intents/initialized/` は、プロジェクト固有の上書きとして扱う。
存在しない場合は、`templates/intents/initialized/` の標準テンプレートを使う。
どちらもない場合は、作成前にテンプレート不足として止める。

テンプレートの `<...>` は、確認済みの値または `未確認` に置き換える。
Intent ディレクトリ名だけは `未確認` にせず、作成前に確定する。

## 実行モード

### `guided`

既定モード。
作成前に、Intent 登録に必要な不足だけを質問する。

質問は `/amadeus-grilling` を使って行う。
複数の論点が残っている場合でも、一度に並べず一問ずつ質問する。
質問数の目安は3問にする。
目安を超えても、Intent 登録に必要な判断が未確定であれば質問を続ける。
目安を超えて質問を続ける場合は、追加確認が必要な理由を短く示す。
既存資料や会話から分かることは質問しない。

質問候補は次である。

- Intent の目的は何か。
- Intent ディレクトリ名は提案どおりでよいか。
- 依存する既存 Intent はあるか。
- `intent.md` の成功条件や範囲に最低限入れる制約はあるか。

Intent ディレクトリ名が未指定の場合は、質問の前に提案ディレクトリ名と理由を示す。
提案ディレクトリ名は `YYYYMMDD-<slug>` にする。
`<slug>` は英小文字、数字、ハイフンだけで書く。

質問した場合は、その場で成果物を作らず、ユーザーの回答を待つ。
回答を受け取ってから Intent の入れ物を作る。
回答に記録対象の判断が含まれる場合は、Intent の入れ物作成と同じ変更で `grillings.md` と `grillings/Gxxx-*.md` を対象 Intent 配下に作る。

### `scaffold-only`

ユーザーが明示した場合だけ使う。
質問せず、与えられた情報だけで Intent の入れ物を作る。

Intent ディレクトリ名を決められない場合は作業を止める。
Intent ディレクトリ名なしで `未確認` のディレクトリ名を作らない。

不足している目的、成功条件、範囲は `未確認` として `intent.md` に残す。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/intents.md`
- `.amadeus/intents/<intent-id>-<slug>/intent.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`
- 記録対象の質問と回答が発生した場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings.md`
- 記録対象の質問と回答が発生した場合だけ、`.amadeus/intents/<intent-id>-<slug>/grillings/Gxxx-*.md`
- Discovery Brief から作成した場合は、対象 Discovery の `brief.md` と `.amadeus/discoveries.md`

`state.json` は次の形にする。

```json
{
  "intent": "<intent-id>-<slug>",
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
| `識別子` | `<intent-id>-<slug>` |
| `概要` | Intent の目的を短く書く。未確認なら `未確認` と書く。 |
| `依存` | 依存する Intent ディレクトリ名、または `なし`。 |
| `詳細` | `[<intent-id>-<slug>/intent.md](intents/<intent-id>-<slug>/intent.md)` |

`依存関係` に、対象 Intent の依存行を1つ追加する。

| 列 | 書き方 |
|---|---|
| `インテント` | `<intent-id>-<slug>` |
| `依存` | 依存する Intent ディレクトリ名、または `なし`。 |
| `理由` | 依存理由。依存がなければ単独で成立する理由を書く。未確認なら `未確認` と書く。 |

既存行は並べ替えない。
既存の Intent ディレクトリ名、依存、詳細リンクを書き換えない。

## 検証

作成後に次を確認する。

1. `state.json` が JSON として解釈できる。
2. `.amadeus/intents.md` に追加した詳細リンクが存在する。
3. 昇格済みの `amadeus-validator` が使える場合は、全体成果物を検証する。
4. 昇格済みの `amadeus-validator` が `initialized` phase に対応している場合は、対象 Intent ディレクトリ名を指定して検証する。
5. Discovery Brief から作成した場合は、対象 Discovery の更新後に全体成果物を検証する。

## 禁止事項

- `.amadeus/` の steering layer を作らない。
- `scope.md`、`ideation.md`、`traceability.md`、`decisions.md`、`mocks/` を作らない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- `domain/**` を作らない。
- Intent ディレクトリ名を重複させない。
- 既存の Intent 行を根拠なく変更しない。
- 依存先が存在しない Intent ディレクトリ名を書かない。
- `gate: passed` ではない Discovery Brief から Intent を作らない。
- `amadeus-discovery` を自動実行しない。
- repo の開発用文書や開発用スクリプトを実行時参照として書かない。

## 次の skill

- Intent の Ideation 成果物を作る場合: `amadeus-ideation`
- 入力テーマの粒度が曖昧な場合: `amadeus-discovery`
- steering layer が不足している場合: `amadeus-steering`
- 成果物の構造を検証する場合: `amadeus-validator`
