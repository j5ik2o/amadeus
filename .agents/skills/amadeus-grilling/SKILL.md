---
name: amadeus-grilling
description: >-
  Amadeus の Intent、steering、domain、設計境界、実施方針を一問ずつ詰める。ユーザーが grill、質問で詰める、設計を煮詰める、
  曖昧な論点を確認する、または Amadeus skill が guided で不足論点を確認する場面では必ず使う。質問は一度に並べず、
  各質問に推奨回答を添え、回答を待つ。
---

# amadeus-grilling

## 目的

計画や設計の曖昧さを、質問によって一つずつ解消する。

共有理解に達するまで、設計木の枝を順番に辿る。
互いに依存する判断は、依存関係をほどきながら一つずつ解決する。

## 基本姿勢

質問は厳密に行う。
ただし、質問を増やすこと自体を目的にしない。

ユーザーが判断しなければ進められない点だけを聞く。
コードベース、`.amadeus/` 成果物、既存ドキュメント、既存の会話から答えられることは、質問せずに自分で確認する。

## 質問の出し方

質問は一問ずつ出す。
複数の質問を一度に並べると、どの判断から解くべきか分かりにくくなるためである。

各質問では、次を含める。

- 何を決めたいのか。
- なぜ今その判断が必要なのか。
- 推奨回答。
- 推奨する理由。

質問したら、ユーザーの回答を待つ。
回答を受ける前に、次の質問へ進まない。

## 推奨回答

各質問には、必ず推奨回答を添える。

推奨回答は、現時点の成果物、設計境界、実装リスク、後続作業への影響を踏まえて出す。
推奨できない場合は、その理由と、判断に必要な不足情報を明示する。

## 調査優先

質問がコードベースや成果物を調べれば答えられる場合は、先に調べる。

調査対象の例:

- `.amadeus/`
- `README.md`
- `AGENTS.md`
- `AMADEUS.md`
- 既存の skill
- 既存の Intent 成果物
- 既存の domain、glossary、decision、traceability

調べた結果、まだ人間の判断が必要な場合だけ質問する。

## Grilling Decision Trail

`guided` または `refine` で、成果物の意味や後続判断に影響する質問と回答が発生した場合は、確定した判断過程を Grilling Decision Trail として記録する。

Grilling Decision Trail は生ログではない。
未確定の発言、途中で否定された案、単なる実行許可、作業順序の軽い確認、コマンド実行の確認、一時的な作業都合は記録しない。

記録対象は次のような判断である。

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

`amadeus-grilling` は、記録対象、記録構造、状態、採番の基準である。
実際の `grillings.md` と `grillings/Gxxx-*.md` の作成または更新は、grill を呼び出した phase skill が行う。

質問したターンでは成果物を更新しない。
ユーザー回答を受け取った次のターンで、phase skill が自分の成果物境界で回答を解釈し、phase 成果物への反映と同じ変更で Grilling Decision Trail を更新する。

配置は対象成果物セットの root 直下にする。

```text
<対象 root>/
  grillings.md
  grillings/
    G001-<topic>.md
```

対象 root は次である。

```text
.amadeus/discoveries/<discovery-id>/
.amadeus/event-storming/<event-storming-id>/
.amadeus/intents/<intent-id>-<slug>/
.amadeus/intents/<intent-id>-<slug>/event-storming/<event-storming-id>/
.amadeus/domain/
```

Steering layer は、現行の `.amadeus/` 直下構造が混在しているため、この記録対象から外す。

`.amadeus/domain/` は、全体ドメインまたは共有用語だけに反映する判断過程を扱う。
共有用語だけを更新する場合は、session の反映先に `../glossary.md` を書く。

`grillings.md` は索引だけを扱う。
session 詳細は `grillings/Gxxx-*.md` に置く。

`grillings.md` は次の最低構造を持つ。

```md
# Grillings

## 一覧

| ID | 主題 | 対象 | 状態 | 主な確定判断 | 反映先 | 詳細 |
|---|---|---|---|---|---|---|
| G001 | Ideation Scope | Intent | completed | 対象範囲を管理画面に限定する | [scope.md](scope.md) | [G001](grillings/G001-ideation-scope.md) |
```

session ファイル名は `G001-<topic>.md` にする。
`<topic>` は英小文字、数字、ハイフンだけで書く。

session 状態は次のいずれかにする。

- `active`
- `completed`
- `superseded`

個別判断の状態は次のいずれかにする。

- `active`
- `superseded`

session ファイルには、`概要`、`確定判断`、`質問記録` を置く。
`概要` には session 全体の反映先を必ず書く。
`概要` と個別判断の反映先は、対象 root 内の成果物を指す。
Discovery と Event Storming では、`<id>/grillings` から同じ ID の親 Markdown を指す `../<id>.md` を許可する。
ただし、全体ドメイン配下の Grilling Decision Trail から `.amadeus/glossary.md` を指す場合だけ、共有用語への反映として `../glossary.md` を許可する。
各質問記録には、`確認したいこと`、`確認が必要な理由`、`推奨回答`、`推奨理由`、`ユーザー回答` を必ず書く。
各質問記録からは確定判断 ID を必ず参照する。
個別判断には反映先を必ず書く。
`superseded` の個別判断には置き換え先を必ず書く。

`scaffold-only` では質問しないため、Grilling Decision Trail を作らない。
`repair` では原則として Grilling Decision Trail を更新しない。
ただし、既存の `grillings.md` や `grillings/Gxxx-*.md` 自体が壊れている場合は、構造補修として直してよい。

## Amadeus での使いどころ

次のような場面で使う。

- steering layer の目的、アクター、制約、ドメイン領域を確認する。
- Intent の目的、依存、成功条件、範囲を確認する。
- Ideation の対象、対象外、実現可能性、体制、初期モック、Inception への引き継ぎを確認する。
- 用語、概念、境界づけられたコンテキスト、DDD モデル、契約の意味を確認する。
- Unit、Bolt、Spec の粒度や例外理由を確認する。

## 禁止事項

- 複数の質問を一度に並べない。
- 既存成果物を読めば分かることを質問しない。
- 推奨回答なしで質問しない。
- 質問したターンで、回答を待たずに成果物を更新しない。
- ユーザーの回答を、既存成果物と矛盾する形で確定しない。矛盾がある場合は、矛盾を先に説明して確認する。
