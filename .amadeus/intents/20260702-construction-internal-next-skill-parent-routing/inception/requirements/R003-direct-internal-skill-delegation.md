# R003: 内部 skill 直接利用条件

## 要求

Construction 内部 skill を直接呼ぶのは、親 skill から明示的に委譲されている場合だけであることを判断できる。

## 根拠

- [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274)
- [scope.md](../../ideation/scope.md) の SC-IN-003
- [codebase-analysis.md](../codebase-analysis.md)

## 受け入れ状態

- `amadeus-construction-implementation-execution` の `次の skill` 欄に、`amadeus-construction-verification-hardening` を直接呼ぶ条件が明記されている。
- `amadeus-construction-verification-hardening` の `次の skill` 欄に、`amadeus-construction-traceability-finalization` を直接呼ぶ条件が明記されている。
- 直接利用条件は、公開入口である `amadeus-construction` の委譲契約と矛盾しない。

## 対象外

- 内部 skill の公開入口化。
- 内部 skill の実行順序の自動制御追加。
