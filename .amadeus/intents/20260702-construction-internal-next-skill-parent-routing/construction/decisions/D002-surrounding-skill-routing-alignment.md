# D002: 周辺 Construction 内部 skill の案内も親 skill 経由にそろえる

## 状態

accepted

## 文脈

B001 と B002 で主要な実装後案内、検証後案内を親 skill 経由へ更新した。

一方で、周辺の Construction 内部 skill にも次工程を内部 skill 直行として読める案内が残ると、Issue #274 の目的である親 skill 経由の継続と矛盾する。

## 判断

`amadeus-construction-functional-design` と `amadeus-construction-bolt-preparation` の `次の skill` 欄は、`amadeus-construction` を目的付きで呼ぶ案内へ更新する。

`amadeus-construction-traceability-finalization` の `次の skill` 欄は内部 skill 直行を案内していないため更新しない。
ただし、`test-results.md` 不足時の戻り案内は検証工程への案内であるため、`amadeus-construction` を検証目的で案内する形へ更新する。

## 影響

- Construction の公開入口契約と内部 skill の次工程案内が整合する。
- 内部 skill を直接呼ぶ条件は、親 skill から明示的に委譲された場合として読める。
- Construction の stage 構造、成果物境界、validator は変更しない。
