---
name: amadeus-domain-modeling
description: >-
  Amadeus 成果物内の対象ドメインモデルを能動的に磨く。用語、ユビキタス言語、概念境界、具体シナリオ、ドメインモデル、契約、ドメイン判断を詰め、
  確定した内容を `.amadeus/glossary.md`、`.amadeus/intents/<intent-id>-<slug>/domain-notes.md`、`.amadeus/intents/<intent-id>-<slug>/domain/**`、
  `.amadeus/domain/**`、必要最小限の decision へ記録したい場面では必ず使う。repo 開発用の `CONTEXT.md` や `docs/adr`
  を更新するための skill ではない。
---

# amadeus-domain-modeling

## 目的

Amadeus 成果物が扱う対象ドメインのモデルを、設計しながら能動的に磨く。

この skill は、単に `.amadeus/glossary.md` や `domain/**` を読むためのものではない。
用語の衝突を指摘し、曖昧な言葉を精密化し、具体シナリオで概念関係を試し、確定した内容をその場で Amadeus 成果物へ記録するための skill である。

扱うのは `.amadeus/` 配下に記録する対象プロダクトのドメイン知識である。
Amadeus repo 自体の開発用語を扱う `CONTEXT.md` や `docs/adr/**` は更新しない。

## ファイル構造

Amadeus workspace は、全体のドメイン知識と Intent 固有のドメイン知識を分けて持つ。

```text
.amadeus/
├── glossary.md
├── domain/
│   ├── subdomains.md
│   ├── bounded-contexts.md
│   └── bounded-contexts/
│       └── <bounded-context-id>/
│           ├── models.md
│           ├── contracts.md
│           └── models/
│               └── <ddd-module-id>/
│                   └── model.md
└── intents/
    └── <intent-id>-<slug>/
        ├── domain-notes.md
        ├── decisions.md
        ├── decisions/
        │   └── <decision-id>.md
        ├── traceability.md
        └── domain/
            ├── subdomains.md
            ├── bounded-contexts.md
            └── bounded-contexts/
                └── <bounded-context-id>/
                    ├── models.md
                    ├── contracts.md
                    └── models/
                        └── <ddd-module-id>/
                            └── model.md
```

`.amadeus/glossary.md` は、全 Intent で共有する確定用語を扱う。
`.amadeus/domain/**` は、全体として採用済みの最新ドメインモデルを扱う。

`.amadeus/intents/<intent-id>-<slug>/domain-notes.md` は、Intent 内で見つかった未確定語、候補、問い、反映履歴を扱う。
`.amadeus/intents/<intent-id>-<slug>/domain/**` は、その Intent で使うサブドメイン、境界づけられたコンテキスト、モデル、契約を扱う。

ファイルは必要になった時だけ作る。
未確定の語や概念を見つけた時は、まず対象 Intent の `domain-notes.md` に記録する。
意味が確定し、複数 Intent で使う可能性がある用語だけを `.amadeus/glossary.md` に昇格する。

## 作業開始時の確認

`.amadeus/` が存在しない場合は、用語やモデルを代替ファイルへ記録しない。
作業を止め、先に `amadeus-steering` で steering layer を初期化または補修するよう案内する。

少なくとも次が存在しない場合は、steering layer が未整備である。

- `.amadeus/glossary.md`
- `.amadeus/domain/subdomains.md`
- `.amadeus/domain/bounded-contexts.md`
- `.amadeus/intents.md`

Intent 固有の用語、モデル、契約、判断を扱う場合は、対象 Intent ディレクトリ名を確定する。
対象 Intent が存在しない場合は、作業を止め、先に `amadeus-intent-init` で Intent の入れ物を作るよう案内する。
対象 Intent の `domain-notes.md` がない場合は、候補や未確定事項を記録する必要が出た時点で作る。

## セッション中の振る舞い

### 用語集と照合する

ユーザーが既存の `.amadeus/glossary.md` と矛盾する語を使った場合は、その場で指摘する。

例:

```text
glossary では「アカウント」は認証・契約・設定の管理単位ですが、
今の文脈では「利用者本人」を指しているように見えます。
ここでは「利用者」と「アカウント」のどちらを意味していますか。
```

Intent 固有の候補が `domain-notes.md` にある場合も同じように照合する。
既存候補と同じ意味か、別概念かを曖昧なまま進めない。

### 曖昧な言葉を精密化する

曖昧、広すぎる、複数の意味を持つ言葉が出たら、より精密な canonical term を提案する。

例:

```text
「ユーザー」は広すぎます。
この Intent では、ログインしてサービスを使う主体なら「利用者」、
認証情報の管理責任に注目するなら「アカウント所有者」と分けた方がよいです。
```

提案した用語が確定したら、共有用語なら `.amadeus/glossary.md` に記録する。
まだ Intent 内の候補なら `domain-notes.md` に記録する。

### 具体シナリオで試す

ドメイン関係を議論している時は、具体シナリオを使って境界を試す。

例:

```text
再設定トークンを値オブジェクトとする場合、使用済み状態をどこが保持しますか。
使用状態を持つならエンティティ候補であり、値だけなら値オブジェクト候補です。
```

シナリオは、概念同士の境界、ライフサイクル、同一性、契約、例外条件が見えるものにする。

### 成果物と照合する

ユーザーがドメインの振る舞いを述べたら、既存の Amadeus 成果物と照合する。

確認対象の例:

- `.amadeus/glossary.md`
- `.amadeus/intents/<intent-id>-<slug>/domain-notes.md`
- `.amadeus/intents/<intent-id>-<slug>/requirements.md`
- `.amadeus/intents/<intent-id>-<slug>/use-cases.md`
- `.amadeus/intents/<intent-id>-<slug>/units.md`
- `.amadeus/intents/<intent-id>-<slug>/bolts.md`
- `.amadeus/intents/<intent-id>-<slug>/traceability.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/**`
- `.amadeus/domain/**`

実装コードがある workspace では、必要に応じてコードも確認する。
成果物やコードと発言が矛盾する場合は、どちらを採用するかを確認する。

例:

```text
use-cases では再設定トークンが使用状態を持つ前提ですが、
今の説明では単なる値として扱っています。
この Intent ではエンティティと値オブジェクトのどちらに揃えますか。
```

### 確定したらすぐ記録する

用語、概念、モデル、契約が確定したら、その場で該当する Amadeus 成果物を更新する。
後でまとめて記録しない。

更新先の目安:

| 確定したもの | 更新先 |
|---|---|
| Intent 内の未確定語、候補、問い | `.amadeus/intents/<intent-id>-<slug>/domain-notes.md` |
| 全 Intent で共有する確定用語 | `.amadeus/glossary.md` |
| Intent 固有のサブドメイン、BC、モデル、契約 | `.amadeus/intents/<intent-id>-<slug>/domain/**` |
| モデル要素や契約 ID の追跡 | `.amadeus/intents/<intent-id>-<slug>/traceability.md` |
| 全体として採用済みのドメインモデル | `.amadeus/domain/**` |
| 戻しにくいドメイン判断 | `.amadeus/intents/<intent-id>-<slug>/decisions.md` と `decisions/<decision-id>-<slug>.md` |

`.amadeus/glossary.md` は glossary であり、仕様書、検討メモ、実装判断の置き場ではない。
実装詳細や一時的なメモは入れない。

## decision を作る基準

decision はむやみに作らない。
次の3つをすべて満たす場合だけ提案する。

1. 後で変えるコストが意味を持つ。
2. 背景なしに読むと、なぜそうしたか疑問が残る。
3. 複数の選択肢があり、実際に trade-off を選んだ。

この条件を満たさない場合は、`domain-notes.md`、`glossary.md`、`domain/**` の更新で足りる。

## DDD モデル要素

確定済みの識別子は次である。

| 種別 | 識別子 |
|---|---|
| DDD モジュール | `DMnnn` |
| 集約 | `DAnnn` |
| エンティティ | `DEnnn` |
| 値オブジェクト | `DVOnnn` |
| ドメインサービス | `DSnnn` |
| ドメインイベント | `DEVnnn` |

リポジトリ、ファクトリなど、識別子規則が未確定の種別は推測で作らない。
必要な場合は `domain-notes.md` の候補または未確定事項に記録し、識別子規則を別途決める。

## 契約

契約は、事前条件、不変条件、事後条件として扱う。

| 種別 | 識別子 |
|---|---|
| 事前条件 | `PREnnn` |
| 不変条件 | `INVnnn` |
| 事後条件 | `POSTnnn` |

契約を追加する場合は、根拠として要求 ID、ユースケース ID、Unit ID、Bolt ID のいずれかを少なくとも1つ記録する。
根拠がない場合は契約へ昇格せず、`domain-notes.md` に候補として残す。

## 禁止事項

- `CONTEXT.md` を更新しない。
- `docs/adr/**` を作成または更新しない。
- repo の開発用語と、`.amadeus/` が扱う対象ドメイン用語を混ぜない。
- 未確定語を `.amadeus/glossary.md` に追加しない。
- `.amadeus/glossary.md` を仕様書、scratch pad、実装判断置き場として使わない。
- BC、DDD モジュール、モデル要素、契約の識別子を推測で作らない。
- リポジトリ、ファクトリなど未確定の識別子規則を作らない。
- 対象 Intent ディレクトリ名が必要な更新を、Intent ディレクトリ名なしで行わない。
- `.amadeus/intents.md` に新しい Intent を追加しない。
- `requirements.md`、`acceptance.md`、`user-stories.md`、`use-cases.md`、`units.md`、`bolts.md` を作らない。
- `/amadeus-grilling` を内部で呼び出す前提にしない。この skill 自体が、ドメインモデルを磨くために必要な問いを扱う。
- repo の開発用文書や開発用スクリプトを実行時参照として書かない。
