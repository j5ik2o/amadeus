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

**Bolt**：Unit を実装、検証する短い反復単位である。
Bolt は Intent 配下に置き、1つの Unit、または依存関係で結び付いた少数の Units を実装する。
Bolt は Unit の子に固定しない。

**Bolts**：Intent 配下の Bolt 群である。

**Task**：Bolt 内で実行する具体作業である。
Task は Requirement を参照し、Story とは直接の親子関係を持たない。

**Tasks**：Bolt 配下の Task 群である。
初期状態では `bolts/<bolt-id>/tasks.md` に ID 付きチェックリストとして置く。
Task 単位の設計、検証、履歴が必要になった時点で `bolts/<bolt-id>/tasks/<task-id>.md` を導入する。

**Deployment Unit**：検証済みで、運用へ渡せる成果物である。

## 関係

所有関係は次の形にする。

```text
Intent
  ├─ Requirements
  │   └─ Stories optional
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
```

Unit を Story から切り出す場合、Unit は Story を入力参照してよい。
ただし Story は Unit を所有せず、Unit も Story を所有しない。

Requirement から Unit、Bolt、Task を見る場合は、所有ではなく逆引きの projection として扱う。

**Acceptance / Traceability**：Intent 配下で、Requirement、Story、Unit、Bolt、Task、Deployment Unit の対応と受け入れ状態を扱う横断成果物である。
Requirement や Unit を所有せず、参照関係と検証状態を記録する。
Requirement、Story、Unit、Bolt、Task を ID で接続する。

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

**Domain Model**：Amadeus DLC 全体の概念間の関係、不変条件、ライフサイクル、集約候補を扱うグローバルなモデルである。
`.amadeus/domain-model.md` に置く。
Intent 配下には置かない。

**Terminology Notes**：Intent 内で見つかった未確定語、提案語、用語確認事項を一時的に扱う文書である。
Intent 配下に置く場合は `terminology-notes.md` とする。

**Domain Notes**：Intent 固有のモデル上の発見や未確定事項を扱う文書である。
正式化された内容だけを `.amadeus/domain-model.md` に昇格する。
