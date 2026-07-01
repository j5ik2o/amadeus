# S001: Agent の次工程判断

## ユーザーストーリー

Agent として、Construction 内部 skill の処理後に親 skill 経由で次工程へ進む判断ができるようにしたい。

これにより、実装後に検証へ進み、検証後に traceability finalization へ進む流れを取り違えにくくする。

## 対象要求

- R001
- R002
- R003
- R004

## 受け入れ状態

- 実装後に `amadeus-construction` を検証目的で呼ぶことを判断できる。
- 検証後に `amadeus-construction` をファイナライズ目的で呼ぶことを判断できる。
- 内部 skill を直接呼ぶ条件を判断できる。

## 未確認事項

- 周辺 skill の案内も Agent の次工程判断へ含める必要があるかは、Construction で確認する。
