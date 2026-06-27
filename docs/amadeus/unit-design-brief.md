# Unit Design Brief

## 背景

Amadeus Inception では、要求、ユースケース、Unit、Bolt、Task をつなぐ。
従来は Bolt 配下の `design.md` が、Bolt を Task 化するための設計入力を担っていた。

しかし Bolt は実行単位である。
Bolt 単位に設計を置くと、実行都合で責務境界や設計戦略を切りやすい。
設計は Task や Bolt の都合に従うのではなく、Unit が解決する課題と価値境界を主導する必要がある。

## 判断

設計ブリーフは Unit 単位に置く。
Bolt 配下の `design.md` は廃止する。

Unit Design Brief は、Unit の課題解決方針を定める設計成果物である。
Bolt は Unit Design Brief に従って実行可能な作業単位へ分割する。
Task は Bolt の実行範囲と Unit Design Brief から導く。

## 成果物構造

Unit は詳細ファイルをディレクトリ化する。

```text
.amadeus/intents/<intent-id>/
  units.md
  units/
    U001-<slug>/
      unit.md
      design.md
  bolts.md
  bolts/
    B001-<slug>/
      bolt.md
      tasks.md
```

`units.md` の `詳細` は `units/<unit-id>-<slug>/unit.md` を指す。
`unit.md` は Unit の価値境界と要求対応を扱う入口である。
`unit.md` から同じディレクトリの `design.md` へリンクする。

`bolts.md` は `設計` 列を持つ。
`設計` は、対象 Unit の `units/<unit-id>-<slug>/design.md` を指す。
複数 Unit をまたぐ Bolt では、複数の Unit Design Brief へリンクする。
その場合は `bolt.md` の `複数 Unit を扱う理由` に複数 Unit をまたぐ理由を書く。

## Unit Design Brief の見出し

Unit `design.md` は次の見出しを持つ。

- `概要`
- `設計戦略`
- `責務境界`
- `構成候補`
- `データと契約候補`
- `検証観点`
- `Bolt 分割方針`
- `Construction への引き継ぎ`

`概要` では、この文書が Unit Design Brief であることを明記する。
Inception では、Unit の課題解決方針、Bolt 分割、Construction へ渡す設計入力だけを扱う。
詳細な Domain Design、Logical Design、実装設計、テスト設計は Construction で確定する。

`設計戦略` では、この Unit の課題解決方針を書く。
Task の都合ではなく、要求、ユースケース、価値境界から導く。

`責務境界` では、この Unit が所有する責務、所有しない責務、依存してよい外部境界を書く。

`構成候補` では、責務名レベルの構成候補を書く。
実装コンポーネント名、クラス名、ファイル名は確定しない。

`データと契約候補` では、入力候補、出力候補、状態候補、事前条件候補、事後条件候補、不変条件候補を書く。
型、保存先、API スキーマは Construction で確定する。

`検証観点` では、受け入れ状態に必要な観測可能な振る舞いと、Construction で具体化するテスト種別候補を書く。

`Bolt 分割方針` では、設計戦略をどの Bolt に分けて実行するかを書く。

`Construction への引き継ぎ` では、Domain Design、Logical Design、実装、検証で確定する未決定事項を書く。

## Construction 入力

Construction の最小必須入力は次である。

- Unit `design.md`
- Bolt `bolt.md`
- Bolt `tasks.md`

`unit.md`、`requirements.md`、`use-cases.md` は、追跡や疑義解消のために参照できる。
ただし、Bolt 実行の最小入力には含めない。

## 追跡

`traceability.md` の `設計からの追跡` は、Unit Design Brief から Bolt と Task への追跡を扱う。

```md
| 設計 | ユニット | 要求 | ユースケース | ボルト | タスク |
|---|---|---|---|---|---|
| [design.md](units/U001-example/design.md) | U001 | R001 | UC001 | B001 | B001/T001 |
```

`codebase-analysis.md` と `traceability.md` の `既存コード分析からの追跡` にある `設計` も、Unit Design Brief を指す。
既存コード分析の結果は Bolt の作業都合ではなく、Unit の設計戦略へ渡す。

## Validator 方針

validator は次を検査する。

- `units.md` の `詳細` が `units/<unit-id>-<slug>/unit.md` を指す。
- `unit.md` に `関連成果物` 見出しがある。
- `unit.md` の `関連成果物` から `design.md` へリンクできる。
- Unit `design.md` に必須見出しがある。
- Unit `design.md` の各必須見出しに本文がある。
- `bolts.md` に `設計` 列がある。
- `bolts.md` の `ユニット` と `設計` リンク先の Unit ID が対応する。
- `bolt.md` に `設計` 見出しがある。
- `bolt.md` の `対象ユニット` と `設計` リンク先の Unit ID が対応する。
- Bolt 配下に `design.md` が存在しない。
- `state.json.inception.requiredBoltArtifacts` に `bolts/*/design.md` が含まれない。
- `state.json.inception.requiredArtifacts` に Unit `unit.md` と Unit `design.md` が含まれる。

validator は構造検査に留める。
本文の意味的妥当性や設計品質は、人間レビューと後続の品質レビューで扱う。

## 非採用

後方互換は残さない。
旧構造の `units/<unit-id>-<slug>.md` と `bolts/<bolt-id>-<slug>/design.md` は許容しない。

`design_brief.md` は導入しない。
Unit の設計ブリーフは `units/<unit-id>-<slug>/design.md` として扱う。
