# Unit と境界づけられたコンテキストの対応方針

## 目的

この文書は、1つの Intent が複数の境界づけられたコンテキストをまたぐ場合の Unit 配置方針を定める。

## AI-DLC 上の前提

AI-DLC では、Intent は達成したい目的を表す出発点である。

Intent は、単一の境界づけられたコンテキストに閉じるとは限らない。

むしろ、複数の境界づけられたコンテキストをまたぐ目的を、Unit に分解して開発と検証へ進めることがある。

そのため、Amadeus DLC では Intent を lifecycle の基準にする。

境界づけられたコンテキストは、Intent を所有する単位ではなく、Unit の責務境界と協調関係を説明する分類軸として扱う。

境界づけられたコンテキストから関連 Intent を見る場合は、所有関係ではなく派生ビューとして扱う。

## 初期化時の扱い

`amadeus-intent-init` は、境界づけられたコンテキスト起点か Intent 起点かを構造モードとして質問しない。

Amadeus DLC の lifecycle は Intent 起点で進むため、この二択を初期化時に提示すると、AI-DLC の前提と Amadeus 成果物の所有関係が揺れる。

この理由により、構造モード選択を目的にした `amadeus-init` は新設しない。

workspace の初期化入口は `amadeus-steering` として扱う。

Amadeus workspace として使い始めるには、steering layer を必須にする。

ただし、steering layer の全項目が確定している必要はない。

すぐに開始したい場合は、`amadeus-steering` の `scaffold-only` で未確認事項を残した最小 steering layer を作る。

steering layer が存在しない状態では、`amadeus-discovery` や `amadeus-intent-init` へ進まない。

入力テーマが大きい、曖昧、または既存 Intent との関係が不明な場合は `amadeus-discovery` を使う。

単一 Intent として明確な場合は `amadeus-intent-init` を使う。

境界づけられたコンテキスト起点の skill や command は存在してよい。

ただし、その役割は関連 Intent の一覧化、影響範囲の確認、domain model の補修、Unit の責務境界確認に限定する。

境界づけられたコンテキスト起点の入口は、Intent lifecycle の代替入口として扱わない。

## 問題

Intent が複数の境界づけられたコンテキストをまたぐ場合、`units/` と `bolts/` をフラットに置くだけでは、各 Unit がどの境界づけられたコンテキストを主担当にしているか分かりにくい。

一方で、境界づけられたコンテキストごとにディレクトリを切ると、Intent 全体に属する成果物まで分断される。

特に、`requirements/`、`use-cases/`、`user-stories/`、`decisions/` は、単一の境界づけられたコンテキストだけに閉じるとは限らない。

また、複数の境界づけられたコンテキストを協調させる Unit は、どのディレクトリに置くべきかが曖昧になる。

さらに、基盤整備や横断改善のように、複数 Unit を同時に扱わないと意味のある検証にならない Bolt もある。

## 方針

Intent 配下の成果物配置はフラットに維持する。

Unit は、主担当の境界づけられたコンテキストを1つ持つ。

Unit は、協調先の境界づけられたコンテキストを0個以上持てる。

Bolt は Unit を参照することで、境界づけられたコンテキストに接続する。

Bolt は通常、1つの Unit を対象にする。

Bolt は、実施上必要な場合に限り、複数 Unit を対象にできる。

複数 Unit を対象にする Bolt は、対象 Unit と Unit Design Brief をすべて参照し、同じ Bolt で扱う理由を `複数 Unit を扱う理由` に記録する。

```text
Intent 1 -> 1..* Unit
Unit 1 -> 1 primary bounded context
Unit 1 -> 0..* collaborating bounded context
Bolt 1 -> 1..* Unit
```

境界づけられたコンテキストから Intent への対応は、次のような派生ビューとして扱う。

```text
bounded context 1 -> 0..* related Intent
```

この対応は、Intent lifecycle の所有関係ではない。

## 成果物への反映

`units/<unit-id>-<slug>.md` には、主担当の境界づけられたコンテキストと協調先の境界づけられたコンテキストを記録する。

`units/<unit-id>-<slug>/design.md` には、境界づけられたコンテキスト間の責務分担、契約、連携方式を記録する。

`domain/bounded-contexts.md` には、Unit 分割への入力として、Unit と境界づけられたコンテキストの対応を記録する。

`bolts.md` と `bolts/<bolt-id>-<slug>.md` には、Bolt が対象にする Unit と Unit Design Brief を記録する。

Bolt が複数 Unit を対象にする場合は、複数 Unit を同じ Bolt で扱う理由を `bolts/<bolt-id>-<slug>.md` の `複数 Unit を扱う理由` に記録する。

## Validator 境界

validator は、Unit に主担当の境界づけられたコンテキスト欄が存在することを確認する。

validator は、主担当の境界づけられたコンテキスト ID が `domain/bounded-contexts.md` に存在することを確認する。

validator は、協調先の境界づけられたコンテキスト ID が存在する場合、同じく `domain/bounded-contexts.md` に存在することを確認する。

validator は、Bolt が参照する Unit ID が存在することを確認する。

validator は、Bolt が複数 Unit を参照する場合、`複数 Unit を扱う理由` 見出しと本文が存在することを確認する。

validator は、その Unit にその境界づけられたコンテキストを割り当てる業務的な妥当性までは判断しない。

validator は、複数 Unit を同じ Bolt で扱う業務的な妥当性までは判断しない。
