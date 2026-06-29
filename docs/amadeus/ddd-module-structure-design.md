# DDD Module モジュール構造設計

## 目的

DDD Module を Amadeus のモジュール構造に揃える。

この設計は、`docs/amadeus/module-structure-validator-design.md` で後続扱いにした DDD Module の具体配置と validator 方針を固定する。

## 背景

現行の Domain Modeling skill は、DDD Module を `domain/bounded-contexts/<bounded-context-id>/models/<ddd-module-id>/model.md` に置く前提を持つ。

一方で、Bounded Context はすでに `domain/bounded-contexts/<bounded-context-id>-<slug>.md` と `domain/bounded-contexts/<bounded-context-id>-<slug>/` のモジュール構造に移行している。

そのため、DDD Module だけが Bounded Context 配下で旧配置のまま残る。

## 判断

DDD Module の詳細は、モジュールファイルへ移す。

```text
.amadeus/domain/bounded-contexts/<bounded-context-id>-<slug>/models/<ddd-module-id>-<slug>.md
.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts/<bounded-context-id>-<slug>/models/<ddd-module-id>-<slug>.md
```

`models.md` の `詳細` は、DDD Module のモジュールファイルを指す。

```text
models/<ddd-module-id>-<slug>.md
```

旧配置の `models/<ddd-module-id>-<slug>/model.md` は許容しない。

後方互換は維持しない。

## モジュールディレクトリ

DDD Module のモジュールディレクトリは、追加の子成果物が必要になった時だけ作る。

```text
.amadeus/domain/bounded-contexts/<bounded-context-id>-<slug>/models/<ddd-module-id>-<slug>/
.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts/<bounded-context-id>-<slug>/models/<ddd-module-id>-<slug>/
```

現時点では、空のモジュールディレクトリを要求しない。

DDD Module の状態管理も行わないため、`state.json` は置かない。

## DDD Module モジュールファイル

DDD Module のモジュールファイルは、境界づけられたコンテキスト内のモデル単位を扱う。

必須見出しは次である。

- `目的`
- `責務`
- `概念関係`
- `ライフサイクル`
- `集約候補`
- `モデル要素`
- `関連成果物`

各見出しには本文が必要である。

`モデル要素` では、存在する要素種別だけを表で扱う。

表名と識別子は次である。

| 表 | 識別子 |
|---|---|
| 集約 | `DAnnn` |
| エンティティ | `DEnnn` |
| 値オブジェクト | `DVOnnn` |
| ドメインサービス | `DSnnn` |
| ドメインイベント | `DEVnnn` |
| リポジトリ | `DRnnn` |
| ファクトリ | `DFnnn` |

各表は、次の列を持つ。

- `識別子`
- `名前`
- `役割`
- `根拠`

`名前`、`役割`、`根拠` は空欄にしない。

識別子は同じ DDD Module のモジュールファイル内で重複させない。

## `models.md`

`models.md` は、境界づけられたコンテキスト内の DDD Module index である。

対象は次である。

- `.amadeus/domain/bounded-contexts/<bounded-context-id>-<slug>/models.md`
- `.amadeus/intents/<intent-id>-<slug>/domain/bounded-contexts/<bounded-context-id>-<slug>/models.md`

`一覧` の表は、次の列を持つ。

- `識別子`
- `名前`
- `役割`
- `詳細`

`識別子` は `DMnnn` の形式にする。

同じ `models.md` 内で `識別子` を重複させない。

`詳細` は `models/<ddd-module-id>-<slug>.md` を指す相対リンクにする。

`詳細` の stem は `DMnnn-<slug>` の形式にする。

## validator 方針

validator は、`models.md` が存在する場合だけ DDD Module を検査する。

`models.md` が存在しない場合は、不足にしない。

`models.md` が存在する場合は、次を検査する。

- `一覧` の必須表列が揃っている。
- `識別子` が `DMnnn` 形式である。
- `識別子` が重複していない。
- `詳細` が `models/<ddd-module-id>-<slug>.md` を指す。
- `詳細` の stem が行の `識別子` と一致する。
- DDD Module のモジュールファイルが存在する。
- DDD Module のモジュールファイルが必須見出しを持つ。
- DDD Module のモジュールファイルの必須見出しに本文がある。
- DDD Module のモジュールファイル内のモデル要素表が、存在する場合は必須列を持つ。
- DDD Module のモジュールファイル内のモデル要素識別子が、表種別に対応する形式である。

validator は、未登録の `models/<ddd-module-id>-<slug>/model.md` を全走査して fail にしない。

ただし、`models.md` の `詳細` が旧配置を指す場合は fail にする。

## 更新対象

実装 PR では、次を更新する。

- `CONTEXT.md`
- `docs/amadeus/concept-model.md`
- `docs/amadeus/module-structure-validator-design.md`
- `skills/amadeus-domain-modeling/SKILL.md`
- `skills/amadeus-validator/references/artifacts.md`
- `skills/amadeus-validator/validator/AmadeusValidator.ts`
- `dev-scripts/evals/amadeus-validator/check.ts`
- 必要な examples
- `.agents/skills` 配下の promoted skill

## 対象外

次はこの対応では扱わない。

- DDD Module の子成果物設計。
- 集約、エンティティ、値オブジェクトごとの個別モジュールファイル。
- `.amadeus/**` の未登録ファイル全走査。
- 旧配置から新配置へ変換する migration command。
- 後方互換の維持。

## 検証方針

実装 PR では、TDD で進める。

まず eval に、`models.md` の `詳細` が `models/<ddd-module-id>-<slug>/model.md` を指す場合に fail するケースを追加する。

次に、`models.md` の `詳細` が `models/<ddd-module-id>-<slug>.md` を指し、対応する DDD Module モジュールファイルが存在する場合に pass するよう validator を更新する。

少なくとも次を実行する。

- `npm run test:it:amadeus-validator`
- `npm run test:it:promote-skill`
- `npm run validate:all`
- `npm run diff:check`
