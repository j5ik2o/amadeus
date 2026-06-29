# Task 生成フェーズ方針

## 背景

Amadeus DLC は、AI-DLC のサブセットとして成果物境界を保つ。

AI-DLC では、Inception で Intent を Unit of Work や Suggested Bolts へ分解し、Construction で Bolt Execution を進める。
そのため、実装作業の細分化は Inception で固定せず、Construction の設計後に行う方が自然である。

旧契約の Amadeus DLC では、Inception で Bolt 配下の `tasks.md` を生成していた。
この形では、Construction Design より先に実装 Task が固定されていた。
その結果、AI-DLC のフェーズ境界と、設計から Task を導く流れが曖昧になる。

この文書は、Task 生成フェーズの現在の成果物契約を固定する方針文書である。
この契約は、`CONTEXT.md`、関連 docs、skill、validator、example の判断基準になる。

## 参照アンカー

この方針は、AI-DLC の「Inception で Unit of Work と Suggested Bolts を扱い、Construction で Bolt Execution を行う」境界を基準にする。

また、実装作業分解の順序は cc-sdd の `requirements.md` と `design.md` を入力に `tasks.md` を生成する流れを参照する。
Amadeus DLC では、Construction Design を `tasks.md` 生成の根拠にし、Inception では実装 Task を確定しない。

## 決定

Inception では `tasks.md` を生成しない。
Inception では Task ID を導入しない。
Inception の `traceability.md` では Task 列を持たない。

Construction では、対象 Bolt の `design.md` を作成し、Design Gate を ready にした後で `tasks.md` を生成する。
`tasks.md` は Construction Design を根拠にした Task 集合である。
実装前の `tasks.md` は作業計画を表す。
実装と検証の後の `tasks.md` は、完了状態と証拠も保持する。

旧構造との後方互換は残さない。
Inception で `bolts/*/tasks.md` が存在する状態は、validator で失敗させる。

## フェーズ別成果物契約

Inception は次を扱う。

- Requirement
- Story
- Use Case
- Unit
- Unit Design Brief
- Bolt
- Acceptance
- Traceability
- Decision

Inception は次を扱わない。

- Bolt 配下の `tasks.md`
- Task ID
- Task 単位の実装作業
- Task 単位の証拠

Construction は次を扱う。

- Bolt 配下の `design.md`
- Bolt 配下の `tasks.md`
- Bolt 配下の `notes.md`
- Bolt 配下の `test-results.md`
- 実装
- 検証
- Task 単位の証拠

## Construction の処理順序

Construction は次の順序で進める。

1. Inception 成果物を読む。
2. 対象 Bolt の Construction Design を作る。
3. Design Gate を ready にする。
4. Task 生成 Review Gate を通す。
5. `tasks.md` を生成する。
6. `tasks.md` に基づいて実装する。
7. `tasks.md` に基づいて検証する。
8. Task の証拠、Acceptance、Traceability、State を更新する。

Construction Design は Task 生成の根拠である。
そのため、Construction Design 作成時点では `B001/T001` のような Task ID を必須参照にしない。

Task 生成 Review Gate で不足が見つかった場合は、`designGate.status` を `draft` または `failed` に戻す。
この場合、`designGate.status: ready` のまま `tasks.status: blocked` にしない。

Construction Design は次を必須参照にする。

- 対象 Bolt
- 対象 Unit
- 対象 Requirement
- 対象 Use Case。
  これは、アクターまたは外部システムとの相互作用がある場合だけ必須にする。

## Task 生成 Review Gate

`tasks.md` を書く前に、Task 生成 Review Gate を通す。

Review Gate では次を確認する。

- Construction Design が対象 Bolt、Unit、Requirement を参照している。
- アクターまたは外部システムとの相互作用がある場合、Construction Design が対象 Use Case を参照している。
- 各 Task が Construction Design のどの設計判断に対応するか説明できる。
- 各 Task が Requirement を参照している。
- アクターまたは外部システムとの相互作用を実現する Task は Use Case を参照している。
- Use Case を参照しない Task には、その理由を Traceability に残せる。
- 各 Task が具体的な作業を持つ。
- 各 Task が依存を持つ。
- 各 Task が証拠候補を持つ。
- 各 Task が設計根拠を持つ。

設計の不足や矛盾が見つかった場合は、`tasks.md` を書かずに Construction Design の refine に戻す。

## `tasks.md` の形式

`tasks.md` は、実装前に生成し、Construction の終盤で証拠を更新する。

初期生成時の形式は次を基本にする。

```md
- [ ] T001: Task 名
  - 作業:
    - Construction Design の実装設計に従い、具体的な作業を書く。
  - 要求: R001
  - ユースケース: UC001
  - 依存: なし
  - 設計根拠: bolts/B001-example/design.md#実装設計
  - 証拠: 未登録
```

Use Case を参照しない Task では、`ユースケース` に `なし` を書く。
その場合は、Traceability finalization で Use Case を参照しない理由を残す。

```md
- [ ] T002: 内部構造を整理する
  - 作業:
    - Construction Design の実装設計に従い、内部構造を整理する。
  - 要求: R001
  - ユースケース: なし
  - 依存: T001
  - 設計根拠: bolts/B001-example/design.md#実装設計
  - 証拠: 未登録
```

実装と検証後は、完了状態と証拠を更新する。

```md
- [x] T001: Task 名
  - 作業:
    - Construction Design の実装設計に従い、具体的な作業を書く。
  - 要求: R001
  - ユースケース: UC001
  - 依存: なし
  - 設計根拠: bolts/B001-example/design.md#実装設計
  - 証拠: bolts/B001-example/test-results.md
```

## `state.json` の状態表現

Construction の Bolt 状態では、Design Gate と Tasks 生成状態を分ける。
`tasks` は `state.json` 上で Tasks の生成状態、確認者、更新時点、証拠を表すプロパティ名である。
文章上の概念名としては Tasks を使う。

```json
{
  "id": "B001",
  "designGate": {
    "status": "ready",
    "reviewedBy": "ai",
    "updatedAt": "2026-06-28",
    "evidence": "bolts/B001-example/design.md"
  },
  "tasks": {
    "status": "generated",
    "reviewedBy": "ai",
    "updatedAt": "2026-06-28",
    "evidence": "bolts/B001-example/tasks.md"
  }
}
```

`designGate.status: ready` は、Construction Design が実装作業へ分解できる粒度になった状態を表す。
`tasks.status: generated` は、Design Gate ready 後に Tasks が生成された状態を表す。
Task 生成 Review Gate で不足が見つかった場合は、`designGate.status` を `draft` または `failed` に戻し、`tasks.status` を `not_generated` または `blocked` として扱う。
この場合、`tasks.md` が存在しない途中状態を許可する。
`tasks.status` は `not_generated`、`generated`、`blocked` のいずれかにする。
`tasks.status: blocked` は、`designGate.status: ready` と同時に使わない。

## Validator 変更方針

Inception validator は次を確認する。

- `bolts.md` が存在する。
- 各 Bolt のモジュールファイルが存在する。
- 各 Bolt の `tasks.md` が存在しない。
- `traceability.md` に Task 列がない。
- `state.json.inception.requiredBoltArtifacts` に `tasks.md` が含まれない。

Construction validator は次を確認する。

- 対象 Bolt の `design.md` が存在する。
- 対象 Bolt の `notes.md` が存在する。
- 対象 Bolt の `notes.md` が `実行方針`、`対象タスク`、`未確認事項` を持つ。
- `state.json.construction.bolts[]` の対象 Bolt が `id` を持つ。
- `state.json.construction.bolts[].designGate.reviewedBy` が空でない。
- `state.json.construction.bolts[].designGate.updatedAt` が空でない。
- `state.json.construction.bolts[].designGate.evidence` が `design.md` を指す。
- `state.json.construction.bolts[].tasks.status` が許可値である。
- `state.json.construction.bolts[].tasks.status` が `generated` の場合、対象 Bolt の `tasks.md` が存在する。
- `state.json.construction.bolts[].tasks.status` が `generated` の場合、`tasks.md` の各 Task が、作業、要求、ユースケース、依存、設計根拠、証拠を持つ。
- `state.json.construction.bolts[].tasks.status` が `generated` の場合、`state.json.construction.requiredBoltArtifacts` に `tasks.md` が含まれる。
- `state.json.construction.bolts[].tasks.status` が `generated` の場合、`state.json.construction.bolts[].tasks.evidence` が `tasks.md` を指す。
- `state.json.construction.bolts[].tasks.status` が `not_generated` または `blocked` の場合、`state.json.construction.requiredBoltArtifacts` に `tasks.md` が含まれない。
- `state.json.construction.bolts[].tasks.status` が `blocked` の場合、`state.json.construction.bolts[].designGate.status` が `ready` ではない。
- Construction Design が対象 Bolt、Unit、Requirement を参照している。
- アクターまたは外部システムとの相互作用がある場合、Construction Design が対象 Use Case を参照している。
- Task の `ユースケース` は、Use Case ID または `なし` を許可する。

Traceability finalization 後の Construction validator は、追加で次を確認する。

- `Construction Design からの追跡` が Construction Design と Task を接続している。
- Task の `ユースケース` が `なし` の場合、Traceability に Use Case を参照しない理由がある。

現在のあるべき姿から外れる構造は失敗にする。

- Inception で `bolts/*/tasks.md` が存在する。
- Inception の `state.json` に `tasks.md` が含まれる。
- Inception の `traceability.md` に Task 列がある。
- Construction Design が Task ID 参照を必須にしている。

## Skill 変更方針

`amadeus-inception` は `tasks.md` を生成しない。
`amadeus-inception-execution-design` は Bolt ごとにモジュールファイルだけを作る。
Inception traceability は Requirement、Story、Use Case、Unit、Bolt、Unit Design Brief までを追跡する。

`amadeus-construction-bolt-preparation` は Construction Design を作成した後、Task 生成 Review Gate を通して `tasks.md` を生成する。
この skill は実装コードやテストコードを変更しない。

`amadeus-construction-implementation-execution` は `tasks.md` に基づいて実装する。

`amadeus-construction-verification-hardening` は `tasks.md` に基づいて検証する。

`amadeus-construction-traceability-finalization` は Task の証拠、Acceptance、Traceability、State を更新する。

## Example 変更方針

`examples/04-inception-completed` は、Inception 完了状態として Task を含めない。
この snapshot には `bolts/*/tasks.md` を置かない。

`examples/05-construction-design-ready` は、Construction の Bolt preparation 完了状態として Task を含める。
この snapshot には `bolts/*/design.md`、`bolts/*/tasks.md`、`bolts/*/notes.md` を置く。
実装と検証は未実施のままにする。

## 反映範囲

この契約は、次の範囲に反映する。

1. `CONTEXT.md` と関連 docs は、Task を Construction 生成の成果物として定義する。
2. skills と templates は、Inception では `tasks.md` を作らず、Construction の Bolt preparation で `tasks.md` を作る。
3. validator と evals は、Inception の `tasks.md` と Task 列を失敗にし、Construction の `tasks` による Tasks 生成状態と `tasks.md` を検証する。
4. examples は、Inception 完了状態と Construction Design ready 状態のフェーズ境界を示す。

## 検証方針

変更時は、少なくとも次を実行する。

```sh
npm run test:all
```

個別に成果物構造を確認する場合は、validator を直接実行する。

```sh
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts examples/04-inception-completed 20260628-discovery-brief-creation
bun run .agents/skills/amadeus-validator/validator/AmadeusValidator.ts examples/05-construction-design-ready 20260628-discovery-brief-creation
```

## 未決定事項

現時点で未決定事項はない。
