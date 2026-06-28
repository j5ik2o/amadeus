# ポリシー

## 方針

| 識別子 | 方針 | 根拠 |
|---|---|---|
| POL001 | 大きなテーマは Discovery で分解してから Intent 化する | Intent の粒度を誤ると後続成果物が要求の羅列になりやすいため |
| POL002 | 例示は root `.amadeus/` ではなく `examples/` に置く | 実運用状態と例示成果物を混ぜないため |

## 禁止事項

| 識別子 | 禁止事項 | 理由 |
|---|---|---|
| BAN001 | Discovery で Requirement、Use Case、Unit、Bolt、Task を作らない | Discovery の責務は Intent 化方針の判断に限定するため |

## 判断基準

- Intent 候補が複数ある場合は、依存順序と最初に進める候補を Discovery Brief に残します。
- 後続 phase の例示は、skill で生成できる粒度に保ちます。
