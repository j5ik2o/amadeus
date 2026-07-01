# Business Logic Model

## 目的

Construction 内部 skill の次工程案内を、公開入口である `amadeus-construction` 経由の継続として判断できるようにする。

## 対象 Unit

U001 Construction 内部 skill 次工程案内。

## 業務ロジック

Construction の内部 skill は、それぞれの stage に対応する限定された責務を持つ。

`amadeus-construction-implementation-execution` は実装実行だけを扱う。
そのため、実装後に検証へ進む判断は、公開入口である `amadeus-construction` を検証目的で呼ぶ案内として示す。

`amadeus-construction-verification-hardening` は検証と堅牢化だけを扱う。
そのため、検証後に追跡と状態確定へ進む判断は、公開入口である `amadeus-construction` をファイナライズ目的で呼ぶ案内として示す。

内部 skill を直接呼ぶのは、親 skill から該当プロセスを明示的に委譲されている場合だけにする。
これにより、公開入口の順序制御と内部 skill の責務境界を両立する。

## 入力

- Issue #274。
- `amadeus-construction` の公開入口契約。
- `amadeus-construction-implementation-execution` の `次の skill` 欄。
- `amadeus-construction-verification-hardening` の `次の skill` 欄。
- U001 の Unit Design Brief。

## 出力

- implementation execution の実装後案内。
- verification hardening の検証後案内。
- 内部 skill 直接利用条件。
- source skill と昇格先成果物の整合確認結果。

## 未確認事項

- 周辺 skill の更新要否は B003 で確認する。
