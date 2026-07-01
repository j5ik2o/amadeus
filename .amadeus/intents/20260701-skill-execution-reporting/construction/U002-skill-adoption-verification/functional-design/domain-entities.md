# Domain Entities

## 目的

Functional Design は詳細な Domain Model と Intent Contracts の管理元である。

この Unit で扱う代表 skill 反映と eval 整合を、Construction 成果物内の Domain Model として整理する。

## Domain Entity

| 識別子 | 名前 | 責務 | 関連 |
|---|---|---|---|
| DE001 | 代表 skill | 初回反映対象にする公開 skill を表す。 | BR001 |
| DE002 | 昇格結果 | source skill から昇格先 skill へ反映した結果を表す。 | BR002 |
| DE003 | Eval 契約 | 報告契約を検出する eval の期待条件を表す。 | BR003 |
| DE004 | 対象外理由 | 初回反映しない skill または eval の理由を表す。 | BR004 |

## 関係

`代表 skill` は `昇格結果` を持つ。
`Eval 契約` は `代表 skill` の source skill と昇格先 skill を検証する。
`対象外理由` は初回反映しない skill に結び付く。

## Domain Map と Context Map への反映候補

| 対象 | 種別 | 候補内容 | 承認後の扱い | 根拠 |
|---|---|---|---|---|
| なし | Domain Map | 新しい共有境界はない。 | 更新しない | D002 |
| なし | Context Map | 新しいコンテキスト依存はない。 | 更新しない | D002 |

## 未確認事項

なし。
