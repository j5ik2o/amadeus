# Amadeus モジュール構造 Validator 設計

## 目的

Amadeus 成果物の配置を、モジュールファイルとモジュールディレクトリの組で検証できるようにする。

この設計は、validator 実装前に成果物配置のあるべき姿を固定するためのものである。

## 用語

**モジュールファイル**：同じ階層にある同じ stem のディレクトリと対になる Markdown ファイルである。

**モジュールディレクトリ**：同じ階層にある同じ stem のモジュールファイルと対になるディレクトリである。

**モジュール構造**：モジュールファイルとモジュールディレクトリを同じ階層に並べる成果物配置である。

用語の定義元は `CONTEXT.md` である。

## 判断

Amadeus の管理対象成果物は、index に載っている対象について現在のモジュール構造を満たす。

validator は過去の配置を検出するのではなく、現在のあるべき姿を満たしているかだけを検査する。

後方互換は維持しない。

このリポジトリは未リリースであるため、互換性のために複数の配置を許容しない。

## 検査粒度

validator は、`.amadeus/**` 全体を未登録ファイルまで走査して fail にしない。

validator は、index に載っている管理対象を検査する。

たとえば `units.md` に `U001` が載っている場合、`詳細` が指す Unit のモジュールファイルと、必要なモジュールディレクトリを検査する。

未登録の作業メモや一時ファイルは、この設計の対象外である。

## 対象分類

### モジュールファイルとモジュールディレクトリを検査する対象

- Discovery
- Intent
- Event Storming
- Intent 配下 Event Storming
- Unit
- Bolt
- Bounded Context

### モジュールファイルだけを検査する対象

- Requirement
- Story
- Use Case
- Decision

これらは現時点で追加の詳細成果物を持たない。

そのため、空のモジュールディレクトリは要求しない。

### 後続で扱う対象

- DDD Module

DDD Module はモジュール構造へ寄せる対象である。

ただし、Domain Modeling への影響が広いため、この設計に基づく最初の validator 強化では fail にしない。

DDD Module の具体配置と validator 方針は `docs/amadeus/ddd-module-structure-design.md` で扱う。

### 対象外

- `state.json`
- `README.md`
- `grillings.md`
- `grillings/Gxxx-*.md`
- `requirements.md` などの index
- `acceptance.md`
- `traceability.md`
- `codebase-analysis.md`
- `domain/subdomains.md`
- `domain/bounded-contexts.md`

これらはモジュール構造の対象成果物ではなく、管理元、状態、追跡、補助成果物として扱う。

## Lifecycle を持つ対象

Lifecycle を持つ対象は、モジュールディレクトリ配下に `state.json` を持つ。

対象は次である。

- Discovery
- Intent
- Event Storming
- Intent 配下 Event Storming

Requirement、Story、Use Case、Unit、Bolt、Decision、Bounded Context、DDD Module には、現時点では `state.json` を要求しない。

## 配置契約

### Discovery

```text
.amadeus/discoveries/<discovery-id>.md
.amadeus/discoveries/<discovery-id>/state.json
```

`.amadeus/discoveries.md` の `詳細` は、Discovery のモジュールファイルを指す。

### Intent

```text
.amadeus/intents/<intent-id>-<slug>.md
.amadeus/intents/<intent-id>-<slug>/state.json
```

`.amadeus/intents.md` の `詳細` は、Intent のモジュールファイルを指す。

### Event Storming

```text
.amadeus/event-storming/<event-storming-id>.md
.amadeus/event-storming/<event-storming-id>/state.json
.amadeus/event-storming/<event-storming-id>/events.md
.amadeus/event-storming/<event-storming-id>/flow.md
.amadeus/event-storming/<event-storming-id>/board.md
.amadeus/event-storming/<event-storming-id>/hotspots.md
```

Intent 配下の場合も同じ規則にする。

```text
.amadeus/intents/<intent-id>-<slug>/event-storming/<event-storming-id>.md
.amadeus/intents/<intent-id>-<slug>/event-storming/<event-storming-id>/state.json
```

### Requirement

```text
.amadeus/intents/<intent-id>-<slug>/requirements/<requirement-id>-<slug>.md
```

`requirements.md` の `詳細` は Requirement のモジュールファイルを指す。

### Story

```text
.amadeus/intents/<intent-id>-<slug>/user-stories/<story-id>-<slug>.md
```

`user-stories.md` の `詳細` は Story のモジュールファイルを指す。

### Use Case

```text
.amadeus/intents/<intent-id>-<slug>/use-cases/<use-case-id>-<slug>.md
```

`use-cases.md` の `詳細` は Use Case のモジュールファイルを指す。

### Unit

```text
.amadeus/intents/<intent-id>-<slug>/units/<unit-id>-<slug>.md
.amadeus/intents/<intent-id>-<slug>/units/<unit-id>-<slug>/design.md
```

Unit のモジュールファイルは、現行の Unit 詳細と同じ必須見出しを持つ。

Unit Design Brief は、Unit のモジュールディレクトリ配下の `design.md` に置く。

`units.md` の `詳細` は Unit のモジュールファイルを指す。

`state.json` の artifact path も、Unit のモジュールファイルを指す。

### Bolt

```text
.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>.md
.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/design.md
.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/tasks.md
.amadeus/intents/<intent-id>-<slug>/bolts/<bolt-id>-<slug>/notes.md
```

Bolt のモジュールファイルは、現行の Bolt 詳細と同じ必須見出しを持つ。

Construction Design、Tasks、notes、test-results、PR 記録は、Bolt のモジュールディレクトリ配下に置く。

`bolts.md` の `詳細` は Bolt のモジュールファイルを指す。

`state.json` の artifact path も、Bolt のモジュールファイルを指す。

### Decision

```text
.amadeus/intents/<intent-id>-<slug>/decisions/<decision-id>-<slug>.md
```

`decisions.md` の `詳細` は Decision のモジュールファイルを指す。

### Bounded Context

```text
.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts/<bounded-context-id>-<slug>.md
.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts/<bounded-context-id>-<slug>/contracts.md
.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts/<bounded-context-id>-<slug>/models.md
```

Bounded Context のモジュールファイルは、少なくとも次を扱う。

- 目的
- 責務
- 外部境界
- 関連成果物

契約詳細は `contracts.md` に残す。

モデル一覧は `models.md` に残す。

## validator の結果表現

validator の条件名と不足内容は、モジュールファイル、モジュールディレクトリという用語で統一する。

例は次である。

- `Unit のモジュールファイルが存在する`
- `Unit のモジュールディレクトリが存在する`
- `Bolt の詳細リンクがモジュールファイルを指す`
- `Bounded Context のモジュールファイルが存在する`

履歴依存の表現は使わない。

validator は、現在のあるべき姿を満たしていないことを fail として通知する。

## 実装順序

実装 PR では、次の順で進める。

1. `CONTEXT.md` の配置定義を更新する。
2. docs と skill 文書の配置契約を更新する。
3. templates と examples をモジュール構造へ移行する。
4. validator を現在のモジュール構造だけ pass するように更新する。
5. eval を更新する。
6. `.agents/skills` へ promote する。
7. 関連検証を通す。

## 検証方針

実装 PR では、少なくとも次を確認する。

- `npm run typecheck`
- `npm run test:it:amadeus-validator`
- `npm run test:it:amadeus-templates`
- `npm run test:it:promote-skill`
- `npm run validate:all`
- `npm run diff:check`

validator の eval には、index の `詳細` がモジュールファイルを指すことを確認するケースを追加する。

Unit、Bolt、Bounded Context については、モジュールファイルが欠けている場合に fail するケースを追加する。
