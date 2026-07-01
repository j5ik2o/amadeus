# Business Logic Model

## 目的

U001 は、Amadeus 成果物に現れる参照表記をリンクとして扱うための対象種別とリンク先規則を扱う。

この Functional Design では、参照先が一意に決まる ID、PR番号、Issue番号、ファイルパス、成果物名をリンク化対象として整理する。

## 対象 Unit

- U001 参照リンク化方針契約

## 業務ロジック

1. 成果物内の参照表記を、ID、PR番号、Issue番号、workspace 内ファイルパス、GitHub 上のファイルパス、成果物名に分類する。
2. 参照先が一意に決まる表記だけをリンク化対象にする。
3. workspace 内成果物は、参照元 Markdown から見た相対 Markdown リンクにする。
4. GitHub 上のファイルパスまたはコード参照は、branch URL ではなく commit SHA 付き permalink にする。
5. PR番号は GitHub Pull Request URL にする。
6. Issue番号は GitHub Issue URL にする。
7. 参照先が一意に決まらない一般語、内容変更、検出実装の詳細は対象外にする。

## 入力

- 参照種別
- 表示文字列
- 参照元成果物
- 参照先成果物
- 対象 repository
- commit SHA
- PR番号
- Issue番号

## 出力

- 参照リンク化対象
- 対象外理由
- workspace 内成果物の相対リンク規則
- GitHub permalink 規則
- PR URL 規則
- Issue URL 規則
- 適用成果物範囲
- template と example snapshot の扱い
- 既存成果物補修の境界

## 適用成果物範囲

1. source skill の template を更新対象にする場合は、対応する `.agents/skills` の昇格先成果物も昇格スクリプトで更新する。
2. Inception と Construction の `traceability.md`、`decisions.md`、`tasks.md`、`test-results.md`、`pr.md` は、参照先が一意に決まる ID、PR番号、Issue番号、ファイルパス、成果物名をリンク化対象にする。
3. example snapshot は手作業で部分更新せず、source skill と validator の契約が揃った後の再生成対象として扱う。
4. 既存 `.amadeus/` 成果物は、内容意味を変えずに参照リンク化だけを補修する。
5. Functional Design の内容変更、Unit と Bolt の再分割、Domain Map と Context Map の採用判断変更、machine-readable evidence の導入は、この適用範囲に含めない。

## 未確認事項

- 同一ファイル内アンカーを必須にする範囲は B002 以降で確定する。
