# Amadeus Event Storming

この文書は、Event Storming 補助 skill の設計メモである。
現時点で `amadeus-event-storming` skill が実装済みであることや、公開入口として利用可能であることを意味しない。

## 背景

Amadeus では、入力テーマが大きい場合に `amadeus-discovery` で Intent 化方針を整理できる。

しかし、入力テーマがドメイン上の複雑な流れを含む場合、Intent 候補や Requirement を先に作るだけでは、なぜその分割になるのかを説明しにくい。

Event Storming は、Domain Event を起点に人間からドメイン上の事実を引き出し、Process、Aggregate Candidate、Bounded Context Candidate を見いだすための補助技法である。

そのため、Amadeus では Event Storming を phase skill に混ぜず、独立した補助 skill として扱う。

## 判断

`amadeus-event-storming` は、独立した補助 skill として定義する方針である。

提案中の `amadeus-event-storming` は phase を進める主入口ではない。
提案中の `amadeus-event-storming` は、Discovery、Intent Init、Inception、Domain Modeling が参照できる分析成果物を作る。

補助 skill の判断基準は次である。

```text
phase を進める責務を持つなら公開 phase skill
phase の中で使う分析技法なら補助 skill
複数 phase から使われるなら補助 skill
成果物を独自に持つなら補助 skill として独立
成果物を持たず質問観点だけなら既存 skill に内包
```

提案中の `amadeus-event-storming` は、この補助 skill 判断基準の最初の標準例として扱う。

## 責務

提案中の `amadeus-event-storming` は、Domain Event を中心に人間へヒアリングする。

提案中の `amadeus-event-storming` は次を行う。

- Domain Event を発見する。
- Domain Event の時系列と因果を整理する。
- Command、Actor、Policy、External System、Read Model を整理する。
- Hotspot を記録する。
- System Design level では Aggregate Candidate と Bounded Context Candidate を見いだす。
- 後続 skill へ渡す Handoff を作る。

提案中の `amadeus-event-storming` は次を行わない。

- Requirement を自動生成しない。
- Use Case を自動生成しない。
- Unit を自動生成しない。
- Bolt を自動生成しない。
- Aggregate を確定しない。
- Bounded Context を確定しない。
- Contract や不変条件を確定しない。
- 実装設計を完了扱いしない。

## Event の扱い

Event Storming で扱う Event は Domain Event だけである。

UI event、technical event、integration event、log event は、Event Storming の Event として扱わない。
これらの扱いは [event-storming-event-types.md](event-storming-event-types.md) に従う。

成果物上では、単に `Event` と書かず、`Domain Event` と明記する。
`events.md` の見出しも `Domain Events` にする。
`board.md` の Type も `Domain Event` にする。

Domain Event の ID は `DEVnnn` にする。
これは既存の Domain Modeling 成果物で使うドメインイベント ID と合わせるためである。

## 成果物の置き場所

Event Storming 成果物は、Intent 前と Intent 配下の両方に置ける。

Intent 前の Event Storming は次に置く。

```text
.amadeus/event-storming/<event-storming-id>/
```

Intent 配下の Event Storming は次に置く。

```text
.amadeus/intents/<intent-id>-<slug>/event-storming/<event-storming-id>/
```

Intent 前の Event Storming は、Discovery から参照できる補助成果物として扱う。
Discovery の `brief.md` には、関連 Event Storming への参照を置く。

```md
## 関連 Event Storming

| ID | 目的 | パス |
|---|---|---|
| ES001-order-flow | ECサイト構築テーマの Domain Event 整理 | ../../event-storming/ES001-order-flow/summary.md |
```

## ID

Event Storming セッションの ID は `ESnnn-<slug>` にする。

例は次である。

```text
ES001-order-flow
ES002-return-flow
ES003-subscription-renewal-flow
```

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

Aggregate Candidate は `AGCnnn` にする。
正式な Aggregate ID ではないことを明示するためである。

Bounded Context Candidate は `BCCnnn` にする。
正式な Bounded Context ID ではないことを明示するためである。

## Level

提案中の `amadeus-event-storming` は、1回の実行で1つの level を主対象にする。

level は次の3つである。

```text
big-picture
process-modeling
system-design
```

`big-picture` は、Domain Event を広く出し、ドメイン上で何が起きているかを把握する level である。
主に Discovery や Intent 分割の材料にする。

`process-modeling` は、Domain Event の前後にある Command、Actor、Policy、External System、Read Model を整理する level である。
シナリオ、分岐、ルール、責務の流れを明確にする。
`process-modeling` は `system-design` に進む前提である。

`system-design` は、`process-modeling` の結果をもとに Aggregate Candidate と Bounded Context Candidate の外観を探索する level である。
ただし、Aggregate、Bounded Context、Contract、不変条件は確定しない。

level の遷移は次である。

```text
big-picture ready
  -> process-modeling を続けるか確認

process-modeling ready
  -> system-design を続けるか確認

system-design ready
  -> amadeus-domain-modeling を案内
```

既に十分な材料がある場合は、ユーザーが明示した level から始めてよい。
ただし、`system-design` を始める前に `process-modeling` の成果物があるか確認する。

## 成果物構造

Event Storming は、同じディレクトリ内で level を進める。
level ごとに別ディレクトリを作らない。

最終的な構造は次である。

```text
.amadeus/event-storming/ES001-order-flow/
  summary.md
  events.md
  flow.md
  board.md
  aggregate-candidates.md
  bounded-context-candidates.md
  hotspots.md
  state.json
```

Intent 配下の場合も同じ構造にする。

```text
.amadeus/intents/<intent-id>-<slug>/event-storming/ES001-order-flow/
  summary.md
  events.md
  flow.md
  board.md
  aggregate-candidates.md
  bounded-context-candidates.md
  hotspots.md
  state.json
```

`big-picture` では `summary.md`、`events.md`、`board.md`、`hotspots.md`、`state.json` を使う。

`process-modeling` では `flow.md` を追加する。

`system-design` では `aggregate-candidates.md` と `bounded-context-candidates.md` を追加する。

## 成果物の役割

`summary.md` は、目的、対象範囲、関連 Discovery、関連 Intent、実施状態、次に使う skill をまとめる。

`events.md` は、Domain Event の詳細を扱う。
採用理由、根拠、除外した類似イベントを持つ。

`flow.md` は、Command、Actor、Policy、External System、Read Model の関係詳細を扱う。
分岐、前提、後続アクションを持つ。

`board.md` は、Event Storming board の全体ビューである。
Order、Type、ID、Label、Related、Note を持つ。
人間と AI が全体の流れを追うための索引として使う。

`aggregate-candidates.md` は、Aggregate Candidate の根拠を扱う。
関連 Domain Event、守りそうな一貫性、未確定事項を持つ。

`bounded-context-candidates.md` は、Bounded Context Candidate の根拠を扱う。
関連 Aggregate Candidate、責務境界、他候補との境界疑義を持つ。

`hotspots.md` は、未確認、矛盾、判断待ち、リスクを扱う。

## board.md

`board.md` は、level が進むにつれて同じ表を成長させる。

標準形式は次である。

```md
# Event Storming Board

## Board

| Order | Type | ID | Label | Related | Note |
|---:|---|---|---|---|---|
```

`big-picture` では Domain Event 中心にする。

```md
| Order | Type | ID | Label | Related | Note |
|---:|---|---|---|---|---|
| 1 | Domain Event | DEV001 | 注文が確定した |  | 購入者の注文意思が確定した |
| 2 | Domain Event | DEV002 | 支払いが承認された | DEV001 | 注文確定後に起きる |
```

`process-modeling` では Command、Actor、Policy、External System、Read Model を追加する。

```md
| Order | Type | ID | Label | Related | Note |
|---:|---|---|---|---|---|
| 1 | Actor | ACT001 | 購入者 | CMD001 | 注文を確定する |
| 2 | Command | CMD001 | 注文を確定する | DEV001 | 購入者が実行する |
| 3 | Domain Event | DEV001 | 注文が確定した | POL001 | 支払い確認へ進む |
| 4 | Policy | POL001 | 注文確定時に支払い確認を開始する | CMD002 |  |
```

`system-design` では Aggregate Candidate と Bounded Context Candidate を追加する。

```md
| Order | Type | ID | Label | Related | Note |
|---:|---|---|---|---|---|
| 8 | Aggregate Candidate | AGC001 | 注文 | DEV001, DEV002 | 注文確定と支払い承認の一貫性境界候補 |
| 9 | Bounded Context Candidate | BCC001 | 注文管理 | AGC001 | 注文関連ルールが密な候補 |
```

## flow.md

`flow.md` は、Process Modeling level の関係を機械的に参照できる形で扱う。

標準形式は次である。

```md
# Event Storming Flow

## Flow

| ID | Type | Label | Trigger | Produces | Related | Note |
|---|---|---|---|---|---|---|
| ACT001 | Actor | 購入者 |  | CMD001 |  | 注文を開始する |
| CMD001 | Command | 注文を確定する | ACT001 | DEV001 |  | UI event はこの Command の発火契機として扱う |
| DEV001 | Domain Event | 注文が確定した | CMD001 | POL001 |  |  |
| POL001 | Policy | 注文確定時に支払い確認を開始する | DEV001 | CMD002 |  |  |
| EXT001 | External System | 決済サービス | CMD002 | DEV002 |  | Integration event はこの外部システム関係として扱う |
| RM001 | Read Model | 注文状況 | DEV001 |  | ACT001 | 購入者が参照する |
```

`Type` は `Actor`、`Command`、`Domain Event`、`Policy`、`External System`、`Read Model` のいずれかにする。
UI event は `Command` の発火契機として `Note` に残す。
Integration event は `External System` の入出力関係として `Note` に残す。

## events.md

`events.md` は Domain Event だけを扱う。

標準形式は次である。

```md
# Domain Events

## 一覧

| ID | Domain Event | Description | Source | Excluded Similar Events |
|---|---|---|---|---|
| DEV001 | 注文が確定した | 購入者の注文意思が確定した | ヒアリング | 注文ボタンがクリックされた、注文 API が呼ばれた |
```

`Excluded Similar Events` には、UI event、technical event、integration event、log event など、似ているが Domain Event ではないものを書く。

## aggregate-candidates.md

`aggregate-candidates.md` は、System Design level で見いだした Aggregate Candidate を扱う。

標準形式は次である。

```md
# Aggregate Candidates

## 一覧

| ID | Candidate | Rationale | Related Domain Events | Consistency Clues | Open Questions |
|---|---|---|---|---|---|
| AGC001 | 注文 | 注文確定と支払い承認の一貫性が密に見える | DEV001, DEV002 | 注文確定後に支払い確認が必要 | 支払いを同じ集約に含めるか |
```

Aggregate Candidate は正式な Aggregate ではない。
正式化は `amadeus-domain-modeling` で判断する。

## bounded-context-candidates.md

`bounded-context-candidates.md` は、System Design level で見いだした Bounded Context Candidate を扱う。

標準形式は次である。

```md
# Bounded Context Candidates

## 一覧

| ID | Candidate | Rationale | Related Domain Events | Related Aggregate Candidates | Open Questions |
|---|---|---|---|---|---|
| BCC001 | 注文管理 | 注文確定、支払い承認、在庫引当のルールが密に関係する | DEV001, DEV002, DEV003 | AGC001 | 在庫管理と同じ境界かは未確認 |
```

Bounded Context Candidate は正式な Bounded Context ではない。
正式化は `amadeus-domain-modeling` で判断する。

## hotspots.md

`hotspots.md` は、未確認事項と Domain Event ではない候補を安定して退避する。

標準形式は次である。

```md
# Hotspots

## 一覧

| ID | Type | Summary | Source | Status | Related | Next Action |
|---|---|---|---|---|---|---|
| HOT001 | Open Question | 支払い承認と在庫引当の順序が未確定 | ヒアリング | open | DEV002, DEV003 | 追加確認する |
| HOT002 | Technical Event | 注文 API が呼ばれた | 技術メモ | open | CMD001 | Domain Event として扱わず実装懸念に残す |
| HOT003 | Log Event | 監査ログが出力された | 運用メモ | open | DEV001 | 未確定事項として残す |
```

`Status` は `open`、`resolved`、`accepted` のいずれかにする。
`open` は未確認で後続判断が必要な状態である。
`resolved` は確認済みで、本文の成果物へ反映済みの状態である。
`accepted` は未解決のままリスクや前提として受け入れた状態である。

## state.json

`state.json` は、Event Storming の機械判定用状態を持つ。

最小構造は次である。

```json
{
  "schemaVersion": 1,
  "id": "ES001-order-flow",
  "phase": "event-storming",
  "status": "draft",
  "currentLevel": "big-picture",
  "completedLevels": [],
  "scope": "pre-intent",
  "relatedDiscovery": "20260628-ec-site-discovery",
  "relatedIntent": null,
  "nextRecommendedSkill": "amadeus-discovery"
}
```

`status` は次の4値にする。

```text
draft
reviewing
ready
superseded
```

`draft` は、ヒアリング中であることを表す。
Domain Event、Command、Policy、Hotspot が未整理でもよい。

`reviewing` は、主要な成果物が揃い、人間確認中であることを表す。

`ready` は、後続 skill が参照できることを表す。
`ready` は phase gate 通過ではない。

`superseded` は、別の Event Storming に置き換えられたことを表す。

`scope` は次の2値にする。

```text
pre-intent
intent-scoped
```

`currentLevel` は現在作業中の level を表す。
`completedLevels` は `ready` になった level を表す。

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
- External System と Read Model がある場合は、`board.md` にもそれらの関係がある。
- 未確認事項が `hotspots.md` に分離されている。

`system-design ready` の条件は次である。

- `process-modeling` が完了している。
- `board.md` に Domain Event、Command、Policy、Aggregate Candidate、Bounded Context Candidate の関係がある。
- `aggregate-candidates.md` に候補と根拠がある。
- `bounded-context-candidates.md` に候補と根拠がある。
- 未確定事項が `hotspots.md` に分離されている。

`system-design ready` は、Aggregate の確定ではない。
`system-design ready` は、Bounded Context の確定ではない。
`system-design ready` は、不変条件や Contract の確定ではない。
`system-design ready` は、実装設計の完了ではない。

## 次に使う skill

`nextRecommendedSkill` は、level と scope に応じて変える。

標準の推奨は次である。

| scope | level | nextRecommendedSkill | 理由 |
|---|---|---|---|
| `pre-intent` | `big-picture` | `amadeus-discovery` | Intent 分割や入力テーマ整理に使うため |
| `pre-intent` | `process-modeling` | `amadeus-discovery` または `amadeus-intent-init` | Intent 候補または最初の Intent を決めるため |
| `pre-intent` | `system-design` | `amadeus-domain-modeling` | Intent 化前の Candidate を Domain Model へ磨くため |
| `intent-scoped` | `big-picture` | `amadeus-inception` | Intent 内の Requirement、Use Case、Unit、Bolt の根拠に使うため |
| `intent-scoped` | `process-modeling` | `amadeus-inception` | Requirement、Use Case、Unit、Bolt の根拠に使うため |
| `intent-scoped` | `system-design` | `amadeus-domain-modeling` | Candidate を Domain Model へ磨くため |

## Handoff To Domain Modeling

`system-design ready` の場合だけ、Domain Modeling への Handoff を作る。
Handoff は `summary.md` の `Handoff To Domain Modeling` 見出しに保存する。

Handoff は変換判断ではない。
Handoff は、Domain Modeling が判断するための入力リストである。

標準形式は次である。

```md
## Handoff To Domain Modeling

| Candidate | Kind | Evidence | Open Questions |
|---|---|---|---|
| AGC001 注文 | Aggregate Candidate | DEV001, DEV002 | 支払いを同じ集約に含めるか |
| BCC001 注文管理 | Bounded Context Candidate | AGC001, DEV001, DEV002 | 支払い境界を分けるか |
```

採用、変更、分割、統合、棄却の判断は `amadeus-domain-modeling` 側で行う。
Event Storming 側では判断を先取りしない。

## Supersession

Event Storming 成果物は上書きしない。
対象シナリオや理解が変わった場合は、新しい Event Storming を追加し、古いものを `superseded` にする。

例は次である。

```text
ES001-order-flow/
  state.json: superseded
  supersededBy: ES002-order-flow-revised

ES002-order-flow-revised/
  state.json: ready
  supersedes: ES001-order-flow
```

`summary.md` にも関係を残す。

```md
## Supersession

| Field | Value |
|---|---|
| Supersedes | なし |
| Superseded By | ES002-order-flow-revised |
| Reason | 支払い承認と在庫引当の順序が逆であることが判明したため |
```

## guided

提案中の `amadeus-event-storming` は、固定上限ではなく質問数の目安を持つ。

質問数の目安は7問にする。
目安を超えても、対象 level を `ready` にするための判断が未確定であれば質問を続ける。
目安を超えて質問を続ける場合は、追加確認が必要な理由を短く示す。
既存成果物、既存資料、会話から分かることは質問しない。

質問は `amadeus-grilling` を使って一問ずつ行う。

対象シナリオが未確定の場合は、最初に対象シナリオを確認する。
対象シナリオが既存 Discovery や Intent から明確な場合は、Domain Event から聞く。

最初の Domain Event 質問は次を基本にする。

```text
この対象で、ドメイン上「起きた」と言える重要な事実を、過去形で3つから10個挙げると何ですか？
```
