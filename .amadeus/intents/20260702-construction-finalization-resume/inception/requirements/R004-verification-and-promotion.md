# R004 検証と昇格同期

## 要求

検出スクリプトの検証が先行して存在し、source skill と昇格先成果物が同期されている。

## 背景

`skills/**/scripts/**` は Script Rules の対象であり、先に失敗する検証を追加してから実装する。
また、検証（eval）は昇格先に混入させず、source skill 側に置く必要がある。

## 受け入れ条件

- 検出スクリプトの eval が `skills/amadeus-construction/evals/` にあり、実装前に失敗することを確認した記録がある。
- eval が repo の標準検証から実行される。
- 昇格先成果物（`.agents/skills/amadeus-construction/`）に evals が混入していない。
- source skill と昇格先成果物が promote 手順で同期され、skill 変更 PR がレビュー支援契約（挙動差分要約、skill-forge 確認、粒度制約）に従っている。

## 依存

- R002
- R003

## 対応する対象境界

- SC-IN-004
- SC-IN-005

## 未確認事項

- なし。
