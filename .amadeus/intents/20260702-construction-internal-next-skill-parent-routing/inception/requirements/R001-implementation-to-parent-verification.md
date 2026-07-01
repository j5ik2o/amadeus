# R001: 実装後の親 skill 経由検証

## 要求

`amadeus-construction-implementation-execution` の `次の skill` 欄から、実装後は `amadeus-construction` を検証目的で呼ぶことを判断できる。

## 根拠

- [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274)
- [scope.md](../../ideation/scope.md) の SC-IN-001
- [codebase-analysis.md](../codebase-analysis.md)

## 受け入れ状態

- `amadeus-construction-implementation-execution` の `次の skill` 欄に、実装後の検証へ進む場合は `amadeus-construction` を検証目的で呼ぶ説明がある。
- 親 skill が `amadeus-construction-verification-hardening` に委譲することを読み取れる。
- 実装実行 skill 自体は検証結果、traceability、state.json、PR 記録を更新しない境界を維持する。

## 対象外

- 実装実行 skill の責務変更。
- Construction の stage 構造変更。
