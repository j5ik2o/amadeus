# Context

この文書は、Amadeus DLC のドメイン語彙の定義元である。

## AI-DLC Concept Model

## Naming Rules

**実行時**：スキルが実際に使われる時点、またはスクリプトが実行される時点を表す。
英語の `runtime` や `Runtime` は、既存コード、固有名、外部仕様名として必要な場合だけ使う。
その語がなくても意味が通じるなら使わない。
文書では原則として「実行時」と書く。
_Avoid_: runtime, Runtime

**実行時依存**：スキルを実行するために必要な依存である。
開発、eval、昇格判断だけに必要な依存とは分ける。
_Avoid_: runtime dependency

**信頼できる参照元**：判断や作業の基準として扱う文書、設定、データである。
「正本」は開発現場の言葉としては硬く、意味が通るなら使わない。
必要な場合は「参照元」「基準」「定義元」「管理元」のように、文脈に合う語へ置き換える。
_Avoid_: 正本

**モジュールファイル**：同じ階層にある同じ stem のディレクトリと対になる Markdown ファイルである。
たとえば `.amadeus/intents/<intent-id>-<slug>.md` は、`.amadeus/intents/<intent-id>-<slug>/` と対になるモジュールファイルである。
モジュールファイルは、対象成果物そのものの目的、責務、範囲、関連成果物を扱う。

**モジュールディレクトリ**：同じ階層にある同じ stem のモジュールファイルと対になるディレクトリである。
たとえば `.amadeus/intents/<intent-id>-<slug>/` は、`.amadeus/intents/<intent-id>-<slug>.md` と対になるモジュールディレクトリである。
モジュールディレクトリは、対象成果物の状態、設計、追跡、補助成果物を扱う。

**モジュール構造**：モジュールファイルとモジュールディレクトリを同じ階層に並べる成果物配置である。
モジュール構造は Rust 2018 の `foo.rs` と `foo/` の配置に近い形で、対象成果物そのものと詳細成果物を分ける。

**ADR**：Amadeus DLC の構造、境界、長期的な判断を記録する Architecture Decision Record である。
採用済み ADR、現在の実装、merge 済みの差分履歴が新しいドメイン語彙を導入した場合は、`CONTEXT.md` に語彙定義として反映する。
`CONTEXT.md` は語彙の定義元であり、ADR は判断の根拠と履歴を扱う。
実装と差分履歴は、現行挙動と判断経緯を確認するための入力として扱う。

**AI-DLC Core**：DLC を領域に依存せず扱うための抽象モデルである。
AI-DLC Core は phase、state、decision、traceability、gate を扱う。
AI-DLC Core は Unit、Bolt、Construction Design、Event Storming、Aggregate、Bounded Context のような software-development 固有概念を所有しない。

**Lifecycle Binding**：DLC の phase ごとに skill、artifact、gate、validator を接続する概念である。
Lifecycle Binding は成果物ファイル名ではなく、Profile が phase と実行能力と検証条件をどう束ねるかを表す。

**Profile**：特定領域に向けた Lifecycle Binding の具体的な束である。
Profile は、AI-DLC Core の抽象モデルに対して、領域別の成果物契約、phase ごとの skill 接続、gate 条件、validator を具体化する。
software-development profile、ddd profile、writing profile、amadeus profile は Profile の例である。

**Skill**：個別能力の単位である。
Skill は `SKILL.md` を入口にし、必要に応じて `scripts/`、`references/`、`assets/` を持つ。
Skill は DLC の phase 契約そのものではなく、Profile から呼び出される実行能力として扱う。

**Agent Plugin**：skill、agent、hook、MCP server などを同梱できる配布とインストールの単位である。
Agent Plugin は Profile を配布する候補になり得る。
ただし、Agent Plugin は Profile の概念と同一視しない。

**MCP**：外部能力や文脈を接続する層である。
MCP は tools、resources、prompts などを公開する。
MCP は DLC の phase、gate、artifact、validator の契約そのものではない。

**Discovery**：Intent を作る前に、入力テーマの課題粒度、既存 Intent との関係、Intent 化方針を整理する判断単位である。
Discovery の詳細は `.amadeus/discoveries/<discovery-id>.md` に置く。
Discovery の状態は `.amadeus/discoveries/<discovery-id>/state.json` に置く。
Discovery は Steering と Intent の間に置く。
Discovery は Requirement、Use Case、Unit、Bolt、Task を定義しない。

**Discoveries**：Amadeus DLC 全体で扱う Discovery 群である。
Discoveries の一覧は `.amadeus/discoveries.md` に置く。
Discovery が Intent 化された場合でも、Intent 化前の判断記録として残す。

**Event Storming**：Domain Event を起点に、ドメイン上の事実、順序、原因、判断待ちを整理する補助分析である。
Event Storming の概要は `.amadeus/event-storming/<event-storming-id>.md`、または `.amadeus/intents/<intent-id>-<slug>/event-storming/<event-storming-id>.md` に置く。
Event Storming の状態と分析成果物は、同じ stem のモジュールディレクトリに置く。
Event Storming は phase を進めず、後続 phase や Domain Model 整理が参照できる分析成果物を作る。
Event Storming は Requirement、Use Case、Unit、Bolt、Task、Aggregate、Bounded Context、Contract を確定しない。

**Event Storming Level**：Event Storming の分析粒度を表す段階である。
Event Storming Level は `big-picture`、`process-modeling`、`system-design` の3つを使う。
`big-picture` は Domain Event を広く出す。
`process-modeling` は Domain Event の前後にある Command、Actor、Policy、External System、Read Model を整理する。
`system-design` は Aggregate Candidate と Bounded Context Candidate を探索する。

**Domain Event**：ドメイン上で起きた意味のある過去形の事実である。
Domain Event は Event Storming の `events.md` に置く。
Event Storming で扱う Event は Domain Event だけである。
UI event、technical event、integration event、log event は Domain Event として扱わない。

**Aggregate Candidate**：Event Storming の system-design level で見いだした Aggregate の候補である。
Aggregate Candidate は Event Storming の `aggregate-candidates.md` に置く。
Aggregate Candidate は正式な Aggregate ではなく、Domain Model へ渡す判断材料である。

**Bounded Context Candidate**：Event Storming の system-design level で見いだした Bounded Context の候補である。
Bounded Context Candidate は Event Storming の `bounded-context-candidates.md` に置く。
Bounded Context Candidate は正式な Bounded Context ではなく、Domain Model へ渡す判断材料である。

**Hotspot**：Event Storming で見つかった未確認事項、矛盾、判断待ち、リスクである。
Hotspot は Event Storming の `hotspots.md` に置く。
Hotspot は Domain Event ではない候補や補足情報の退避先としても扱う。

**Intent**：達成したい目的を表す出発点である。
Intent の詳細は `.amadeus/intents/<intent-id>-<slug>.md` に置く。
Intent の状態と phase ごとの成果物は `.amadeus/intents/<intent-id>-<slug>/` に置く。
ビジネス目標、機能目標、技術的成果を含む。
Intent は、単一の境界づけられたコンテキストに閉じるとは限らない。
複数の境界づけられたコンテキストをまたぐ Intent は、Unit に分解して開発と検証へ進める。

**Intents**：Amadeus DLC 全体で扱う Intent 群である。
Intents の一覧は `.amadeus/intents.md` に置く。
Intent が別の Intent の成果を前提にする場合は、依存関係を記録する。

**Requirement**：Intent を検証可能な要求へ落とした中間契約である。
Requirement の詳細は `requirements/<requirement-id>-<slug>.md` に置く。
Story がない作業でも、Unit、Bolt、Task は Requirement を参照して進める。

**Requirements**：Intent 配下の Requirement 群である。
Requirements の一覧は `requirements.md` に置く。

**Unit**：Intent から導かれる、独立して開発と検証を進められる価値単位である。
Unit の詳細は `units/<unit-id>-<slug>.md` に置く。
Unit は Requirement を参照し、Requirement は Unit を所有しない。

**Units**：Intent 配下の Unit 群である。
Units の一覧は `units.md` に置く。

**Unit Design Brief**：Inception で Unit の課題解決方針、責務境界、Bolt 分割方針、Construction への引き継ぎを定める設計成果物である。
Unit Design Brief は `units/<unit-id>-<slug>/design.md` に置く。
Unit Design Brief は Construction の入力であり、Construction で上書きしない。
Inception の旧 Bolt Design Brief は廃止済みであり、Unit Design Brief と Construction Design に分離する。
_Avoid_: Bolt Design Brief

**Story**：Requirement をユーザー価値の単位で表す任意の表現形式である。
Story の詳細は `user-stories/<story-id>-<slug>.md` に置く。
「誰が、何のために、何をしたいか」と受け入れ条件を明示する必要がある場合に作る。
リファクタ、バグ修正、インフラ変更、内部品質改善では省略できる。

**Stories**：Intent 配下の Story 群である。
Stories の一覧は `user-stories.md` に置く。
Story は Requirement のユーザー価値表現であり、任意である。

**Use Case**：アクターまたは外部システムとシステムの相互作用手順を叙述する成果物である。
Use Case の詳細は `use-cases/<use-case-id>-<slug>.md` に置く。
Use Case は Requirement を参照し、Story がある場合は Story を任意で参照できる。
Use Case は Task の親ではなく、Task が何を満たすかを示す参照先である。

**Use Cases**：Intent 配下の Use Case 群である。
Use Cases の一覧は `use-cases.md` に置く。
Task がアクターまたは外部システムとの相互作用を実現する場合は、Task が参照する Use Case を作る。

**Bolt**：Unit を実装、検証する短い反復単位である。
Bolt の詳細は `bolts/<bolt-id>-<slug>.md` に置く。
Bolt は Intent 配下に置き、1つの Unit、または依存関係で結び付いた少数の Units を実装する。
Bolt は Unit の子に固定しない。

**Bolts**：Intent 配下の Bolt 群である。
Bolts の一覧は `bolts.md` に置く。

**Construction Design**：Construction で Bolt を実行可能にするための設計成果物である。
Construction Design は Bolt ごとの `bolts/<bolt-id>-<slug>/design.md` に置く。
Construction Design は Domain Design、Logical Design、実装設計、検証設計を確定する。
Construction Design は Task 生成の根拠であり、Inception では作らない。

**Design Gate**：Construction Design が Task へ分解できる粒度に達したかを示す Construction の Bolt 単位 gate である。
Design Gate の evidence は対象 Bolt の Construction Design を指す。
Design Gate が `ready` または `passed` でない場合、Implementation Execution へ進めない。

**Task**：Bolt 内で実行する具体作業である。
Task は `bolts/<bolt-id>-<slug>/tasks.md` のチェックリスト項目として置く。
Task は Construction で生成する。
Inception では Task ID を導入しない。
Task は Requirement を必ず参照する。
Task がアクターまたは外部システムとの相互作用を実現する場合は Use Case も参照する。
相互作用がない内部作業では、Use Case を参照しない理由を Acceptance / Traceability に残す。
Task は Story とは直接の親子関係を持たない。

**Tasks**：Bolt 配下の Task 群である。
Construction の Bolt preparation で `bolts/<bolt-id>/tasks.md` に ID 付きチェックリストとして置く。
`tasks.md` は Construction Design を根拠にした Task 集合である。
`tasks.md` は実装前には作業計画を表し、実装と検証の後には完了状態、証拠、受け入れ判断の入力も保持する。
`state.json` の `tasks` は Tasks の生成状態を表すプロパティ名であり、文章上の概念名としては Tasks を使う。
`tasks.evidence` は対象 Bolt の `tasks.md` を指す。
Task 単位の設計、検証、履歴が必要になった時点で `bolts/<bolt-id>/tasks/<task-id>.md` を導入する。

**Task 生成 Review Gate**：`tasks.md` を書く前に、Task 案が Construction Design、Requirement、必要な Use Case、依存、証拠候補に対応しているかを確認する gate である。
Task 生成 Review Gate で不足が見つかった場合は、`tasks.md` を書かずに Construction Design の refine に戻す。

**Decision**：Intent 内の構造、境界、進め方に影響する判断である。
Decision の詳細は `decisions/<decision-id>-<slug>.md` に置く。
Decision が別の Decision の採用や前提を必要とする場合は、依存関係を記録する。

**Decisions**：Intent 配下の Decision 群である。
Decisions の一覧は `decisions.md` に置く。
一覧と依存関係は `decisions.md` に置き、個別判断は `decisions/<decision-id>-<slug>.md` に置く。

**Grilling Decision Trail**：`guided` または `refine` で確認した、成果物の意味や後続判断に影響する質問、回答、確定判断、反映先の記録である。
Grilling Decision Trail は生ログではなく、確定した判断過程だけを扱う。
Grilling Decision Trail の索引は対象成果物セットの `grillings.md` に置き、session 詳細は `grillings/Gxxx-<topic>.md` に置く。

**Deployment Unit**：検証済みで、運用へ渡せる成果物である。

## 関係

所有関係は次の形にする。

```text
Steering
  ├─ Discoveries
  ├─ Event Storming optional
  └─ Intents

Intent
  ├─ Event Storming optional
  ├─ Requirements
  │   └─ Stories optional
  ├─ Use Cases optional
  ├─ Units
  │   └─ Unit Design Brief
  ├─ Bolts
  │   ├─ Construction Design
  │   └─ Tasks
  └─ Acceptance / Traceability
```

参照関係は次の形にする。

```text
Unit -> Requirement
Unit Design Brief -> Unit
Bolt -> Requirement
Bolt -> Unit
Bolt -> Unit Design Brief
Construction Design -> Bolt
Construction Design -> Unit Design Brief
Construction Design -> Requirement
Construction Design -> Use Case optional
Task -> Requirement
Task -> Construction Design
Use Case -> Requirement
Use Case -> Story optional
Task -> Use Case optional
```

Unit を Story から切り出す場合、Unit は Story を入力参照してよい。
ただし Story は Unit を所有せず、Unit も Story を所有しない。

Requirement から Use Case、Unit、Bolt、Task を見る場合は、所有ではなく逆引きの projection として扱う。

境界づけられたコンテキストから Intent を見る場合も、所有ではなく逆引きの projection として扱う。
Intent と境界づけられたコンテキストの対応は、Unit の主担当と協調先を通じて表す。

**Acceptance / Traceability**：Intent 配下で、Requirement、Story、Use Case、Unit、Unit Design Brief、Bolt、Construction Design、Task、Deployment Unit の対応と受け入れ状態を扱う横断成果物である。
Acceptance は `acceptance.md` に置く。
Traceability は `traceability.md` に置く。
Requirement や Unit を所有せず、参照関係と検証状態を記録する。
Requirement、Story、Use Case、Unit、Bolt、Task を ID で接続する。
Unit Design Brief と Construction Design は相対リンクで接続する。
Inception の Traceability は Task を接続しない。
Task は Construction 以降の Traceability で接続する。

Acceptance / Traceability は、最初は対応関係と受け入れ状態を同じ成果物で扱う。
受け入れ状態の主語は Requirement である。
Task と Deployment Unit は Requirement が満たされたかを判断するための証拠として扱う。

Requirement の受け入れ状態は、`proposed`、`accepted`、`satisfied`、`verified` の順に進む。
`verified` への遷移には人間承認が必要であり、センサー結果だけでは `verified` にしない。
`satisfied` への遷移には、必要な Task の完了と受け入れ証拠が必要である。

証拠は typed reference のリストで表す。
人間向け Markdown と機械向け JSON は分けて保存する。

**Glossary**：Amadeus DLC 全体で使う確定済みの用語集である。
`.amadeus/glossary.md` に置く。
Intent 配下には置かない。

**Domain Model**：Amadeus DLC 全体の概念間の関係、不変条件、ライフサイクル、集約候補を扱うモデルである。
全体モデルは `.amadeus/domain/` に置き、サブドメイン、境界づけられたコンテキスト、コンテキスト別モデル、契約に分ける。

**Aggregate**：整合性を保って扱うドメインオブジェクトのまとまりである。
Aggregate は Event Storming の Aggregate Candidate から自動確定せず、Domain Model の判断で採用する。

**Bounded Context**：特定のモデル、語彙、責務が一貫して通用するドメイン境界である。
Bounded Context は Event Storming の Bounded Context Candidate から自動確定せず、Domain Model の判断で採用する。

**DDD Module**：境界づけられたコンテキスト内で、概念関係、ライフサイクル、集約候補をまとめるモデル単位である。
Amadeus DLC では、DDD Module ごとのモデルを `domain/bounded-contexts/<bounded-context-id>/models/<ddd-module-id>/model.md` に置く。

**Upstream Context**：別の境界づけられたコンテキストが参照、利用、または順応する側の境界づけられたコンテキストである。
コンテキスト間依存では `Upstream` として記録する。

**Downstream Context**：Upstream Context が提供するモデル、契約、公開インターフェイスに依存する側の境界づけられたコンテキストである。
コンテキスト間依存では `Downstream` として記録する。

**Organization Pattern**：境界づけられたコンテキストを担うチーム同士の関係を示す分類である。
Amadeus DLC では、パートナーシップ、別々の道、順応者、顧客／供給者を使う。

**Integration Pattern**：境界づけられたコンテキスト同士のモデルやインターフェイスの連携方法を示す分類である。
Amadeus DLC では、共有カーネル、巨大な泥団子、公開ホストサービス（OHS）、公表された言語（PL）、腐敗防止層（ACL）を使う。

**Intent Domain Model**：特定の Intent で使う概念、関係、ライフサイクル、集約候補を扱うモデルである。
Intent 配下の `domain/bounded-contexts/BC001-authentication-access/models/account/model.md` に置く。

**Intent Bounded Context**：特定の Intent で Unit を切る時に参照する境界づけられたコンテキスト、責務、外部境界である。
Intent 配下の `domain/bounded-contexts.md` に置く。

**Intent Contracts**：特定の Intent で守る事前条件、不変条件、事後条件と根拠を扱う文書である。
Intent 配下の `domain/bounded-contexts/BC001-authentication-access/contracts.md` に置く。
事前条件は `PREnnn`、不変条件は `INVnnn`、事後条件は `POSTnnn` の識別子で扱う。

**Terminology Notes**：Intent 内で見つかった未確定語、提案語、用語確認事項を一時的に扱う文書である。
Intent 配下に置く場合は `terminology-notes.md` とする。

**Domain Notes**：Intent 固有のモデル上の発見や未確定事項を扱う文書である。
正式化された内容は、対象範囲に応じて Intent 配下の `domain/bounded-contexts.md`、`domain/bounded-contexts/BC001-authentication-access/models/account/model.md`、`domain/bounded-contexts/BC001-authentication-access/contracts.md`、または `.amadeus/domain/` に昇格する。
