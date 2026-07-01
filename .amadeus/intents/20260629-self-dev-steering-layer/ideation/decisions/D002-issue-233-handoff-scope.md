# D002: Issue #233 引き継ぎ範囲

## 背景

- D001 では、初回導入 Intent を Ideation gate passed として完了し、Inception 以降を後続 Issue と後続 Intent に渡すと判断した。
- 既存の未確定事項には、stage 判定、`CONTEXT.md` への stage 語彙追加、example snapshot の provenance、host environment の assets と target artifacts の assets の混入検出、build workspace と target workspace の対応記録が含まれる。
- [Issue #233](https://github.com/amadeus-dlc/amadeus/issues/233) は、自己開発 cycle の stage 判定と workspace 対応記録を定義するための後続 Issue である。

## 判断

- Issue #233 へ渡す範囲を、stage 判定と build workspace / target workspace の対応記録に限定する。
- `CONTEXT.md` への stage0、stage1、stage2 の追加は、Issue #233 の対象外として後続判断に残す。
- example snapshot の provenance と、host environment の assets と target artifacts の assets の混入検出は、別 Issue または後続 Intent に残す。

## 理由

- Issue #233 の範囲を限定すると、初回導入 Intent から後続 Intent へ渡す判断が stage 判定と workspace 対応記録に集中する。
- `scope.md` は `CONTEXT.md` への stage0、stage1、stage2 の追加を対象外としているため、Issue #233 で語彙追加まで広げると既存の対象外判断と衝突する。
- example snapshot の provenance と assets 混入検出は、validator や example 更新に関わる可能性があり、Issue #233 の中心である stage 判定と workspace 対応記録から外れる。

## 影響

- 後続 Intent は、stage 判定と build workspace / target workspace の対応記録を Inception の要求分析へ渡せる。
- stage 語彙追加、example snapshot provenance、assets 混入検出は、別 Issue または後続 Intent の候補として残る。
