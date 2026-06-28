# Task 生成フェーズ方針

## 背景

Amadeus DLC は、AI-DLC のサブセットとして成果物境界を保つ。

AI-DLC では、Inception で Intent を Unit of Work や Suggested Bolts へ分解し、Construction で Bolt Execution を進める。
そのため、実装作業の細分化は Inception で固定せず、Construction の設計後に行う方が自然である。

現行の Amadeus DLC では、Inception で Bolt 配下の `tasks.md` を生成している。
この形では、Construction Design より先に実装 Task が固定される。
その結果、AI-DLC のフェーズ境界と、設計から Task を導く流れが曖昧になる。

## 参照アンカー

この方針は、AI-DLC の「Inception で Unit of Work と Suggested Bolts を扱い、Construction で Bolt Execution を行う」境界を基準にする。

また、実装作業分解の順序は cc-sdd の `requirements.md` と `design.md` を入力に `tasks.md` を生成する流れを参照する。
Amadeus DLC では、Construction Design を `tasks.md` 生成の根拠にし、Inception では実装 Task を確定しない。

## 決定

Inception では `tasks.md` を生成しない。
Inception では Task ID を導入しない。
Inception の `traceability.md` では Task 列を持たない。

Construction では、対象 Bolt の `design.md` を作成し、Design Gate を ready にした後で `tasks.md` を生成する。
`tasks.md` は Construction Design を根拠にした実装作業計画である。

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

Construction Design は次を必須参照にする。

- 対象 Bolt
- 対象 Unit
- 対象 Requirement
- 対象 Use Case

## Task 生成 Review Gate

`tasks.md` を書く前に、Task 生成 Review Gate を通す。

Review Gate では次を確認する。

- Construction Design が対象 Bolt、Unit、Requirement、Use Case を参照している。
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

Construction の Bolt 状態では、Design Gate と Task Plan を分ける。

```json
{
  "designGate": {
    "status": "ready",
    "evidence": "bolts/B001-example/design.md"
  },
  "taskPlan": {
    "status": "generated",
    "evidence": "bolts/B001-example/tasks.md"
  }
}
```

`designGate.status: ready` は、Construction Design が実装作業へ分解できる粒度になった状態を表す。
`taskPlan.status: generated` は、Design Gate ready 後に実装作業リストが生成された状態を表す。

## Validator 変更方針

Inception validator は次を確認する。

- `bolts.md` が存在する。
- 各 Bolt の `bolt.md` が存在する。
- 各 Bolt の `tasks.md` が存在しない。
- `traceability.md` に Task 列がない。
- `state.json.inception.requiredBoltArtifacts` に `tasks.md` が含まれない。

Construction validator は次を確認する。

- 対象 Bolt の `design.md` が存在する。
- 対象 Bolt の `tasks.md` が存在する。
- `tasks.md` の各 Task が、作業、要求、ユースケース、依存、設計根拠、証拠を持つ。
- `state.json.construction.requiredBoltArtifacts` に `design.md` と `tasks.md` が含まれる。
- `state.json.construction.bolts[].designGate.evidence` が `design.md` を指す。
- `state.json.construction.bolts[].taskPlan.evidence` が `tasks.md` を指す。

旧構造は失敗にする。

- Inception で `bolts/*/tasks.md` が存在する。
- Inception の `state.json` に `tasks.md` が含まれる。
- Inception の `traceability.md` に Task 列がある。
- Construction Design が Task ID 参照を必須にしている。

## Skill 変更方針

`amadeus-inception` は `tasks.md` を生成しない。
`amadeus-inception-execution-design` は Bolt ごとに `bolt.md` だけを作る。
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

## 後続 PR 分割案

後続の実装変更は、次の PR に分ける。

1. docs と `CONTEXT.md` の契約変更。
2. skills と templates の変更。
3. validator と evals の変更。
4. examples の再生成と検証。

ただし、validator と examples が強く結合している場合は、3 と 4 を統合してよい。

## 検証方針

実装 PR では、少なくとも次を実行する。

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
