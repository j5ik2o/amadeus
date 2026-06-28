# Grilling Decision Trail

このメモは、Amadeus の `guided` と `refine` で確認した判断過程を、後続の AI が読み直せる形で残すための設計メモである。

このメモは、skill と validator に反映する Grilling Decision Trail の設計根拠である。
template と既存 example への一括 migration は扱わない。

## 背景

`amadeus-grilling` は、不足している判断を一問ずつ確認する。

しかし、質問と回答の過程が成果物に残らない場合、後続の AI は結論だけを読んで判断軸を復元する必要がある。

その結果、棄却した選択肢や、人間が重視した境界条件が失われ、別ターンや別エージェントで判断が揺れやすくなる。

一方で、生の会話ログをそのまま残すと、未確定の発言や途中で否定された案を AI が確定事項として扱う危険がある。

そのため、残す対象は会話ログではなく、確定した判断過程である。

## 方針

`grillings` は、成果物の意味や後続判断に影響する質問と回答だけを記録する。

単なる実行許可、作業順序の軽い確認、コマンド実行の確認、一時的な作業都合は記録しない。

記録対象の例は次である。

- スコープ。
- 成功条件。
- 対象外。
- 依存。
- 用語。
- 境界づけられたコンテキスト。
- 分割方針。
- 状態判断。
- 反映先。
- supersede 判断。

`grillings` は、質問したターンでは更新しない。

ユーザー回答を受け取った次のターンで、phase 成果物と同じ変更として更新する。

## 配置

`index.md` は使わない。

Rust 2018 のモジュール配置に近い形で、`grillings.md` を索引、`grillings/` を session 本体の置き場にする。

```text
<対象 root>/
  grillings.md
  grillings/
    G001-<topic>.md
    G002-<topic>.md
```

対象 root は次である。

```text
.amadeus/discoveries/<discovery-id>/
.amadeus/event-storming/<event-storming-id>/
.amadeus/intents/<intent-id>-<slug>/
.amadeus/intents/<intent-id>-<slug>/event-storming/<event-storming-id>/
.amadeus/domain/
```

Steering layer については、現行の `.amadeus/` 直下構造が混在しているため、この設計メモの導入範囲から外す。

将来、Steering layer の詳細成果物を `.amadeus/steering/` 配下へ寄せる構造変更を行う場合は、`.amadeus/steering/grillings.md` と `.amadeus/steering/grillings/` を検討する。

`.amadeus/domain/` は、全体ドメインまたは共有用語だけに反映する判断過程を扱う。
共有用語だけを更新する場合は、session の反映先に `../glossary.md` を書く。

## 作成条件

`grillings.md` と `grillings/` は、記録対象の質問と回答が発生したときだけ作る。

標準テンプレートには含めない。

`scaffold-only` では質問しないため、`grillings` を作らない。

`repair` では原則として `grillings` を更新しない。
ただし、既存の `grillings.md` や `grillings/Gxxx-*.md` 自体が壊れている場合は、構造補修として直してよい。

既存 example や既存成果物の migration は、この設計では行わない。

新ルールは、今後の `guided` と `refine` で記録対象の質問と回答が発生したときから適用する。

## 更新責務

`amadeus-grilling` は、質問作法と記録形式の基準を定義する。

`amadeus-grilling` は、どの質問を記録対象にするか、どの構造で記録するか、どの状態と採番を使うかの基準である。

`amadeus-grilling` は、phase 成果物の意味を解釈して `grillings` を更新する責務を持たない。

`grillings.md` と `grillings/Gxxx-*.md` を更新する責務は、grill を呼び出した phase skill が持つ。

phase skill は、ユーザー回答を自分の成果物境界で解釈し、phase 成果物への反映と同じ変更で `grillings` を更新する。

例は次である。

- `amadeus-discovery` が質問した場合は、対象 Discovery 配下の `grillings` を更新する。
- `amadeus-event-storming` が質問した場合は、対象 Event Storming 配下の `grillings` を更新する。
- `amadeus-intent-init`、`amadeus-ideation`、`amadeus-inception`、`amadeus-construction` が質問した場合は、対象 Intent 配下の `grillings` を更新する。
- `amadeus-domain-grilling` が質問した場合は、対象成果物セットに応じて Discovery、Event Storming、Intent、全体ドメインのいずれかの配下を更新する。

## 採番

session ID と判断 ID は、対象成果物セット内で連番にする。

session ID は `G001`、`G002` のようにする。

判断 ID は `GD001`、`GD002` のようにする。

session ファイル名は次の形式にする。

```text
G001-<topic>.md
```

`<topic>` は英小文字、数字、ハイフンだけで書く。

例は次である。

```text
G001-ideation-scope.md
G002-inception-boundary.md
G003-bolt-split.md
```

## `grillings.md`

`grillings.md` は索引だけを扱う。

session 詳細は `grillings/Gxxx-*.md` に置く。

最低限、次を一覧できるようにする。

- session ID。
- 主題。
- 対象。
- 状態。
- 主な確定判断。
- 反映先。
- session ファイルへのリンク。

例は次である。

```md
# Grillings

## 一覧

| ID | 主題 | 対象 | 状態 | 主な確定判断 | 反映先 | 詳細 |
|---|---|---|---|---|---|---|
| G001 | Ideation Scope | Intent | completed | 対象範囲を管理画面に限定する | [scope.md](scope.md) | [G001](grillings/G001-ideation-scope.md) |
```

## Session ファイル

session ファイルは、1回の grilling session ごとに1ファイル作る。

session の状態は次の3つにする。

- `active`：grilling session が継続中である。
- `completed`：その session の判断が確定し、反映先へ反映済み、または反映先が明記済みである。
- `superseded`：後続 session や成果物変更で置き換え済みである。

session ファイルには、質問ごとの要約を残す。

生ログは残さない。

例は次である。

```md
# G001 Ideation Scope

## 概要

- 対象: 20260628-example
- 目的: Ideation の対象範囲を確定する。
- 状態: completed
- 開始日: 2026-06-28
- 終了日: 2026-06-28
- 反映先: scope.md

## 確定判断

| ID | 判断 | 状態 | 反映先 | 置き換え先 |
|---|---|---|---|---|
| GD001 | 対象範囲は管理画面に限定する。 | active | scope.md | 該当なし |

## 質問記録

### Q001

- 確認したいこと: 対象範囲をどこまで含めるか。
- 確認が必要な理由: 要求と初期モックの境界が変わるため。
- 推奨回答: 管理画面に限定する。
- 推奨理由: 最初の Intent として検証可能な粒度に収まるため。
- ユーザー回答: それでよい。
- 確定判断: GD001
```

## 個別判断

個別判断の状態は次の2つにする。

- `active`：現時点で有効な判断である。
- `superseded`：後続判断で置き換え済みである。

個別判断には、反映先を必ず書く。

`superseded` になった判断には、置き換え先を必ず書く。

例は次である。

```md
### GD001 対象範囲

- 状態: superseded
- 判断: 対象範囲は管理画面に限定する。
- 反映先: scope.md
- 置き換え先: G002 GD003
```

質問記録からは、確定した判断 ID を必ず参照する。

これにより、質問、回答、判断、反映先を追跡できる。

## Validator 方針

validator では、`grillings` を任意成果物として軽く検証する。

`grillings.md` と `grillings/` が存在しない場合は失敗にしない。

どちらか片方だけ存在する場合は失敗にする。

存在する場合は、最低構造を検証する。

検証観点は次である。

- session ファイル名が `Gnnn-<topic>.md` である。
- session ファイルに質問記録と確定判断がある。
- 個別判断に反映先がある。
- `superseded` 判断に置き換え先がある。

## 対象外

この設計メモでは、Steering layer の構造変更を扱わない。

この設計メモでは、既存 example や既存成果物の migration を扱わない。

この設計メモでは、template と既存 example の具体的な変更手順を扱わない。
