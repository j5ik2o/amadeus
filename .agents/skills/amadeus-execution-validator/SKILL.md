---
name: amadeus-execution-validator
description: 配布先ユーザー環境で Amadeus の実行時構造を検証する。`.amadeus/` 成果物、Intent、domain/bounded-contexts.md、Upstream/Downstream、組織パターン、統合パターンを、repo root の開発用 scripts に依存せず確認したいときに使う。
---

# amadeus-execution-validator

## 目的

配布先ユーザー環境で、Amadeus 成果物が実行時に参照できる最低限の構造条件を満たしているか確認する。

この skill は Execution Validator の入口である。
Development Validator としての `pnpm test` や repo root の `scripts/**` ではない。

## 入力

- 検証対象の作業ディレクトリ。
- 必要に応じて、対象 Intent ID。

対象 Intent ID が指定されない場合は、全体成果物を検証する。
対象 Intent ID が指定された場合は、全体成果物に加えて `.amadeus/intents/<intent-id>/` を検証する。

## 読む正本

次の順で読む。

1. `CONTEXT.md`
2. `.amadeus/README.md`
3. `.amadeus/domain/bounded-contexts.md`
4. `.amadeus/intents/<intent-id>/domain/bounded-contexts.md`。対象 Intent ID が指定された場合だけ読む。

存在しない正本がある場合は、存在しない事実を結果に含める。
存在しない正本を推測で補完しない。

## 検証範囲

少なくとも次を確認する。

- Amadeus の成果物ルートが `.amadeus/` である。
- `.amadeus/README.md` が存在する。
- `.amadeus/domain/bounded-contexts.md` が存在する。
- 対象 Intent ID が指定された場合、`.amadeus/intents/<intent-id>/domain/bounded-contexts.md` が存在する。
- `domain/bounded-contexts.md` が、[bounded-contexts validation](references/bounded-contexts.md) の条件を満たす。

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

## 確認対象

- <確認したファイル>

## 満たしている条件

- <条件>

## 不足または矛盾

- <不足または矛盾。なければ「なし」>

## 次に使う Amadeus skill

- <推奨する次の skill。なければ「なし」>
```

## 禁止事項

- repo root の `scripts/**` を Execution Validator の格納先や実行入口として扱わない。
- `pnpm test` を配布先ユーザー環境の検証入口として扱わない。
- Installer の接続、配布単位、インストール後の実行順序を決めない。
- Intent 状態や成果物状態を変更しない。
- 親参照や欠落ファイルを推測で補完しない。
