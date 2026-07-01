# Domain Entities

## 目的

Functional Design は詳細な Domain Model と Intent Contracts の管理元である。

この Unit で扱う報告契約要素を、Construction 成果物内の Domain Model として整理する。

## Domain Entity

| 識別子 | 名前 | 責務 | 関連 |
|---|---|---|---|
| DE001 | 実行時問題報告 | skill 実行中に見つかった問題や懸念、根拠、推奨分類を保持する。 | BR001, BR005 |
| DE002 | 報告先分類 | 現在の Intent 対象、後続 Issue 候補、報告不要のいずれかを表す。 | BR001, BR002, BR003 |
| DE003 | 後続 Issue 候補 | 人間承認後に GitHub Issue として起票できる候補情報を保持する。 | BR003, BR004 |
| DE004 | 検出候補 | validator または evaluator で検出すべき観点を保持する。 | BR005, BR007 |

## 関係

`実行時問題報告` は `報告先分類` を1つ持つ。
`実行時問題報告` は、必要に応じて `後続 Issue 候補` と `検出候補` を持つ。
`後続 Issue 候補` は人間承認なしに GitHub Issue へ昇格しない。

## Domain Map と Context Map への反映候補

| 対象 | 種別 | 候補内容 | 承認後の扱い | 根拠 |
|---|---|---|---|---|
| なし | Domain Map | 新しい共有境界はない。 | 更新しない | D002 |
| なし | Context Map | 新しいコンテキスト依存はない。 | 更新しない | D002 |

## 未確認事項

なし。
