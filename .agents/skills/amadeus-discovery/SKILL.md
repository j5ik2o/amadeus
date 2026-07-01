---
name: amadeus-discovery
description: >-
  Amadeus steering layer が存在する workspace で、Ideation の前に入力テーマを Discovery として整理する。
  課題サイズが曖昧、大きい、または既存 Intent との関係が不明な場合に、`.amadeus/discoveries.md`、
  `.amadeus/discoveries/<discovery-id>.md`、`state.json` を作成または補修する場面では必ず使う。
  Amadeus 自身を変更対象にする自己開発の入力整理も、`self-development` mode として同じ Discovery 成果物に記録する。
  Requirement、Use Case、Unit、Bolt、Task、実装方針を作るための skill ではない。
---

# amadeus-discovery

## 目的

Ideation で Intent Record を作る前の入力テーマを Discovery として整理する。

この skill は、入力テーマをそのまま Intent Record 化しない。
課題粒度、既存 Discovery との重複、既存 Intent との関係、Intent 化方針を確認し、次に使う入口を判定する。

この skill は Ideation の任意前処理である。
課題サイズが明確な場合は `amadeus-ideation` を使う。

Amadeus 自身の変更要望を扱う場合も、この skill の `self-development` mode で整理する。
自己開発向けに別 skill、別成果物、別 `state.json.decision` を作らない。

## 前提

`.amadeus/` の steering layer が存在することを前提にする。

少なくとも次が存在しない場合は、作業を止めて `amadeus-steering` を案内する。

- `.amadeus/README.md`
- `.amadeus/steering.md`
- `.amadeus/steering/objective.md`
- `.amadeus/steering/product.md`
- `.amadeus/steering/tech.md`
- `.amadeus/steering/structure.md`
- `.amadeus/steering/actors.md`
- `.amadeus/glossary.md`
- `.amadeus/domain-map.md`
- `.amadeus/context-map.md`
- `.amadeus/intents.md`

`.amadeus/discoveries.md` が存在しない場合は、この skill が作成してよい。

## 入力

- 検証対象の作業ディレクトリ。
- 入力テーマ。
- Discovery のモジュールディレクトリ名。未指定なら、現在日付と入力テーマから `YYYYMMDD-<slug>` を提案する。
- 実行モード。指定がなければ `guided` にする。

Discovery のモジュールディレクトリ名は、`.amadeus/discoveries.md` の `識別子` と同じ値にする。
既存 Discovery のモジュールディレクトリ名と重複してはいけない。

## 既存成果物の確認

作成前に、既存 Discovery を確認する。

- `.amadeus/discoveries.md`
- `.amadeus/discoveries/*.md`
- `.amadeus/discoveries/*/state.json`

同じテーマ、近いテーマ、未完了 Discovery がある場合は、新規作成ではなく既存 Discovery の再開または補修を優先する。

作成前に、既存 Intent も確認する。

- `.amadeus/intents.md`
- `.amadeus/intents/*.md`
- `.amadeus/intents/*/state.json`

必要な場合だけ、関連しそうな既存 Intent の `ideation/scope.md`、`inception/requirements.md`、`inception/traceability.md` を読む。
Discovery は Ideation や Inception の代替ではない。

## テンプレート

成果物を新規作成する場合は、テンプレートを使う。

優先順位は次である。

1. `.amadeus/settings/templates/discoveries/discovery.md` と `.amadeus/settings/templates/discoveries/discovery/`
2. この skill に同梱された `templates/discoveries/discovery.md` と `templates/discoveries/discovery/`

テンプレートの `<...>` は、確認済みの値または `未確認` に置き換える。
Discovery のモジュールディレクトリ名だけは `未確認` にせず、作成前に確定する。

## 実行モード

### `guided`

既定モード。
作成前に、Discovery 判定に必要な不足だけを質問する。

質問は `amadeus-grilling` を使って行う。
複数の論点が残っている場合でも、一度に並べず一問ずつ質問する。
質問数の目安は5問にする。
目安を超えても、Discovery 判定に必要な判断が未確定であれば質問を続ける。
目安を超えて質問を続ける場合は、追加確認が必要な理由を短く示す。
既存資料や会話から分かることは質問しない。

質問対象は次である。

- 入力テーマの課題。
- 利用者または影響対象。
- 成功状態。
- 除外範囲。
- 既存 Discovery との関係。
- 既存 Intent との関係。
- Intent として大きすぎるか。
- Intent 候補間の依存順序。
- 最初に Intent 化すべき候補。

質問対象外は次である。

- Requirement 詳細。
- Use Case 詳細。
- Unit Design Brief。
- Bolt 分割。
- Task 分解。
- 実装方針。

質問した場合は、その場で成果物を作らず、ユーザーの回答を待つ。
回答に記録対象の判断が含まれる場合は、Discovery 成果物への反映と同じ変更で `grillings.md` と `grillings/Gxxx-*.md` を更新する。
記録対象は成果物の意味や後続判断に影響する質問と回答だけにする。

### `self-development`

Amadeus 自身の変更要望を Intent 化する前に使う。
GitHub Issue、会話、docs 点検、validator 結果、example 検証、CI 結果を入力テーマとして整理し、通常の Discovery と同じ成果物へ記録する。

不足確認の進め方は `guided` と同じである。
既存資料や会話から分かることは質問せず、Discovery 判定に必要な不足だけを `amadeus-grilling` で一問ずつ確認する。
質問した場合は、その場で成果物を作らず、ユーザーの回答を待つ。
回答に記録対象の判断が含まれる場合は、Discovery 成果物への反映と同じ変更で `grillings.md` と `grillings/Gxxx-*.md` を更新する。

`gate: passed` にするには、通常の Gate 条件と同じく、grilling で確認した前提、または既存資料から確認できる前提が `確認した前提` に記録されている必要がある。
不足が残る場合は `gate: not_ready` とし、`推奨次アクション` に `amadeus-grilling` 継続を記録する。

この mode は、Discovery の成果物契約を増やさない。
`state.json.decision` は既存値だけを使い、`self_development_intent` のような値を追加しない。
自己開発かどうかは、Intent 化判断ではなく入力テーマの分類として扱う。

自己開発固有の情報は、既存見出しに記録する。

| 観点 | 記録先 |
|---|---|
| 入力元 | `確認した前提` |
| 対象分類 | `確認した前提` |
| 変更対象領域 | `判定理由` または `Intent 候補` |
| 既存 Intent との関係 | `既存 Intent との関係` |
| Intent 候補 | `Intent 候補` |
| 最初に進める候補 | `候補判断` と `推奨次アクション` |

少なくとも次を確認する。

- 入力元が GitHub Issue、会話、docs 点検、validator 結果、example 検証、CI 結果のどれか。
- 対象が Amadeus DLC 契約か、Amadeus 実装か。
- 変更対象領域が lifecycle 契約、skill、template、validator、eval、example、docs、domain、release、昇格手順のどれか。
- 既存 Intent 更新か、新規 Intent か、複数 Intent か。
- Intent 化前に steering、domain、Codebase Analysis が必要か。
- `multi_intent` の場合は、最初に進める `recommended` 候補が1件だけ選ばれているか。

`multi_intent` で複数候補を記録する場合、最初に進める候補だけを `recommended` とし、他の候補は依存順、待機理由、または分離理由を `候補判断` に書く。

### `scaffold-only`

ユーザーが明示した場合だけ使う。
質問せず、与えられた情報だけで Discovery 成果物を作る。

不足している前提、判定理由、候補判断は `未確認` として残す。
`gate` は `not_ready` にする。

### `repair`

既存 Discovery 成果物の見出し、リンク、`state.json`、`.amadeus/discoveries.md` の対応だけを補修する。
既存の `grillings.md` または `grillings/Gxxx-*.md` が存在し、構造だけが壊れている場合は、Grilling Decision Trail の索引、session ファイル名、必須見出し、表列、相対リンク、状態、反映先、判断 ID、置き換え先、質問記録の参照だけを補修してよい。

判定内容を推測で変更しない。

## 成果物

作成または更新するものは次だけである。

- `.amadeus/discoveries.md`
- `.amadeus/discoveries/<discovery-id>.md`
- `.amadeus/discoveries/<discovery-id>/state.json`
- 記録対象の質問と回答が発生した場合だけ、`.amadeus/discoveries/<discovery-id>/grillings.md`
- 記録対象の質問と回答が発生した場合だけ、`.amadeus/discoveries/<discovery-id>/grillings/Gxxx-*.md`

Requirement、Use Case、Unit、Bolt、Task は作らない。
`amadeus-ideation` は自動実行しない。

`state.json` は次の形にする。

```json
{
  "schemaVersion": 1,
  "phase": "discovery",
  "status": "in_progress",
  "decision": "undecided",
  "gate": "not_ready"
}
```

`status` は次のいずれかにする。

- `in_progress`
- `completed`

`gate` は次のいずれかにする。

- `not_ready`
- `passed`

`decision` は次のいずれかにする。

- `single_intent`
- `multi_intent`
- `existing_intent_update`
- `research_only`
- `no_intent`
- `undecided`

`state.json` に Intent へのリンクや Intent 候補の状態は持たせない。

## `Discovery のモジュールファイル`

`Discovery のモジュールファイル` は次の見出しを持つ。

- `入力テーマ`
- `確認した前提`
- `判定`
- `判定理由`
- `Intent Draft`
- `Intent 候補`
- `候補判断`
- `既存 Intent との関係`
- `推奨次アクション`

対象外の見出しには `該当なし` と書く。
空欄にはしない。

`state.json.decision` と `Discovery のモジュールファイル` の `判定` は一致させる。

## `discoveries.md`

`.amadeus/discoveries.md` の `一覧` に、対象 Discovery の行を1つ追加する。

| 列 | 書き方 |
|---|---|
| `識別子` | `<discovery-id>` |
| `テーマ` | 入力テーマを短く書く。 |
| `状態` | `in_progress` または `completed`。 |
| `判定` | `state.json.decision` と同じ値を書く。 |
| `推奨次アクション` | 次に使う skill、または no-action 理由を書く。 |
| `詳細` | `[Discovery のモジュールファイル](discoveries/<discovery-id>.md)` |

既存行は並べ替えない。

## Gate 条件

Discovery が `gate: passed` になるには、次を満たす必要がある。

- 入力テーマが記録されている。
- grilling で確認した前提が記録されている。
- `decision` が `undecided` ではない。
- 判定理由が書かれている。
- 推奨次アクション、または no-action 理由が書かれている。

判定ごとの追加条件は次である。

| decision | 追加条件 | 推奨次アクション |
|---|---|---|
| `single_intent` | `Intent Draft` がある。 | `amadeus-ideation` に Intent Draft を渡す。 |
| `multi_intent` | Intent 候補が2件以上あり、Intent Record 作成前なら `recommended` が1件だけある。 | `recommended` の Intent 候補を `amadeus-ideation` に渡す。 |
| `existing_intent_update` | 対象既存 Intent が1件だけある。 | 対象 Intent の該当 phase skill を使う。 |
| `research_only` | 調査論点が記録されている。 | `amadeus-grilling` 継続または none。 |
| `no_intent` | Intent にしない理由が記録されている。 | none。 |
| `undecided` | `gate: passed` にできない。 | `amadeus-grilling` 継続。 |

## 禁止事項

- Requirement を定義しない。
- Use Case を定義しない。
- Unit を定義しない。
- Bolt を分割しない。
- Task を分解しない。
- 実装方針を決めない。
- `amadeus-ideation` を自動実行しない。
- `.amadeus/intents/**` 配下に Discovery を置かない。
- `docs/**` に Discovery 成果物を置かない。

## 検証

作成後に次を確認する。

1. `state.json` が JSON として解釈できる。
2. `.amadeus/discoveries.md` に追加した詳細リンクが存在する。
3. 昇格済みの `amadeus-validator` が使える場合は、全体成果物を検証する。

## 次の skill

- Discovery から Intent Record を作る場合: `amadeus-ideation`
- Discovery の不足論点を確認する場合: `amadeus-grilling`
- 成果物の構造を検証する場合: `amadeus-validator`
