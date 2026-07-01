# R002: 検証後の親 skill 経由ファイナライズ

## 要求

`amadeus-construction-verification-hardening` の `次の skill` 欄から、検証後は `amadeus-construction` をファイナライズ目的で呼ぶことを判断できる。

## 根拠

- [Issue #274](https://github.com/amadeus-dlc/amadeus/issues/274)
- [scope.md](../../ideation/scope.md) の SC-IN-002
- [codebase-analysis.md](../codebase-analysis.md)

## 受け入れ状態

- `amadeus-construction-verification-hardening` の `次の skill` 欄に、追跡と状態確定へ進む場合は `amadeus-construction` をファイナライズ目的で呼ぶ説明がある。
- 親 skill が `amadeus-construction-traceability-finalization` に委譲することを読み取れる。
- 検証 skill 自体は traceability、acceptance、decisions、state.json、PR 記録を更新しない境界を維持する。

## 対象外

- 検証 skill の責務変更。
- traceability finalization の成果物境界変更。
