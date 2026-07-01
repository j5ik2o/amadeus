# 自己開発用 Steering Layer 導入

## 目標プロファイル

| フィールド | 値 | 説明 |
|---|---|---|
| goalType | technical | Amadeus 本体リポジトリの自己開発基盤を整備する技術目標である。 |
| scope | feature | root `.amadeus/` steering layer を導入する新規機能相当の Intent である。 |
| labels | self-dev, steering | 自己開発用 steering layer の導入を表す。 |

## 目的

Amadeus 本体リポジトリに、Amadeus 自己開発用の root `.amadeus/` steering layer を導入する。

この Intent は [Issue #108](https://github.com/j5ik2o/amadeus/issues/108) を根拠にする。

## 成功条件

- root `.amadeus/` が、Amadeus 本体開発全体の steering layer として読める。
- GitHub Issue と Intent の接続方針が記録されている。
- build workspace、host environment、target workspace、target artifacts の分離方針が記録されている。
- stage2 から次回 stage0 への昇格条件が記録されている。
- Ideation gate が passed である。

## 範囲

含めるもの:

- `.amadeus/README.md`
- `.amadeus/steering.md`
- `.amadeus/steering/**`
- `.amadeus/development.md`
- `.amadeus/glossary.md`
- `.amadeus/domain/**`
- `.amadeus/intents.md`
- この Intent の Ideation 成果物
- `README.md` の root `.amadeus/` 説明更新

含めないもの:

- 個別 skill 改善
- validator の大きな拡張
- example snapshot の再生成
- ハーネス実装
- provenance の自動収集
- `git submodule` 構成
