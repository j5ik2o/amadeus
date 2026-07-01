---
name: amadeus-steering
description: >-
  Amadeus workspace の steering layer を greenfield または brownfield で初期化、点検、補修する。`.amadeus/` がない新規プロジェクト、
  既存プロジェクトに Amadeus を載せる場面、Intent 作成前に objective、actors、glossary、policies、knowledge、discoveries.md、intents.md
  の土台を揃えたい場面では必ず使う。個別 Intent の ideation、requirements、use-cases、units、bolts を作るための skill ではない。
---

# amadeus-steering

## 目的

Amadeus DLC の steering layer を作る。

Steering layer は、複数 Intent で共有する目的、方針、知識、用語、アクター、外部システム、Discovery 一覧、Intent 一覧を扱う。
個別 Intent の要求、ユースケース、ユニット、ボルト、タスクは扱わない。
プロダクト、技術、構造の判断パターンは `steering/product.md`、`steering/tech.md`、`steering/structure.md` に置く。

Domain Map と Context Map は、Inception と Construction の承認済み stage 成果物から更新する root 成果物である。
この skill では、空の Domain Map と Context Map を作る。
ただし、Subdomain、Bounded Context、コンテキスト間依存、詳細な Domain Model、契約は作らない。

この skill は開発中スキルとして扱う。
eval と手動レビューを通るまで、昇格済み skill として扱わない。

## 入力

- 検証対象の作業ディレクトリ。
- greenfield か brownfield か。
  - greenfield: `.amadeus/` が存在しない、または Amadeus 成果物を新規に作る。
- brownfield: `.amadeus/` または既存の要求、設計、README、業務資料がある。
- 実行モード。指定がなければ `guided` にする。
- 分かっている場合は、プロダクト目的、主要アクター、外部システム、既知の用語、既知の制約。

不明な入力は、未確認として成果物に書く。
推測で確定済みにしない。

Amadeus 自身を対象 workspace にする場合も brownfield として扱う。
自己開発専用 mode は作らず、既存資料、既存 `.amadeus/`、GitHub Issue、docs、validator 結果、example 検証、CI 結果を参照元にして steering layer を点検または補修する。

## 未確認の書き方

空欄は作らない。
分からない値は `未確認` と書き、状態または本文に確認すべき問いを残す。

ただし、存在自体が未確認のものは、識別子を推測して作らない。

- 目的や主要アクターは、steering の入口として最低1行の `未確認` 行を置いてよい。
- 外部システム、Intent は、存在が未確認なら行を作らず、表の下に未確認であることを書く。

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
存在自体が未確認の外部システム、Intent は、推測で行を作らない。

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
- 主要な業務領域を1から3個で言うと何か。

質問した場合は、その場で成果物を作らず、ユーザーの回答を待つ。
回答を受け取ってから `.amadeus/` を作る。
ユーザーが回答せずに続行するよう明示した場合だけ、未回答項目を `未確認` として作る。
その場合は、未確認事項に確認すべき問いを残す。

### `discovery`

brownfield 向けのモード。
既存の README、設計資料、業務資料、`.amadeus/` から draft できる範囲を抽出する。
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
- `.amadeus/domain-map.md`
- `.amadeus/context-map.md`
- `.amadeus/discoveries.md`
- `.amadeus/intents.md`

brownfield では、既存成果物を読み、欠けている成果物だけを追加する。
既存の本文、判断、用語、識別子を上書きしない。

## 自己開発 bootstrap と再生成比較

Amadeus 自身を brownfield として扱う場合は、実行モードに関係なく、初回 `.amadeus/` が bootstrap 用になり得ることを前提にする。

昇格済み skill で `.amadeus/` を作り直す場合は、作り直し前の `.amadeus/` を `.amadeus-snapshots/previous/` に退避し、退避版は git 管理外で直近1世代だけ保持する。
再生成前に既存の `.amadeus-snapshots/previous/` がある場合は、古い退避版を削除してから現在の `.amadeus/` を退避する。

退避版そのものを永続的な成果物にしない。
差分確認の採用判断だけを、採用対象 `.amadeus/` の既存成果物に要約する。
自己開発 cycle 全体の判断なら `.amadeus/steering/knowledge.md`、特定 Discovery のやり直しなら `.amadeus/discoveries/<discovery-id>.md` の `判定理由`、特定 Intent の再生成なら対象 phase の `decisions.md` または `decisions/**` に記録する。

差分確認の要約には、比較元、比較先、比較理由、主な差分、採用判断、必要な未確認事項を含める。

## 手順

1. 作業ディレクトリを確認する。
2. `.amadeus/` の有無を確認する。
3. 実行モードを決める。指定がなければ `guided` にする。
4. brownfield または `discovery` の場合は、既存の README、設計資料、業務資料、`.amadeus/` を読み、既存の参照元を尊重する。
5. Amadeus 自身を対象 workspace にし、昇格済み skill で `.amadeus/` を作り直す場合は、再生成前に自己開発 bootstrap と再生成比較の手順を適用する。
6. `guided` または `discovery` の場合は、足りない情報だけを目安5問で質問する。
   質問した場合は、回答を待ってから次へ進む。
7. `.amadeus/` がなければ作る。
8. steering layer の必須成果物を作る。
9. Domain Map と Context Map は、採用済み情報がない空の表として作る。
10. 未確認の情報は `未確認` と書き、空欄にしない。
11. Intent は作らない。個別 Intent が必要になったら `amadeus-ideation` へ渡す。
12. 昇格済みの `amadeus-validator` が使える場合は、全体成果物だけを検証する。

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
- 自己開発専用の steering mode や専用成果物を作らない。

## 次の skill

- 新しい Intent Recordだけを作る場合: `amadeus-ideation`
- 既存 Intent の Ideation 成果物を作る場合: `amadeus-ideation`
- 成果物の構造を検証する場合: `amadeus-validator`
