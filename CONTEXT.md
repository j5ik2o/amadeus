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

**Intent**：達成したい目的を表す出発点である。
ビジネス目標、機能目標、技術的成果を含む。

**Intents**：Amadeus DLC 全体で扱う Intent 群である。
Intent が別の Intent の成果を前提にする場合は、依存関係を記録する。

**Requirement**：Intent を検証可能な要求へ落とした中間契約である。
Story がない作業でも、Unit、Bolt、Task は Requirement を参照して進める。

**Requirements**：Intent 配下の Requirement 群である。

**Unit**：Intent から導かれる、独立して開発と検証を進められる価値単位である。
Unit は Requirement を参照し、Requirement は Unit を所有しない。

**Units**：Intent 配下の Unit 群である。

**Story**：Requirement をユーザー価値の単位で表す任意の表現形式である。
「誰が、何のために、何をしたいか」と受け入れ条件を明示する必要がある場合に作る。
リファクタ、バグ修正、インフラ変更、内部品質改善では省略できる。

**Stories**：Intent 配下の Story 群である。
Story は Requirement のユーザー価値表現であり、任意である。

**Use Case**：アクターまたは外部システムとシステムの相互作用手順を叙述する成果物である。
Use Case は Requirement を参照し、Story がある場合は Story を任意で参照できる。
Use Case は Task の親ではなく、Task が何を満たすかを示す参照先である。

**Use Cases**：Intent 配下の Use Case 群である。
Task がアクターまたは外部システムとの相互作用を実現する場合は、Task が参照する Use Case を作る。

**Bolt**：Unit を実装、検証する短い反復単位である。
Bolt は Intent 配下に置き、1つの Unit、または依存関係で結び付いた少数の Units を実装する。
Bolt は Unit の子に固定しない。

**Bolts**：Intent 配下の Bolt 群である。

**Task**：Bolt 内で実行する具体作業である。
Task は Requirement を必ず参照する。
Task がアクターまたは外部システムとの相互作用を実現する場合は Use Case も参照する。
相互作用がない内部作業では、Use Case を参照しない理由を Acceptance / Traceability に残す。
Task は Story とは直接の親子関係を持たない。

**Tasks**：Bolt 配下の Task 群である。
初期状態では `bolts/<bolt-id>/tasks.md` に ID 付きチェックリストとして置く。
Task 単位の設計、検証、履歴が必要になった時点で `bolts/<bolt-id>/tasks/<task-id>.md` を導入する。

**Decision**：Intent 内の構造、境界、進め方に影響する判断である。
Decision が別の Decision の採用や前提を必要とする場合は、依存関係を記録する。

**Decisions**：Intent 配下の Decision 群である。
一覧と依存関係は `decisions.md` に置き、個別判断は `decisions/<decision-id>.md` に置く。

**Deployment Unit**：検証済みで、運用へ渡せる成果物である。

## 関係

所有関係は次の形にする。

```text
Intent
  ├─ Requirements
  │   └─ Stories optional
  ├─ Use Cases optional
  ├─ Units
  ├─ Bolts
  │   └─ Tasks
  └─ Acceptance / Traceability
```

参照関係は次の形にする。

```text
Unit -> Requirement
Bolt -> Requirement
Bolt -> Unit
Task -> Requirement
Use Case -> Requirement
Use Case -> Story optional
Task -> Use Case optional
```

Unit を Story から切り出す場合、Unit は Story を入力参照してよい。
ただし Story は Unit を所有せず、Unit も Story を所有しない。

Requirement から Use Case、Unit、Bolt、Task を見る場合は、所有ではなく逆引きの projection として扱う。

**Acceptance / Traceability**：Intent 配下で、Requirement、Story、Use Case、Unit、Bolt、Task、Deployment Unit の対応と受け入れ状態を扱う横断成果物である。
Requirement や Unit を所有せず、参照関係と検証状態を記録する。
Requirement、Story、Use Case、Unit、Bolt、Task を ID で接続する。

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
