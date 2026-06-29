---
name: amadeus-steering
description: >-
  Amadeus workspace の steering layer を greenfield または brownfield で初期化、点検、補修する。`.amadeus/` がない新規プロジェクト、
  既存プロジェクトに Amadeus を載せる場面、Intent 作成前に objective、actors、glossary、domain、policies、knowledge、discoveries.md、intents.md
  の土台を揃えたい場面では必ず使う。個別 Intent の ideation、requirements、use-cases、units、bolts を作るための skill ではない。
---

# amadeus-steering

## 目的

Amadeus DLC の steering layer を作る。

Steering layer は、複数 Intent で共有する目的、方針、知識、用語、アクター、外部システム、ドメイン境界、Discovery 一覧、Intent 一覧を扱う。
個別 Intent の要求、ユースケース、ユニット、ボルト、タスクは扱わない。
プロダクト、技術、構造の判断パターンは `steering/product.md`、`steering/tech.md`、`steering/structure.md` に置く。

この skill は開発中スキルとして扱う。
eval と手動レビューを通るまで、昇格済み skill として扱わない。

## 入力

- 検証対象の作業ディレクトリ。
- greenfield か brownfield か。
  - greenfield: `.amadeus/` が存在しない、または Amadeus 成果物を新規に作る。
  - brownfield: `.amadeus/` または既存の要求、設計、README、ドメイン資料がある。
- 実行モード。指定がなければ `guided` にする。
- 分かっている場合は、プロダクト目的、主要アクター、外部システム、既知の用語、既知の制約。

不明な入力は、未確認として成果物に書く。
推測で確定済みにしない。

## 未確認の書き方

空欄は作らない。
分からない値は `未確認` と書き、状態または本文に確認すべき問いを残す。

ただし、存在自体が未確認のものは、識別子を推測して作らない。

- 目的や主要アクターは、steering の入口として最低1行の `未確認` 行を置いてよい。
- 外部システム、境界づけられたコンテキスト、Intent は、存在が未確認なら行を作らず、表の下に未確認であることを書く。
- サブドメインは、主要な領域が未確認なら `SD001` を `未分類` として置いてよい。

この分け方により、必要な入口は残しつつ、存在するか分からない外部境界や Intent を作ったことにしない。

## テンプレート

成果物を新規作成する場合は、テンプレートを使う。

優先順位は次である。

1. `.amadeus/settings/templates/steering/`
2. この skill に同梱された `templates/steering/`

`.amadeus/settings/templates/steering/` は、プロジェクト固有の上書きとして扱う。
存在しない場合は、`templates/steering/` の標準テンプレートを使う。
どちらもない場合は、作成前にテンプレート不足として止める。

テンプレートの `<...>` は、確認済みの値または `未確認` に置き換える。
存在自体が未確認の外部システム、境界づけられたコンテキスト、Intent は、推測で行を作らない。
境界づけられたコンテキストを行として作る場合は、`モデル` と `契約` に存在する相対リンクを書ける時だけにする。
主要領域だけが分かっていてモデルと契約が未確定の場合は、`domain/subdomains.md` にサブドメインとして残し、`domain/bounded-contexts.md` の `一覧` は空表のままにする。
その場合は、表の下に境界づけられたコンテキストが未確認であることを書く。

## 実行モード

### `guided`

既定モード。
作成前に、必要最低限の質問をして steering layer の初期値を埋める。

質問は `/amadeus-grilling` を使って行う。
複数の論点が残っている場合でも、一度に並べず一問ずつ質問する。
質問数の目安は5問にする。
目安を超えても、steering layer 作成に必要な判断が未確定であれば質問を続ける。
目安を超えて質問を続ける場合は、追加確認が必要な理由を短く示す。
質問は、成果物を作るために必要なものだけにする。
既存資料や会話から分かることは質問しない。

greenfield で最初に聞く候補は次である。

- このプロダクトで達成したい主目的は何か。
- 主な利用者または関係者は誰か。
- 外部システム連携はあるか。
- 守るべき制約や禁止事項はあるか。
- 主要なドメイン領域を1から3個で言うと何か。

質問した場合は、その場で成果物を作らず、ユーザーの回答を待つ。
回答を受け取ってから `.amadeus/` を作る。
ユーザーが回答せずに続行するよう明示した場合だけ、未回答項目を `未確認` として作る。
その場合は、未確認事項に確認すべき問いを残す。

### `discovery`

brownfield 向けのモード。
既存の README、設計資料、ドメイン資料、`.amadeus/` から draft できる範囲を抽出する。
その後、矛盾または不足だけを質問する。

質問数の目安は5問にする。
目安を超えても、steering layer 作成に必要な判断が未確定であれば質問を続ける。
目安を超えて質問を続ける場合は、追加確認が必要な理由を短く示す。
既存資料の根拠が弱い内容は、確定済みにせず `未確認` として書く。

質問が必要な場合は、次を提示して回答を待つ。

- 既存資料から draft できた項目。
- draft の根拠にしたファイル。
- 矛盾または不足している項目。
- 目安5問の質問。

質問した場合は、その場で成果物を追加しない。
回答を受け取ってから、不足している steering layer 成果物だけを追加する。

### `scaffold-only`

ユーザーが明示した場合だけ使う。
質問せず、最小の steering layer 成果物を作る。

空欄は作らない。
不明な値には `未確認` と書く。
未確認事項には、後で人間が答えるべき問いを残す。

## 成果物

greenfield では、少なくとも次を作る。

- `.amadeus/README.md`
- `.amadeus/steering.md`
- `.amadeus/steering/knowledge.md`
- `.amadeus/steering/knowledge/README.md`
- `.amadeus/steering/policies.md`
- `.amadeus/steering/policies/README.md`
- `.amadeus/steering/objective.md`
- `.amadeus/steering/product.md`
- `.amadeus/steering/tech.md`
- `.amadeus/steering/structure.md`
- `.amadeus/steering/actors.md`
- `.amadeus/steering/external-systems.md`
- `.amadeus/glossary.md`
- `.amadeus/domain/subdomains.md`
- `.amadeus/domain/bounded-contexts.md`
- `.amadeus/discoveries.md`
- `.amadeus/intents.md`

brownfield では、既存成果物を読み、欠けている成果物だけを追加する。
既存の本文、判断、用語、識別子を上書きしない。

## 手順

1. 作業ディレクトリを確認する。
2. `.amadeus/` の有無を確認する。
3. 実行モードを決める。指定がなければ `guided` にする。
4. brownfield または `discovery` の場合は、既存の README、設計資料、ドメイン資料、`.amadeus/` を読み、既存の参照元を尊重する。
5. `guided` または `discovery` の場合は、足りない情報だけを目安5問で質問する。
   質問した場合は、回答を待ってから次へ進む。
6. `.amadeus/` がなければ作る。
7. steering layer の必須成果物を作る。
8. 未確認の情報は `未確認` と書き、空欄にしない。
9. Intent は作らない。個別 Intent が必要になったら `amadeus-intent-init` へ渡す。
10. 昇格済みの `amadeus-validator` が使える場合は、全体成果物だけを検証する。

## ファイル別の最低構造

### `steering.md`

- `役割`
- `対象成果物`
- `読む順序`
- `Intent Layer へ進む基準`
- `責務境界`

### `steering/objective.md`

- `一覧`

表の列:

- `識別子`
- `目的`
- `期待価値`
- `成功指標`
- `状態`

### `steering/product.md`

- `コア能力`
- `主要ユースケース`
- `価値仮説`

プロダクトの能力、利用場面、価値仮説は、網羅的な機能一覧ではなく後続の判断に使うパターンとして書く。

### `steering/tech.md`

- `アーキテクチャ`
- `主要技術`
- `開発標準`
- `開発環境`
- `主要技術判断`

技術スタックは、依存ライブラリの網羅ではなく開発判断に影響する技術と標準として書く。

### `steering/structure.md`

- `編成方針`
- `ディレクトリパターン`
- `命名規約`
- `依存関係の整理`
- `コード構成原則`

プロジェクト構造は、ファイルツリーの網羅ではなく新しいファイルを置く判断に使うパターンとして書く。

### `steering/actors.md`

- `一覧`

表の列:

- `識別子`
- `名前`
- `役割`
- `関心`
- `状態`

### `steering/external-systems.md`

- `一覧`

表の列:

- `識別子`
- `名前`
- `役割`
- `接点`
- `状態`

外部システムがない場合も、`EXT001` を推測で作らない。
一覧表は空にしてよい。

### `glossary.md`

- `用語`
- `避ける語`
- `禁止ワード`

未確定語は確定用語に混ぜない。
確定していない場合は、用語表に `未確認` として根拠を書く。
避ける語または禁止ワードが確定していない場合は、`未確認` を避ける語または禁止ワードとして登録しない。
その表はヘッダーだけにするか、表の下に「現時点ではなし。」と書く。

### `steering/knowledge.md`

- `背景`
- `前提`
- `未確認事項`

### `steering/policies.md`

- `方針`
- `禁止事項`
- `判断基準`

### `domain/subdomains.md`

- `一覧`

表の列:

- `識別子`
- `名前`
- `種別`
- `役割`
- `コンテキスト`

`識別子` は `SDnnn` にする。
`種別` は `コア`、`支援`、`汎用`、`未分類` のいずれかにする。

### `domain/bounded-contexts.md`

- `一覧`
- `外部境界`
- `コンテキスト間の依存`
- `パターン分類`

`一覧` の表の列:

- `識別子`
- `名前`
- `サブドメイン`
- `役割`
- `モデル`
- `契約`

`外部境界` の表の列:

- `コンテキスト`
- `名前`
- `役割`
- `根拠`

`コンテキスト間の依存` の表の列:

- `Downstream`
- `Upstream`
- `依存内容`
- `組織パターン`
- `統合パターン`
- `状態`

`パターン分類` には、組織パターン4種類と統合パターン5種類を列挙する。

### `discoveries.md`

- `一覧`

`一覧` の表の列:

- `識別子`
- `テーマ`
- `状態`
- `判定`
- `推奨次アクション`
- `詳細`

Discovery がまだない場合は、表に行を作らない。

### `intents.md`

- `一覧`
- `依存関係`

`一覧` の表の列:

- `識別子`
- `概要`
- `依存`
- `詳細`

`依存関係` の表の列:

- `インテント`
- `依存`
- `理由`

Intent がまだない場合は、表に行を作らない。

## 禁止事項

- 個別 Intent ディレクトリを作らない。
- `requirements.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- 未確認のドメイン語彙を確定語として追加しない。
- brownfield の既存成果物を、根拠なく置き換えない。
- 既存の識別子を採番し直さない。
- Installer、配布方法、後方互換方針を決めない。
- repo の開発用文書や開発用スクリプトを実行時参照として書かない。

## 次の skill

- 新しい Intent の入れ物だけを作る場合: `amadeus-intent-init`
- 既存 Intent の Ideation 成果物を作る場合: `amadeus-ideation`
- 成果物の構造を検証する場合: `amadeus-validator`
