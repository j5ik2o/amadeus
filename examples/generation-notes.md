# Example generation notes

## 目的

root `.amadeus/` に古い例示成果物を置くと、リポジトリ自身の実運用状態と混ざります。
そのため root `.amadeus/` は削除し、例示は `examples/<snapshot>/.amadeus/` に置きます。

## 生成方針

1つの workspace を `.tmp/amadeus-example-generation/workspace/` に作り、Amadeus skill の順に進めました。
各段階で `.amadeus/` を snapshot として `examples/` にコピーしました。
各 snapshot は、生成に使った source skill の `skills/**/SKILL.md` と md5 を `skill-provenance.json` に記録します。
後続段階の snapshot には、上流段階で使った skill も累積して記録します。

## 使用した skill

| 段階 | skill | 主な出力 |
|---|---|---|
| Steering | amadeus-steering | `.amadeus/` の共有土台 |
| Discovery | amadeus-discovery | `discoveries.md`, `discoveries/20260628-amadeus-theme-decomposition/brief.md`, `state.json` |
| Intent 初期化 | amadeus-intent-init | `intents.md`, `intents/20260628-discovery-brief-creation/intent.md`, `state.json` |
| Ideation | amadeus-ideation と内部 skill | `scope.md`, `ideation.md`, `mocks/initial-confirmation.puml`, `traceability.md`, `decisions.md` |
| Inception | amadeus-inception と内部 skill | Requirement、Story、Use Case、Unit、Bolt、Task、追跡、判断 |
| Construction Preparation | amadeus-construction-bolt-preparation | `design.md`, `notes.md`, Design Gate ready、Construction Design 追跡 |

## 生成ログ

詳細ログは Git 管理対象外の `.tmp/amadeus-example-generation/logs/` にあります。
ログには、各 skill の入力、生成された主なファイル、手戻り理由を短く残しています。

## Snapshot の意図

| Snapshot | 意図 |
|---|---|
| `01-discovery-completed` | Intent 未作成の Discovery 完了状態を示す |
| `02-intent-initialized` | Discovery 候補が initialized になり、Intent の入れ物ができた状態を示す |
| `03-ideation-completed` | Inception に進める最小の Ideation 成果物を示す |
| `04-inception-completed` | Requirement 2件、Story 2件、Use Case 2件、Unit 2件、Bolt 2件、各 Bolt 2 Task の粒度を示す |
| `05-construction-design-ready` | B001 の Construction Design が ready になり、実装前の追跡ができた状態を示す |

## root .amadeus を削除する理由

root `.amadeus/` は、このリポジトリ自身の作業状態として読まれやすい場所です。
例示を root に置くと、読者は古い作業状態なのか、配布用の例示なのかを区別できません。
そのため、例示成果物は `examples/` に隔離します。
