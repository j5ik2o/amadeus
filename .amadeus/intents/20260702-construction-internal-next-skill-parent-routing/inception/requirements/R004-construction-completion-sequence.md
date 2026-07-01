# R004: Construction 完了までの順序

## 要求

実装完了だけでは Construction 完了ではなく、検証と traceability finalization が必要であることを判断できる。

## 根拠

- [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274)
- [scope.md](../../ideation/scope.md) の SC-IN-004
- [codebase-analysis.md](../codebase-analysis.md)

## 受け入れ状態

- 実装後は検証へ進むことを、`amadeus-construction-implementation-execution` の案内から読み取れる。
- 検証後は traceability finalization へ進むことを、`amadeus-construction-verification-hardening` の案内から読み取れる。
- `test-results.md` を作っただけでは Construction 完了ではなく、tasks、acceptance、traceability、decisions、state.json の更新が必要であることを判断できる。

## 対象外

- Construction の一括自動実行。
- Construction の完了状態ルールの再設計。
