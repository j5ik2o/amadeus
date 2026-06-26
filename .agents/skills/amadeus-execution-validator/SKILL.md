---
name: amadeus-execution-validator
description: 配布先ユーザー環境で Amadeus の実行時構造を検証する。`.amadeus/` 成果物、Intent、domain/bounded-contexts.md、Upstream/Downstream、組織パターン、統合パターンを、repo root の開発用 scripts に依存せず確認したいときに使う。
---

# amadeus-execution-validator

## 目的

配布先ユーザー環境で、Amadeus 成果物が実行時に参照できる最低限の構造条件を満たしているか確認する。

この skill は Execution Validator の入口である。
Development Validator としての `pnpm test` や repo root の `scripts/**` ではない。

## 実行時依存

- Ruby。
- Ruby 標準ライブラリだけを使う。

Ruby が使えない場合は `blocked` として報告する。
検証のために依存パッケージをインストールしない。

## 入力

- 検証対象の作業ディレクトリ。
- 必要に応じて、対象 Intent ID。

対象 Intent ID が指定されない場合は、全体成果物を検証する。
対象 Intent ID が指定された場合は、全体成果物に加えて `.amadeus/intents/<intent-id>/` を検証する。

## 読む参照元

次の順で読む。

1. `CONTEXT.md`
2. `.amadeus/README.md`
3. `.amadeus/intents.md`
4. `.amadeus/domain/subdomains.md`
5. `.amadeus/domain/bounded-contexts.md`
6. `.amadeus/intents/<intent-id>/intent.md`。対象 Intent ID が指定された場合だけ読む。
7. `.amadeus/intents/<intent-id>/requirements.md`。対象 Intent ID が指定された場合だけ読む。
8. `.amadeus/intents/<intent-id>/acceptance.md`。対象 Intent ID が指定された場合だけ読む。
9. `.amadeus/intents/<intent-id>/traceability.md`。対象 Intent ID が指定された場合だけ読む。
10. `.amadeus/intents/<intent-id>/domain/subdomains.md`。対象 Intent ID が指定された場合だけ読む。
11. `.amadeus/intents/<intent-id>/domain/bounded-contexts.md`。対象 Intent ID が指定された場合だけ読む。

存在しない参照元がある場合は、存在しない事実を結果に含める。
存在しない参照元を推測で補完しない。

## 検証範囲

少なくとも次を確認する。

- Amadeus の成果物ルートが `.amadeus/` である。
- `.amadeus/README.md` が存在する。
- `.amadeus/intents.md` が存在する。
- `.amadeus/domain/subdomains.md` が存在する。
- `.amadeus/domain/bounded-contexts.md` が存在する。
- `.amadeus` の index 系成果物が、[artifacts validation](references/artifacts.md) の条件を満たす。
- 対象 Intent ID が指定された場合、`.amadeus/intents/<intent-id>/domain/bounded-contexts.md` が存在する。
- 対象 Intent ID が指定された場合、対象 Intent の index 系成果物が、[artifacts validation](references/artifacts.md) の条件を満たす。
- 対象 Intent ID が指定された場合、対象 Intent の `traceability.md` に出る ID が対応する index または定義元に存在する。
- `domain/bounded-contexts.md` が、[bounded-contexts validation](references/bounded-contexts.md) の条件を満たす。

## 検証手順

次の順で検証する。

1. Ruby が使えるか確認する。
2. 対象 Intent ID を確定する。
   - ユーザーが Intent ID を指定した場合は、その ID だけを対象 Intent にする。
   - Intent ID が指定されていない場合は、全体成果物だけを検証する。
   - `.amadeus/intents.md` から勝手に全 Intent を検証対象に増やさない。
3. skill 同梱の `validator/ExecutionValidator.rb` を実行する。

全体成果物だけを検証する場合:

```sh
ruby <skill-dir>/validator/ExecutionValidator.rb <workdir>
```

対象 Intent ID も検証する場合:

```sh
ruby <skill-dir>/validator/ExecutionValidator.rb <workdir> <intent-id>
```

`ExecutionValidator.rb` は、内部で検査台帳を作り、`pass`、`fail`、`blocked` の判定と不足内容を日本語 Markdown で出力する。
この出力を最終報告の基準にする。

## 判定

判定は `pass`、`fail`、`blocked` のいずれかで出す。

`pass` は、検証対象が実行時に参照できる最低限の構造条件を満たしていることを示す。
`fail` は、成果物の矛盾または必須項目の欠落を示す。
`blocked` は、検証対象や判断材料が不足していることを示す。

`pass` だけで gate を通過した扱いにしない。
`waived` を検証結果にしない。

## 出力

日本語で次の形にまとめる。

```md
# Execution Validator 結果

## 判定

pass | fail | blocked

## 検査サマリ

| 検査カテゴリ | pass | fail | blocked |
|---|---:|---:|---:|
| <カテゴリ> | <件数> | <件数> | <件数> |

## 確認対象

| 対象カテゴリ | 件数 |
|---|---:|
| <カテゴリ> | <件数> |

### <対象カテゴリ>

- <確認したファイル>

## 満たしている条件

- <条件>

## 検査対象外

- <機械検査の対象外にした項目。なければ「なし」>

## 不足または矛盾

- <不足または矛盾。なければ「なし」>

## 次に使う Amadeus skill

- <推奨する次の skill。なければ「なし」>
```

## 禁止事項

- repo root の `scripts/**` を Execution Validator の格納先や実行入口として扱わない。
- `pnpm test` を配布先ユーザー環境の検証入口として扱わない。
- skill 同梱の `validator/ExecutionValidator.rb` 以外を実行時検証入口にしない。
- 検証のために依存パッケージをインストールしない。
- Installer の接続、配布単位、インストール後の実行順序を決めない。
- Intent 状態や成果物状態を変更しない。
- 親参照や欠落ファイルを推測で補完しない。
