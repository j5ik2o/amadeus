# Domain Entities

## 目的

Skill Contract generation and drift で扱う概念を定義する。

Functional Design は詳細な Domain Model と Intent Contracts の管理元である。

## Domain Entity

| 識別子 | 名前 | 責務 | 関連 |
|---|---|---|---|
| DE001 | Generated Skill Contract Artifact | Skill Contract catalog から作る生成物を表す。 | DE002, DE003 |
| DE002 | Generated File Entry | path と content を持つ生成対象を表す。 | DE001 |
| DE003 | Drift Result | 現在ファイルと生成内容の差分検出結果を表す。 | DE001, DE002 |
| DE004 | Skill Contract Reference Document | skill 配下の `references/skill-contract.md` を表す。 | DE001 |

## 関係

Generated File Entry は、Skill Contract catalog から JSON、Markdown、TypeScript の content を作る。
Drift Result は、Generated File Entry と現在ファイルを比較して欠落または差分を示す。
Skill Contract Reference Document は Generated Skill Contract Artifact の一種であり、直接編集せず catalog から再生成する。

## Domain Map と Context Map への反映候補

| 対象 | 種別 | 候補内容 | 承認後の扱い | 根拠 |
|---|---|---|---|---|
| なし | なし | 新しい Bounded Context やコンテキスト間依存は追加しない。 | Domain Map と Context Map は更新しない。 | U002 は BC001 内の生成とずれ検出を扱うため。 |

## 未確認事項

なし。
