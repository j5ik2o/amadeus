---
name: amadeus-event-storming
description: >-
  Amadeus steering layer が存在する workspace で、Intent 作成前または Intent 配下の対象テーマを Event Storming
  として整理する。Domain Event、Process、Aggregate Candidate、Bounded Context Candidate、Hotspot を
  `.amadeus/event-storming/<event-storming-id>.md` と `.amadeus/event-storming/<event-storming-id>/`、または
  `.amadeus/intents/<intent-id>-<slug>/event-storming/<event-storming-id>.md` と
  `.amadeus/intents/<intent-id>-<slug>/event-storming/<event-storming-id>/` に作成または補修する場面では必ず使う。
  Requirement、Use Case、Unit、Bolt、Task、Aggregate、Bounded Context、実装を確定するための skill ではない。
---

# amadeus-event-storming

## 目的

Domain Event を起点に、人間からドメイン上の事実、順序、原因、判断待ちを引き出す。

この skill は lifecycle phase を進めない。
Discovery、Ideation、Inception、Domain Modeling が参照できる Event Storming 分析成果物を作る。

Event Storming で扱う Event は Domain Event だけである。
UI event、technical event、integration event、log event は Domain Event として扱わず、必要なら `hotspots.md` または `flow.md` の補足に残す。

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
- `.amadeus/discoveries.md`
- `.amadeus/intents.md`

Intent 配下に作る場合は、対象 Intent の次も存在することを確認する。

- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/state.json`

## 入力

- 検証対象の作業ディレクトリ。
- 対象テーマまたは対象シナリオ。
- scope。未指定なら、Intent が明示されていない場合は `pre-intent`、Intent が明示されている場合は `intent-scoped` にする。
- level。未指定なら `big-picture` にする。
- Event Storming セッション ID。未指定なら `ESnnn-<slug>` を提案する。
- 実行モード。指定がなければ `guided` にする。

scope は次のいずれかにする。

- `pre-intent`
- `intent-scoped`

level は次のいずれかにする。

- `big-picture`
- `process-modeling`
- `system-design`

1回の実行で主対象にする level は1つだけにする。
ただし、同じ Event Storming ディレクトリ内で level を進める。

## 既存成果物の確認

作成前に、既存 Event Storming を確認する。

- `.amadeus/event-storming/*.md`
- `.amadeus/event-storming/*/state.json`
- `.amadeus/intents/*/event-storming/*.md`
- `.amadeus/intents/*/event-storming/*/state.json`

同じ対象シナリオ、近い対象シナリオ、未完了 Event Storming がある場合は、新規作成ではなく既存 Event Storming の再開または補修を優先する。

関連しそうな Discovery または Intent がある場合だけ、次を読む。

- `.amadeus/discoveries/<discovery-id>.md`
- `.amadeus/intents/<intent-id>-<slug>.md`
- `.amadeus/intents/<intent-id>-<slug>/ideation/scope.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/inception/traceability.md`

## テンプレート

成果物を新規作成する場合は、テンプレートを使う。

優先順位は次である。

1. `.amadeus/settings/templates/event-storming/session.md` と `.amadeus/settings/templates/event-storming/session/`
2. この skill に同梱された `templates/event-storming/session.md` と `templates/event-storming/session/`

テンプレートの `<...>` は、確認済みの値または `未確認` に置き換える。
`state.json.relatedDiscovery` と `state.json.relatedIntent` は、関連先がない場合は `null` のままにする。
関連先がある場合は、JSON の quoted string に置き換える。
Event Storming セッション ID と scope だけは `未確認` にせず、作成前に確定する。
intent-scoped の場合、`state.json.relatedIntent` は対象 Intent ディレクトリ名に置き換える。

## 実行モード

### `guided`

既定モード。
作成前に、対象 level を ready に近づけるために必要な不足だけを質問する。

質問は `amadeus-grilling` を使って行う。
複数の論点が残っている場合でも、一度に並べず一問ずつ質問する。
質問数の目安は7問にする。
目安を超えても、対象 level を ready にするための判断が未確定であれば質問を続ける。
目安を超えて質問を続ける場合は、追加確認が必要な理由を短く示す。
既存成果物、既存資料、会話から分かることは質問しない。

対象シナリオが未確定の場合は、最初に対象シナリオを確認する。
対象シナリオが既存 Discovery や Intent から明確な場合は、Domain Event から聞く。

最初の Domain Event 質問は次を基本にする。

```text
この対象で、ドメイン上「起きた」と言える重要な事実を、過去形で3つから10個挙げると何ですか？
```

質問した場合は、その場で成果物を作らず、ユーザーの回答を待つ。
回答に記録対象の判断が含まれる場合は、Event Storming 成果物への反映と同じ変更で `grillings.md` と `grillings/Gxxx-*.md` を更新する。
記録対象は成果物の意味や後続判断に影響する質問と回答だけにする。

### `scaffold-only`

ユーザーが明示した場合だけ使う。
質問せず、与えられた情報だけで Event Storming 成果物を作る。

不足している Domain Event、関係、候補、未確認事項は `未確認` として残す。
`status` は `draft` にする。

### `repair`

既存 Event Storming 成果物の見出し、表列、リンク、`state.json` の対応だけを補修する。
既存の `grillings.md` または `grillings/Gxxx-*.md` が存在し、構造だけが壊れている場合は、Grilling Decision Trail の索引、session ファイル名、必須見出し、表列、相対リンク、状態、反映先、判断 ID、置き換え先、質問記録の参照だけを補修してよい。

Domain Event、Aggregate Candidate、Bounded Context Candidate の意味を推測で変更しない。

### `refine`

既存 Event Storming 成果物に、ユーザー回答で確定した内容だけを追記または更新する。

既存の Domain Event や候補を上書きする場合は、理由を `hotspots.md` または `Event Storming のモジュールファイル` の `Supersession` に残す。
grilling による質問と回答で確定した判断を反映する場合は、同じ変更で `grillings.md` と `grillings/Gxxx-*.md` も更新する。

## 成果物

pre-intent の作成先は次だけである。

```text
.amadeus/event-storming/<event-storming-id>.md
.amadeus/event-storming/<event-storming-id>/
```

intent-scoped の作成先は次だけである。

```text
.amadeus/intents/<intent-id>-<slug>/event-storming/<event-storming-id>.md
.amadeus/intents/<intent-id>-<slug>/event-storming/<event-storming-id>/
```

intent-scoped の場合、`state.json.scope` は `intent-scoped`、`state.json.relatedIntent` は `<intent-id>-<slug>` にする。

作成または更新するものは次だけである。

- `Event Storming のモジュールファイル`
- `events.md`
- `flow.md`
- `board.md`
- `aggregate-candidates.md`
- `bounded-context-candidates.md`
- `hotspots.md`
- `state.json`
- 記録対象の質問と回答が発生した場合だけ、`grillings.md`
- 記録対象の質問と回答が発生した場合だけ、`grillings/Gxxx-*.md`

`big-picture` では `Event Storming のモジュールファイル`、`events.md`、`board.md`、`hotspots.md`、`state.json` を使う。
`process-modeling` では `flow.md` を追加する。
`system-design` では `aggregate-candidates.md` と `bounded-context-candidates.md` を追加する。

Requirement、Use Case、Unit、Bolt、Task は作らない。
Aggregate、Bounded Context、Contract、不変条件は確定しない。
実装、テスト、CI、PR は作らない。
`amadeus-discovery`、`amadeus-ideation`、`amadeus-inception`、`amadeus-domain-modeling` は自動実行しない。

## `state.json`

`state.json` は次の形にする。

```json
{
  "schemaVersion": 1,
  "id": "<event-storming-id>",
  "phase": "event-storming",
  "status": "draft",
  "currentLevel": "big-picture",
  "completedLevels": [],
  "scope": "pre-intent",
  "relatedDiscovery": null,
  "relatedIntent": null,
  "nextRecommendedSkill": "amadeus-discovery"
}
```

`status` は次のいずれかにする。

- `draft`
- `reviewing`
- `ready`
- `superseded`

`ready` は後続 skill が参照できるという意味であり、phase gate 通過ではない。

## `Event Storming のモジュールファイル`

`Event Storming のモジュールファイル` は次の見出しを持つ。

- `Purpose`
- `Scope`
- `Related Discovery`
- `Related Intent`
- `Level Status`
- `Next Skill`
- `Supersession`

`system-design` が ready の場合だけ、次の見出しも持つ。

- `Handoff To Domain Modeling`

`Handoff To Domain Modeling` は、`amadeus-domain-modeling` が判断するための入力である。
Event Storming 側で採用、変更、分割、統合、棄却を判断しない。

## ID

Event Storming セッション ID は `ESnnn-<slug>` にする。

成果物内の要素 ID は次にする。

| 要素 | ID |
|---|---|
| Domain Event | `DEVnnn` |
| Command | `CMDnnn` |
| Actor | `ACTnnn` |
| Policy | `POLnnn` |
| External System | `EXTnnn` |
| Read Model | `RMnnn` |
| Aggregate Candidate | `AGCnnn` |
| Bounded Context Candidate | `BCCnnn` |
| Hotspot | `HOTnnn` |

## ファイル詳細

`events.md` の一覧見出しは `一覧` にする。
表列は `ID`、`Domain Event`、`Description`、`Source`、`Excluded Similar Events` にする。

`flow.md` の表列は `ID`、`Type`、`Label`、`Trigger`、`Produces`、`Related`、`Note` にする。
`Type` は `Actor`、`Command`、`Domain Event`、`Policy`、`External System`、`Read Model` のいずれかにする。

`board.md` の表列は `Order`、`Type`、`ID`、`Label`、`Related`、`Note` にする。
`Type` は `Actor`、`Command`、`Domain Event`、`Policy`、`External System`、`Read Model`、`Aggregate Candidate`、`Bounded Context Candidate` のいずれかにする。

`aggregate-candidates.md` の表列は `ID`、`Candidate`、`Rationale`、`Related Domain Events`、`Consistency Clues`、`Open Questions` にする。

`bounded-context-candidates.md` の表列は `ID`、`Candidate`、`Rationale`、`Related Domain Events`、`Related Aggregate Candidates`、`Open Questions` にする。

`hotspots.md` の表列は `ID`、`Type`、`Summary`、`Source`、`Status`、`Related`、`Next Action` にする。
`Status` は `open`、`resolved`、`accepted` のいずれかにする。

`Event Storming のモジュールファイル` の `Handoff To Domain Modeling` は、`Candidate` に `AGCnnn` または `BCCnnn` の ID を書く。
表示名は `Evidence` または `Open Questions` に含める。

## ready 条件

`big-picture ready` の条件は次である。

- 主要な Domain Event が `events.md` にある。
- Domain Event が `board.md` に時系列で並んでいる。
- 未確認事項が `hotspots.md` に分離されている。

`process-modeling ready` の条件は次である。

- `big-picture` が完了している。
- Domain Event の前後にある Command、Actor、Policy が `flow.md` にある。
- 関係する External System と Read Model が必要に応じて `flow.md` にある。
- `board.md` に Domain Event、Command、Actor、Policy の関係がある。
- 未確認事項が `hotspots.md` に分離されている。

`system-design ready` の条件は次である。

- `process-modeling` が完了している。
- `board.md` に Domain Event、Command、Policy、Aggregate Candidate、Bounded Context Candidate の関係がある。
- `aggregate-candidates.md` に候補と根拠がある。
- `bounded-context-candidates.md` に候補と根拠がある。
- 未確定事項が `hotspots.md` に分離されている。

`system-design ready` は Aggregate、Bounded Context、不変条件、Contract、実装設計の確定ではない。

## 次に使う skill

`nextRecommendedSkill` は、scope と level に応じて選ぶ。

| scope | level | nextRecommendedSkill |
|---|---|---|
| `pre-intent` | `big-picture` | `amadeus-discovery` |
| `pre-intent` | `process-modeling` | `amadeus-discovery` |
| `pre-intent` | `system-design` | `amadeus-domain-modeling` |
| `intent-scoped` | `big-picture` | `amadeus-inception` |
| `intent-scoped` | `process-modeling` | `amadeus-inception` |
| `intent-scoped` | `system-design` | `amadeus-domain-modeling` |

## Supersession

Event Storming 成果物は意味を変えて上書きしない。
対象シナリオや理解が変わった場合は、新しい Event Storming を追加し、古いものを `superseded` にする。

`Event Storming のモジュールファイル` の `Supersession` に、`Supersedes`、`Superseded By`、`Reason` を残す。

## 検証

作成または補修後、次を実行する。

```bash
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts .
```

Intent 配下に作った場合は、対象 Intent も指定して実行する。

```bash
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts . <intent-id>-<slug>
```

## 禁止事項

- Domain Event 以外を Event と呼ばない。
- Requirement、Use Case、Unit、Bolt、Task を作らない。
- Aggregate、Bounded Context、Contract、不変条件を確定しない。
- 実装、テスト、CI、PR を作らない。
- `.kiro/specs`、`openspec`、Spec 成果物を作らない。
- `amadeus-discovery`、`amadeus-ideation`、`amadeus-inception`、`amadeus-domain-modeling` を自動実行しない。
