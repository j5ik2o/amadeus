# Skill Contract Catalog

## 目標プロファイル

| フィールド | 値 | 説明 |
|---|---|---|
| goalType | technical | Amadeus の skill 実行契約を TypeScript と生成物で扱えるようにする技術目標である。 |
| scope | refactor | 既存の `amadeus-contracts` と代表 skill を前提に、skill 実行契約の管理元と生成参照を整理する Intent である。 |
| labels | skill-contract, contracts, validator, evaluator, self-development | skill 実行契約、契約生成、validator、evaluator、自己開発を表す。 |

## 目的

Amadeus に Skill Contract を追加し、公開 skill と代表内部 skill の実行契約を `amadeus-contracts` から生成参照できるようにする。

この Intent は [Issue #263](https://github.com/amadeus-dlc/amadeus/issues/263) を根拠にする。

現在の skill 実行契約は、主に `SKILL.md` の自然文に分散している。
そのため、decision review、learning review、validator、evaluator が同じ契約を機械的に参照しにくい。

この Intent では、事前条件、不変条件、事後条件、読み取り境界、書き込み境界、委譲先、grilling 条件、feedback 条件を Skill Contract として整理する。
また、`SKILL.md`、validator、evaluator、横断的補助 skill が同じ契約を参照できる状態を目指す。

## 成功条件

- `amadeus-contracts` に Skill Contract の TypeScript 型を追加する方針が整理されている。
- 代表 skill の事前条件、不変条件、事後条件を TypeScript で記述できる。
- `contracts:generate` で skill 契約の生成物を作る方針が整理されている。
- `contracts:check` で生成物のずれを検出する方針が整理されている。
- validator または evaluator が Skill Contract を参照する入口を整理できる。
- Issue #257 の decision review と Issue #259 の learning review が Skill Contract を入力として使える設計に接続できる。

## 範囲

含めるもの:

- Skill Contract の型と catalog への配置方針。
- 代表 skill の契約記述対象。
- `references/skill-contract.md` または同等生成物の配置方針。
- validator または evaluator が参照する生成物の入口。
- `SKILL.md` と生成物の不整合検出。
- Issue #257 と Issue #259 へ渡す契約入力。

含めないもの:

- 全 skill への一括適用。
- 既存 `SKILL.md` の全面再構成。
- validator を意味検証エンジンへ拡張すること。
- TypeScript 契約から skill 本文を完全生成すること。
- 各 skill の `references/` に手書き契約を置くこと。
- Inception の前に要求、ユースケース、Unit、Bolt、Task、実装を作ること。

## 現在の phase

Ideation を開始する。

Inception では、Skill Contract の型、生成物、代表 skill、validator または evaluator の参照入口、decision review と learning review への接続を要求として具体化する。
