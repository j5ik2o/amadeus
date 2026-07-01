# 追跡

## Ideation からの追跡

| Ideation 要素 | 対象 | 定義元 | 後続への渡し方 |
|---|---|---|---|
| Intent | 20260702-construction-internal-next-skill-parent-routing | [20260702-construction-internal-next-skill-parent-routing.md](../../20260702-construction-internal-next-skill-parent-routing.md) | Inception の要求分析で参照する。 |
| Issue | #274 | [GitHub Issue](https://github.com/amadeus-dlc/amadeus/issues/274) | Requirement、Acceptance、Use Case、Unit、Bolt の根拠にする。 |
| 先行 Intent | 20260701-construction-finalization-traceability-skill | [state.json](../../20260701-construction-finalization-traceability-skill/state.json) | Construction finalization を完了条件として扱う既存契約を参照する。 |
| 対象境界 | Construction 内部 skill の次工程案内 | [scope.md](scope.md) | Inception の Requirement、Use Case、Unit、Bolt の対象と対象外の制約にする。 |
| 実行制御 | refactor、stage 省略なし | [scope.md](scope.md) | Inception から Construction へ進める前提にする。 |
| 成果物深度 | standard | [scope.md](scope.md) | 対象 skill、直接委譲条件、source skill と昇格先成果物の対応を分解する入力にする。 |
| 検証戦略 | standard | [scope.md](scope.md) | validator、typecheck、diff check、文面確認を PR 準備条件にする。 |
| Mock | 初期確認 | [initial-confirmation.puml](mocks/initial-confirmation.puml) | Inception で次工程案内の確認例にする。 |
| 状態 | Ideation completed | [state.json](../state.json) | Inception へ進める前提にする。 |

## 依存関係からの追跡

| 種別 | 対象 | 依存 | 理由 | 定義元 |
|---|---|---|---|---|
| インテント | 20260702-construction-internal-next-skill-parent-routing | 20260701-construction-finalization-traceability-skill | Issue #274 は、Construction finalization を忘れないための次工程案内を扱い、Issue #245 の追跡要件と同じ公開入口契約を前提にするため。 | [intents.md](../../../intents.md) |
| Issue | #274 | #245 | Construction 完了には traceability finalization が必要であることを前提に、内部 skill の案内を補正するため。 | [GitHub Issue #245](https://github.com/amadeus-dlc/amadeus/issues/245) |
| 外部システム | EXT001 GitHub | なし | Issue、PR、CI、review comment を追跡の根拠に使うため。 | [external-systems.md](../../../steering/external-systems.md) |
| アクター | ACT001 Maintainer | なし | 公開入口契約と内部 skill の案内が矛盾しないことを判断するため。 | [actors.md](../../../steering/actors.md) |

## 受け入れ条件への対応

| 受け入れ条件 | Ideation での扱い | Inception への引き渡し |
|---|---|---|
| `amadeus-construction-implementation-execution` の `次の skill` 欄で、実装後は `amadeus-construction` を検証目的で呼ぶことが明記されている。 | scope の SC-IN-001 に記録した。 | 対象 skill の文面要求として扱う。 |
| `amadeus-construction-verification-hardening` の `次の skill` 欄で、検証後は `amadeus-construction` をファイナライズ目的で呼ぶことが明記されている。 | scope の SC-IN-002 に記録した。 | 対象 skill の文面要求として扱う。 |
| 内部 skill を直接呼ぶのは、親 skill から明示的に委譲されている場合だけであることが説明されている。 | scope の SC-IN-003 に記録した。 | Acceptance と文面確認に落とす。 |
| 実装完了だけでは Construction 完了ではなく、検証と traceability finalization が必要であることが読み取れる。 | scope の SC-IN-004 に記録した。 | Construction 全体の完了条件として acceptance に落とす。 |
| `amadeus-construction` の公開入口としての責務と矛盾しない。 | scope の実行制御と decisions に記録した。 | `amadeus-construction` 本文との整合確認に落とす。 |

## 逆方向 feedback

Inception 以降で、他の Construction 内部 skill にも同じ案内補正が必要だと分かった場合は、対象外にせずこの Intent の scope 内で扱う。

ただし、Construction の stage 構造や内部 skill の責務を変える必要が見つかった場合は、後続 Intent 候補として分ける。
